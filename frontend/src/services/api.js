import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 120000,
});

export async function analyzeSyllabus(file = null, text = "") {
  const form = new FormData();

  if (file) {
    form.append("file", file);
  } else if (text.trim()) {
    form.append("text", text.trim());
  }

  const { data } = await api.post("/syllabus/analyze", form);

  return data;
}

export async function generateNotes(topic, context = "") {
  const { data } = await api.post("/notes/generate", {
    topic,
    context,
  });

  return data;
}

export async function generateQuiz(
  topic,
  number_of_questions = 10,
  difficulty = "medium",
  context = "",
) {
  const { data } = await api.post("/quiz/generate", {
    topic,
    number_of_questions,
    difficulty,
    context,
  });

  return data;
}

export async function submitQuiz(quiz_id, answers) {
  const { data } = await api.post("/quiz/submit", {
    quiz_id,
    answers,
  });

  return data;
}

export function friendlyError(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail.map((item) => item?.msg || "Invalid request").join(", ");
  }

  if (detail && typeof detail === "object") {
    return detail.msg || fallback;
  }

  return error?.message || fallback;
}

export async function analyzePriorities(syllabus) {
  const { data } = await api.post("/priority/analyze", syllabus);

  return data;
}


export async function analyzeMindmap(
  subject,
  unit,
  topic,
  subtopics = [],
) {
  const response = await api.post("/mindmap/analyze", {
    subject,
    unit,
    topic,
    subtopics,
  });

  return response.data;
}