from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PageOperation(BaseModel):
    sourceFile: int
    page: int
    rotation: int = 0
    deleted: bool = False
    crop: Optional[Dict[str, Any]] = None
    # Future fields:
    # watermark: Optional[Dict[str, Any]] = None
    # textAnnotations: Optional[List[Dict[str, Any]]] = None

class EditorPayload(BaseModel):
    pages: List[PageOperation]
