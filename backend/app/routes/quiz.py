import uuid

from fastapi import APIRouter, HTTPException, Request

from app.rate_limiter import limiter
from app.schemas.quiz import (
    QuizRequest,
    QuizResponse,
    QuizQuestionPublic,
    QuizSubmitRequest,
    QuizSubmitResponse,
)
from app.services.ai_service import generate_quiz
from app.services.quiz_service import QUIZ_STORE, calculate_quiz_result


router = APIRouter(
    prefix="/api/quiz",
    tags=["Quiz"],
)


@router.post(
    "/generate",
    response_model=QuizResponse,
)
@limiter.limit("10/minute")
def create_quiz(
    request: Request,
    body: QuizRequest,
) -> QuizResponse:

    raw = generate_quiz(
        body.topic,
        body.number_of_questions,
        body.difficulty,
        body.context,
    )

    quiz_id = uuid.uuid4().hex

    questions = []
    stored_questions = []

    for item in raw["questions"]:
        qid = uuid.uuid4().hex[:10]

        question = {
            "id": qid,
            "question": item["question"],
            "options": item["options"],
            "correct_answer": item["correct_answer"],
            "explanation": item["explanation"],
        }

        stored_questions.append(question)

        questions.append(
            QuizQuestionPublic(
                id=qid,
                question=item["question"],
                options=item["options"],
            )
        )

    QUIZ_STORE[quiz_id] = {
        "quiz_id": quiz_id,
        "topic": body.topic,
        "questions": stored_questions,
    }

    # Keep the in-memory store bounded for this simple MVP.
    while len(QUIZ_STORE) > 50:
        QUIZ_STORE.pop(next(iter(QUIZ_STORE)))

    return QuizResponse(
        quiz_id=quiz_id,
        topic=body.topic,
        questions=questions,
    )


@router.post(
    "/submit",
    response_model=QuizSubmitResponse,
)
def submit_quiz(
    request: QuizSubmitRequest,
) -> QuizSubmitResponse:

    quiz = QUIZ_STORE.get(request.quiz_id)

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found or expired. Generate a new quiz.",
        )

    expected_ids = {
        q["id"]
        for q in quiz["questions"]
    }

    received = {
        answer.question_id: answer.selected_answer
        for answer in request.answers
    }

    if expected_ids != set(received.keys()):
        raise HTTPException(
            status_code=400,
            detail="Please answer every question before submitting.",
        )

    return calculate_quiz_result(
        quiz,
        received,
    )