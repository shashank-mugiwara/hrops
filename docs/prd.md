# Enterprise HR Ops Portal - PRD & User Guide

**Welcome to the HR Ops Portal!**

This document outlines the core problem we are solving, the design of our solution, and a step-by-step guide on how to use the new system. It serves as both our Product Requirements Document (PRD) and a visual guide for the HR team.

> **🚧 Prototype Review Notice**
> A 50% completed skeleton of the frontend is currently available for your review!
> You can access and explore the live prototype here: **[HR Ops Portal Prototype](https://mag-equity-pregnancy-situation.trycloudflare.com/)**
>
> *Please note:* This is a work-in-progress. An AI developer is progressively building and enhancing the application every night, little by little. What you see is currently a structural preview of the final experience.

---

## 1. The Core Problem & Solution

**The Problem:** High-volume employee onboarding often relies on fragmented spreadsheets, manual data entry, and scattered email threads. This leads to missing compliance documents, data errors, and a stressful experience for both the HR team and the new candidates.

**Our Solution:** A unified command center designed specifically for HR Operations. It automates compliance document delivery, provides a rigorous process for candidate data management, and replaces spreadsheets with a visually structured, easy-to-use dashboard.

---

## 2. Platform Overview: Tabs and Screens

The application is divided into several key areas (tabs) that help you manage the onboarding process smoothly. Here is a breakdown of what each screen does and how to configure it.

### 📊 Dashboard
The high-level status board.
- **What it does:** Tracks active onboardings, critical alerts (like failed emails), and overall health of the onboarding pipeline.
- **How to use it:** Log in here daily to get a quick operational glance at pending joinees, outstanding tasks, and system health.

![Dashboard Overview](https://placehold.co/800x400/F4F7FB/161616?text=Dashboard+Overview)

### 👥 Candidate Repository
The central database for all incoming hires.
- **What it does:** Displays a dense, easily readable list of all candidates with powerful filtering and search options.
- **How to use it:** Use this tab to look up specific candidates, edit their details, or trigger manual actions.

![Candidate Repository](https://placehold.co/800x400/F4F7FB/161616?text=Candidate+Repository+Screen)

### 📥 Import Wizard
The tool to safely ingest external data (like CSV files from recruiting systems).
- **What it does:** Guides you through uploading spreadsheets, mapping the columns correctly, and resolving any duplicate entries before they enter the system.
- **How to use it:** Click "Import Candidates" from the Repository to launch the wizard whenever you have a new batch of hires.

![Import Wizard Concept](https://placehold.co/800x400/F4F7FB/161616?text=Import+Wizard+Concept)

### ⚙️ Automation Rules
The engine behind our automated document dispatch.
- **What it does:** Allows you to configure triggers (e.g., "Send NDA 10 days before joining date") so documents go out automatically.
- **How to use it:** Create rules based on teams, joining dates, and required documents. The system handles the execution, ensuring you never miss a deadline.

![Automation Rules](https://placehold.co/800x400/F4F7FB/161616?text=Automation+Rules+Configuration)

---

## 3. End-to-End Walkthroughs

To help you understand how to operate the portal visually, here are two common end-to-end examples outlining the user flows.

### Example 1: Importing Candidates via the Import Wizard
*When you have a new list of hires from the recruiting team and need to add them to the system without creating duplicates.*

**Step 1: Start the Import**
Navigate to the **Candidate Repository** tab and click the **Import Candidates** button. This opens the multi-step Import Wizard.

![Import Wizard - Step 1](https://placehold.co/800x400/0F62FE/FFFFFF?text=Click+Import+Candidates)

**Step 2: Upload File & Map Columns**
Upload your CSV file (e.g., `candidates_q3.csv`). The system will automatically try to match your spreadsheet columns (like "First Name", "Email") to the portal's database. Review and confirm the mapping is correct.

![Import Wizard - Step 2](https://placehold.co/800x400/F4F7FB/161616?text=Upload+and+Map+Columns)

**Step 3: Resolve Conflicts (Deduplication)**
If the system detects that a candidate already exists, it will pause and show a side-by-side comparison ("Existing" vs. "New"). You can visually inspect the differences and choose to merge the records, keeping the most recent data (like an updated joining date).

![Import Wizard - Step 3](https://placehold.co/800x400/F4F7FB/161616?text=Resolve+Data+Conflicts)

**Step 4: Confirm and Finish**
Review the final list of valid records and click **Confirm**. The Dashboard and Repository will instantly update with the new candidates, completely error-free.

---

### Example 2: Configuring an Automated Document Dispatch
*When you want the Engineering team to automatically receive their NDA and Benefits Guide exactly 10 days before they join.*

**Step 1: Create a New Rule**
Navigate to the **Automation Rules** tab and click **New Rule**.

![Automation Rules - Step 1](https://placehold.co/800x400/0F62FE/FFFFFF?text=Click+New+Rule)

**Step 2: Set the Trigger Logic**
In the configuration screen, set the timeline logic using simple dropdowns:
- **Timeframe:** 10 Days
- **Condition:** Before
- **Anchor:** Joining Date

![Automation Rules - Step 2](https://placehold.co/800x400/F4F7FB/161616?text=Configure+Trigger+Logic)

**Step 3: Attach Documents & Assign Targets**
Upload the specific documents you want to send (e.g., `NDA_v4.pdf` and `Benefits_Guide.pdf`). Then, assign this rule to apply only to the **Engineering** team.

**Step 4: Save and Activate**
Click **Save**. The system will verify the rule and show you how many upcoming candidates will be affected immediately. The documents are now scheduled automatically!

![Automation Rules - Step 4](https://placehold.co/800x400/F4F7FB/161616?text=Rule+Active+Confirmation)

---

## Summary
The primary goal of this portal is to transition HR operations from manual spreadsheets to a visual, automated workflow. By reviewing the [prototype skeleton](https://mag-equity-pregnancy-situation.trycloudflare.com/), you can click through the different tabs and see the foundation of this system in action. Remember, our AI developer will continue adding features and refining the functional design every night!
