import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Toolzio API"
    API_V1_STR: str = "/api"
    BACKEND_CORS_ORIGINS: list[str] = ["*"] # Change this in production
    
    
    # Storage settings
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # On Vercel, the filesystem is read-only except for /tmp
    if os.environ.get("VERCEL"):
        UPLOADS_DIR: str = "/tmp/uploads"
        OUTPUTS_DIR: str = "/tmp/outputs"
        TEMP_DIR: str = "/tmp/temp"
    else:
        UPLOADS_DIR: str = os.path.join(BASE_DIR, "uploads")
        OUTPUTS_DIR: str = os.path.join(BASE_DIR, "outputs")
        TEMP_DIR: str = os.path.join(BASE_DIR, "temp")

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
os.makedirs(settings.OUTPUTS_DIR, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)
