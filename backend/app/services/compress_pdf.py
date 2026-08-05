import os
from pypdf import PdfReader, PdfWriter

def process_compress_pdf(input_path: str, output_path: str) -> None:
    """
    Compresses a PDF file using pypdf content stream compression.
    """
    abs_input = os.path.abspath(input_path)
    abs_output = os.path.abspath(output_path)
    
    reader = PdfReader(abs_input)
    writer = PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    # Some additional lossless compression options
    for page in writer.pages:
        page.compress_content_streams()
    
    with open(abs_output, "wb") as f:
        writer.write(f)

    # Verify the file was created
    if not os.path.exists(abs_output) or os.path.getsize(abs_output) == 0:
        raise Exception("Failed to compress PDF file.")
