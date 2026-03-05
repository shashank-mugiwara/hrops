import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ... import models
from ...api.deps import get_db

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
)

@router.get("/stats")
def get_dashboard_stats(
    period: Optional[str] = Query(default="7d", description="Period: 7d, 30d, quarter"),
    db: Session = Depends(get_db),
):
    today = datetime.date.today()
    if period == "30d":
        period_days = 30
    elif period == "quarter":
        period_days = 90
    else:
        period_days = 7

    period_end = today + datetime.timedelta(days=period_days)

    pending_joinees = db.query(models.Candidate).filter(models.Candidate.status != "Active").count()
    active_rules = db.query(models.AutomationRule).filter(models.AutomationRule.status == "active").count()
    total_candidates = db.query(models.Candidate).count()

    # Count candidates with joining_date within the selected period
    welcome_kits_due = db.query(models.Candidate).filter(
        models.Candidate.joining_date >= today,
        models.Candidate.joining_date <= period_end,
    ).count()

    # Activity feed from recent candidates
    recent_candidates = db.query(models.Candidate).order_by(models.Candidate.id.desc()).limit(5).all()
    activity = []
    for c in recent_candidates:
        joining_str = c.joining_date.strftime("%b %d") if c.joining_date else "TBD"
        activity.append({
            "id": f"c_{c.id}",
            "title": c.candidate_name,
            "detail": f"Joining as {c.role} on {joining_str}" if c.role else f"Joining on {joining_str}",
            "time": joining_str,
            "icon": "person_add",
            "iconColor": "text-primary",
        })

    return {
        "pending_joinees": pending_joinees,
        "active_rules": active_rules,
        "total_candidates": total_candidates,
        "welcome_kits_due": welcome_kits_due,
        "activity": activity,
    }
