from fastapi import APIRouter, Request

from app.rate_limiter import limiter
from app.schemas.priority import (
    PriorityAnalysis,
    PriorityAnalysisRequest,
)
from app.services.ai_service import analyze_topic_priorities


router = APIRouter(
    prefix="/api/priority",
    tags=["Priority"],
)


@router.post(
    "/analyze",
    response_model=PriorityAnalysis,
)
@limiter.limit("5/minute")
async def analyze_priority(
    request: Request,
    payload: PriorityAnalysisRequest,
) -> PriorityAnalysis:

    result = analyze_topic_priorities(
        subject=payload.subject,
        units=[
            unit.model_dump()
            for unit in payload.units
        ],
    )

    return PriorityAnalysis.model_validate(result)