from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import schemas, crud
from ...api.deps import get_db

router = APIRouter(
    prefix="/templates",
    tags=["templates"],
)


@router.get("/", response_model=list[schemas.Template])
def read_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_templates(db, skip=skip, limit=limit)


@router.get("/{template_id}", response_model=schemas.Template)
def read_template(template_id: int, db: Session = Depends(get_db)):
    t = crud.get_template(db, template_id)
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return t


@router.post("/", response_model=schemas.Template)
def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db, template)


@router.put("/{template_id}", response_model=schemas.Template)
def update_template(template_id: int, template: schemas.TemplateCreate, db: Session = Depends(get_db)):
    t = crud.update_template(db, template_id, template)
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return t


@router.delete("/{template_id}")
def delete_template(template_id: int, db: Session = Depends(get_db)):
    t = crud.delete_template(db, template_id)
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}
