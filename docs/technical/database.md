# Database Schema

This document outlines the database tables, columns, and relationships defined in the backend models.

## `departments`
Stores organizational departments.

- **id**: Integer, Primary Key
- **name**: String, Unique, Non-nullable
- **description**: Text, Nullable
- *Relationships*: Has many `groups`.

## `groups`
Stores groups within departments.

- **id**: Integer, Primary Key
- **name**: String, Unique, Non-nullable
- **code**: String, Unique, Nullable
- **color**: String, Nullable
- **description**: Text, Nullable
- **department_id**: Integer, Foreign Key (`departments.id`)
- *Relationships*: Belongs to `department`, has many `candidates`, has many `active_rules`.

## `candidates`
Stores candidate information.

- **id**: Integer, Primary Key
- **candidate_name**: String, Non-nullable
- **candidate_email**: String, Non-nullable
- **hrbp_name**: String, Nullable
- **hrbp_email**: String, Nullable
- **reporting_manager_name**: String, Nullable
- **reporting_manager_email**: String, Nullable
- **recruiter_name**: String, Nullable
- **buddy_name**: String, Nullable
- **role**: String, Nullable
- **joining_date**: Date, Nullable
- **location**: String, Nullable
- **status**: String, Nullable
- **group_id**: Integer, Foreign Key (`groups.id`)
- *Relationships*: Belongs to `group`, has many `documents`, has many `audit_logs`.

## `automation_rules`
Stores rules for automated actions.

- **id**: Integer, Primary Key
- **name**: String, Non-nullable
- **trigger_days**: Integer, Non-nullable
- **trigger_type**: String (before/after), Non-nullable
- **joining_date_ref**: String, Default: "joining_date", Non-nullable
- **status**: String, Default: "active", Non-nullable
- **channel**: String (email/slack), Nullable
- **group_id**: Integer, Foreign Key (`groups.id`)
- **template_files**: Text (comma-separated filenames), Nullable
- **assigned_department_id**: Integer, Foreign Key (`departments.id`), Nullable
- *Relationships*: Belongs to `group`.

## `documents`
Stores document metadata for candidates.

- **id**: Integer, Primary Key
- **filename**: String, Non-nullable
- **type**: String, Nullable
- **uploaded_by**: String, Nullable
- **uploaded_at**: DateTime, Default: Current UTC Time
- **status**: String (pending/completed), Nullable
- **candidate_id**: Integer, Foreign Key (`candidates.id`), Nullable
- **rule_id**: Integer, Foreign Key (`automation_rules.id`), Nullable
- *Relationships*: Belongs to `candidate`.

## `audit_logs`
Stores audit logs for candidate events.

- **id**: Integer, Primary Key
- **candidate_id**: Integer, Foreign Key (`candidates.id`)
- **event_type**: String, Non-nullable
- **event_time**: DateTime, Default: Current UTC Time
- **details**: Text, Nullable
- *Relationships*: Belongs to `candidate`.

## `templates`
Stores communication templates.

- **id**: Integer, Primary Key
- **name**: String, Non-nullable
- **channel**: String, Default: "Email", Non-nullable
- **subject**: String, Nullable
- **body**: Text, Nullable
- **attachments**: Text (comma-separated filenames), Nullable
- **last_modified**: DateTime, Default: Current UTC Time, On Update: Current UTC Time

## `app_settings`
Stores global application settings.

- **id**: Integer, Primary Key, Default: 1
- **email_provider**: String, Default: "smtp", Non-nullable
- **smtp_host**: String, Nullable
- **smtp_port**: Integer, Default: 587, Nullable
- **smtp_user**: String, Nullable
- **smtp_password**: String, Nullable
- **smtp_use_tls**: Boolean, Default: True, Non-nullable
- **smtp_from_address**: String, Nullable
- **slack_bot_token**: String, Nullable
- **slack_socket_mode**: Boolean, Default: False, Non-nullable
- **slack_app_token**: String, Nullable
- **slack_channel_id**: String, Nullable

## `admin_users`
Stores administrator credentials.

- **id**: Integer, Primary Key
- **username**: String, Unique, Indexed, Non-nullable
- **password_hash**: String, Non-nullable
