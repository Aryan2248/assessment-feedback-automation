from app.services.llm_client import call_gemini
from app.utils.parsing import parse_score_reasoning

def grade_submission(question: str, reference_answer: str | None, student_answer: str, context_chunks: list[str] | None = None) -> dict:
    context_section = ""
    if context_chunks:
        joined = "\n".join(f"- {c}" for c in context_chunks)
        context_section = f"\nRelevant course material retrieved for grounding:\n{joined}\n"

    if reference_answer:
        reference_section = f"Reference/ideal answer: {reference_answer}\n"
    else:
        reference_section = "No reference answer was provided. Use the retrieved course material above as the authoritative source of truth for grading.\n"

    prompt = f"""You are grading a student's answer for accuracy and completeness.

Question: {question}
{reference_section}{context_section}
Student's answer: {student_answer}

Evaluate conceptual understanding and completeness, not just keyword matches.

Respond ONLY in this exact format:
Score: <number>/10
Reasoning: <1-2 sentences, internal notes on what was correct or missing — this will NOT be shown directly to the student>"""

    raw = call_gemini(prompt, model="gemini-2.5-flash-lite")
    score, reasoning = parse_score_reasoning(raw)
    return {"score": score, "reasoning": reasoning, "raw": raw}