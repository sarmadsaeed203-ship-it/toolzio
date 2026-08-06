import os

# Ensure rembg can download models in Vercel's read-only environment
if os.environ.get("VERCEL"):
    os.environ["U2NET_HOME"] = "/tmp/u2net"
else:
    # Explicitly set it locally just to be safe if needed, though default is fine
    pass

from PIL import Image
from rembg import remove, new_session

def process_remove_bg(input_path: str, output_path: str):
    """
    Removes the background from the image at input_path and saves it to output_path.
    Uses the lightweight 'u2netp' model to keep memory and package size small for serverless environments.
    """
    # Create a session with the lightweight model
    # u2netp is ~4.7MB vs u2net which is ~170MB
    session = new_session("u2netp")
    
    with open(input_path, "rb") as i:
        input_data = i.read()
        
    output_data = remove(input_data, session=session)
    
    with open(output_path, "wb") as o:
        o.write(output_data)
