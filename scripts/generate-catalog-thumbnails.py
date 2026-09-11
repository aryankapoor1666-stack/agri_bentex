from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "images" / "catalog"
TARGET_DIR = SOURCE_DIR / "thumbs"
TARGET_SIZE = (600, 450)
PADDING = 0


def content_box(image):
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    corners = [
        pixels[0, 0],
        pixels[width - 1, 0],
        pixels[0, height - 1],
        pixels[width - 1, height - 1],
    ]
    bg = tuple(sum(corner[channel] for corner in corners) // 4 for channel in range(3))
    xs = []
    ys = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            color_distance = max(abs(r - bg[0]), abs(g - bg[1]), abs(b - bg[2]))
            dark_detail = min(r, g, b) < 210 and color_distance > 12
            if a > 10 and (color_distance > 28 or dark_detail):
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    left, right = min(xs), max(xs) + 1
    top, bottom = min(ys), max(ys) + 1
    if (right - left) * (bottom - top) < width * height * 0.08:
        return None
    return left, top, right, bottom


def make_thumb(path):
    image = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    box = content_box(image)
    if box:
        image = image.crop(box)

    max_w = TARGET_SIZE[0] - PADDING * 2
    max_h = TARGET_SIZE[1] - PADDING * 2
    scale = min(max_w / image.width, max_h / image.height)
    image = image.resize(
        (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("RGB", TARGET_SIZE, "#f2f3ee")
    if image.mode == "RGBA":
        background = Image.new("RGBA", image.size, "#f2f3ee")
        background.alpha_composite(image)
        image = background.convert("RGB")
    x = (TARGET_SIZE[0] - image.width) // 2
    y = (TARGET_SIZE[1] - image.height) // 2
    canvas.paste(image, (x, y))

    target = TARGET_DIR / f"{path.stem}.jpg"
    canvas.save(target, "JPEG", quality=88, optimize=True, progressive=True)
    return target


def main():
    TARGET_DIR.mkdir(exist_ok=True)
    sources = sorted(
        path for path in SOURCE_DIR.iterdir()
        if path.suffix.lower() in {".jpg", ".jpeg", ".png"} and path.is_file()
    )
    for source in sources:
        make_thumb(source)
    print(f"Generated {len(sources)} catalogue thumbnails in {TARGET_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
