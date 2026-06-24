import { useEffect, useState } from "react";
import { getSubmissions, clearSubmissions } from "../api";
import ScoreOrb from "./ScoreOrb";

export default function SubmissionsList({ studentId, refreshKey }) {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    getSubmissions(studentId).then(setSubmissions).catch((err) => setError(err.message));
  }, [studentId, refreshKey]);

  const handleClear = async () => {
    const confirmed = window.confirm(
      "Clear all submission history for this student? This cannot be undone."
    );
    if (!confirmed) return;

    setClearing(true);
    setError("");
    try {
      await clearSubmissions(studentId);
      setSubmissions([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header-row">
        <h2>Submission history</h2>
        {submissions.length > 0 && (
          <button className="btn-clear" onClick={handleClear} disabled={clearing}>
            {clearing ? "Clearing..." : "Clear"}
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {submissions.length === 0 ? (
        <p className="hint">No submissions yet.</p>
      ) : (
        <ul className="submission-list">
          {submissions.map((s) => (
            <li key={s.id} className="submission-row">
              <ScoreOrb score={s.score} size="small" />
              <div className="submission-body">
                <span className="submission-question">{s.question}</span>
                <p className="submission-feedback">{s.feedback}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}