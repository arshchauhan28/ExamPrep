import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import syllabus, notes, quiz

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

app = FastAPI(title="ExamPrep AI API", version="1.0.0")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(syllabus.router)
app.include_router(notes.router)
app.include_router(quiz.router)

@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "ExamPrep AI API"}
