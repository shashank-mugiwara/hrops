import os
import re
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ... import models, schemas, crud
from ...api.deps import get_db

router = APIRouter(
    prefix="/documents",
    tags=["documents"],
)

UPLOAD_DIR = "uploaded_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "txt", "jpg", "jpeg", "png"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
}

def _safe_filename(filename: str) -> str:
    """Sanitize filename and prefix with UUID to prevent path traversal."""
    # Keep only alphanumeric, dots, dashes, underscores
    basename = os.path.basename(filename)
    safe = re.sub(r"[^a-zA-Z0-9.\-_]", "_", basename)
    return f"{uuid.uuid4().hex}_{safe}"

@router.get("/", response_model=list[schemas.Document])
def read_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_documents(db, skip=skip, limit=limit)

@router.get("/{document_id}", response_model=schemas.Document)
def read_document(document_id: int, db: Session = Depends(get_db)):
    db_document = crud.get_document(db, document_id)
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return db_document

@router.post("/", response_model=schemas.Document)
def create_document(document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    return crud.create_document(db, document)

@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    filename = file.filename or "upload"
    extension = filename.split(".")[-1].lower() if "." in filename else ""

    if extension not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    safe_name = _safe_filename(filename)
    file_path = os.path.join(UPLOAD_DIR, safe_name)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "stored_as": safe_name, "message": "File uploaded successfully"}
