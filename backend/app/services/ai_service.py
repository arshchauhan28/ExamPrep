import json
import os
import re
from typing import Any

from fastapi import HTTPException

try:
    from openai import OpenAI
except ImportError:  # pragma: no cover - dependency is listed in requirements
    OpenAI = None


# Gemini API through Google's OpenAI-compatible endpoint
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"


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
    }

    if base_url:
        kwargs["base_url"] = base_url

    return OpenAI(**kwargs)

def _model() -> str:
    # Default Gemini model
    return os.getenv("AI_MODEL", "gemini-3.8-flash")


def _clean_json(text: str) -> str:
    text = text.strip()

    # Remove markdown code fences such as ```json ... ```
    fenced = re.search(
        r"```(?:json)?\s*(.*?)\s*```",
        text,
        re.IGNORECASE | re.DOTALL,
    )

    if fenced:
        text = fenced.group(1).strip()

    # Find the beginning of a JSON object or array
    positions = [
        idx for idx in [text.find("{"), text.find("[")]
        if idx >= 0
    ]

    first = min(positions, default=-1)

    if first > 0:
        text = text[first:]

    return text


def _request_json(system: str, user: str) -> Any:
    client = _client()

    try:
        response = client.chat.completions.create(
            model=_model(),
            temperature=0.2,
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

        content = response.choices[0].message.content or ""

    except Exception as exc:
        # Do not expose provider errors/API details to the browser.
        print(f"AI API error: {exc}")

        raise HTTPException(
            status_code=502,
            detail="The AI service is temporarily unavailable. Please try again.",
        ) from exc

    try:
        return json.loads(_clean_json(content))

    except (json.JSONDecodeError, TypeError) as exc:
        print(f"Gemini JSON parsing error: {exc}")

        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid structured response. Please try again.",
        ) from exc


def analyze_syllabus(text: str) -> dict:
    system = (
        "You analyze academic syllabi. Return ONLY valid JSON matching this shape: "
        '{"subject":"string","units":[{"name":"string","topics":[{"name":"string","subtopics":["string"]}]}]}. '
        "Do not invent topics that are not reasonably supported by the syllabus. "
        "Keep names concise."
    )

    user = (
        "Analyze this syllabus and extract the subject, units, topics, and subtopics.\n\n"
        f"SYLLABUS:\n{text[:50000]}"
    )

    data = _request_json(system, user)

    if (
        not isinstance(data, dict)
        or not isinstance(data.get("units"), list)
    ):
        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid syllabus structure.",
        )

    return data

def generate_notes(topic: str, context: str) -> dict:
    system = (
        "You create concise, exam-oriented study notes. "
        "Return ONLY valid JSON with exactly these keys: "
        "topic, overview, important_concepts, definitions, key_points, "
        "examples, exam_points, common_mistakes, quick_revision. "

        "IMPORTANT FORMAT RULES: "
        "topic must be a string. "
        "overview must be a single string paragraph. "
        "All remaining fields must be arrays of short strings. "
        "Do not return an array for topic or overview. "
        "Avoid unnecessary verbosity."
    )

    user = (
        f"Create study notes for topic: {topic}.\n"
        "Use this optional syllabus context to stay aligned:\n"
        f"{context[:12000]}"
    )

    data = _request_json(system, user)

    if not isinstance(data, dict):
        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid notes structure.",
        )

    # Make the response robust if the model accidentally returns
    # topic/overview as arrays instead of strings.
    if isinstance(data.get("topic"), list):
        data["topic"] = " ".join(str(x) for x in data["topic"])

    if isinstance(data.get("overview"), list):
        data["overview"] = " ".join(str(x) for x in data["overview"])

    # Ensure required string fields exist
    data["topic"] = topic

    if not isinstance(data.get("overview"), str):
        data["overview"] = str(data.get("overview", ""))

    # Ensure all list fields contain strings
    list_fields = [
        "important_concepts",
        "definitions",
        "key_points",
        "examples",
        "exam_points",
        "common_mistakes",
        "quick_revision",
    ]

    for field in list_fields:
        value = data.get(field, [])

        if not isinstance(value, list):
            value = [value]

        data[field] = [str(item) for item in value]

    return data

def generate_quiz(
    topic: str,
    number_of_questions: int,
    difficulty: str,
    context: str,
) -> dict:
    system = (
        "You create exam-quality multiple choice quizzes. "
        "Return ONLY valid JSON with key 'questions'. "
        "Each question must have: question (string), "
        "options (array of exactly 4 strings), "
        "correct_answer (integer 0-3), "
        "explanation (string). "
        "Exactly one option is correct. "
        "No duplicate questions. "
        "Mix conceptual and application-based questions."
    )

    user = (
        f"Topic: {topic}\n"
        f"Difficulty: {difficulty}\n"
        f"Number of questions: {number_of_questions}\n"
        "Optional syllabus context:\n"
        f"{context[:12000]}"
    )

    data = _request_json(system, user)

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

    for q in questions:
        if (
            not isinstance(q, dict)
            or not isinstance(q.get("question"), str)
            or not isinstance(q.get("options"), list)
            or len(q["options"]) != 4
            or not all(isinstance(option, str) for option in q["options"])
            or not isinstance(q.get("correct_answer"), int)
            or q["correct_answer"] not in range(4)
            or not isinstance(q.get("explanation"), str)
        ):
            raise HTTPException(
                status_code=502,
                detail="The AI returned an invalid quiz question structure.",
            )

    return {"questions": questions}