# ExamPrep AI

ExamPrep AI is a full-stack AI-powered study assistant that helps students turn their syllabus into structured topics, generate exam-oriented notes, practice with MCQ quizzes, and track their exam readiness.

## Features

- 📚 Syllabus analysis
- 📄 Supports PDF, DOCX, and TXT files
- 📝 Supports pasted syllabus text
- 🧠 AI-powered topic and subtopic extraction
- 📖 Topic-wise exam notes
- ❓ AI-generated MCQ quizzes
- 📊 Quiz scoring and explanations
- 📈 Exam-readiness tracking
- 🔐 Backend-only AI API key handling
- 🚦 API rate limiting
- 💾 No database or login system
- 🌐 Deployed frontend and backend

## Live Demo

### Frontend

https://examprep-frontend-q9ky.onrender.com

### Backend API

https://examprep-9p9z.onrender.com

### API Health Check

https://examprep-9p9z.onrender.com/api/health

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Axios
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SlowAPI

### Document Processing

- PyMuPDF
- python-docx
- UTF-8 text processing

### AI

- Groq API
- OpenAI-compatible API client
- Structured JSON responses

### Storage

- Browser localStorage
- In-memory quiz data
- No database

## Project Structure

```text
ExamPrep/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── rate_limiter.py
│   │   │
│   │   ├── routes/
│   │   │   ├── syllabus.py
│   │   │   ├── notes.py
│   │   │   └── quiz.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   ├── document_service.py
│   │   │   └── quiz_service.py
│   │   │
│   │   └── schemas/
│   │       ├── syllabus.py
│   │       ├── notes.py
│   │       └── quiz.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package-lock.json
└── README.md