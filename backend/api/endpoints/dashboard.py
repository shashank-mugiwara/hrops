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

    # Calculate 4 weeks of volume ending at period_end
    # We will step backwards from period_end in 7-day increments
    intake_volume = []
    for i in range(3, -1, -1):
        wk_start = period_end - datetime.timedelta(days=(i+1)*7)
        wk_end = period_end - datetime.timedelta(days=i*7)

        # Count candidates joining in this week
        intake = db.query(models.Candidate).filter(
            models.Candidate.joining_date > wk_start,
            models.Candidate.joining_date <= wk_end
        ).count()

        # Count delivered notifications (AuditLog) in this week
        notifications = db.query(models.AuditLog).filter(
            models.AuditLog.event_time > datetime.datetime.combine(wk_start, datetime.time.min),
            models.AuditLog.event_time <= datetime.datetime.combine(wk_end, datetime.time.max),
            models.AuditLog.event_type.in_(["email_sent", "slack_sent", "notification"])
        ).count()

        # Count delivered documents in this week
        documents = db.query(models.Document).filter(
            models.Document.uploaded_at > datetime.datetime.combine(wk_start, datetime.time.min),
            models.Document.uploaded_at <= datetime.datetime.combine(wk_end, datetime.time.max)
        ).count()

        # Fallback to audit log document_sent if Document table is not used for delivered docs
        if documents == 0:
            documents = db.query(models.AuditLog).filter(
                models.AuditLog.event_time > datetime.datetime.combine(wk_start, datetime.time.min),
                models.AuditLog.event_time <= datetime.datetime.combine(wk_end, datetime.time.max),
                models.AuditLog.event_type.in_(["document_sent", "document_signed"])
            ).count()

        # Simple label e.g., "Aug 21 - Aug 27"
        label = f"{wk_start.strftime('%b %d')} - {wk_end.strftime('%b %d')}"
        status = "actual" if wk_end <= today else "projection"

        intake_volume.append({
            "label": label,
            "intake": intake,
            "notifications": notifications,
            "documents": documents,
            "status": status
        })

    return {
        "pending_joinees": pending_joinees,
        "active_rules": active_rules,
        "total_candidates": total_candidates,
        "welcome_kits_due": welcome_kits_due,
        "activity": activity,
        "intake_volume": intake_volume,
    }
