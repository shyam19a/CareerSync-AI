import os
from typing import List
from sentence_transformers import SentenceTransformer, util

MODEL_NAME = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
_model = SentenceTransformer(MODEL_NAME)


def _cosine(a, b) -> float:
    return float(util.cos_sim(a, b).item())


def compute_similarity(resume_text: str, jd_text: str) -> float:
    er = _model.encode(resume_text, convert_to_tensor=True, normalize_embeddings=True)
    ej = _model.encode(jd_text, convert_to_tensor=True, normalize_embeddings=True)
    cos = _cosine(er, ej)  # [-1, 1]
    score_0_100 = max(0.0, min(100.0, round((cos + 1.0) * 50.0, 2)))
    return score_0_100


def generate_suggestions(missing_skills: List[str]) -> List[str]:
    out: List[str] = []
    if missing_skills:
        out.append(f"Address missing keywords: {', '.join(missing_skills[:8])}.")
    else:
        out.append("Looks good, no major missing keywords.")
    return out
