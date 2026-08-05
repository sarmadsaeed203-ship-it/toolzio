<div align="center">
  <h1>Toolzio</h1>
  <p><b>One workspace for every file. Convert, edit, compress, and organize documents and images securely.</b></p>
</div>

<br />

## 🌟 Overview
Toolzio is a premium, open-source SaaS application for comprehensive file manipulation. Instead of relying on multiple fragmented tools, Toolzio provides a unified interface with desktop-class tools operating entirely within the browser. 

Our flagship feature, **PDF Studio**, enables users to merge, split, rotate, reorder, and organize massive PDFs (up to 300+ pages) in an ultra-responsive, zero-lag React workspace.

## ✨ Features
- **⭐ PDF Studio**: A professional drag-and-drop workspace for manipulating PDF pages. Features virtualization for large files, Undo/Redo history, and seamless batch processing.
- **PDF to Word**: Extract editable text and formatting from PDF files into `.docx`.
- **Word to PDF**: Convert `.docx` documents securely into immutable PDFs.
- **Compress PDF**: Reduce file sizes drastically while maintaining readable visual fidelity.
- **Security-First**: All uploaded documents are processed securely and temporary files are automatically cleaned up immediately after download.

## 🚀 Technology Stack
**Frontend (React/Vite)**
- React 18
- Tailwind CSS
- `react-pdf` (for rendering PDFs in-browser)
- `@hello-pangea/dnd` (for accessible drag-and-drop)
- `lucide-react` (icons)
- React Router DOM
- React Helmet Async (SEO)

**Backend (FastAPI)**
- FastAPI (Python 3.11+)
- `PyPDF2` (for PDF manipulation)
- `pdf2docx` (for PDF -> Word conversion)
- `docx2pdf` (for Word -> PDF conversion)

## 📁 Folder Structure
```
toolzio/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── tools.py         # FastAPI Endpoints
│   │   └── services/
│   │       ├── pdf_editor/      # PDF Studio Core Engine
│   │       └── ...              # Conversion services
│   └── main.py                  # Backend Entrypoint
├── src/
│   ├── components/
│   │   ├── editor/              # PDF Studio React Components
│   │   ├── features/            # Feature Cards & Layout
│   │   ├── layout/              # Header/Footer
│   │   ├── shared/              # Reusable UI (Buttons, Alerts)
│   │   └── tool/                # Upload Cards & Tool Wrappers
│   ├── pages/                   # Route Pages (Home, PdfEditor, etc.)
│   ├── api/                     # Axios Interceptors
│   └── App.jsx                  # Main Routing
└── public/
    └── favicon.ico
```

## 🛠️ Installation & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/toolzio.git
cd toolzio
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## 🌍 Environment Variables
To connect the frontend to a remote backend, add an `.env` file to the root:
```
VITE_API_URL=https://your-backend-url.com/api
```

## ☁️ Deployment
Toolzio is designed for seamless deployment on Vercel:
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the Vite frontend and build it.
3. The `vercel.json` file configures Serverless Functions to serve the FastAPI backend out of the `backend/main.py` entrypoint on the `/api/*` route.

## 🤝 Contributing
Contributions are welcome! If you'd like to add a new tool (e.g., Image Converter, OCR), please read the contributing guidelines and submit a Pull Request. 

## 📝 License
This project is licensed under the MIT License.
