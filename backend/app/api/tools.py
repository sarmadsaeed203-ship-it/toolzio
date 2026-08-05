import os
import shutil
import urllib.parse
import magic
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from starlette.concurrency import run_in_threadpool

from ..core.config import settings
from ..utils.file_handler import get_unique_filename, cleanup_files

# Services
from ..services.pdf_to_word import convert_pdf_to_word
from ..services.word_to_pdf import process_word_to_pdf
from ..services.merge_pdf import process_merge_pdf
from ..services.split_pdf import process_split_pdf
from ..services.compress_pdf import process_compress_pdf

router = APIRouter()

MAX_FILE_SIZE = 50 * 1024 * 1024 # 50 MB

def validate_and_save_file(file: UploadFile, allowed_mimes: List[str]) -> str:
    # First save it to temp path to read its magic bytes
    temp_filename = get_unique_filename(file.filename)
    temp_path = os.path.join(settings.UPLOADS_DIR, temp_filename)
    
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")
        
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail="Failed to save uploaded file.")
        
    # Verify true file signature using python-magic
    try:
        actual_mime = magic.from_file(temp_path, mime=True)
    except Exception as e:
        os.remove(temp_path)
        raise HTTPException(status_code=500, detail="Failed to verify file format.")

    # Secondary validation for DOCX files if magic returns a generic ZIP/binary type
    if actual_mime in ["application/zip", "application/octet-stream"] and "application/vnd.openxmlformats-officedocument.wordprocessingml.document" in allowed_mimes:
        import zipfile
        try:
            with zipfile.ZipFile(temp_path, 'r') as zip_ref:
                namelist = zip_ref.namelist()
                if "[Content_Types].xml" in namelist and "word/document.xml" in namelist:
                    actual_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        except zipfile.BadZipFile:
            pass # It's not a valid ZIP, so let it fail the validation below

    if actual_mime not in allowed_mimes:
        os.remove(temp_path)
        raise HTTPException(status_code=400, detail=f"Invalid file format. Detected {actual_mime}, but expected one of {allowed_mimes}.")
        
    return temp_path

@router.post("/pdf-to-word")
async def api_pdf_to_word(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    temp_path = validate_and_save_file(file, ["application/pdf"])
    
    try:
        output_path = await run_in_threadpool(convert_pdf_to_word, temp_path, file.filename)
    except Exception as e:
        background_tasks.add_task(cleanup_files, [temp_path])
        raise HTTPException(status_code=500, detail=str(e))
        
    background_tasks.add_task(cleanup_files, [temp_path, output_path], delay=2)

    original_base = os.path.splitext(file.filename)[0]
    download_filename = f"{original_base}.docx"
    encoded_filename = urllib.parse.quote(download_filename)

    return FileResponse(
        path=output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.post("/word-to-pdf")
async def api_word_to_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    temp_path = validate_and_save_file(file, ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"])
    
    original_base = os.path.splitext(file.filename)[0]
    output_filename = f"{original_base}.pdf"
    output_path = os.path.join(settings.OUTPUTS_DIR, get_unique_filename(output_filename))

    try:
        await run_in_threadpool(process_word_to_pdf, temp_path, output_path)
    except Exception as e:
        background_tasks.add_task(cleanup_files, [temp_path, output_path])
        raise HTTPException(status_code=500, detail=str(e))
        
    background_tasks.add_task(cleanup_files, [temp_path, output_path], delay=2)

    encoded_filename = urllib.parse.quote(output_filename)

    return FileResponse(
        path=output_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.post("/merge-pdf")
async def api_merge_pdf(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)):
    if not files or len(files) < 2:
        raise HTTPException(status_code=400, detail="Please upload at least 2 PDF files to merge.")
        
    temp_paths = []
    for f in files:
        temp_paths.append(validate_and_save_file(f, ["application/pdf"]))
        
    output_filename = "merged_document.pdf"
    output_path = os.path.join(settings.OUTPUTS_DIR, get_unique_filename(output_filename))

    try:
        await run_in_threadpool(process_merge_pdf, temp_paths, output_path)
    except Exception as e:
        background_tasks.add_task(cleanup_files, temp_paths + [output_path])
        raise HTTPException(status_code=500, detail=str(e))
        
    background_tasks.add_task(cleanup_files, temp_paths + [output_path], delay=2)

    encoded_filename = urllib.parse.quote(output_filename)

    return FileResponse(
        path=output_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.post("/split-pdf")
async def api_split_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    temp_path = validate_and_save_file(file, ["application/pdf"])
    
    original_base = os.path.splitext(file.filename)[0]
    output_filename = f"{original_base}_split.zip"
    output_path = os.path.join(settings.OUTPUTS_DIR, get_unique_filename(output_filename))

    try:
        await run_in_threadpool(process_split_pdf, temp_path, output_path)
    except Exception as e:
        background_tasks.add_task(cleanup_files, [temp_path, output_path])
        raise HTTPException(status_code=500, detail=str(e))
        
    background_tasks.add_task(cleanup_files, [temp_path, output_path], delay=2)

    encoded_filename = urllib.parse.quote(output_filename)

    return FileResponse(
        path=output_path,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@router.post("/compress-pdf")
async def api_compress_pdf(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    temp_path = validate_and_save_file(file, ["application/pdf"])
    
    original_base = os.path.splitext(file.filename)[0]
    output_filename = f"{original_base}_compressed.pdf"
    output_path = os.path.join(settings.OUTPUTS_DIR, get_unique_filename(output_filename))

    try:
        await run_in_threadpool(process_compress_pdf, temp_path, output_path)
    except Exception as e:
        background_tasks.add_task(cleanup_files, [temp_path, output_path])
        raise HTTPException(status_code=500, detail=str(e))
        
    background_tasks.add_task(cleanup_files, [temp_path, output_path], delay=2)

    encoded_filename = urllib.parse.quote(output_filename)

    return FileResponse(
        path=output_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )
