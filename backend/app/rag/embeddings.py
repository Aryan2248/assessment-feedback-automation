from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def get_embedding(text: str) -> list[float]:
    """Embed text using Gemini's current embedding model (gemini-embedding-001).
    Free tier, no OpenAI billing needed. Swap to OpenAI's text-embedding-3-small
    before final submission if you want to match the brief's stated stack and
    your OpenAI account gets funded."""
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )
    return result.embeddings[0].values