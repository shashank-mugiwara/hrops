from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text, Boolean, Table
from sqlalchemy.orm import relationship, declarative_base
import datetime

Base = declarative_base()

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    groups = relationship("Group", back_populates="department")

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, nullable=True)
    color = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship("Department", back_populates="groups")
    candidates = relationship("Candidate", back_populates="group")
    active_rules = relationship("AutomationRule", back_populates="group")

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    candidate_name = Column(String, nullable=False)
    candidate_email = Column(String, nullable=False)
    hrbp_name = Column(String, nullable=True)
    hrbp_email = Column(String, nullable=True)
    reporting_manager_name = Column(String, nullable=True)
    reporting_manager_email = Column(String, nullable=True)
    recruiter_name = Column(String, nullable=True)
    buddy_name = Column(String, nullable=True)
    role = Column(String, nullable=True)
    joining_date = Column(Date, nullable=True)
    location = Column(String, nullable=True)
    status = Column(String, nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    group = relationship("Group", back_populates="candidates")
    documents = relationship("Document", back_populates="candidate")
    audit_logs = relationship("AuditLog", back_populates="candidate")

class AutomationRule(Base):
    __tablename__ = "automation_rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    trigger_days = Column(Integer, nullable=False)
    trigger_type = Column(String, nullable=False)  # before/after
    joining_date_ref = Column(String, nullable=False, default="joining_date")
    status = Column(String, nullable=False, default="active")
    channel = Column(String, nullable=True)  # email/slack
    group_id = Column(Integer, ForeignKey("groups.id"))
    group = relationship("Group", back_populates="active_rules")
    template_files = Column(Text, nullable=True)  # comma-separated filenames
    assigned_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    type = Column(String, nullable=True)
    uploaded_by = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, nullable=True)  # pending/completed
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=True)
    rule_id = Column(Integer, ForeignKey("automation_rules.id"), nullable=True)
    candidate = relationship("Candidate", back_populates="documents")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    event_type = Column(String, nullable=False)
    event_time = Column(DateTime, default=datetime.datetime.utcnow)
    details = Column(Text, nullable=True)
    candidate = relationship("Candidate", back_populates="audit_logs")

class Template(Base):
    __tablename__ = "templates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    channel = Column(String, nullable=False, default="Email")  # Email / Slack
    subject = Column(String, nullable=True)
    body = Column(Text, nullable=True)
    attachments = Column(Text, nullable=True)  # comma-separated filenames
    last_modified = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class AppSettings(Base):
    __tablename__ = "app_settings"
    id = Column(Integer, primary_key=True, default=1)
    # Email
    email_provider = Column(String, nullable=False, default="smtp")  # smtp | aws_ses
    smtp_host = Column(String, nullable=True)
    smtp_port = Column(Integer, nullable=True, default=587)
    smtp_user = Column(String, nullable=True)
    smtp_password = Column(String, nullable=True)
    smtp_use_tls = Column(Boolean, nullable=False, default=True)
    smtp_from_address = Column(String, nullable=True)
    # Slack
    slack_bot_token = Column(String, nullable=True)
    slack_socket_mode = Column(Boolean, nullable=False, default=False)
    slack_app_token = Column(String, nullable=True)
    slack_channel_id = Column(String, nullable=True)
class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
