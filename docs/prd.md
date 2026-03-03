# Enterprise Trust HR Portal - PRD

**The Pitch:** A unified command center for high-volume employee onboarding, replacing fragmented spreadsheets with rigorous automation and data integrity.

**Target Audience:** HR Operations Managers who need absolute certainty in compliance document delivery and zero-error candidate data management.

**Target Device:** Desktop (1440px+ optimized).

**Design Direction:** "Structured Professional." High-information density, unwavering visual hierarchy, and a calm, antiseptic cleanliness that suggests data precision.

**Inspiration:** Stripe Dashboard, Workday (modernized), Linear (light mode).

---

## Core Screens

- **Dashboard:** High-level status board tracking active onboardings, critical alerts, and email deliverability health.
- **Candidate Repository:** Data-dense table view of all candidates with powerful filtering and bulk action capabilities.
- **Import Wizard:** A multi-step modal flow for CSV ingestion, schema mapping, and intelligent duplicate conflict resolution.
- **Automation Rules:** Logic builder for configuring time-based document dispatch triggers relative to joining dates.
- **Candidate Detail & Audit:** Individual profile view showing a timeline of sent communications and document status.
- **Welcome Canvas Generator:** Visual tool to crop employee headshots and generate branded welcome assets for Slack.

---

## Key User Flows

### Flow 1: CSV Import with Deduplication
1. User clicks **Import Candidates** on Repository (Opens full-screen Wizard).
2. User uploads `candidates_q3.csv` (System validates schema).
3. System detects 3 duplicates and displays the "Conflict Resolution" step.
4. User compares "Existing" vs "New" data side-by-side and selects **Merge** (Keep New Joining Date).
5. User confirms, and the Dashboard updates with valid records.

### Flow 2: Configuring a T-Minus 10 Document Batch
1. User navigates to **Automation Rules** and clicks **New Rule**.
2. User sets Trigger: 10 Days, Before, Joining Date.
3. User attaches `NDA_v4.pdf` and `Benefits_Guide.pdf`.
4. User assigns to Team: Engineering.
5. System confirms the rule is active for 14 upcoming candidates.

### Flow 3: Generating a Welcome Asset
1. User opens **Welcome Canvas** and selects an onboarded candidate.
2. User uploads a raw headshot and uses the built-in cropper to align the face within a circular mask.
3. System previews a branded card with Name, Role, and Start Date overlaid.
4. User clicks **Push to Slack**, and the bot posts the image to `#general`.

---

## Design System

### Typography Foundation
**Font Family:** IBM Plex Sans (Google Fonts). Engineered, technical, readable.

| Element | Weight | Size & Spacing | Additional Notes |
| :--- | :--- | :--- | :--- |
| Display | 600 (Semi-Bold) | 24px, -0.5px tracking | Used for primary page headers. |
| Heading | 600 (Semi-Bold) | 18px, 0px tracking | Used for card titles and modals. |
| Body Strong | 500 (Medium) | 14px | Used for emphasis in paragraphs. |
| Body | 400 (Regular) | 14px, 1.4 line-height | Standard reading text. |
| Data/Table | 400 (Regular) | 13px | Condensed capability if needed. |
| Label | 500 (Medium) | 12px, +0.5px tracking | Uppercase formatting. |

### Color Palette

| Category | Hex Code | Color Name / Purpose |
| :--- | :--- | :--- |
| Primary | `#0F62FE` | IBM Blue style. Trustworthy, authoritative actions. |
| Background | `#F4F7FB` | Very cool grey/blue tint. Not stark white. |
| Surface | `#FFFFFF` | Crisp white for cards and tables. |
| Text Primary | `#161616` | Near black, high contrast. |
| Text Secondary | `#525252` | Neutral grey for metadata. |
| Border/Divider | `#E0E6ED` | Subtle structure. |
| Status Success | `#198038` | Green text on #DEFBE6 background. |
| Status Warning | `#B28600` | Gold text on #FFF8E1 background. |
| Status Error | `#DA1E28` | Red text on #FFD7D9 background. |

### Styling Notes & Tokens
- **Shadows:** Hard, low-blur shadows. `box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);`
- **Borders:** Every card has a 1px border (`#E0E6ED`).
- **Corners:** Tight 4px radius everywhere. No rounded bubbles.

---

## Screen Specifications

### Dashboard
- **Purpose:** Operational awareness at a glance.
- **Layout:** Fixed Left Nav (240px). Main content features a 64px Header, a grid of KPI cards at the top, and a Recent Activity List at the bottom.
- **KPI Cards:** White background, 1px border. Metrics include "Pending Joinees (7 Days)", "Emails Failed", "Welcome Kits Due", and "Active Rules".
- **Joining Timeline Chart:** Bar chart showing intake volume per week for the next 4 weeks.

### Candidate Repository
- **Purpose:** Manage the raw database of candidates.
- **Layout:** Full-width data table occupying 90% of screen real estate.
- **Toolbar:** Search input, Filter Button, "Import Candidates".
- **Data Table:** Header features `#F4F7FB` background, uppercase labels. Rows are 48px high.

### Import Wizard (Modal)
- **Purpose:** Safe ingestion of external data.
- **Stepper:** 1. Upload -> 2. Map Columns -> 3. Resolve Conflicts -> 4. Review.
- **Conflict Resolver:** Side-by-side comparison of existing vs incoming records.

### Automation Rules Engine
- **Purpose:** Logic builder for email/document dispatch.
- **Trigger Sentence:** "Send [Template] to [Team] [N] days [Before/After] Joining Date."
- **Attachment Zone:** Box listing uploaded PDFs.

### Welcome Canvas Generator
- **Purpose:** Brand advocacy and internal culture building.
- **Image Uploader & Cropper:** Upload face with a circular mask overlay.
- **Preview Card:** 800x400px branded card.
- **Slack Destination:** Select destination channel.
