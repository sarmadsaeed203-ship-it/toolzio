import os
import zipfile
from pypdf import PdfReader, PdfWriter

def process_split_pdf(input_path: str, output_path: str) -> None:
    """
    Splits a PDF into individual pages and packages them into a ZIP file.
    """
    abs_input = os.path.abspath(input_path)
    abs_output = os.path.abspath(output_path)
    
    reader = PdfReader(abs_input)
    temp_dir = os.path.dirname(abs_output)
    
    pdf_files = []
    
    # Split each page into a separate PDF
    for i in range(len(reader.pages)):
        writer = PdfWriter()
        writer.add_page(reader.pages[i])
        
        page_filename = f"page_{i + 1}.pdf"
        page_path = os.path.join(temp_dir, page_filename)
        
        with open(page_path, "wb") as f:
            writer.write(f)
            
        pdf_files.append((page_path, page_filename))
        
    # Create ZIP file
    with zipfile.ZipFile(abs_output, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for page_path, page_filename in pdf_files:
            zipf.write(page_path, page_filename)
            
    # Cleanup individual page files
    for page_path, _ in pdf_files:
        if os.path.exists(page_path):
            os.remove(page_path)

    # Verify the ZIP file was created
    if not os.path.exists(abs_output) or os.path.getsize(abs_output) == 0:
        raise Exception("Failed to split PDF files.")
