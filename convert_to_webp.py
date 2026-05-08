"""
Converts all PNG images to WebP format and updates HTML references.
Originals are preserved (not deleted).
"""

import os
import glob
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).parent
IMAGES_DIR = BASE_DIR / "PAGE_SERVING_ROUTERS" / "IMAGES"
PAGES_DIR = BASE_DIR / "PAGE_SERVING_ROUTERS" / "PAGES"

WEBP_QUALITY = 85


def convert_png_to_webp(png_path: Path) -> Path:
    webp_path = png_path.with_suffix(".webp")
    if webp_path.exists():
        print(f"  [SKIP] Already exists: {webp_path.name}")
        return webp_path

    with Image.open(png_path) as img:
        if img.mode in ("RGBA", "LA"):
            img.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)
        else:
            img = img.convert("RGB")
            img.save(webp_path, "WEBP", quality=WEBP_QUALITY, method=6)

    original_kb = png_path.stat().st_size / 1024
    webp_kb = webp_path.stat().st_size / 1024
    saving_pct = (1 - webp_kb / original_kb) * 100
    print(f"  [OK] {png_path.name} -> {webp_path.name}  ({original_kb:.1f}KB -> {webp_kb:.1f}KB, -{saving_pct:.1f}%)")
    return webp_path


def update_html_references(pages_dir: Path):
    html_files = list(pages_dir.glob("*.html"))
    total_replacements = 0

    for html_file in html_files:
        content = html_file.read_text(encoding="utf-8")
        updated = content.replace(".png", ".webp")
        replacements = content.count(".png")

        if replacements > 0:
            html_file.write_text(updated, encoding="utf-8")
            print(f"  [HTML] {html_file.name}: {replacements} reference(s) updated")
            total_replacements += replacements
        else:
            print(f"  [HTML] {html_file.name}: no PNG references found")

    return total_replacements


def main():
    print("=" * 60)
    print("Step 1: Converting PNGs to WebP")
    print("=" * 60)

    png_files = list(IMAGES_DIR.rglob("*.png"))
    print(f"Found {len(png_files)} PNG file(s)\n")

    converted = 0
    skipped = 0
    for png_path in sorted(png_files):
        rel = png_path.relative_to(IMAGES_DIR)
        print(f"Processing: {rel}")
        webp = convert_png_to_webp(png_path)
        if webp.stat().st_mtime >= png_path.stat().st_mtime:
            converted += 1
        else:
            skipped += 1

    print(f"\nConverted: {converted} | Skipped (already existed): {skipped}")

    print("\n" + "=" * 60)
    print("Step 2: Updating HTML references (.png -> .webp)")
    print("=" * 60)
    total = update_html_references(PAGES_DIR)
    print(f"\nTotal HTML references updated: {total}")

    print("\n" + "=" * 60)
    print("Done! Original PNGs are preserved (not deleted).")
    print("=" * 60)


if __name__ == "__main__":
    main()
