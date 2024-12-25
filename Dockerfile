# Base image with specified platform
FROM nielsborie/machine-learning-environments

# Install required packages as root
USER root
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    g++ \
    cmake \
    curl

# Install Ollama and Llama 2
RUN curl -fsSL https://ollama.com/install.sh | sh

# Install Python dependencies
RUN pip install \
    transformers==4.27.4 \
    accelerate==0.22.0 \
    einops==0.6.1 \
    langchain==0.0.300 \
    xformers==0.0.20 \
    bitsandbytes==0.41.1 \
    sentence_transformers==2.2.2 \
    chromadb==0.4.0 \
    huggingface_hub==0.23.5 \
    flask==2.3.2

# Set the working directory to /app
WORKDIR /app

# Copy the application code to the container
COPY input /app/

# Expose the Flask port
EXPOSE 8090

# Start the Flask server
CMD ["python", "app.py"]
