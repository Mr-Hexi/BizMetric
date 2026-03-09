from flask import Flask, render_template, request
import chromadb
from chromadb.utils import embedding_functions
import os

app = Flask(__name__)

client = chromadb.PersistentClient(path="./chroma_db")

# ✅ Restore embedding function
openai_key = os.getenv("OPENAI_API_KEY")
if openai_key:
    emb_fn = embedding_functions.OpenAIEmbeddingFunction(
        api_key=openai_key,
        model_name="text-embedding-3-small"
    )
else:
    emb_fn = embedding_functions.DefaultEmbeddingFunction()  # ✅ don't comment this out!

# ✅ Pass embedding function to both collections
collection = client.get_or_create_collection(
    name="product_collection",
    embedding_function=emb_fn,          # ✅ restored
    metadata={"hnsw:space": "cosine"}   # ✅ keep cosine
)

faq_collection = client.get_or_create_collection(
    name="faq_collection",
    embedding_function=emb_fn,          # ✅ same embedding function
    metadata={"hnsw:space": "cosine"}
)

@app.route('/')
def home():
    return render_template('index.html')






'''
**Visualized:**
User types query
       │
       ▼
FAQ collection.query()
       │
       ▼
distance <= 0.5?
   │          │
  YES         NO
   │          │
   ▼          ▼
return      product_collection.query()
db_info          │
                 ▼
            return results
'''

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')
    if not query:
        return render_template('index.html', results=[])

    # ---- STEP 1: Check FAQ collection first ----
    FAQ_THRESHOLD = 0.5  # ✅ fixed threshold

    faq_results = faq_collection.query(query_texts=[query], n_results=1)

    if faq_results['distances'][0] and faq_results['distances'][0][0] <= FAQ_THRESHOLD:
        answer = faq_results['metadatas'][0][0]['answer']
        # all_products = collection.get()  # ✅ get all products for dynamic answers that need live data
        # Only dynamic ones need special handling
        if answer == "DYNAMIC:count":
            count = collection.count()
            answer = f"There are {count} products in the database."

        elif answer == "DYNAMIC:cheapest":
            all_products = collection.get()
            cheapest = min(all_products['metadatas'], key=lambda x: float(x.get('price', 999)))
            answer = f"Cheapest product: {cheapest['title']} at €{cheapest['price']}"


        elif answer == "DYNAMIC:count_beauty":
            all_products = collection.get()
            # Filter by Category = Beauty
            beauty_count = sum(
                1 for m in all_products['metadatas']
                if m.get('category', '').lower() == 'beauty'
            )
            answer = f"We have {beauty_count} beauty/skincare products in our collection. ✨"

        elif answer == "DYNAMIC:count_health":
            all_products = collection.get()
            health_count = sum(
                1 for m in all_products['metadatas']
                if m.get('category', '').lower() == 'health'
            )
            answer = f"We have {health_count} health & wellness products in our collection. 💊"

        elif answer == "DYNAMIC:count_hair":
            all_products = collection.get()
            # Filter by keyword in title since hair products span categories
            hair_count = sum(
                1 for m in all_products['metadatas']
                if 'hair' in m.get('title', '').lower()
            )
            answer = f"We have {hair_count} hair care products in our collection. 💆"

        elif answer == "DYNAMIC:count_sleep":
            all_products = collection.get()
            sleep_count = sum(
                1 for m in all_products['metadatas']
                if 'sleep' in m.get('title', '').lower()
            )
            answer = f"We have {sleep_count} sleep-related products in our collection. 😴"

        # ✅ Static answers are returned directly — no extra code needed!
        db_info = {'type': 'faq', 'message': answer}
        
        return render_template('index.html', query=query, db_info=db_info)


    # ---- STEP 2: Normal product search ----
    DISTANCE_THRESHOLD = 0.7

    results = collection.query(query_texts=[query], n_results=6)

    formatted_results = []
    rejected_count = 0

    for i in range(len(results['documents'][0])):
        distance = results['distances'][0][i]

        if distance <= DISTANCE_THRESHOLD:
            formatted_results.append({
                'document': results['documents'][0][i],
                'metadata': results['metadatas'][0][i],
                'distance': distance,
                'id': results['ids'][0][i]
            })
        else:
            rejected_count += 1

    return render_template('index.html',
                           query=query,
                           results=formatted_results,
                           rejected_count=rejected_count)  # ✅ always reached if FAQ didn't match










@app.route('/db-stats')
def db_stats():
    
    #get the number of products in the collection
    count = collection.count()
    
    
    # Get a sample of 5 products for display
    sample = collection.peek(5)  
    
        # Format sample products
    sample_products = []
    for i in range(len(sample['ids'])):
        sample_products.append({
            'id': sample['ids'][i],
            'document': sample['documents'][i][:100] + '...',  # first 100 chars
            'metadata': sample['metadatas'][i]
        })
    stats = {
        'total_products': count,
        'collection_name': collection.name,
        'sample_products': sample_products
    }
    
    return stats

@app.route('/db-stats-ui')
def db_stats_ui():
    return render_template('db_stats.html')
    
if __name__ == '__main__':
    app.run(debug=True, port=5001)