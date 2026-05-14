from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
# ✅ #1.1 Multilingual NLP: Олон хэл (Монгол, Англи) дэмждэг модел руу шилжүүлэв
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")


@app.get("/health")
async def health():
    return {"status": "ok"}

SYNONYMS = {
    # ── IT & Software Development ──
    "react": ["reactjs", "react.js", "react js"],
    "node.js": ["node", "nodejs", "node js"],
    "vue.js": ["vue", "vuejs"],
    "next.js": ["next", "nextjs"],
    "nuxt.js": ["nuxt", "nuxtjs"],
    "angular": ["angularjs", "angular.js"],
    "typescript": ["ts"],
    "javascript": ["js", "vanilla js"],
    "python": ["py"],
    "c#": ["csharp", "c sharp"],
    "c++": ["cpp"],
    "postgres": ["postgresql", "postgres sql"],
    "mysql": ["my sql"],
    "mongodb": ["mongo", "mongo db"],
    "react native": ["react-native", "rn"],
    "amazon web services": ["aws"],
    "google cloud platform": ["gcp"],
    "ruby on rails": ["ruby", "ror", "rails"],
    "go": ["golang"],
    "kubernetes": ["k8s"],
    "docker": ["docker container"],
    "html": ["html5"],
    "css": ["css3"],
    "tailwind": ["tailwindcss", "tailwind css"],
    "wordpress": ["wp"],

    # ── Data Science & AI ──
    "machine learning": ["ml"],
    "artificial intelligence": ["ai"],
    "deep learning": ["dl"],
    "natural language processing": ["nlp"],
    "computer vision": ["cv"],
    "data science": ["data-science", "datascience"],
    "data analytics": ["data analysis"],
    "pandas": ["python pandas"],
    "tensorflow": ["tf"],
    "pytorch": ["torch"],

    # ── Design & UI/UX ──
    "ui design": ["ui", "user interface", "user interface design"],
    "ux design": ["ux", "user experience", "user experience design"],
    "ui/ux": ["ui ux", "ux/ui"],
    "figma": ["figma design"],
    "adobe photoshop": ["photoshop", "ps"],
    "adobe illustrator": ["illustrator", "ai design"],
    "graphic design": ["graphic designer"],
    "motion design": ["motion graphics", "after effects", "adobe after effects", "ae"],
    "video editing": ["video editor", "premiere pro", "adobe premiere"],
    
    # ── Digital Marketing & SEO ──
    "search engine optimization": ["seo"],
    "social media marketing": ["smm"],
    "search engine marketing": ["sem", "google ads", "google adwords"],
    "facebook ads": ["meta ads", "fb ads"],
    "content creation": ["content marketing"],
    "copywriting": ["copy writer", "copy writing"],
    
    # ── Finance & Business ──
    "accounting": ["bookkeeping", "cpa", "certified public accountant"],
    "financial analysis": ["financial modeling", "finance"],
    "business analysis": ["ba", "business analyst"],
    "project management": ["pm", "project manager", "scrum master"],

    # ── Languages & Translation ──
    "english translation": ["english to mongolian", "mongolian to english", "english translator"],
    "copy editing": ["proofreading"],
}

def normalize(skill: str) -> str:
    s = skill.lower().strip()
    for canonical, aliases in SYNONYMS.items():
        if s in aliases or s == canonical:
            return canonical
    return s


class MatchRequest(BaseModel):
    job_title: str
    job_description: str
    job_budget_max: float
    required_skills: list[str]
    freelancers: list[dict]

# ✅ #4.1 ES Semantic Search: Текстээс вектор гаргаж авах endpoint
class EmbedRequest(BaseModel):
    text: str

@app.post("/embed")
async def get_embedding(req: EmbedRequest):
    try:
        embedding = model.encode([req.text])[0]
        return {"embedding": embedding.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def cosine_similarity_matrix(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Олон вектор хоорондын cosine similarity-г нэг зэрэг тооцно (batch)."""
    # a: [1, D], b: [N, D]
    a_norm = a / (np.linalg.norm(a, axis=1, keepdims=True) + 1e-9)
    b_norm = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-9)
    return (a_norm @ b_norm.T).flatten()  # [N]


def build_freelancer_text(fl: dict) -> str:
    skills_text = ", ".join(fl.get("skills", []))
    return f"{fl.get('title', '')}. {fl.get('bio', '')}. Skills: {skills_text}"


@app.post("/match")
async def match_freelancers(req: MatchRequest):
    if not req.freelancers:
        raise HTTPException(status_code=400, detail="No freelancers provided")

    # --- 1. Job embedding ---
    job_text = (
        f"{req.job_title}. {req.job_description}. "
        f"Skills: {', '.join(req.required_skills)}"
    )

    # --- 2. Batch encoding: нэг дуудалтаар бүгдийг encode хийнэ ---
    fl_texts = [build_freelancer_text(fl) for fl in req.freelancers]
    all_texts = [job_text] + fl_texts

    logger.info(f"Encoding {len(all_texts)} texts...")
    all_vecs = model.encode(all_texts, batch_size=32, show_progress_bar=False)

    job_vec = all_vecs[0:1]       # [1, D]
    fl_vecs = all_vecs[1:]         # [N, D]

    # --- 3. Cosine similarity бүгдийг нэг зэрэг тооцно ---
    skill_sims = cosine_similarity_matrix(job_vec, fl_vecs)  # [N]

    # --- 4. Оноо тооцоолох ---
    results = []
    for i, fl in enumerate(req.freelancers):
        skill_sim = float(skill_sims[i])

        # Төсвийн тохирол
        rate = float(fl.get("hourly_rate", 0))
        budget = req.job_budget_max
        if budget <= 0 or rate <= budget:
            rate_fit = 1.0
        else:
            # Давсан хувь (жишээ: 50% давсан → rate_fit = 0.5)
            rate_fit = max(0.0, 1.0 - (rate - budget) / (budget + 1))

        # Үнэлгээ (0–5 → 0–1)
        rating_score = min(fl.get("avg_rating", 3.0), 5.0) / 5.0

        # Идэвх (20 ажил = дүүрэн оноо)
        activity = min(1.0, fl.get("completed_jobs", 0) / 20.0)

        # ── Skill давхцал (explicit match bonus) ──────────────────
        # Семантик ойролцоо байдлаас гадна яг тохирсон skill-д нэмэлт оноо
        fl_skills_normalized = {normalize(s) for s in fl.get("skills", [])}
        req_skills_normalized = {normalize(s) for s in req.required_skills}
        if req_skills_normalized:
            explicit_match = len(fl_skills_normalized & req_skills_normalized) / len(req_skills_normalized)
        else:
            explicit_match = 0.0

        # Нийт оноо
        total_score = (
            0.35 * skill_sim       # Семантик ойролцоо
            + 0.15 * explicit_match  # Яг тохирсон skill
            + 0.25 * rate_fit       # Төсөв
            + 0.15 * rating_score   # Үнэлгээ
            + 0.10 * activity       # Идэвх
        )

        results.append({
            "freelancer_id": fl["id"],
            "score": round(total_score, 4),
            "skill_similarity": round(skill_sim, 4),
            "explicit_skill_match": round(explicit_match, 4),
            "rate_fit": round(rate_fit, 4),
            "rating_score": round(rating_score, 4),
            "activity_score": round(activity, 4),
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    logger.info(f"Matched {len(results)} freelancers. Top score: {results[0]['score']}")
    return {"matches": results[:10]}
