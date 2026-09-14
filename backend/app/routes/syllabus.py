from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.syllabus import SyllabusAnalysis
from app.services.ai_service import analyze_syllabus
from app.services.pdf_service import extract_text_from_pdf

router = APIRouter(prefix="/api/syllabus", tags=["Syllabus"])

@router.post("/analyze", response_model=SyllabusAnalysis)
async def analyze(file: UploadFile = File(...)) -> SyllabusAnalysis:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files are supported.")
    data = await file.read()
    text = extract_text_from_pdf(data)
    return SyllabusAnalysis.model_validate(analyze_syllabus(text))
