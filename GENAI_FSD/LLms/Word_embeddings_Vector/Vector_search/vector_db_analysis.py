import chromadb
from chromadb.utils import embedding_functions


client = chromadb.PersistentClient(path="./chroma_db")
# emb_fn = embedding_functions.DefaultEmbeddingFunction()
collection = client.get_or_create_collection(
    name="product_collection",
    # embedding_function=emb_fn
)
print("Total products in collection:", collection.count())

sample = collection.peek(1)  
print("1st Product:", sample['ids'][0])  #O/P-> 7894891397168

res = collection.query(
    query_texts=["Protein boost"],)

print(res['documents'][0][0])  #O/P-> "This is a product description for a hair fall control shampoo."4


