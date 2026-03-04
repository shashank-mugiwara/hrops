from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
import datetime


class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class GroupBase(BaseModel):
    name: str
    code: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    department_id: Optional[int] = None

class GroupCreate(GroupBase):
    pass

class Group(GroupBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    member_count: int = 0
    rule_count: int = 0


class CandidateBase(BaseModel):
    candidate_name: str
    candidate_email: EmailStr
    hrbp_name: Optional[str] = None
    hrbp_email: Optional[EmailStr] = None
    reporting_manager_name: Optional[str] = None
    reporting_manager_email: Optional[EmailStr] = None
    recruiter_name: Optional[str] = None
    buddy_name: Optional[str] = None
    role: Optional[str] = None
    joining_date: Optional[datetime.date] = None
    location: Optional[str] = None
    status: Optional[str] = None
    group_id: Optional[int] = None

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class AutomationRuleBase(BaseModel):
    name: str
    trigger_days: int
    trigger_type: str
    joining_date_ref: str = "joining_date"
    status: Optional[str] = "active"
    channel: Optional[str] = None
    group_id: Optional[int] = None
    template_files: Optional[str] = None
    assigned_department_id: Optional[int] = None

class AutomationRuleCreate(AutomationRuleBase):
    pass

class AutomationRule(AutomationRuleBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class DocumentBase(BaseModel):
    filename: str
    type: Optional[str] = None
    uploaded_by: Optional[str] = None
    uploaded_at: Optional[datetime.datetime] = None
    status: Optional[str] = None
    candidate_id: Optional[int] = None
    rule_id: Optional[int] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class AuditLogBase(BaseModel):
    candidate_id: int
    event_type: str
    event_time: Optional[datetime.datetime] = None
    details: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    model_config = ConfigDict(from_attributes=True)
    id: int


class TemplateBase(BaseModel):
    name: str
    channel: str = "Email"
    subject: Optional[str] = None
    body: Optional[str] = None
    attachments: Optional[str] = None  # comma-separated filenames

class TemplateCreate(TemplateBase):
    pass

class Template(TemplateBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    last_modified: Optional[datetime.datetime] = None


class AppSettingsBase(BaseModel):
    email_provider: str = "smtp"
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = True
    smtp_from_address: Optional[str] = None
    slack_bot_token: Optional[str] = None
    slack_socket_mode: bool = False
    slack_app_token: Optional[str] = None
    slack_channel_id: Optional[str] = None

class AppSettingsUpdate(AppSettingsBase):
    pass

class AppSettings(AppSettingsBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
