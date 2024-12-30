from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
import os
import subprocess
import time
import chromadb
from chromadb.utils import embedding_functions
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.document_loaders import TextLoader
from langchain.schema import Document 

# Set up environment variables
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Initialize ChromaDB client
client = chromadb.Client()

# Initialize embedding function
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# Initialize Ollama LLM
llm = Ollama(model="llama2")

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})  # Allows requests from any origin. Adjust as needed.

vectorstore = None

@app.route('/upload_document', methods=['POST'])
def upload_and_index_document():
    global vectorstore
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading."}), 400
    try:
        file_path = f"./uploaded_files/{file.filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        file.save(file_path)  # Save the file locally
        loader = TextLoader(file_path)
        documents = loader.load()
        texts = text_splitter.split_documents(documents)
        vectorstore = Chroma.from_documents(texts, embeddings, persist_directory="./chroma_db")
        return jsonify({"message": "Document uploaded and indexed successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/query_document', methods=['POST'])
def query_document():
    global vectorstore
    if vectorstore is None:
        return jsonify({"error": "Please upload a document first."}), 400
    query = request.json.get('query')
    if not query:
        return jsonify({"error": "Query is required."}), 400
    try:
        print(f"user asked query is: {query}")
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        )
        result = qa_chain.run(query)
        return jsonify({"answer": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/similarity_search', methods=['POST'])
def similarity_search():
    global vectorstore
    if vectorstore is None:
        return jsonify({"error": "Please upload a document first."}), 400
    query = request.json.get('query')
    if not query:
        return jsonify({"error": "Query is required."}), 400
    try:
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        results = retriever.get_relevant_documents(query)
        return jsonify({"results": [doc.page_content for doc in results]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ask_general_query', methods=['POST'])
def ask_general_query():
    query = request.json.get('query')
    if not query:
        return jsonify({"error": "Query is required."}), 400
    try:
        print(f"user asked query is: {query}")
        result = llm.generate([query])
        text_response = result.generations[0][0].text  # Adjust indexing based on actual structure
        return jsonify({"response": text_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/text_and_query', methods=['POST'])
def text_and_query():
    global vectorstore
    request_data = request.json
    text = request_data.get('text')
    query = request_data.get('query')

    if not text:
        return jsonify({"error": "Text is required."}), 400
    if not query:
        return jsonify({"error": "Query is required."}), 400

    try:
        # Step 1: Create a Document object
        documents = [Document(page_content=text, metadata={})]  # Ensure it's a list of Document objects

        # Step 2: Split the document into smaller chunks
        texts = text_splitter.split_documents(documents)  # Split into chunks

        # Step 3: Index the chunks into ChromaDB
        vectorstore = Chroma.from_documents(texts, embeddings, persist_directory="./chroma_db")

        print("uploading of text document content done !!")

        # Step 4: Query the indexed content
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
        )
        result = qa_chain.run(query)

        return jsonify({"answer": result, "message": "Text processed and query executed successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    try:
        print("Initializing Ollama server...")
        subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Started the ollama server")
        time.sleep(5)
        print("Pulling Llama2 model...")
        subprocess.run(["ollama", "pull", "llama2"], check=True, capture_output=True, text=True)
        print("Initialization complete.")
    except Exception as e:
        print(f"Initialization error: {e}")

    app.run(host="0.0.0.0", debug=True, port=8090)
