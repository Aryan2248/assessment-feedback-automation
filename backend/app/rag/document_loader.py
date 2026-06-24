from pypdf import PdfReader
import io

def extract_text(filename: str, content: bytes) -> str:
    """Pull plain text out of an uploaded .pdf or .txt file."""
    if filename.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(content))
        return "\n\n".join(page.extract_text() or "" for page in reader.pages)
    return content.decode("utf-8", errors="ignore")

def chunk_text(text: str, min_chunk_length: int = 40) -> list[str]:
    """Splits on blank lines (paragraphs) and drops tiny fragments that
    aren't worth embedding on their own."""
    raw_chunks = [c.strip() for c in text.split("\n\n")]
    return [c for c in raw_chunks if len(c) >= min_chunk_length]