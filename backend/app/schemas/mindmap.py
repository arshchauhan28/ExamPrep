from pydantic import BaseModel, Field


class MindMapNode(BaseModel):
    id: str
    label: str
    type: str
    children: list["MindMapNode"] = Field(default_factory=list)


class MindMapAnalysisRequest(BaseModel):
    subject: str
    unit: str
    topic: str
    subtopics: list[str] = Field(default_factory=list)


class MindMapAnalysis(BaseModel):
    subject: str
    unit: str
    topic: str
    root: MindMapNode


MindMapNode.model_rebuild()