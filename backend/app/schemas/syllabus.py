from pydantic import BaseModel, Field
from typing import List

class Topic(BaseModel):
    name: str
    subtopics: List[str] = Field(default_factory=list)

class Unit(BaseModel):
    name: str
    topics: List[Topic] = Field(default_factory=list)

class SyllabusAnalysis(BaseModel):
    subject: str
    units: List[Unit] = Field(default_factory=list)
