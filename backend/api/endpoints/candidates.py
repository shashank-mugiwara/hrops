from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.responses import StreamingResponse
import io
import csv
from sqlalchemy.orm import Session
from ... import models, schemas, crud
from ...api.deps import get_db

router = APIRouter(
    prefix="/candidates",
    tags=["candidates"],
)


@router.get("/", response_model=list[schemas.Candidate])
def read_candidates(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    group_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    return crud.get_candidates(db, skip=skip, limit=limit, search=search, status=status, group_id=group_id)


CANDIDATE_CSV_FIELDS = [
    "id", "candidate_name", "candidate_email", "hrbp_name", "hrbp_email",
    "reporting_manager_name", "reporting_manager_email", "recruiter_name",
    "buddy_name", "role", "joining_date", "location", "status", "group_id",
]

@router.get("/export")
def export_candidates(db: Session = Depends(get_db)):
    candidates = crud.get_candidates(db, skip=0, limit=1_000_000)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=CANDIDATE_CSV_FIELDS, extrasaction="ignore")
    writer.writeheader()
    for c in candidates:
        row = {f: getattr(c, f, None) for f in CANDIDATE_CSV_FIELDS}
        writer.writerow(row)
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=candidates.csv"},
    )


@router.post("/check_duplicates")
def check_duplicates(emails: list[str] = Body(...), db: Session = Depends(get_db)):
    """Given a list of emails, return which ones already exist in the DB."""
    existing = (
        db.query(models.Candidate.candidate_email)
        .filter(models.Candidate.candidate_email.in_(emails))
        .all()
    )
    return {"duplicates": [row[0] for row in existing]}


@router.get("/{candidate_id}", response_model=schemas.Candidate)
def read_candidate(candidate_id: int, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate(db, candidate_id)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate


@router.post("/", response_model=schemas.Candidate)
def create_candidate(candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = crud.create_candidate(db, candidate)
    crud.create_audit_log(db, db_candidate.id, "created", f"Candidate {db_candidate.candidate_name} added")
    return db_candidate


@router.put("/{candidate_id}", response_model=schemas.Candidate)
def update_candidate(candidate_id: int, candidate: schemas.CandidateCreate, db: Session = Depends(get_db)):
    db_candidate = crud.update_candidate(db, candidate_id, candidate)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    crud.create_audit_log(db, db_candidate.id, "updated", f"Profile updated for {db_candidate.candidate_name}")
    return db_candidate


@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    db_candidate = crud.delete_candidate(db, candidate_id)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return {"message": "Candidate deleted successfully"}


@router.get("/{candidate_id}/activity", response_model=list[schemas.AuditLog])
def get_candidate_activity(candidate_id: int, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate(db, candidate_id)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return crud.get_audit_logs(db, candidate_id=candidate_id)


@router.post("/bulk_action")
def bulk_action(action: str = Body(...), candidate_ids: list[int] = Body(...), db: Session = Depends(get_db)):
    if action == "delete":
        candidates = db.query(models.Candidate).filter(models.Candidate.id.in_(candidate_ids)).all()
        deleted = len(candidates)
        for candidate in candidates:
            db.delete(candidate)
        db.commit()
        return {"action": action, "candidate_ids": candidate_ids, "deleted": deleted, "message": f"Deleted {deleted} candidates."}
    return {"action": action, "candidate_ids": candidate_ids, "message": "Bulk operation not implemented yet."}
