import datetime
from sqlalchemy.orm import Session
from backend.db import SessionLocal
from backend import models

db = SessionLocal()
today = datetime.date.today()

# Add candidates in different weeks
group = db.query(models.Group).first()

wk1 = today - datetime.timedelta(days=21)
wk2 = today - datetime.timedelta(days=14)
wk3 = today - datetime.timedelta(days=7)
wk4 = today

c1 = models.Candidate(candidate_name="Test 1", candidate_email="t1@example.com", joining_date=wk1, status="Active", group_id=group.id if group else None)
c2 = models.Candidate(candidate_name="Test 2", candidate_email="t2@example.com", joining_date=wk2, status="Active", group_id=group.id if group else None)
c3 = models.Candidate(candidate_name="Test 3", candidate_email="t3@example.com", joining_date=wk3, status="Active", group_id=group.id if group else None)
c4 = models.Candidate(candidate_name="Test 4", candidate_email="t4@example.com", joining_date=wk4, status="Active", group_id=group.id if group else None)
db.add_all([c1, c2, c3, c4])
db.commit()

# Add audit logs
a1 = models.AuditLog(candidate_id=c1.id, event_type="email_sent", event_time=datetime.datetime.combine(wk1, datetime.time.min))
a2 = models.AuditLog(candidate_id=c2.id, event_type="email_sent", event_time=datetime.datetime.combine(wk2, datetime.time.min))
a3 = models.AuditLog(candidate_id=c3.id, event_type="email_sent", event_time=datetime.datetime.combine(wk3, datetime.time.min))
db.add_all([a1, a2, a3])
db.commit()

# Add documents
d1 = models.Document(filename="test1.pdf", uploaded_at=datetime.datetime.combine(wk1, datetime.time.min), candidate_id=c1.id)
db.add(d1)
db.commit()

print("Mock data added")
