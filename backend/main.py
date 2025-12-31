from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import io
import traceback
import logging

from models import MatchResponse
from resume_parser import (
    extract_text_from_pdf_filelike,
    extract_text_from_docx_filelike,
    extract_skills,
)
from matcher import compute_similarity, generate_suggestions
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MatchRequest(BaseModel):
    resume_text: Optional[str] = None
    job_description: Optional[str] = None

app = FastAPI(
    title="AI Resume & Job Matcher",
    description="Upload your resume and a job description to see your match score, missing skills, and improvement suggestions.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/match", response_model=MatchResponse)
async def match_resume_json(payload: MatchRequest):
    try:
        if not payload.resume_text:
            raise HTTPException(status_code=400, detail="Resume text is required when not uploading a file.")
        if not payload.job_description:
            raise HTTPException(status_code=400, detail="Job description is required when not uploading a file.")

        resume = payload.resume_text
        job = payload.job_description

        resume_skills = extract_skills(resume)
        job_skills = extract_skills(job)
        missing_skills = sorted(list(set(job_skills) - set(resume_skills)))
        similarity_score = compute_similarity(resume, job)
        suggestions = generate_suggestions(missing_skills)

        return MatchResponse(
            similarity_score=round(float(similarity_score), 4),
            missing_skills=missing_skills,
            suggestions=suggestions,
            extracted_resume_skills=resume_skills,
            extracted_job_skills=job_skills,
        )
    except Exception as e:
        logger.error(f"Error in /match: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error. Check backend logs.")

@app.post("/match-file", response_model=MatchResponse)
async def match_resume_file(
    resume_file: Optional[UploadFile] = File(None),
    job_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
):
    try:
        # Resolve resume
        if resume_file:
            name = (resume_file.filename or "").lower()
            data = await resume_file.read()
            bio = io.BytesIO(data)
            if name.endswith(".pdf"):
                resume = extract_text_from_pdf_filelike(bio)
            elif name.endswith((".docx", ".doc")):
                resume = extract_text_from_docx_filelike(bio)
            else:
                raise HTTPException(status_code=400, detail="Unsupported resume file format")
        elif resume_text:
            resume = resume_text
        else:
            raise HTTPException(status_code=400, detail="Resume not provided.")

        # Resolve job description
        if job_file:
            name = (job_file.filename or "").lower()
            data = await job_file.read()
            bio = io.BytesIO(data)
            if name.endswith(".pdf"):
                job = extract_text_from_pdf_filelike(bio)
            elif name.endswith((".docx", ".doc")):
                job = extract_text_from_docx_filelike(bio)
            else:
                raise HTTPException(status_code=400, detail="Unsupported job file format")
        elif job_description:
            job = job_description
        else:
            raise HTTPException(status_code=400, detail="Job description not provided.")

        resume_skills = extract_skills(resume)
        job_skills = extract_skills(job)
        missing_skills = sorted(list(set(job_skills) - set(resume_skills)))
        similarity_score = compute_similarity(resume, job)
        suggestions = generate_suggestions(missing_skills)

        return MatchResponse(
            similarity_score=round(float(similarity_score), 4),
            missing_skills=missing_skills,
            suggestions=suggestions,
            extracted_resume_skills=resume_skills,
            extracted_job_skills=job_skills,
        )
    except Exception as e:
        logger.error(f"Error in /match-file: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error. Check backend logs.")
