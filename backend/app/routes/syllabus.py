from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile

from app.rate_limiter import limiter
from app.schemas.syllabus import SyllabusAnalysis
from app.services.ai_service import analyze_syllabus
from app.services.document_service import extract_text_from_file


router = APIRouter(
    prefix="/api/syllabus",
    tags=["Syllabus"],
)


@router.post(
    "/analyze",
    response_model=SyllabusAnalysis,
)
@limiter.limit("5/minute")
async def analyze(
    request: Request,
    file: UploadFile | None = File(None),
    text: str | None = Form(None),
) -> SyllabusAnalysis:

    # -------------------------
    # PASTED TEXT
    # -------------------------

    if text and text.strip():
        syllabus_text = text.strip()

    # -------------------------
    # FILE UPLOAD
    # -------------------------

    elif file:
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file uploaded.",
            )

        data = await file.read()

        syllabus_text = extract_text_from_file(
            data=data,
            filename=file.filename,
            content_type=file.content_type,
        )

    # -------------------------
    # NOTHING PROVIDED
    # -------------------------

    else:
        raise HTTPException(
            status_code=400,
            detail="Please upload a file or paste syllabus text.",
        )

    # -------------------------
    # AI ANALYSIS
    # -------------------------

    result = analyze_syllabus(syllabus_text)

    return SyllabusAnalysis.model_validate(result)