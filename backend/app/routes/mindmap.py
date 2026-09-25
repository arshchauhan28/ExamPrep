from fastapi import APIRouter, Request

from app.rate_limiter import limiter
from app.schemas.mindmap import (
    MindMapAnalysis,
    MindMapAnalysisRequest,
)
from app.services.ai_service import generate_mindmap


router = APIRouter(
    prefix="/api/mindmap",
    tags=["Mind Map"],
)


@router.post(
    "/analyze",
    response_model=MindMapAnalysis,
)
@limiter.limit("5/minute")
async def analyze_mindmap(
    request: Request,
    payload: MindMapAnalysisRequest,
) -> MindMapAnalysis:

    result = generate_mindmap(
        subject=payload.subject,
        unit=payload.unit,
        topic=payload.topic,
        subtopics=payload.subtopics,
    )

    return MindMapAnalysis.model_validate(result)