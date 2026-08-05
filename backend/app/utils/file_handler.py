import os
import uuid
import logging
import asyncio
from typing import List

logger = logging.getLogger("uvicorn.error")

def get_unique_filename(original_filename: str) -> str:
    ext = os.path.splitext(original_filename)[1]
    return f"{uuid.uuid4()}{ext}"

async def cleanup_files(file_paths: List[str], delay: int = 0):
    """
    Deletes files from the system. If delay is provided, waits before deleting.
    Intended to be run as a FastAPI BackgroundTask.
    """
    if delay > 0:
        await asyncio.sleep(delay)
        
    for path in file_paths:
        try:
            if os.path.exists(path):
                os.remove(path)
                logger.info(f"Cleaned up file: {path}")
        except Exception as e:
            logger.error(f"Failed to clean up {path}: {e}")
