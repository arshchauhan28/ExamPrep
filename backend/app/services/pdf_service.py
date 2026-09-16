import fitz

from fastapi import HTTPException

MAX_PDF_BYTES = 10 * 1024 * 1024


def extract_text_from_pdf(data: bytes) -> str:
    if not data:
        raise HTTPException(
            status_code=400,
            detail="No file uploaded."
        )

    if len(data) > MAX_PDF_BYTES:
        raise HTTPException(
            status_code=413,
            detail="PDF is too large. Maximum size is 10 MB."
        )

    try:
        document = fitz.open(
            stream=data,
            filetype="pdf"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is not a valid PDF."
        ) from exc

    chunks = []

    try:
        for page in document:
            chunks.append(page.get_text("text"))
    finally:
        document.close()

    text = "\n".join(chunks).strip()

    if not text:
        raise HTTPException(
            status_code=422,
            detail="The PDF contains no extractable text. Try a text-based PDF."
        )

    return text