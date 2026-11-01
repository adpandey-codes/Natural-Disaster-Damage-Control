import os
import json
import hashlib
from google import genai
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from flask_cors import CORS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

load_dotenv()

app = Flask(__name__)
CORS(app)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ----------------------------------------------------
# 2. Vector Database & Indexing Setup
# ----------------------------------------------------
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
INDEX_PATH = "faiss_index"
DATASET_PATH = "dataset.json"
HASH_FILE = "dataset_hash.txt"

def get_dataset_hash():
    """Generates an MD5 hash of dataset.json to detect changes."""
    if not os.path.exists(DATASET_PATH):
        return ""
    with open(DATASET_PATH, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

def build_vector_db():
    """Reads dataset.json and constructs a new FAISS vector database."""
    print("-> Building Vector Index from dataset.json...")
    docs = []
    
    if os.path.exists(DATASET_PATH):
        try:
            with open(DATASET_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                items = data.get("dataset", [])
                for idx, item in enumerate(items):
                    content = f"Instruction: {item.get('instruction', '')}\nContext: {item.get('context', '')}\nResponse: {item.get('response', '')}"
                    docs.append(Document(page_content=content, metadata={"id": idx}))
                print(f"-> Indexed {len(items)} calamity records successfully!")
        except Exception as e:
            print(f"Error parsing JSON dataset: {e}")

    if not docs:
        docs = [Document(page_content="Flood emergency response assistant dataset initialized.")]

    vector_db = FAISS.from_documents(docs, embeddings)
    vector_db.save_local(INDEX_PATH)
    
    # Save hash to track future updates
    with open(HASH_FILE, "w") as f:
        f.write(get_dataset_hash())
        
    return vector_db

def load_or_update_vector_db():
    """Loads existing index if unchanged, or rebuilds if dataset.json was updated."""
    current_hash = get_dataset_hash()
    saved_hash = ""
    
    if os.path.exists(HASH_FILE):
        with open(HASH_FILE, "r") as f:
            saved_hash = f.read().strip()

    # Rebuild if index doesn't exist or dataset changed
    if not os.path.exists(INDEX_PATH) or current_hash != saved_hash:
        print("-> Dataset modified or index missing. Rebuilding index...")
        return build_vector_db()
    else:
        print("-> Loading cached FAISS Vector Database...")
        return FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)

# Initialize vector database on server startup
try:
    vector_db = load_or_update_vector_db()
    print("-> Vector DB Readiness: OK")
except Exception as e:
    print(f"Critical error setting up Vector DB: {e}")
    vector_db = None

# ----------------------------------------------------
# 3. RAG Retrieval & Prompt Pipeline
# ----------------------------------------------------
def get_rag_response(user_query):
    if vector_db :
        docs = vector_db.similarity_search(user_query, k=4)
        context = "\n\n".join([doc.page_content for doc in docs])
    else:
        context = "No disaster records available. Please check the dataset."
    try:
        response = client.generate_content(user_query)
        return response.text.strip()
    except Exception as e:
        print(f"API Error: {e}")
        return f"Error executing disaster query: {str(e)}"
    
    

     # Retrieve top 4 most relevant entries
        docs = vector_db.similarity_search(user_query, k=4)
        context = "\n\n".join([doc.page_content for doc in docs])

        prompt = prompt = f"""
        You are 'DisasterGuard AI', an empathetic, highly knowledgeable emergency response assistant specializing in natural calamities and safety protocols over the last two decades.

        Instructions:
        1. Do not Greet the Person unless they explicitly say "hi", "hello", "hey" first.
        2. Directly answer the user's query using the context provided from past disaster records, statistics, and emergency steps.
        3. Use the provided context to accurately answer questions about past disasters, statistics, and emergency steps.
        4. Break down complex facts into bullet points or bold text to make it easy to scan quickly during emergencies.
        5. If the exact answer is not in the context, use your general knowledge on natural disasters while remaining grounded and helpful.
        6. Always use official Indian emergency contact numbers nut when mentioning helpline/emergency services:
            - National Emergency Number: 112
            - Ambulance: 102 / 108
            - Disaster Management Helpline: 1070 / 1078
            - Fire Services: 101
            - Police: 100
        7. Do not provide these emergency numbers unless the user explicitly asks for them or needs them if they are in any danger.
        8. Do NOT mention 911 under any circumstances.
        9. Directly answer the query using the provided context or general disaster management guidelines applicable in India.
        Context Information:
        {context}

        User Prompt: {user_query}
        Answer:
        """

        response = client.models.generate_content(
            client=genai.GenerativeModel('gemini-1.5-flash'),
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        print(f"API Error: {e}")
        return f"Error executing disaster query: {str(e)}"

# ----------------------------------------------------
# 4. REST API Endpoint
# ----------------------------------------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"response": "Please provide a message."}), 400
    try:
        bot_response = get_rag_response(user_message)
        return jsonify({"response": bot_response})
    except Exception as e:
        print(f"Error processing chat request: {str(e)}")
        return jsonify({"response": f"Error processing request: {str(e)}"}), 500

if __name__ == "__main__":
    print("-> Launching DisasterGuard Server on http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=True)