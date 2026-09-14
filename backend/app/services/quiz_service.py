from typing import Dict, Any

QUIZ_STORE: Dict[str, Dict[str, Any]] = {}


def calculate_quiz_result(quiz: Dict[str, Any], answers: Dict[str, int]) -> dict:
    results = []
    correct = 0
    for q in quiz["questions"]:
        selected = answers.get(q["id"])
        is_correct = selected == q["correct_answer"]
        correct += int(is_correct)
        results.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "selected_answer": selected,
            "correct_answer": q["correct_answer"],
            "is_correct": is_correct,
            "explanation": q["explanation"],
        })
    total = len(quiz["questions"])
    percentage = round((correct / total) * 100) if total else 0
    return {
        "quiz_id": quiz["quiz_id"],
        "topic": quiz["topic"],
        "total_questions": total,
        "correct_answers": correct,
        "incorrect_answers": total - correct,
        "percentage": percentage,
        "question_results": results,
    }
