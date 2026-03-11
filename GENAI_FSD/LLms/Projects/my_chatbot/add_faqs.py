import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
faq_collection = client.get_or_create_collection(
    name="faq_collection",
    metadata={"hnsw:space": "cosine"}
)

faqs = [
    {
        "id": "faq_1",
        "question": "How many products do you have?",
        "answer": "DYNAMIC:count"  # changes constantly → fetch live
    },
    {
        "id": "faq_2",
        "question": "What is the cheapest product?",
        "answer": "DYNAMIC:cheapest"  # changes if prices update → fetch live
    },
    {
        "id": "faq_3",
        "question": "Do you have vegan products?",
        "answer": "Yes! All IVYBEARS products are vegan gummy vitamins. 🌱"  # ✅ static
    },
    {
        "id": "faq_4",
        "question": "What collection is this?",
        "answer": "This is the IVYBEARS product collection."  # ✅ static
    },
    {
        "id": "faq_5",
        "question": "Where are you based?",
        "answer": "IVYBEARS is a European health supplement brand. 🇪🇺"  # ✅ static
    },
    {
        "id": "faq_6",
        "question": "What type of products do you sell?",
        "answer": "We sell gummy vitamins and health supplements for immunity, hair, sleep and more! 💊"  # ✅ static
    }
]

faq_collection.add(
    ids=[f["id"] for f in faqs],
    documents=[f["question"] for f in faqs],
    metadatas=[{"answer": f["answer"]} for f in faqs]
)

print("FAQs added successfully!")