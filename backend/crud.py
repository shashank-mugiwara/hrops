from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

# Department CRUD
def get_department(db: Session, department_id: int):
    return db.query(models.Department).filter(models.Department.id == department_id).first()

def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_department = models.Department(**department.model_dump())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

def update_department(db: Session, department_id: int, department: schemas.DepartmentCreate):
    db_department = get_department(db, department_id)
    if db_department:
        for key, value in department.model_dump().items():
            setattr(db_department, key, value)
        db.commit()
        db.refresh(db_department)
    return db_department

def delete_department(db: Session, department_id: int):
    db_department = get_department(db, department_id)
    if db_department:
        db.delete(db_department)
        db.commit()
    return db_department

# Group CRUD
def get_group(db: Session, group_id: int):
    # Subqueries for counts
    member_count_subquery = db.query(
        models.Candidate.group_id,
        func.count(models.Candidate.id).label('member_count')
    ).filter(models.Candidate.group_id == group_id).group_by(models.Candidate.group_id).subquery()

    rule_count_subquery = db.query(
        models.AutomationRule.group_id,
        func.count(models.AutomationRule.id).label('rule_count')
    ).filter(
        models.AutomationRule.group_id == group_id,
        models.AutomationRule.status == 'active'
    ).group_by(models.AutomationRule.group_id).subquery()

    # Main query
    result = db.query(
        models.Group,
        func.coalesce(member_count_subquery.c.member_count, 0).label('member_count'),
        func.coalesce(rule_count_subquery.c.rule_count, 0).label('rule_count')
    ).outerjoin(
        member_count_subquery, models.Group.id == member_count_subquery.c.group_id
    ).outerjoin(
        rule_count_subquery, models.Group.id == rule_count_subquery.c.group_id
    ).filter(models.Group.id == group_id).first()

    if result:
        group, member_count, rule_count = result
        group.member_count = member_count
        group.rule_count = rule_count
        return group
    return None

def get_groups(db: Session, skip: int = 0, limit: int = 100):
    # Subqueries for counts
    member_count_subquery = db.query(
        models.Candidate.group_id,
        func.count(models.Candidate.id).label('member_count')
    ).group_by(models.Candidate.group_id).subquery()

    rule_count_subquery = db.query(
        models.AutomationRule.group_id,
        func.count(models.AutomationRule.id).label('rule_count')
    ).filter(models.AutomationRule.status == 'active').group_by(models.AutomationRule.group_id).subquery()

    # Main query
    results = db.query(
        models.Group,
        func.coalesce(member_count_subquery.c.member_count, 0).label('member_count'),
        func.coalesce(rule_count_subquery.c.rule_count, 0).label('rule_count')
    ).outerjoin(
        member_count_subquery, models.Group.id == member_count_subquery.c.group_id
    ).outerjoin(
        rule_count_subquery, models.Group.id == rule_count_subquery.c.group_id
    ).offset(skip).limit(limit).all()

    groups = []
    for group, member_count, rule_count in results:
        group.member_count = member_count
        group.rule_count = rule_count
        groups.append(group)
    return groups

def create_group(db: Session, group: schemas.GroupCreate):
    db_group = models.Group(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

def update_group(db: Session, group_id: int, group: schemas.GroupCreate):
    db_group = get_group(db, group_id)
    if db_group:
        for key, value in group.model_dump().items():
            setattr(db_group, key, value)
        db.commit()
        db.refresh(db_group)
    return db_group

def delete_group(db: Session, group_id: int):
    db_group = get_group(db, group_id)
    if db_group:
        db.delete(db_group)
        db.commit()
    return db_group

# Candidate CRUD
def get_candidate(db: Session, candidate_id: int):
    return db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()

def get_candidates(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    status: str | None = None,
    group_id: int | None = None,
):
    query = db.query(models.Candidate)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            models.Candidate.candidate_name.ilike(pattern) |
            models.Candidate.candidate_email.ilike(pattern) |
            models.Candidate.role.ilike(pattern)
        )
    if status:
        query = query.filter(models.Candidate.status == status)
    if group_id is not None:
        query = query.filter(models.Candidate.group_id == group_id)
    return query.offset(skip).limit(limit).all()

