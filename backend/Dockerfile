FROM python:3.11-slim

# Install system dependencies (LibreOffice for DOCX->PDF, libmagic for MIME validation)
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Ensure upload/output directories exist
RUN mkdir -p uploads outputs temp

# Expose port
EXPOSE 8000

# Start server
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
