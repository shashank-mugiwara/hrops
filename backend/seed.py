import datetime
from sqlalchemy.orm import Session
from .db import SessionLocal, init_db
from . import models, schemas

def seed_db():
    db = SessionLocal()
    init_db()

    # Check if data already exists
    if db.query(models.Department).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database...")

    # Departments
    eng = models.Department(name="Engineering", description="Software development and operations")
    design = models.Department(name="Design", description="Product and UX design")
    marketing = models.Department(name="Marketing", description="Growth and brand")
    hr = models.Department(name="HR", description="Human Resources")
    sales = models.Department(name="Sales", description="Revenue and sales")

    db.add_all([eng, design, marketing, hr, sales])
    db.commit()

    # Groups
    devops = models.Group(name="DevOps", code="DO", color="blue", department_id=eng.id)
    backend = models.Group(name="Backend", code="BE", color="purple", department_id=eng.id)
    frontend = models.Group(name="Frontend", code="FE", color="emerald", department_id=eng.id)
    product_design = models.Group(name="Product Design", code="PD", color="orange", department_id=design.id)

    db.add_all([devops, backend, frontend, product_design])
    db.commit()

    # Candidates
    candidates = [
        models.Candidate(
            candidate_name="Sarah Jennings", 
            candidate_email="s.jennings@example.com", 
            role="Senior DevOps Engineer", 
            joining_date=datetime.date(2023, 11, 24), 
            status="Docs Signed", 
            group_id=devops.id,
            reporting_manager_name="John Doe",
            hrbp_name="Alice Smith"
        ),
        models.Candidate(
            candidate_name="Michael Chen", 
            candidate_email="m.chen@design.co", 
            role="Product Designer", 
            joining_date=datetime.date(2023, 11, 26), 
            status="Pre-boarding", 
            group_id=product_design.id,
            reporting_manager_name="Jane Doe",
            hrbp_name="Bob Wilson"
        ),
        models.Candidate(
            candidate_name="Jessica Alverez", 
            candidate_email="j.alverez@example.com", 
            role="Head of Marketing", 
            joining_date=datetime.date(2023, 12, 1), 
            status="Review Needed"
        ),
        models.Candidate(
            candidate_name="David Kim", 
            candidate_email="david.k@techcorp.io", 
            role="Backend Engineer II", 
            joining_date=datetime.date(2023, 12, 5), 
            status="Pending Invite", 
            group_id=backend.id
        ),
        models.Candidate(
            candidate_name=" Emily Ross", 
            candidate_email="e.ross@example.com", 
            role="HR Specialist", 
            joining_date=datetime.date(2023, 12, 8), 
            status="Docs Signed", 
            group_id=hr.id
        ),
    ]

    db.add_all(candidates)
    db.commit()

    # Automation Rules
    rules = [
        models.AutomationRule(name="Welcome Email", trigger_days=0, trigger_type="after", status="active", group_id=devops.id),
        models.AutomationRule(name="Laptop Request", trigger_days=7, trigger_type="before", status="active", group_id=backend.id),
    ]
    db.add_all(rules)
    db.commit()

    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_db()
