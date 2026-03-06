import re

with open("backend/api/endpoints/dashboard.py", "r") as f:
    content = f.read()

# We need to compute intake volume for 4 weeks.
# Let's say the period_end determines the end of the 4th week.
# So week 4 is (period_end - 7d, period_end)
# week 3 is (period_end - 14d, period_end - 7d)
# week 2 is (period_end - 21d, period_end - 14d)
# week 1 is (period_end - 28d, period_end - 21d)
# Or wait, if `period` means how many days ahead, like 7d, then it's basically the next 7 days.
# The user wants "show exactly 4 weeks... and they should be able to select date".
# The UI currently allows selecting 7d, 30d, quarter.
# If they select a period, let's say the period_days determines how far back or forward.
# The previous logic was: period_end = today + period_days.
# If we want 4 contiguous weeks, we can divide the period into 4 chunks (so for 30d, each is ~7.5 days. For quarter, 22.5 days).
# Wait, user explicitly said: "Yes let dashboard show exactly 4 weeks".
# So it's 4 weeks. Always 4 periods.
# If they select 7d, maybe we show the 4 weeks ending on today + 7d.
# Actually, the simplest approach is to just show the 4 weeks starting from today (if they want projected) or ending today (if actual).
# The mock data had "Aug 21 - 27", "Aug 28 - Sep 3", "Sep 4 - 10" (projection), "Sep 11 - 17" (projection).
# Let's just create 4 static weeks: 2 weeks before today, current week, and 1 week after today.
# Or better, base it on the selected `period`:
# Week 1: today - 14 days to today - 7 days
# Week 2: today - 7 days to today
# Week 3: today to today + 7 days
# Week 4: today + 7 days to today + 14 days
# The user said "they should be able to select date". They probably meant the existing 7d, 30d, quarter filter.
# If the filter is "7d", the time range is today to today+7d. So showing exactly 4 weeks is a bit conflicting.
# Let's make the 4 bars represent 4 weeks ending on the `period_end`.
# For "7d", period_end is today + 7d.
# For "30d", period_end is today + 30d.
# So the 4 weeks would be the 4 weeks leading up to period_end.

new_logic = """
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
"""

content = content.replace("    return {\n        \"pending_joinees\": pending_joinees,\n        \"active_rules\": active_rules,\n        \"total_candidates\": total_candidates,\n        \"welcome_kits_due\": welcome_kits_due,\n        \"activity\": activity,\n    }", new_logic.strip())

with open("backend/api/endpoints/dashboard.py", "w") as f:
    f.write(content)
