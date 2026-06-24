import chromadb
from app.rag.embeddings import get_embedding

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="course_material")

def add_document(doc_id: str, text: str, metadata: dict | None = None) -> None:
    embedding = get_embedding(text)
    collection.add(
        ids=[doc_id],
        embeddings=[embedding],
        documents=[text],
        metadatas=[metadata if metadata else {"doc_id": doc_id}],
    )

def query_similar(text: str, n_results: int = 3) -> list[str]:
    if collection.count() == 0:
        return []
    embedding = get_embedding(text)
    n_results = min(n_results, collection.count())
    results = collection.query(
        query_embeddings=[embedding],
        n_results=n_results,
    )
    return results["documents"][0] if results["documents"] else []