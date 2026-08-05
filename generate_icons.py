from PIL import Image, ImageDraw

def create_icon(size, filename):
    img = Image.new('RGB', (size, size), color = (59, 130, 246)) # tailwind blue-500
    d = ImageDraw.Draw(img)
    d.text((size/4, size/4), "T", fill=(255, 255, 255))
    img.save(filename)

create_icon(16, "public/favicon-16x16.png")
create_icon(32, "public/favicon-32x32.png")
create_icon(180, "public/apple-touch-icon.png")
create_icon(192, "public/android-chrome-192x192.png")
create_icon(512, "public/android-chrome-512x512.png")

# favicon.ico
img = Image.new('RGB', (32, 32), color = (59, 130, 246))
img.save("public/favicon.ico")

print("Generated all icons")