def create_candidate(db: Session, candidate: schemas.CandidateCreate):
    db_candidate = models.Candidate(**candidate.model_dump())
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def update_candidate(db: Session, candidate_id: int, candidate: schemas.CandidateCreate):
    db_candidate = get_candidate(db, candidate_id)
    if db_candidate:
        for key, value in candidate.model_dump().items():
            setattr(db_candidate, key, value)
        db.commit()
        db.refresh(db_candidate)
    return db_candidate

def delete_candidate(db: Session, candidate_id: int):
    db_candidate = get_candidate(db, candidate_id)
    if db_candidate:
        db.delete(db_candidate)
        db.commit()
    return db_candidate

# AutomationRule CRUD
def get_rule(db: Session, rule_id: int):
    return db.query(models.AutomationRule).filter(models.AutomationRule.id == rule_id).first()

def get_rules(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AutomationRule).offset(skip).limit(limit).all()

def create_rule(db: Session, rule: schemas.AutomationRuleCreate):
    db_rule = models.AutomationRule(**rule.model_dump())
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule

def update_rule(db: Session, rule_id: int, rule: schemas.AutomationRuleCreate):
    db_rule = get_rule(db, rule_id)
    if db_rule:
        for key, value in rule.model_dump().items():
            setattr(db_rule, key, value)
        db.commit()
        db.refresh(db_rule)
    return db_rule

def delete_rule(db: Session, rule_id: int):
    db_rule = get_rule(db, rule_id)
    if db_rule:
        db.delete(db_rule)
        db.commit()
    return db_rule

# Document CRUD
def get_document(db: Session, document_id: int):
    return db.query(models.Document).filter(models.Document.id == document_id).first()

def get_documents(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Document).offset(skip).limit(limit).all()

def create_document(db: Session, document: schemas.DocumentCreate):
    db_document = models.Document(**document.model_dump())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

# AuditLog CRUD
def get_audit_log(db: Session, audit_log_id: int):
    return db.query(models.AuditLog).filter(models.AuditLog.id == audit_log_id).first()

def get_audit_logs(db: Session, candidate_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(models.AuditLog)
    if candidate_id:
        query = query.filter(models.AuditLog.candidate_id == candidate_id)
    return query.order_by(models.AuditLog.event_time.desc()).offset(skip).limit(limit).all()

def create_audit_log(db: Session, candidate_id: int, event_type: str, details: str | None = None):
    import datetime
    log = models.AuditLog(
        candidate_id=candidate_id,
        event_type=event_type,
        event_time=datetime.datetime.now(datetime.timezone.utc),
        details=details,
    )
    db.add(log)
    db.commit()
    return log


# Template CRUD
def get_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Template).order_by(models.Template.last_modified.desc()).offset(skip).limit(limit).all()

def get_template(db: Session, template_id: int):
    return db.query(models.Template).filter(models.Template.id == template_id).first()

def create_template(db: Session, template: schemas.TemplateCreate):
    import datetime
    db_template = models.Template(**template.model_dump(), last_modified=datetime.datetime.now(datetime.timezone.utc))
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def update_template(db: Session, template_id: int, template: schemas.TemplateCreate):
    import datetime
    db_template = get_template(db, template_id)
    if db_template:
        for key, value in template.model_dump().items():
            setattr(db_template, key, value)
        db_template.last_modified = datetime.datetime.now(datetime.timezone.utc)
        db.commit()
        db.refresh(db_template)
    return db_template

def delete_template(db: Session, template_id: int):
    db_template = get_template(db, template_id)
    if db_template:
        db.delete(db_template)
        db.commit()
    return db_template

def check_candidate_email_exists(db: Session, email: str):
    """Return existing candidate by email or None."""
    return db.query(models.Candidate).filter(models.Candidate.candidate_email == email).first()



# AppSettings CRUD (single-row, id=1)
def get_settings(db: Session):
    settings = db.query(models.AppSettings).filter(models.AppSettings.id == 1).first()
    if not settings:
        settings = models.AppSettings(id=1)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, settings_update: schemas.AppSettingsUpdate):
    settings = get_settings(db)
    for key, value in settings_update.model_dump().items():
        setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings