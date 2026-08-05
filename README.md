# Toolzio

![Toolzio Banner](https://placehold.co/1200x400/3b82f6/white?text=Toolzio)

Toolzio is a blazing-fast, privacy-first suite of online PDF tools. 

## Features

- **PDF to Word**: Convert your PDFs accurately into editable `.docx` files.
- **Word to PDF**: Generate high-quality PDFs from Word documents.
- **Merge PDF**: Combine multiple PDF files in exactly the order you need.
- **Split PDF**: Extract single pages or split PDFs effortlessly.
- **Compress PDF**: Reduce file size while preserving quality.
- **Privacy First**: Files are processed locally on the backend and deleted immediately after conversion.

## Tech Stack

### Frontend
- **React.js (Vite)**
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Helmet Async** for SEO management

### Backend
- **Python (FastAPI)**
- **LibreOffice** for Document Conversions
- **PyPDF2** for PDF Manipulation
- **Docker** for containerized deployment

## Folder Structure

```
toolzio/
├── backend/            # FastAPI Python Application
│   ├── app/            # Core logic and configuration
│   ├── api/            # Route handlers
│   ├── uploads/        # Temporary upload storage (auto-cleaned)
│   ├── outputs/        # Temporary output storage (auto-cleaned)
│   ├── Dockerfile
│   └── requirements.txt
├── src/                # React Frontend
│   ├── components/     # UI Components
│   ├── pages/          # React Router Pages
│   └── api/            # API connection logic
├── public/             # Static Assets (favicon, sitemap, robots)
├── package.json
├── render.yaml         # Render Deployment Blueprint
└── vercel.json         # Vercel Configuration
```

## Local Development

### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

*Note: For Word to PDF conversions to work locally, LibreOffice must be installed and added to your system PATH.*

### 2. Start the Frontend
```bash
# In a new terminal at the project root
npm install
npm run dev
```

## Deployment

Refer to [LAUNCH_GUIDE.md](./LAUNCH_GUIDE.md) for a comprehensive, step-by-step production deployment guide.

- **Frontend**: Deploy to Vercel (zero-config Vite support).
- **Backend**: Deploy to Render using the included Dockerfile.
