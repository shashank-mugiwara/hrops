from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ... import models, schemas, crud
from ...api.deps import get_db

router = APIRouter(
    prefix="/groups",
    tags=["groups"],
)

@router.get("/", response_model=list[schemas.Group])
def read_groups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_groups(db, skip=skip, limit=limit)

@router.get("/{group_id}", response_model=schemas.Group)
def read_group(group_id: int, db: Session = Depends(get_db)):
    db_group = crud.get_group(db, group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group

@router.post("/", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    return crud.create_group(db, group)

@router.put("/{group_id}", response_model=schemas.Group)
def update_group(group_id: int, group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = crud.update_group(db, group_id, group)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group

@router.delete("/{group_id}")
def delete_group(group_id: int, db: Session = Depends(get_db)):
    db_group = crud.delete_group(db, group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return {"message": "Group deleted successfully"}


@router.post("/bulk_action")
def bulk_action_groups(action: str = Body(...), group_ids: list[int] = Body(...), db: Session = Depends(get_db)):
    if action == "delete":
        groups = db.query(models.Group).filter(models.Group.id.in_(group_ids)).all()
        deleted = len(groups)
        for group in groups:
            db.delete(group)
        db.commit()
        return {"action": action, "group_ids": group_ids, "deleted": deleted, "message": f"Deleted {deleted} groups."}
    return {"action": action, "group_ids": group_ids, "message": "Bulk operation not implemented yet."}
