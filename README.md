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

Built by **Aryan Yadav** — 3rd-year B.Tech CS student, Uttaranchal University.

## License

[MIT](LICENSE) — or update if your hackathon requires otherwise.
