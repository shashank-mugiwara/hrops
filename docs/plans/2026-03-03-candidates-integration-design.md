# 2026-03-03-candidates-integration-design.md

## Overview
This document describes the design for end-to-end integration of the Candidates feature in the HR Portal, connecting the React frontend to the FastAPI backend for all CRUD operations.

---

### 1. Architecture & Data Flow
- Each Candidates-related React component (list, detail, create/edit) will use the shared API client to call backend endpoints.
- Data will be fetched from the backend on component mount and after any create/update/delete operation.
- State (data, loading, error) will be managed locally in each component.
- Inline error messages will be shown near the relevant UI elements.

---

### 2. Components & API Endpoints
- **Candidate List Page**:  
  - Fetches all candidates from `GET /candidates/`.
  - Supports delete via `DELETE /candidates/{id}`.
  - Navigates to detail or create form.
- **Candidate Detail Page**:  
  - Fetches single candidate from `GET /candidates/{id}`.
  - Supports update via `PUT /candidates/{id}`.
- **Candidate Create/Edit Form**:  
  - Submits new candidate via `POST /candidates/`.
  - Updates existing via `PUT /candidates/{id}`.
- **API Client**:  
  - Use the shared `client` in `src/api/client.ts` for all requests.
- **Error Handling**:  
  - Inline error messages shown near forms or list items.

---

### 3. Error Handling, Loading, and Testing
- **Loading States**:  
  - Show loading spinners or skeletons while fetching data.
  - Disable form buttons during API calls.
- **Error Handling**:  
  - Display inline error messages near the relevant UI (e.g., form fields, list items).
  - Show generic error if the backend is unreachable.
- **Success Handling**:  
  - On successful create/update/delete, refresh the list or navigate as appropriate.
- **Automated Testing**:  
  - Write tests for API client methods (mocking fetch).
  - Add integration tests for components to verify data is fetched, displayed, and errors are handled.

---

## Conclusion
This design enables robust, maintainable, and testable integration of the Candidates feature, providing a foundation for future backend integrations.
