from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime

from ... import models
from ...api.deps import get_db

router = APIRouter(
    prefix="/reports",
    tags=["reports"],
)

@router.get("/stats")
def get_reports_stats(db: Session = Depends(get_db)):
    today = datetime.date.today()

    # 1. Metric Overview
    total_candidates = db.query(models.Candidate).count()
    pending_joinees = db.query(models.Candidate).filter(models.Candidate.status != "Active").count()
    active_rules = db.query(models.AutomationRule).filter(models.AutomationRule.status == "active").count()

    # 2. Intake Volume (Trailing 12 Weeks)
    # Generate the last 12 weeks boundaries
    weeks_data = []
    # Week 1 is the oldest, Week 12 is the current week.
    for i in range(11, -1, -1):
        start_date = today - datetime.timedelta(days=(i * 7) + 6)
        end_date = today - datetime.timedelta(days=(i * 7))
        count = db.query(models.Candidate).filter(
            models.Candidate.joining_date >= start_date,
            models.Candidate.joining_date <= end_date
        ).count()
        weeks_data.append({
            "week": 12 - i, # 1 to 12
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "count": count
        })

    # 3. Volume by Department
    # Join Candidate -> Group -> Department
    dept_counts = (
        db.query(models.Department.name, func.count(models.Candidate.id))
        .join(models.Group, models.Department.id == models.Group.department_id)
        .join(models.Candidate, models.Group.id == models.Candidate.group_id)
        .group_by(models.Department.name)
        .all()
    )

    # Predefined colors for UI
    colors = ['bg-primary', 'bg-blue-400', 'bg-indigo-400', 'bg-slate-400', 'bg-slate-300', 'bg-purple-400', 'bg-pink-400']

    department_volume = []
    for idx, (dept_name, count) in enumerate(dept_counts):
        department_volume.append({
            "label": dept_name,
            "value": count,
            "color": colors[idx % len(colors)]
        })

    return {
        "metrics": {
            "total_candidates": total_candidates,
            "pending_joinees": pending_joinees,
            "active_rules": active_rules
        },
        "intake_volume": weeks_data,
        "department_volume": department_volume
    }
