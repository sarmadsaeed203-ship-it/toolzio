import os
import glob

pages_dir = r"C:\Users\SARMAD\.gemini\antigravity-ide\scratch\toolzio\src\pages"
for file_path in glob.glob(os.path.join(pages_dir, "*.jsx")):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if 'ogImage="https://toolzio.com/og-image.jpg"' not in content:
        content = content.replace("<ToolLayout ", '<ToolLayout \n      ogImage="https://toolzio.com/og-image.jpg"')
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")
