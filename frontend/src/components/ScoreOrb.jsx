export default function ScoreOrb({ score, size = "large" }) {
  if (score === null || score === undefined) return null;
  const band = score >= 8 ? "high" : score >= 5 ? "mid" : "low";

  return (
    <div className={`score-orb score-orb--${size} score-orb--${band}`}>
      <span className="score-orb-value">{score}</span>
      <span className="score-orb-max">/10</span>
    </div>
  );
}