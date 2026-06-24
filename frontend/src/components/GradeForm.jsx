import { useState } from "react";
import { gradeSubmission } from "../api";
import ScoreOrb from "./ScoreOrb";

export default function GradeForm({ studentId, onGraded }) {
  const [question, setQuestion] = useState("");
  const [referenceAnswer, setReferenceAnswer] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await gradeSubmission({
        question,
        reference_answer: referenceAnswer.trim() ? referenceAnswer : null,
        student_answer: studentAnswer,
        student_id: studentId,
      });
      setResult(data);
      onGraded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Grade a submission</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Question</label>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} required />
        <label>Reference answer (optional — leave blank to grade against an uploaded document)</label>
        <textarea
          value={referenceAnswer}
          onChange={(e) => setReferenceAnswer(e.target.value)}
          placeholder="Leave blank to use uploaded reference material instead"
        />
        <label>Student's answer</label>
        <textarea value={studentAnswer} onChange={(e) => setStudentAnswer(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Grading..." : "Grade"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <ScoreOrb score={result.score} size="large" />
          <p className="result-feedback">{result.feedback}</p>
        </div>
      )}
    </div>
  );
}