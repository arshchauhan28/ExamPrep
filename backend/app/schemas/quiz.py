from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class QuizRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=200)
    number_of_questions: int = Field(default=10, ge=3, le=20)
    difficulty: str = Field(default="medium")
    context: str = Field(default="", max_length=12000)

    @field_validator("difficulty")
    @classmethod
    def valid_difficulty(cls, value: str) -> str:
        value = value.lower().strip()
        if value not in {"easy", "medium", "hard"}:
            raise ValueError("difficulty must be easy, medium, or hard")
        return value

class QuizQuestionPublic(BaseModel):
    id: str
    question: str
    options: List[str] = Field(min_length=4, max_length=4)

class QuizResponse(BaseModel):
    quiz_id: str
    topic: str
    questions: List[QuizQuestionPublic]

class QuizAnswer(BaseModel):
    question_id: str
    selected_answer: int = Field(ge=0, le=3)

class QuizSubmitRequest(BaseModel):
    quiz_id: str
    answers: List[QuizAnswer]

class QuestionResult(BaseModel):
    id: str
    question: str
    options: List[str]
    selected_answer: Optional[int] = None
    correct_answer: int
    is_correct: bool
    explanation: str

class QuizSubmitResponse(BaseModel):
    quiz_id: str
    topic: str
    total_questions: int
    correct_answers: int
    incorrect_answers: int
    percentage: int
    question_results: List[QuestionResult]
