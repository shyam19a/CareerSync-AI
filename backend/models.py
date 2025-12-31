from pydantic import BaseModel
from typing import List


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str


class MatchResponse(BaseModel):
    similarity_score: float
    missing_skills: List[str]
    suggestions: List[str]
    extracted_resume_skills: List[str]
    extracted_job_skills: List[str]


class ErrorResponse(BaseModel):
    error: str
