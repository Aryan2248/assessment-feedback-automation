const API_BASE = "http://localhost:8000";

export async function createStudent(name, email) {
  const res = await fetch(`${API_BASE}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error("Failed to create student");
  return res.json();
}

export async function gradeSubmission({ question, reference_answer, student_answer, student_id }) {
  const res = await fetch(`${API_BASE}/api/grade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, reference_answer, student_answer, student_id }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to grade submission");
  }
  return res.json();
}

export async function getSubmissions(studentId) {
  const res = await fetch(`${API_BASE}/api/students/${studentId}/submissions`);
  if (!res.ok) throw new Error("Failed to fetch submissions");
  return res.json();
}

export async function clearSubmissions(studentId) {
  const res = await fetch(`${API_BASE}/api/students/${studentId}/submissions`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to clear submissions");
  return res.json();
}

export async function getProgressReport(studentId) {
  const res = await fetch(`${API_BASE}/api/students/${studentId}/progress-report`);
  if (!res.ok) throw new Error("Failed to fetch progress report");
  return res.json();
}

export async function ingestDocument({ doc_id, text }) {
  const res = await fetch(`${API_BASE}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id, text }),
  });
  if (!res.ok) throw new Error("Failed to ingest document");
  return res.json();
}

export async function ingestFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/api/ingest-document`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to ingest document");
  }
  return res.json();
}