import { useState } from "react";
import { createStudent } from "../api";

export default function StudentPanel({ studentId, studentName, onStudentReady }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [existingId, setExistingId] = useState("");
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const student = await createStudent(name, email);
      onStudentReady(student.id, student.name);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUseExisting = (e) => {
    e.preventDefault();
    if (existingId) onStudentReady(Number(existingId), `Student #${existingId}`);
  };

  return (
    <div className="card">
      <h2>Student</h2>
      {studentId && <p className="active-student">Active: {studentName} (ID {studentId})</p>}

      <form onSubmit={handleCreate} className="form">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Aryan Yadav" required />
        <label>Email (optional)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="aryan@example.com" />
        <button type="submit">Create student</button>
      </form>

      <div className="divider">or</div>

      <form onSubmit={handleUseExisting} className="form">
        <label>Use existing student ID</label>
        <input value={existingId} onChange={(e) => setExistingId(e.target.value)} placeholder="1" />
        <button type="submit">Load</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}