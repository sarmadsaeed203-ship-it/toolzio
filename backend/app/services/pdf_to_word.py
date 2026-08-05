import os
import time
import logging
from pdf2docx import Converter
from ..core.config import settings
from ..utils.file_handler import get_unique_filename

logger = logging.getLogger("uvicorn.error")

def convert_pdf_to_word(pdf_path: str, original_filename: str) -> str:
    """
    Converts a PDF file to a Word (DOCX) file using pdf2docx.
    Returns the path to the generated DOCX file.
    """
    start_time = time.time()
    
    # Prepare output path
    base_name = os.path.splitext(original_filename)[0]
    output_filename = get_unique_filename(f"{base_name}.docx")
    output_path = os.path.join(settings.OUTPUTS_DIR, output_filename)
    
    try:
        logger.info(f"Starting conversion for {original_filename} to {output_filename}")
        
        # Initialize converter
        cv = Converter(pdf_path)
        
        # Convert all pages
        cv.convert(output_path, start=0, end=None)
        cv.close()
        
        duration = time.time() - start_time
        logger.info(f"Successfully converted {original_filename} in {duration:.2f} seconds")
        
        return output_path
        
    except Exception as e:
        logger.error(f"Failed to convert {original_filename}: {e}")
        # Clean up output if it partially failed
        if os.path.exists(output_path):
            os.remove(output_path)
        raise RuntimeError(f"PDF conversion failed: {str(e)}")
