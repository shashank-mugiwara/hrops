from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ... import crud, models, schemas
from ...api.deps import get_db

router = APIRouter(
    prefix="/rules",
    tags=["automation_rules"],
)

@router.get("/", response_model=list[schemas.AutomationRule])
def read_rules(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_rules(db, skip=skip, limit=limit)

@router.get("/{rule_id}", response_model=schemas.AutomationRule)
def read_rule(rule_id: int, db: Session = Depends(get_db)):
    db_rule = crud.get_rule(db, rule_id)
    if db_rule is None:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    return db_rule

@router.post("/", response_model=schemas.AutomationRule)
def create_rule(rule: schemas.AutomationRuleCreate, db: Session = Depends(get_db)):
    return crud.create_rule(db, rule)

@router.put("/{rule_id}", response_model=schemas.AutomationRule)
def update_rule(rule_id: int, rule: schemas.AutomationRuleCreate, db: Session = Depends(get_db)):
    db_rule = crud.update_rule(db, rule_id, rule)
    if db_rule is None:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    return db_rule

@router.delete("/{rule_id}")
def delete_rule(rule_id: int, db: Session = Depends(get_db)):
    db_rule = crud.delete_rule(db, rule_id)
    if db_rule is None:
        raise HTTPException(status_code=404, detail="Automation rule not found")
    return {"message": "Automation rule deleted successfully"}
