from fastapi import APIRouter, HTTPException

from app.schemas.notes import NotesRequest, NotesResponse
from app.services.ai_service import generate_notes

router = APIRouter(prefix="/api/notes", tags=["Notes"])

@router.post("/generate", response_model=NotesResponse)
def create_notes(request: NotesRequest) -> NotesResponse:
    try:
        return NotesResponse.model_validate(generate_notes(request.topic, request.context))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Something went wrong while generating notes.") from exc
