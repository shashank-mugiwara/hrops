from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...api.deps import get_db
from ... import crud, schemas

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/", response_model=schemas.AppSettings)
def get_settings(db: Session = Depends(get_db)):
    return crud.get_settings(db)


@router.put("/", response_model=schemas.AppSettings)
def update_settings(settings: schemas.AppSettingsUpdate, db: Session = Depends(get_db)):
    return crud.update_settings(db, settings)
