from flask import Flask, render_template, request
import chromadb
from chromadb.utils import embedding_functions
from google import genai
from google.genai import types
import os
import time
import dotenv

app = Flask(__name__)

dotenv.load_dotenv(override=True)
env = os.getenv("GENAI_API_KEY")
client_ai = genai.Client(api_key=env)
print((env))

client = chromadb.PersistentClient(path="./chroma_db")
emb_fn = embedding_functions.DefaultEmbeddingFunction()

collection = client.get_or_create_collection(
    name="product_collection",
    embedding_function=emb_fn,
    metadata={"hnsw:space": "cosine"}
)

# ---- Tools ----
def search_products(query: str):
    """Search for products in the IVYBEARS store based on user query."""
    DISTANCE_THRESHOLD = 0.7
    results = collection.query(query_texts=[query], n_results=3)
    formatted = []
    for i in range(len(results['documents'][0])):
        distance = results['distances'][0][i]
        if distance <= DISTANCE_THRESHOLD:
            formatted.append({
                'document': results['documents'][0][i],
                'metadata': results['metadatas'][0][i],
                'distance': distance,
                'id': results['ids'][0][i]
            })
    return formatted

def get_product_count():
    """Get the total number of products in the store."""
    return collection.count()

def get_cheapest_product():
    """Get the cheapest product in the store."""
    all_products = collection.get()
    cheapest = min(
        all_products['metadatas'],
        key=lambda x: float(x.get('price', 999)) if x.get('price') else 999
    )
    return cheapest

# ---- Retry Logic ----
def generate_with_retry(query, retries=3):
    
    general_keywords = ['founder', 'who is', 'where are', 'based in',
                        'about', 'what is ivybears', 'vegan', 'made in']
    is_general = any(k in query.lower() for k in general_keywords)

    for attempt in range(retries):
        try:
            if is_general:
                # Single call, no tools
                response = client_ai.models.generate_content(
                    model="gemini-2.5-flash-lite",
                    contents=query,
                    config=types.GenerateContentConfig(
                        system_instruction="""
                        You are a helpful assistant for IVYBEARS, a vegan vitamin gummy brand.
                        About IVYBEARS:
                        - Founded by Kaan Haylaza
                        - Based in Germany, ships across Europe
                        - 100% vegan gummy vitamins
                        - Categories: Hair, Sleep, Immune, Skin, Energy, Stress, Kids
                        - Made in Germany, no artificial flavors or colors
                        Answer directly and friendly! 🐻
                        """
                    )
                )
            else:
                # Force tool use for product queries
                response = client_ai.models.generate_content(
                    model="gemini-2.5-flash-lite",
                    contents=query,
                    config=types.GenerateContentConfig(
                        tools=[search_products, get_product_count, get_cheapest_product],
                        tool_config=types.ToolConfig(
                            function_calling_config=types.FunctionCallingConfig(
                                mode="ANY",  # ✅ forces tool call
                                allowed_function_names=["search_products", "get_product_count", "get_cheapest_product"]
                            )
                        ),
                        system_instruction="""
                        You are a shopping assistant for IVYBEARS.
                        ALWAYS use the available tools. Never answer product questions from memory.
                        - Product/health queries → MUST call search_products()
                        - Count queries → MUST call get_product_count()
                        - Cheapest product → MUST call get_cheapest_product()
                        """
                    )
                )
            return response

        except Exception as e:
            if '429' in str(e):
                if attempt < retries - 1:
                    wait = 60
                    print(f"Rate limited, waiting {wait}s...")
                    time.sleep(wait)
                else:
                    return None
            else:
                raise e

# ---- Routes ----
@app.route('/')
def home():
    count = collection.count()
    all_results = collection.get(limit=12)
    formatted_results = []
    for i in range(len(all_results['ids'])):
        price = all_results['metadatas'][i].get('price', 0)
        if float(price) > 0:
            formatted_results.append({
                'document': all_results['documents'][i],
                'metadata': all_results['metadatas'][i],
                'distance': 0.0,
                'id': all_results['ids'][i]
            })
    return render_template('index.html',
                           collection_count=count,
                           results=formatted_results)

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')
    if not query:
        return render_template('index.html', results=[], collection_count=collection.count())

    response = generate_with_retry(query)

    if response is None:
        db_info = {'type': 'faq', 'message': "I'm overwhelmed 😅 Try again in a few seconds!"}
        return render_template('index.html', query=query, db_info=db_info,
                               collection_count=collection.count())

    product_results = []
    db_info = None

    for part in response.candidates[0].content.parts:
        if hasattr(part, 'function_call') and part.function_call:
            fn_name = part.function_call.name
            fn_args = dict(part.function_call.args)

            if fn_name == 'search_products':
                # ✅ FIX 1: call search_products ONCE and store result
                product_results = search_products(fn_args['query'])

            elif fn_name == 'get_product_count':
                count = get_product_count()
                db_info = {'type': 'faq', 'message': f'We have {count} products in our store! 🛍️'}

            elif fn_name == 'get_cheapest_product':
                cheapest = get_cheapest_product()
                db_info = {'type': 'faq', 'message': f'Cheapest: {cheapest["title"]} at €{cheapest["price"]} 🏷️'}

        elif hasattr(part, 'text') and part.text:
            db_info = {'type': 'faq', 'message': part.text}

    # ✅ FIX 2: if products found, add a friendly message in chat too
    if product_results and not db_info:
        db_info = {'type': 'faq', 'message': f'Found {len(product_results)} product(s) for you! Check them out below 🛍️'}

    return render_template('index.html',
                           query=query,
                           results=product_results,
                           db_info=db_info,
                           collection_count=collection.count())

if __name__ == '__main__':
    app.run(debug=True, port=5001)