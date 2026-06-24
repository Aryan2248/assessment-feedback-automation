from app.services.llm_client import call_gemini

def generate_feedback(question: str, student_answer: str, score: float | None, reasoning: str | None, context_chunks: list[str] | None = None) -> str:
    context_section = ""
    if context_chunks:
        joined = "\n".join(f"- {c}" for c in context_chunks)
        context_section = f"\nRelevant course material:\n{joined}\n"

    prompt = f"""You are a supportive teaching assistant writing feedback directly to a student.

Question: {question}
Student's answer: {student_answer}
Score given: {score}/10
Internal grading notes (context for you, do not repeat verbatim): {reasoning}
{context_section}
Write 2-3 sentences of constructive, encouraging, specific feedback addressed directly
to the student ("You..."). Acknowledge what they got right before pointing out what's
missing or could be more precise. Do not just restate the score."""

    return call_gemini(prompt, model="gemini-2.5-flash-lite").strip()