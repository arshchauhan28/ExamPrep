import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.rate_limiter import limiter

from app.routes import syllabus, notes, quiz, priority, mindmap


BASE_DIR = Path(__file__).resolve().parents[1]

load_dotenv(BASE_DIR / ".env")


# ---------------------------------------------------------
# RATE LIMITER
# ---------------------------------------------------------


app = FastAPI(
    title="ExamPrep AI API",
    version="1.0.0",
)


# Make the limiter available to FastAPI.
app.state.limiter = limiter

# Return HTTP 429 when a client exceeds a limit.
app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173",
    ).split(",")
    if origin.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# ROUTES
# ---------------------------------------------------------

app.include_router(syllabus.router)
app.include_router(notes.router)
app.include_router(quiz.router)
app.include_router(priority.router)
app.include_router(mindmap.router)

# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "ExamPrep AI API",
    }