from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from app.agents.grading_agent import grade_submission
from app.agents.feedback_agent import generate_feedback
from app.agents.progress_agent import generate_progress_report
from app.rag.vector_store import add_document, query_similar
from app.rag.document_loader import extract_text, chunk_text
from app.db.database import Base, engine, get_db
from app.db import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Assessment & Feedback Automation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class GradeRequest(BaseModel):
    question: str
    reference_answer: Optional[str] = None
    student_answer: str
    student_id: Optional[int] = None
    use_rag: bool = True

class IngestRequest(BaseModel):
    doc_id: str
    text: str
    metadata: Optional[dict] = None

class StudentCreate(BaseModel):
    name: str
    email: Optional[str] = None

@app.get("/")
def health():
    return {"status": "running"}

@app.post("/api/ingest")
def ingest(req: IngestRequest):
    add_document(req.doc_id, req.text, req.metadata)
    return {"status": "ingested", "doc_id": req.doc_id}

@app.post("/api/ingest-document")
async def ingest_document(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text(file.filename, content)
    chunks = chunk_text(text)
    if not chunks:
        raise HTTPException(status_code=400, detail="Could not extract any usable text from this file.")

    base_id = file.filename.rsplit(".", 1)[0]
    for i, chunk in enumerate(chunks):
        add_document(f"{base_id}-{i}", chunk, {"source": file.filename})

    return {"status": "ingested", "filename": file.filename, "chunks": len(chunks)}

@app.post("/api/students")
def create_student(req: StudentCreate, db: Session = Depends(get_db)):
    student = models.Student(name=req.name, email=req.email)
    db.add(student)
    db.commit()
    db.refresh(student)
    return {"id": student.id, "name": student.name, "email": student.email}

@app.get("/api/students/{student_id}/submissions")
def get_submissions(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return [
        {
            "id": s.id,
            "question": s.question,
            "score": s.score,
            "feedback": s.feedback,
            "created_at": s.created_at,
        }
        for s in student.submissions
    ]

@app.delete("/api/students/{student_id}/submissions")
def clear_submissions(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.query(models.Submission).filter(models.Submission.student_id == student_id).delete()
    db.commit()
    return {"status": "cleared", "student_id": student_id}

@app.get("/api/students/{student_id}/progress-report")
def get_progress_report(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    submissions = [
        {"question": s.question, "score": s.score, "created_at": s.created_at.isoformat()}
        for s in sorted(student.submissions, key=lambda s: s.created_at)
    ]
    report = generate_progress_report(student.name, submissions)
    return {"student_id": student.id, "student_name": student.name, "report": report}

@app.post("/api/grade")
def grade(req: GradeRequest, db: Session = Depends(get_db)):
    context_chunks = []
    if req.use_rag:
        context_chunks = query_similar(req.question, n_results=3)

    if not req.reference_answer and not context_chunks:
        raise HTTPException(
            status_code=400,
            detail="No reference answer was given, and no matching material was found in the document store. Upload a document covering this topic, or provide a reference answer.",
        )

    grading_result = grade_submission(req.question, req.reference_answer, req.student_answer, context_chunks)
    feedback_text = generate_feedback(
        req.question, req.student_answer, grading_result.get("score"), grading_result.get("reasoning"), context_chunks
    )

    submission = models.Submission(
        student_id=req.student_id,
        question=req.question,
        reference_answer=req.reference_answer or "(derived from uploaded document)",
        student_answer=req.student_answer,
        score=grading_result.get("score"),
        feedback=feedback_text,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "score": grading_result.get("score"),
        "feedback": feedback_text,
        "submission_id": submission.id,
    }