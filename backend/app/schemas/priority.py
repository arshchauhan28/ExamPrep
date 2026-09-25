from typing import List, Literal

from pydantic import BaseModel, Field


class PriorityTopicInput(BaseModel):
    name: str
    subtopics: List[str] = Field(default_factory=list)


class PriorityUnitInput(BaseModel):
    name: str
    topics: List[PriorityTopicInput] = Field(default_factory=list)


class PriorityAnalysisRequest(BaseModel):
    subject: str
    units: List[PriorityUnitInput] = Field(default_factory=list)


class PriorityTopic(BaseModel):
    name: str
    priority: Literal["high", "medium", "low"]
    reason: str
    recommended_action: str
    subtopics: List[str] = Field(default_factory=list)


class PriorityUnit(BaseModel):
    name: str
    topics: List[PriorityTopic] = Field(default_factory=list)


class PriorityAnalysis(BaseModel):
    subject: str
    units: List[PriorityUnit] = Field(default_factory=list)