from app.services.llm_client import call_gemini

def generate_progress_report(student_name: str, submissions: list[dict]) -> str:
    if not submissions:
        return "No submissions yet — once this student has a few graded answers, a progress report can be generated."

    history_lines = "\n".join(
        f"- {s['created_at']}: \"{s['question']}\" — scored {s['score']}/10"
        for s in submissions
    )

    prompt = f"""You are an academic progress analyst reviewing one student's history.

Student: {student_name}
Submission history (oldest to newest):
{history_lines}

Write a short progress report (3-4 sentences). State whether the student is
improving, staying steady, or declining over time, and call out any specific
topics where they consistently struggle or excel, if a pattern is visible.
Keep the tone constructive and encouraging, written for the student or their teacher."""

    return call_gemini(prompt, model="gemini-2.5-flash-lite").strip()