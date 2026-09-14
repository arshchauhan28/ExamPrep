from pydantic import BaseModel, Field
from typing import List

class NotesRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=200)
    context: str = Field(default="", max_length=12000)

class NotesResponse(BaseModel):
    topic: str
    overview: str
    important_concepts: List[str] = Field(default_factory=list)
    definitions: List[str] = Field(default_factory=list)
    key_points: List[str] = Field(default_factory=list)
    examples: List[str] = Field(default_factory=list)
    exam_points: List[str] = Field(default_factory=list)
    common_mistakes: List[str] = Field(default_factory=list)
    quick_revision: List[str] = Field(default_factory=list)
