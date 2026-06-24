import { useState } from "react";
import StudentPanel from "./components/StudentPanel";
import GradeForm from "./components/GradeForm";
import SubmissionsList from "./components/SubmissionsList";
import ProgressReport from "./components/ProgressReport";
import IngestPanel from "./components/IngestPanel";
import DocumentUpload from "./components/DocumentUpload";

export default function App() {
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app">
      <div className="bg-mesh" aria-hidden="true" />

      <header className="app-header">
        <h1 className="brand-title">Assessment &amp; Feedback Automation</h1>
        <p className="subtitle">AI grading, feedback, and progress tracking</p>
      </header>

      <main className="layout">
        <section className="column">
          <StudentPanel
            studentId={studentId}
            studentName={studentName}
            onStudentReady={(id, name) => {
              setStudentId(id);
              setStudentName(name);
            }}
          />
          <IngestPanel />
          <DocumentUpload />
        </section>

        <section className="column wide">
          {studentId ? (
            <>
              <GradeForm studentId={studentId} onGraded={() => setRefreshKey((k) => k + 1)} />
              <SubmissionsList studentId={studentId} refreshKey={refreshKey} />
              <ProgressReport studentId={studentId} studentName={studentName} />
            </>
          ) : (
            <p className="hint">Create or select a student on the left to get started.</p>
          )}
        </section>
      </main>
    </div>
  );
}