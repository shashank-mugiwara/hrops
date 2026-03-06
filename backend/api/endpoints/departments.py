from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ... import crud, models, schemas
from ...api.deps import get_db

router = APIRouter(
    prefix="/departments",
    tags=["departments"],
)

@router.get("/", response_model=list[schemas.Department])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_departments(db, skip=skip, limit=limit)

@router.get("/{department_id}", response_model=schemas.Department)
def read_department(department_id: int, db: Session = Depends(get_db)):
    db_department = crud.get_department(db, department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@router.post("/", response_model=schemas.Department)
def create_department(department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return crud.create_department(db, department)

@router.put("/{department_id}", response_model=schemas.Department)
def update_department(department_id: int, department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    db_department = crud.update_department(db, department_id, department)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@router.delete("/{department_id}")
def delete_department(department_id: int, db: Session = Depends(get_db)):
    db_department = crud.delete_department(db, department_id)
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return {"message": "Department deleted successfully"}
