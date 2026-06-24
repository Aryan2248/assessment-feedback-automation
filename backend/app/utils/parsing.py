import re

def parse_score_feedback(raw: str) -> tuple[float | None, str | None]:
    """Used by the legacy single-call agent (grading_agent_claude.py) that
    returns score + feedback together in one response."""
    score_match = re.search(r"Score:\s*([\d.]+)\s*/\s*10", raw)
    score = float(score_match.group(1)) if score_match else None
    feedback_match = re.search(r"Feedback:\s*(.*)", raw, re.DOTALL)
    feedback = feedback_match.group(1).strip() if feedback_match else None
    return score, feedback

def parse_score_reasoning(raw: str) -> tuple[float | None, str | None]:
    """Used by the split grading_agent.py — it only returns a score plus
    brief internal reasoning. The feedback_agent writes the student-facing text."""
    score_match = re.search(r"Score:\s*([\d.]+)\s*/\s*10", raw)
    score = float(score_match.group(1)) if score_match else None
    reasoning_match = re.search(r"Reasoning:\s*(.*)", raw, re.DOTALL)
    reasoning = reasoning_match.group(1).strip() if reasoning_match else None
    return score, reasoning