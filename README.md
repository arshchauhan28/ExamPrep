# ExamPrep AI

ExamPrep AI is a simple full-stack student MVP that turns a syllabus PDF into structured topics, exam-oriented notes, MCQ quizzes, score reports, and a basic exam-readiness signal.

## Tech stack

- Frontend: React + Vite + Tailwind-style utility-free CSS + Axios + JavaScript
- Backend: Python + FastAPI + Uvicorn
- PDF extraction: PyMuPDF (`fitz`)
- AI: OpenAI-compatible chat completions API through a backend-only service
- Storage: React state/localStorage for the current browser session; no database

## Project structure

```text
exam-prep-ai/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── syllabus.py
│   │   │   ├── notes.py
│   │   │   └── quiz.py
│   │   ├── services/
│   │   │   ├── pdf_service.py
│   │   │   ├── ai_service.py
│   │   │   └── quiz_service.py
│   │   └── schemas/
│   │       ├── syllabus.py
│   │       ├── notes.py
│   │       └── quiz.py
│   ├── uploads/
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Backend setup

From `backend/`:

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Add your AI provider key to `.env`:

```env
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-5-mini
FRONTEND_ORIGINS=http://localhost:5173
```

Optional OpenAI-compatible providers can be configured with `AI_BASE_URL`.

Run FastAPI:

```powershell
uvicorn app.main:app --reload --port 8000
```

Health check: `http://127.0.0.1:8000/api/health`
Swagger: `http://127.0.0.1:8000/docs`

## Frontend setup

From `frontend/`:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

Build for production:

```powershell
npm run build
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health check |
| POST | `/api/syllabus/analyze` | Validate PDF, extract text, AI-analyze units/topics |
| POST | `/api/notes/generate` | Generate concise topic notes |
| POST | `/api/quiz/generate` | Generate quiz; answer key is not returned |
| POST | `/api/quiz/submit` | Score a generated quiz and return explanations |

## How AI integration works

`backend/app/services/ai_service.py` is the only place that knows about the LLM provider. It reads `AI_API_KEY`, `AI_MODEL`, and optional `AI_BASE_URL` from environment variables. The browser never receives the API key.

The AI is instructed to return JSON for syllabus analysis, notes, and quiz generation. Responses are validated with Pydantic before they are returned to the frontend.

## How PDF extraction works

`pdf_service.py` opens the uploaded bytes with PyMuPDF and extracts text page by page. The MVP accepts PDF files only and limits uploads to 10 MB. PDFs are processed in memory rather than persisted to a database.

## How quiz scoring works

Quiz generation creates a random `quiz_id` and stores the answer key temporarily in an in-memory Python dictionary. The public quiz response includes only question IDs, questions, and four options. The correct answers and explanations are returned only by `/api/quiz/submit` after the frontend submits all answers.

This keeps answer keys away from the browser before submission without adding a persistent database.

## Exam readiness formula

The frontend uses simple deterministic logic instead of AI:

```text
Readiness = 45% average topic quiz score
          + 25% topic coverage
          + 30% average of up to the 3 most recent quiz scores
```

Topic scores come from completed quizzes. Topics below 70% are treated as needs-improvement; topics at or above 80% are treated as strong topics.

## Security notes

- Never put `AI_API_KEY` in React code.
- Keep `.env` out of source control.
- Validate the uploaded file type and size.
- Sanitize by processing PDF bytes directly; no uploaded executable is run.
- Do not log API keys or provider responses containing secrets.
- The backend uses friendly HTTP error messages and the frontend avoids showing internal stack traces.
- The in-memory quiz store is intentionally bounded to 50 generated quizzes for this MVP.

## Important limitations

This project intentionally has no login, account system, user ID, database, or persistent backend session. Browser refresh persistence is limited to the current localStorage snapshot. Restarting the backend clears generated quiz answer keys.
