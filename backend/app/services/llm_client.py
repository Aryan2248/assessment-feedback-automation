import logging
from google import genai
from google.genai import errors as genai_errors
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type, before_sleep_log
from app.config import GEMINI_API_KEY

logger = logging.getLogger("llm_client")
logging.basicConfig(level=logging.INFO)

client = genai.Client(api_key=GEMINI_API_KEY)

@retry(
    stop=stop_after_attempt(4),
    wait=wait_exponential(multiplier=2, min=2, max=15),
    retry=retry_if_exception_type(genai_errors.ServerError),
    before_sleep=before_sleep_log(logger, logging.WARNING),
)
def call_gemini(prompt: str, model: str = "gemini-2.5-flash") -> str:
    response = client.models.generate_content(model=model, contents=prompt)
    return response.text