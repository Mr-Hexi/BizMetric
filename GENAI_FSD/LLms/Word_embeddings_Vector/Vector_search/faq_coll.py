import chromadb
from chromadb.utils import embedding_functions


client = chromadb.PersistentClient(path="./chroma_db")
# emb_fn = embedding_functions.DefaultEmbeddingFunction()
collection = client.get_or_create_collection(
    name="faq_collection",
    # embedding_function=emb_fn
)
print("Total FAQs in collection:", collection.peek(1))