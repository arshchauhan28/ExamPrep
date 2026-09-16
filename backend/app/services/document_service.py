from io import BytesIO

from fastapi import HTTPException

import fitz
from docx import Document


MAX_FILE_BYTES = 10 * 1024 * 1024


def extract_text_from_file(
    data: bytes,
    filename: str,
    content_type: str | None = None,
) -> str:

    if not data:
        raise HTTPException(
            status_code=400,
            detail="No file uploaded.",
        )

    if len(data) > MAX_FILE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File is too large. Maximum size is 10 MB.",
        )

    extension = filename.lower().rsplit(".", 1)[-1]

    try:

        # -------------------------
        # PDF
        # -------------------------
        if extension == "pdf":

            document = fitz.open(
                stream=data,
                filetype="pdf",
            )

            chunks = []

            try:
                for page in document:
                    chunks.append(page.get_text("text"))
            finally:
                document.close()

            text = "\n".join(chunks).strip()

        # -------------------------
        # DOCX
        # -------------------------
        elif extension == "docx":

            document = Document(BytesIO(data))

            paragraphs = [
                paragraph.text
                for paragraph in document.paragraphs
                if paragraph.text.strip()
            ]

            text = "\n".join(paragraphs).strip()

        # -------------------------
        # TXT
        # -------------------------
        elif extension == "txt":

            text = data.decode(
                "utf-8",
                errors="ignore",
            ).strip()

        else:
            raise HTTPException(
                status_code=415,
                detail=(
                    "Unsupported file type. "
                    "Please upload PDF, DOCX, or TXT."
                ),
            )

    except HTTPException:
        raise

    except Exception as exc:
        print(f"Document extraction error: {exc}")

        raise HTTPException(
            status_code=400,
            detail="Could not read the uploaded file.",
        ) from exc

    if not text:
        raise HTTPException(
            status_code=422,
            detail="The uploaded file contains no extractable text.",
        )

    return text