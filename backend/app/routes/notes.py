from fastapi import APIRouter, HTTPException, Request

from app.rate_limiter import limiter
from app.schemas.notes import NotesRequest, NotesResponse
from app.services.ai_service import generate_notes


router = APIRouter(
    prefix="/api/notes",
    tags=["Notes"],
)


@router.post(
    "/generate",
    response_model=NotesResponse,
)
@limiter.limit("10/minute")
def create_notes(
    request: Request,
    body: NotesRequest,
) -> NotesResponse:

    try:
        return NotesResponse.model_validate(
            generate_notes(
                body.topic,
                body.context,
            )
        )

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Something went wrong while generating notes.",
        ) from exc