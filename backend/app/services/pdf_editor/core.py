from pypdf import PdfReader, PdfWriter
from typing import List
from .models import EditorPayload
from .rotate import apply_rotation

def process_edit_pdf(temp_paths: List[str], payload: EditorPayload, output_path: str):
    """
    Processes a list of PDF files and applies generic editing operations.
    """
    readers = [PdfReader(path) for path in temp_paths]
    writer = PdfWriter()

    for page_op in payload.pages:
        # Skip deleted pages
        if page_op.deleted:
            continue
            
        if page_op.sourceFile < 0 or page_op.sourceFile >= len(readers):
            raise ValueError(f"Invalid sourceFile index: {page_op.sourceFile}")
            
        reader = readers[page_op.sourceFile]
        
        if page_op.page < 0 or page_op.page >= len(reader.pages):
            raise ValueError(f"Invalid page index {page_op.page} for sourceFile {page_op.sourceFile}")
            
        # Add the original page to the writer
        page = reader.pages[page_op.page]
        writer.add_page(page)
        
        # Get a reference to the newly added page
        new_page = writer.pages[-1]
        
        # Apply rotation if needed
        if page_op.rotation != 0:
            apply_rotation(new_page, page_op.rotation)
            
        # Future operations (crop, watermark, etc.) would be applied to new_page here
        
    with open(output_path, "wb") as f:
        writer.write(f)
