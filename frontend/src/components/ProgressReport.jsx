import { useState } from "react";
import { jsPDF } from "jspdf";
import { getProgressReport } from "../api";

export default function ProgressReport({ studentId, studentName }) {
  const [report, setReport] = useState("");
  const [generatedAt, setGeneratedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProgressReport(studentId);
      setReport(data.report);
      setGeneratedAt(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!report) return;
    const doc = new jsPDF();
    const margin = 18;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Progress Report", margin, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90);
    doc.text(`Student: ${studentName}`, margin, 32);
    doc.text(`Generated: ${(generatedAt || new Date()).toLocaleString()}`, margin, 39);

    doc.setDrawColor(200);
    doc.line(margin, 44, pageWidth - margin, 44);

    doc.setTextColor(20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(report, maxWidth);
    doc.text(lines, margin, 56);

    const safeName = studentName.replace(/\s+/g, "_").toLowerCase();
    doc.save(`progress-report-${safeName}.pdf`);
  };

  return (
    <div className="card">
      <h2>Progress report</h2>
      <button onClick={fetchReport} disabled={loading}>
        {loading ? "Generating..." : `Generate report for ${studentName}`}
      </button>
      {error && <p className="error">{error}</p>}

      {report && (
        <div className="report-card">
          <div className="report-meta">
            <span className="report-meta-name">{studentName}</span>
            <span className="report-meta-date">{generatedAt?.toLocaleString()}</span>
          </div>
          <p className="report-text">{report}</p>
          <button className="btn-secondary" onClick={handleDownloadPdf}>
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}