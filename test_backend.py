import requests
import os
import time

BASE_URL = "http://127.0.0.1:8000/api/tools"

def test_pdf_to_word():
    print("Testing PDF -> Word")
    url = f"{BASE_URL}/pdf-to-word"
    with open("test_data/sample1.pdf", "rb") as f:
        resp = requests.post(url, files={"file": f})
    
    if resp.status_code != 200:
        print(f"FAILED: PDF -> Word, Status: {resp.status_code}")
        print(resp.text)
        return False
        
    output_path = "test_data/out_sample1.docx"
    with open(output_path, "wb") as f:
        f.write(resp.content)
        
    size = os.path.getsize(output_path)
    if size == 0:
        print("FAILED: Output file size is 0")
        return False
        
    print(f"SUCCESS: PDF -> Word, Size: {size} bytes")
    return True

def test_word_to_pdf():
    print("Testing Word -> PDF")
    url = f"{BASE_URL}/word-to-pdf"
    with open("test_data/sample.docx", "rb") as f:
        resp = requests.post(url, files={"file": f})
        
    if resp.status_code != 200:
        print(f"FAILED: Word -> PDF, Status: {resp.status_code}")
        print(resp.text)
        return False
        
    output_path = "test_data/out_sample.pdf"
    with open(output_path, "wb") as f:
        f.write(resp.content)
        
    size = os.path.getsize(output_path)
    if size == 0:
        print("FAILED: Output file size is 0")
        return False
        
    print(f"SUCCESS: Word -> PDF, Size: {size} bytes")
    return True

def test_merge_pdf():
    print("Testing Merge PDF")
    url = f"{BASE_URL}/merge-pdf"
    files = [
        ("files", ("sample1.pdf", open("test_data/sample1.pdf", "rb"), "application/pdf")),
        ("files", ("sample2.pdf", open("test_data/sample2.pdf", "rb"), "application/pdf"))
    ]
    resp = requests.post(url, files=files)
    
    if resp.status_code != 200:
        print(f"FAILED: Merge PDF, Status: {resp.status_code}")
        print(resp.text)
        return False
        
    output_path = "test_data/out_merged.pdf"
    with open(output_path, "wb") as f:
        f.write(resp.content)
        
    size = os.path.getsize(output_path)
    if size == 0:
        print("FAILED: Output file size is 0")
        return False
        
    print(f"SUCCESS: Merge PDF, Size: {size} bytes")
    return True

def test_split_pdf():
    print("Testing Split PDF")
    url = f"{BASE_URL}/split-pdf"
    with open("test_data/large.pdf", "rb") as f:
        resp = requests.post(url, files={"file": f})
        
    if resp.status_code != 200:
        print(f"FAILED: Split PDF, Status: {resp.status_code}")
        print(resp.text)
        return False
        
    output_path = "test_data/out_split.zip"
    with open(output_path, "wb") as f:
        f.write(resp.content)
        
    size = os.path.getsize(output_path)
    if size == 0:
        print("FAILED: Output file size is 0")
        return False
        
    print(f"SUCCESS: Split PDF, Size: {size} bytes")
    return True

def test_compress_pdf():
    print("Testing Compress PDF")
    url = f"{BASE_URL}/compress-pdf"
    with open("test_data/large.pdf", "rb") as f:
        resp = requests.post(url, files={"file": f})
        
    if resp.status_code != 200:
        print(f"FAILED: Compress PDF, Status: {resp.status_code}")
        print(resp.text)
        return False
        
    output_path = "test_data/out_compressed.pdf"
    with open(output_path, "wb") as f:
        f.write(resp.content)
        
    size = os.path.getsize(output_path)
    orig_size = os.path.getsize("test_data/large.pdf")
    if size == 0:
        print("FAILED: Output file size is 0")
        return False
        
    print(f"SUCCESS: Compress PDF, Orig: {orig_size}, New: {size} bytes")
    return True

if __name__ == "__main__":
    time.sleep(2) # Wait for server
    test_pdf_to_word()
    test_word_to_pdf()
    test_merge_pdf()
    test_split_pdf()
    test_compress_pdf()
