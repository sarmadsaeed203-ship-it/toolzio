import os
from pypdf import PdfWriter

def process_merge_pdf(input_paths: list[str], output_path: str) -> None:
    """
    Merges multiple PDF files into a single PDF file.
    """
    merger = PdfWriter()

    for path in input_paths:
        abs_path = os.path.abspath(path)
        merger.append(abs_path)

    abs_output = os.path.abspath(output_path)
    merger.write(abs_output)
    merger.close()

    # Verify the file was created
    if not os.path.exists(abs_output) or os.path.getsize(abs_output) == 0:
        raise Exception("Failed to merge PDF files.")
