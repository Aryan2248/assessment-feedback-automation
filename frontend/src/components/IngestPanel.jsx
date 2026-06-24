import { useState } from "react";
import { ingestDocument } from "../api";

export default function IngestPanel() {
  const [docId, setDocId] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Ingesting...");
    try {
      await ingestDocument({ doc_id: docId, text });
      setStatus("Ingested.");
      setDocId("");
      setText("");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Add reference material</h2>
      <p className="hint small">Feeds the RAG layer used during grading.</p>
      <form onSubmit={handleSubmit} className="form">
        <label>Doc ID</label>
        <input value={docId} onChange={(e) => setDocId(e.target.value)} placeholder="photo-2" required />
        <label>Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required />
        <button type="submit">Ingest</button>
      </form>
      {status && <p className="hint small">{status}</p>}
    </div>
  );
}