import logging
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.tools import router as tools_router
from app.core.config import settings

# Structured logging configuration
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "level": record.levelname,
            "message": record.getMessage(),
            "name": record.name,
            "filename": record.filename,
            "lineno": record.lineno,
        }
        if record.exc_info:
            log_record["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler])
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Toolzio API Backend for File Conversions",
    version="1.0.0"
)

# TODO(security): Implement Rate Limiting middleware (e.g., slowapi) to prevent abuse of heavy conversion endpoints.

# In production, configure origins appropriately
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

# Include Routers
app.include_router(tools_router, prefix=f"{settings.API_V1_STR}/tools", tags=["tools"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Toolzio API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
