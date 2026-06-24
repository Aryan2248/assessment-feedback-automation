import { useState } from "react";
import { ingestFile } from "../api";

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setStatus("Uploading and ingesting...");
    try {
      const data = await ingestFile(file);
      setStatus(`Ingested ${data.chunks} chunks from ${data.filename}.`);
      setFile(null);
      e.target.reset();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload reference document</h2>
      <p className="hint small">
        Upload a .txt or .pdf of theory/notes. After this, you can ask a question and leave
        "Reference answer" blank — grading will pull the correct answer from this document.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label>File (.txt or .pdf)</label>
        <input type="file" accept=".txt,.pdf" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit" disabled={loading || !file}>{loading ? "Uploading..." : "Upload & ingest"}</button>
      </form>
      {status && <p className="hint small">{status}</p>}
    </div>
  );
}