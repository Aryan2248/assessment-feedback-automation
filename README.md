# Assessment & Feedback Automation

> AI agents that automate grading, feedback, and progress reporting — so teachers spend less time marking and more time teaching.

Built for the **Assessment & Feedback Automation** hackathon challenge track. Teachers currently spend up to 40% of their time on administrative grading work. This project replaces that with a multi-agent AI pipeline that grades for conceptual understanding (not keyword matching), writes student-facing feedback, tracks progress over time, and grounds every score in real reference material via RAG.

---

---

## The Problem

Grading at scale is repetitive, slow, and inconsistent. Teachers either:
- Spend hours manually marking similar answers one by one, or
- Resort to rigid keyword-matching tools that miss genuine understanding and give shallow feedback.

Neither approach scales, and neither gives students feedback that actually helps them improve.

## Our Approach

A pipeline of three specialized agents, grounded in a RAG layer built from real course material:

1. **Grading Agent** — scores a student's answer for conceptual accuracy and completeness, not surface-level keyword overlap. Produces an internal reasoning trace alongside the score.
2. **Feedback Agent** — takes the grading agent's score and reasoning and rewrites it as warm, specific, student-facing feedback ("You correctly identified X, but missed Y...").
3. **Progress Agent** — analyzes a student's full submission history over time and reports trends: improving, steady, declining, and which topics they consistently struggle with or excel at.

All three agents can ground their output in **uploaded reference material** (a teacher's notes, textbook excerpts, rubrics) via a RAG layer, instead of requiring a manually typed reference answer for every single question.

---

## Architecture

Student submission

│
▼

FastAPI backend
│
▼

RAG retrieval layer ── OpenAI/Gemini embeddings + ChromaDB
│
▼

┌──────────────┬───────────────┬────────────────┐

│ Grading Agent│ Feedback Agent│ Progress Agent │

└──────────────┴───────────────┴────────────────┘

│
▼

Gemini / Claude API

│
▼

SQLite database (students, submissions, scores, feedback)

│
▼

React frontend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| LLM (grading/feedback/progress) | Google Gemini (`gemini-2.5-flash-lite`), with a Claude (`claude-sonnet-4-6`) implementation included as a swap-in |
| Embeddings | Gemini Embeddings (`gemini-embedding-001`) |
| Vector store | ChromaDB (local, persistent) |
| Database | SQLite via SQLAlchemy |
| Document parsing | pypdf (for uploaded PDFs) |
| Frontend | React (Vite) |
| PDF export | jsPDF |
| Resilience | Tenacity (retry/backoff on transient LLM API errors) |

---

## Features

- **Conceptual grading** — evaluates understanding, not keyword matches, with a transparent "Why this score?" reasoning toggle
- **RAG-grounded feedback** — retrieves relevant reference material via ChromaDB before grading
- **Document ingestion** — upload a `.txt` or `.pdf` of theory/notes once; grade against it without typing a reference answer every time
- **Progress tracking** — per-student history with AI-generated trend analysis across submissions
- **PDF export** — download any progress report as a polished PDF
- **Persistent storage** — all students, submissions, scores, and feedback saved to a real database
- **Provider-agnostic agents** — built on Gemini for free-tier development, with a parallel Claude implementation ready to swap in

---

## Project Structure

assessment-feedback-automation/

├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app & routes
│   │   ├── config.py               # env var loading
│   │   ├── agents/
│   │   │   ├── grading_agent.py        # scores + internal reasoning
│   │   │   ├── grading_agent_claude.py # Claude-backed alternative
│   │   │   ├── feedback_agent.py       # student-facing feedback
│   │   │   └── progress_agent.py       # trend analysis over time
│   │   ├── rag/
│   │   │   ├── embeddings.py
│   │   │   ├── vector_store.py         # ChromaDB add/query
│   │   │   └── document_loader.py      # PDF/TXT chunking
│   │   ├── services/
│   │   │   └── llm_client.py           # shared Gemini client + retry logic
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── models.py               # Student, Submission
│   │   └── utils/
│   │       └── parsing.py              # score/reasoning extraction
│   └── requirements.txt
└── frontend/
└── src/
├── App.jsx
├── api.js
└── components/
├── StudentPanel.jsx
├── GradeForm.jsx
├── SubmissionsList.jsx
├── ProgressReport.jsx
├── IngestPanel.jsx
└── DocumentUpload.jsx

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # add your GEMINI_API_KEY (and ANTHROPIC/OPENAI keys if using those agents)
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the printed `localhost:5173` URL. The frontend expects the backend at `http://localhost:8000` (see `src/api.js`).

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/students` | Create a student |
| `POST` | `/api/grade` | Grade a submission (reference answer optional if RAG material exists) |
| `GET` | `/api/students/{id}/submissions` | Get a student's submission history |
| `DELETE` | `/api/students/{id}/submissions` | Clear a student's submission history |
| `GET` | `/api/students/{id}/progress-report` | Generate an AI progress report |
| `POST` | `/api/ingest` | Add a single text chunk to the RAG store |
| `POST` | `/api/ingest-document` | Upload and chunk a `.txt`/`.pdf` into the RAG store |

---

## Known Limitations

- Currently single-question grading; batch/CSV grading is on the roadmap
- Free-tier LLM rate limits apply when running on Gemini's free tier without billing enabled
- No authentication layer yet — intended for a single-teacher demo context

## Roadmap

- [ ] Batch grading via CSV upload for an entire class at once
- [ ] Class-level analytics (score distribution, common weak topics)
- [ ] Multi-criteria rubric scoring (accuracy, clarity, completeness as separate sub-scores)
- [ ] Authentication for multi-teacher use

---

## Team

Built by **Aryan Yadav** && **Anusri Joddar**— 3rd-year B.Tech CS student, Uttaranchal University.

