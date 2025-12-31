import io
import re
from typing import TextIO

import pdfplumber
from docx import Document

MAX_TEXT_LENGTH = 20000  


def _clean_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"\s+\n", "\n", text)
    text = re.sub(r"\n\s+", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def extract_text_from_pdf_filelike(file_like: TextIO) -> str:
    data = file_like.read()
    if isinstance(data, str):
        data = data.encode("utf-8", errors="ignore")
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        chunks = []
        for page in pdf.pages:
            chunks.append(page.extract_text() or "")
        text = _clean_text("\n".join(chunks))
        return text[:MAX_TEXT_LENGTH]


def extract_text_from_docx_filelike(file_like: TextIO) -> str:
    data = file_like.read()
    if isinstance(data, str):
        data = data.encode("utf-8", errors="ignore")
    bio = io.BytesIO(data)
    doc = Document(bio)
    text = "\n".join(p.text for p in doc.paragraphs)
    text = _clean_text(text)
    return text[:MAX_TEXT_LENGTH]


def extract_skills(text: str) -> list[str]:
    # Simple heuristic skill extractor; swap with NER/keyword lists later
    tokens = {w.lower() for w in re.split(r"[^A-Za-z0-9#+.]+", text) if len(w) > 1}
    tech = {
        "python", "java", "javascript", "typescript", "react", "node", "flask", "fastapi",
        "django", "docker", "kubernetes", "aws", "gcp", "azure", "sql", "nosql", "mongodb",
        "postgres", "mysql", "rest", "graphql", "pandas", "numpy", "sklearn", "spacy"
    }
    return sorted(list(tokens & tech))
