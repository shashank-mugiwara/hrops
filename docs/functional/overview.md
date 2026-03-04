# Functional Overview

Welcome to the HR Ops Portal functional documentation. This guide is designed for HR Operations Managers and team leads responsible for managing high-volume employee onboarding.

## Getting Started

To access the portal, navigate to the [HR Ops Dashboard](https://shashank-mugiwara.github.io/hrops/).

### Core Navigation
- **Dashboard:** Your operational mission control.
- **Repository:** The database of all candidates.
- **Teams:** Organize candidates by departments.
- **Import Wizard:** Add new candidates from CSV.
- **Automation Rules:** Set up auto-email triggers.

---

## User Manual

### 1. Managing Candidates (Repository)
The **Candidate Repository** is the primary view for managing the candidate database.
- Use the **Search** bar to find candidates by name or email.
- Filter by status or team to narrow down your view.
- Perform **Bulk Actions** such as changing status or deleting records.

### 2. Importing Candidates (Import Wizard)
The **Import Wizard** ensures data integrity when ingesting external records.
1. **Upload:** Drag and drop your `.csv` file.
2. **Map Columns:** Align your CSV headers with the portal's database schema.
3. **Resolve Conflicts:** If duplicates are detected, choose between keeping the existing record or overwriting it with new data.
4. **Review:** Confirm the final list before importing into the repository.

### 3. Creating Automation Rules
The **Automation Rules Engine** allows you to automate communication and document dispatch.
- **Trigger:** Define a rule based on the candidate's joining date (e.g., "10 days before").
- **Templates:** Attach necessary PDF documents like NDAs or Benefits Guides.
- **Assignment:** Target specific teams or departments for the rule.

### 4. Welcome Canvas Generator
Create branded assets for internal communication:
1. Select a candidate.
2. Upload a headshot.
3. Use the built-in cropper to align the image within the circular mask.
4. Preview and push the final asset directly to your company's Slack channel.
