import json
import os
from typing import Any

from fastapi import HTTPException

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None


# ---------------------------------------------------------
# AI CLIENT
# ---------------------------------------------------------

def _client() -> Any:
    api_key = os.getenv("AI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured. Add AI_API_KEY to .env.",
        )

    if OpenAI is None:
        raise HTTPException(
            status_code=503,
            detail="AI SDK is not installed on the backend.",
        )

    base_url = os.getenv("AI_BASE_URL")

    kwargs = {
        "api_key": api_key,
        "timeout": 90.0,
    }

    if base_url:
        kwargs["base_url"] = base_url

    return OpenAI(**kwargs)


def _model() -> str:
    return os.getenv("AI_MODEL", "openai/gpt-oss-20b")


# ---------------------------------------------------------
# STRUCTURED AI REQUEST
# ---------------------------------------------------------

def _request_json(
    system: str,
    user: str,
    schema_name: str,
    schema: dict,
) -> Any:

    client = _client()

    try:
        response = client.chat.completions.create(
            model=_model(),
            temperature=0.2,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": schema_name,
                    "strict": True,
                    "schema": schema,
                },
            },
            messages=[
                {
                    "role": "system",
                    "content": system,
                },
                {
                    "role": "user",
                    "content": user,
                },
            ],
        )

        if not response.choices:
            raise ValueError("AI returned no choices.")

        content = response.choices[0].message.content or ""

        if not content.strip():
            raise ValueError("AI returned an empty response.")

    except HTTPException:
        raise

    except Exception as exc:
        print(f"AI API error: {exc}")

        raise HTTPException(
            status_code=502,
            detail="The AI service is temporarily unavailable. Please try again.",
        ) from exc

    try:
        return json.loads(content)

    except (json.JSONDecodeError, TypeError, ValueError) as exc:
        print(f"AI JSON parsing error: {exc}")

        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid structured response. Please try again.",
        ) from exc


# ---------------------------------------------------------
# SYLLABUS ANALYSIS
# ---------------------------------------------------------

def analyze_syllabus(text: str) -> dict:

    schema = {
        "type": "object",
        "properties": {
            "subject": {
                "type": "string",
            },
            "units": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                        },
                        "topics": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string",
                                    },
                                    "subtopics": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                        },
                                    },
                                },
                                "required": [
                                    "name",
                                    "subtopics",
                                ],
                                "additionalProperties": False,
                            },
                        },
                    },
                    "required": [
                        "name",
                        "topics",
                    ],
                    "additionalProperties": False,
                },
            },
        },
        "required": [
            "subject",
            "units",
        ],
        "additionalProperties": False,
    }

    system = (
        "You analyze academic syllabi. "
        "Extract the subject, units, topics, and subtopics. "
        "Only include information reasonably supported by the syllabus. "
        "Keep names concise. "
        "Every unit must be a separate object inside the units array. "
        "Every topic must be a separate object inside its unit's topics array."
    )

    user = (
        "Analyze this syllabus and extract its structure.\n\n"
        f"SYLLABUS:\n{text[:50000]}"
    )

    data = _request_json(
        system=system,
        user=user,
        schema_name="syllabus_analysis",
        schema=schema,
    )

    if (
        not isinstance(data, dict)
        or not isinstance(data.get("subject"), str)
        or not isinstance(data.get("units"), list)
    ):
        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid syllabus structure.",
        )

    return data


# ---------------------------------------------------------
# NOTES GENERATION
# ---------------------------------------------------------

def generate_notes(topic: str, context: str) -> dict:

    schema = {
        "type": "object",
        "properties": {
            "topic": {
                "type": "string",
            },
            "overview": {
                "type": "string",
            },
            "important_concepts": {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            "definitions": {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            "key_points": {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            "examples": {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            "exam_points": {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            "common_mistakes": {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
            "quick_revision": {
                "type": "array",
                "items": {
                    "type": "string",
                },
            },
        },
        "required": [
            "topic",
            "overview",
            "important_concepts",
            "definitions",
            "key_points",
            "examples",
            "exam_points",
            "common_mistakes",
            "quick_revision",
        ],
        "additionalProperties": False,
    }

    system = (
        "You create concise, exam-oriented study notes. "
        "Return structured study notes for the requested topic. "
        "The overview must be a single paragraph. "
        "All other sections must contain short, useful strings. "
        "Keep the content suitable for university exam preparation. "
        "Avoid unnecessary verbosity."
    )

    user = (
        f"Create study notes for topic: {topic}.\n\n"
        "Use this optional syllabus context to stay aligned:\n"
        f"{context[:12000]}"
    )

    data = _request_json(
        system=system,
        user=user,
        schema_name="study_notes",
        schema=schema,
    )

    if not isinstance(data, dict):
        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid notes structure.",
        )

    data["topic"] = topic

    return data


# ---------------------------------------------------------
# QUIZ GENERATION
# ---------------------------------------------------------

def generate_quiz(
    topic: str,
    number_of_questions: int,
    difficulty: str,
    context: str,
) -> dict:

    schema = {
        "type": "object",
        "properties": {
            "questions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "question": {
                            "type": "string",
                        },
                        "options": {
                            "type": "array",
                            "items": {
                                "type": "string",
                            },
                            "minItems": 4,
                            "maxItems": 4,
                        },
                        "correct_answer": {
                            "type": "integer",
                            "enum": [0, 1, 2, 3],
                        },
                        "explanation": {
                            "type": "string",
                        },
                    },
                    "required": [
                        "question",
                        "options",
                        "correct_answer",
                        "explanation",
                    ],
                    "additionalProperties": False,
                },
            },
        },
        "required": [
            "questions",
        ],
        "additionalProperties": False,
    }

    system = (
        "You create exam-quality multiple choice quizzes. "
        "Create exactly the requested number of questions. "
        "Every question must have exactly four different answer options. "
        "The correct_answer must be exactly one of: 0, 1, 2, or 3. "
        "The number represents the zero-based index of the correct option. "
        "Exactly one option must be correct. "
        "Do not create duplicate questions. "
        "Mix conceptual and application-based questions. "
        "Provide a concise explanation for every answer."
    )

    user = (
        f"Topic: {topic}\n"
        f"Difficulty: {difficulty}\n"
        f"Number of questions: {number_of_questions}\n\n"
        "Optional syllabus context:\n"
        f"{context[:12000]}"
    )

    data = _request_json(
        system=system,
        user=user,
        schema_name="quiz_generation",
        schema=schema,
    )

    questions = (
        data.get("questions")
        if isinstance(data, dict)
        else None
    )

    if (
        not isinstance(questions, list)
        or len(questions) != number_of_questions
    ):
        raise HTTPException(
            status_code=502,
            detail="The AI did not return the requested number of quiz questions.",
        )

    for question in questions:

        if (
            not isinstance(question, dict)
            or not isinstance(question.get("question"), str)
            or not question.get("question", "").strip()
            or not isinstance(question.get("options"), list)
            or len(question["options"]) != 4
            or not all(
                isinstance(option, str) and option.strip()
                for option in question["options"]
            )
            or len(set(question["options"])) != 4
            or not isinstance(question.get("correct_answer"), int)
            or question["correct_answer"] not in range(4)
            or not isinstance(question.get("explanation"), str)
            or not question.get("explanation", "").strip()
        ):
            raise HTTPException(
                status_code=502,
                detail="The AI returned an invalid quiz question structure.",
            )

    return {
        "questions": questions,
    }