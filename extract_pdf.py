import fitz
import sys

pdf_path = r"d:\Programming\Projects\suhas_medam\SriParadise\SriiParadiise _ Website Changes.pdf"
doc = fitz.open(pdf_path)
with open("extracted_text.txt", "w", encoding="utf-8") as f:
    for i, page in enumerate(doc):
        f.write(f"\n\n===== PAGE {i+1} =====\n")
        f.write(page.get_text())
