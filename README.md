
# RAG Document Q&A using LLAMA 2 (via Ollama), ChromaDB, and Docker

## Overview

This project demonstrates the creation of a **Retrieval-Augmented Generation (RAG)** system utilizing Meta's Llama 2.0 model (integrated via **Ollama**), ChromaDB for vector storage, and LangChain for pipeline management. The system facilitates efficient document retrieval, general queries, and question answering (QA) by integrating retrieval capabilities with LLMs, enabling responses to queries about documents not part of the LLM's training data or even general questions.

## RAG Architecture

The system combines the capabilities of document retrieval with LLM-based response generation. This integration ensures contextual accuracy by retrieving relevant documents from a vector database before generating responses.

- **Retriever**: Encodes and indexes external documents as vectors, enabling efficient similarity-based searches.
- **Generator**: Uses **Llama 2.0 (via Ollama)** to generate responses based on retrieved documents or general knowledge.

LangChain orchestrates this pipeline, streamlining the retrieval-generation workflow.

## Features

- **General Query Handling**: Answers questions based on the inherent knowledge of **Llama 2.0 accessed via Ollama**, even if the question is not related to uploaded documents.
- **Document Database Creation**: Stores documents as high-dimensional vectors using ChromaDB.
- **Embedding Generation**: Transforms textual data into numerical representations with HuggingFace embeddings.
- **Vector Database**: Supports similarity searches and document retrieval.
- **Retriever Integration**: Fetches relevant documents based on query embeddings.
- **QA System**: Generates accurate, context-aware answers using Llama 2.0 through Ollama.


## How It Works

1. **Embedding Creation**: Generates document embeddings with HuggingFace.
2. **Data Persistence**: Stores embeddings in a directory for reuse.
3. **Vector Database Setup**: Builds a ChromaDB vector database for retrieval.
4. **Retriever Initialization**: Fetches relevant documents for queries.
5. **General Query Handling**: Answers questions unrelated to the provided documents using **Llama 2.0's pre-trained knowledge via Ollama**.
6. **LLM Integration**: Uses **Llama 2.0 (via Ollama)** for deterministic, context-aware answers.
7. **QA Pipeline**: Combines retriever and generator using LangChain.


## Project Structure

- **Data Loading**: Parses and processes textual data.
- **Database Creation**: Builds and stores vectorized documents.
- **Query Processing**: Handles retrieval-based and general queries.
- **Model Integration**: Integrates Llama 2.0 for answer generation.



## Getting Started

### Cloning the Repository

```bash
git clone https://github.com/your-repo-name/RAG-Document-QA.git
cd RAG-Document-QA
```

## Building the Application
### With Docker

1. Build the Docker image:
   ```bash
   docker-compose build
   ```
2. Start the Docker containers:
   ```bash
   docker-compose up
   ```
### Directly running RAG Application docker image 
1. Start the Docker containers:
   ```bash
   docker-compose -f docker-compose-run.yml up
   ```

## Interacting with the RAG Application

### Postman API Collection

A [Postman collection](RAG_stack.postman_collection.json) is provided for easy interaction with the application. Import the collection into Postman and use the following endpoints:

1. **Ask a General Query**
   - **Feature**: Handles queries unrelated to uploaded documents.
   - **Endpoint**: `http://127.0.0.1:8090/ask_general_query`
   - **Method**: POST
   - **Request Body**:
     ```json
     {
       "query": "What is the capital of USA?"
     }
     ```
   **Screenshot**
   ![photo_1.png](./images/photo_1.png)

2. **Upload a Document**
   - **Feature**: Uploads documents for embedding and storage.
   - **Endpoint**: `http://127.0.0.1:8090/upload_document`
   - **Method**: POST
   - **Request Body**: Form-data with the key `file`.

   **Screenshot**
   ![photo_2.png](./images/photo_2.png)

3. **Perform Similarity Search**
   - **Feature**: Finds content similar to the query in uploaded documents.
   - **Endpoint**: `http://127.0.0.1:8090/similarity_search`
   - **Method**: POST
   - **Request Body**:
     ```json
     {
       "query": "Find content similar to this query."
     }
     ```
   **Screenshot**
   ![photo_3.png](./images/photo_3.png)

4. **Query a Document**
   - **Feature**: Queries uploaded documents for specific information.
   - **Endpoint**: `http://127.0.0.1:8090/query_document`
   - **Method**: POST
   - **Request Body**:
     ```json
     {
       "query": "What is the content of the document?"
     }
     ```
   **Screenshot**
   ![photo_4.png](./images/photo_4.png)

---
