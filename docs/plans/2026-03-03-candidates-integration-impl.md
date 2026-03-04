# Candidates Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate the Candidates feature in the frontend with the backend API for full CRUD operations, replacing all mock data with live backend data.

**Architecture:**
- Each Candidates-related React component will use the shared API client to call backend endpoints directly.
- State, loading, and error handling will be managed locally in each component.
- Inline error messages will be shown for all failed operations.

**Tech Stack:** React, TypeScript, FastAPI, Jest (or React Testing Library)

---

### Task 1: Candidate List - Fetch & Display

**Files:**
- Modify: `src/pages/CandidateRepository.tsx`
- Test: `src/pages/__tests__/CandidateRepository.test.tsx`

**Step 1: Write a failing test**
- Test that the list fetches and displays candidates from the backend.

**Step 2: Run the test to verify it fails**

**Step 3: Implement data fetching using the API client**
- Replace mock data with a call to `client.get('/candidates/')`.
- Show loading and error states.

**Step 4: Run the test to verify it passes**

**Step 5: Commit**

---

### Task 2: Candidate Delete

**Files:**
- Modify: `src/pages/CandidateRepository.tsx`
- Test: `src/pages/__tests__/CandidateRepository.test.tsx`

**Step 1: Write a failing test**
- Test that deleting a candidate calls the backend and removes it from the list.

**Step 2: Run the test to verify it fails**

**Step 3: Implement delete using `client.delete('/candidates/{id}')`**
- Show inline error if delete fails.

**Step 4: Run the test to verify it passes**

**Step 5: Commit**

---

### Task 3: Candidate Detail - Fetch & Update

**Files:**
- Modify: `src/pages/CandidateDetail.tsx`
- Test: `src/pages/__tests__/CandidateDetail.test.tsx`

**Step 1: Write a failing test**
- Test that the detail page fetches a candidate and updates it via the backend.

**Step 2: Run the test to verify it fails**

**Step 3: Implement fetch and update using `client.get` and `client.put`**
- Show loading, error, and success states.

**Step 4: Run the test to verify it passes**

**Step 5: Commit**

---

### Task 4: Candidate Create

**Files:**
- Modify: `src/pages/CandidateDetail.tsx` or create a new form component if needed
- Test: `src/pages/__tests__/CandidateDetail.test.tsx` or new test file

**Step 1: Write a failing test**
- Test that creating a candidate calls the backend and adds it to the list.

**Step 2: Run the test to verify it fails**

**Step 3: Implement create using `client.post('/candidates/')`**
- Show loading, error, and success states.

**Step 4: Run the test to verify it passes**

**Step 5: Commit**

---

### Task 5: Refactor & Clean Up

**Files:**
- All modified files above

**Step 1: Remove all mock data and ensure only backend data is used**

**Step 2: Run all tests to verify full integration**

**Step 3: Commit**

---

Plan complete and saved to `docs/plans/2026-03-03-candidates-integration-impl.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?