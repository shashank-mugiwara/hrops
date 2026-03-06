# Agent Skills and Guidelines

This file serves as the definitive reference for the available agent skills in this repository. Use these skills throughout the Software Development Life Cycle (SDLC) to ensure best practices, consistency, and high-quality outputs.

## Table of Contents

1. [brainstorming](#brainstorming)
2. [writing-plans](#writing-plans)
3. [using-git-worktrees](#using-git-worktrees)
4. [executing-plans](#executing-plans)
5. [test-driven-development](#test-driven-development)
6. [remembering-conversations](#remembering-conversations)
7. [frontend-design](#frontend-design)
8. [web-design-guidelines](#web-design-guidelines)
9. [vercel-react-best-practices](#vercel-react-best-practices)
10. [fastapi-templates](#fastapi-templates)
11. [sql-optimization-patterns](#sql-optimization-patterns)
12. [postgresql-table-design](#postgresql-table-design)
13. [SQLite Database Expert](#sqlite-database-expert)
14. [typescript-advanced-types](#typescript-advanced-types)

---

### brainstorming
**Path**: `.agents/skills/brainstorming/SKILL.md`
**Description**: You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements and design before implementation.
**When to Use**: At the start of a feature request or major change, before writing any code.

### writing-plans
**Path**: `.agents/skills/writing-plans/SKILL.md`
**Description**: Use when you have a spec or requirements for a multi-step task, before touching code.
**When to Use**: After brainstorming and requirements gathering, to outline exact steps, files, and tests before implementation.

### using-git-worktrees
**Path**: `.agents/skills/using-git-worktrees/SKILL.md`
**Description**: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - creates isolated git worktrees with smart directory selection and safety verification.
**When to Use**: When transitioning from planning to execution to ensure a clean, isolated environment.

### executing-plans
**Path**: `.agents/skills/executing-plans/SKILL.md`
**Description**: Use when you have a written implementation plan to execute in a separate session with review checkpoints.
**When to Use**: When working through a generated plan step-by-step.

### test-driven-development
**Path**: `.agents/skills/test-driven-development/SKILL.md`
**Description**: Use when implementing any feature or bugfix, before writing implementation code.
**When to Use**: Immediately before writing production code, to define failing tests first.

### remembering-conversations
**Path**: `.agents/skills/remembering-conversations/SKILL.md`
**Description**: Use when user asks 'how should I...' or 'what's the best approach...' after exploring code, OR when you've tried to solve something and are stuck, OR for unfamiliar workflows, OR when user references past work. Searches conversation history.
**When to Use**: When needing context on past decisions, workflows, or when blocked on an implementation.

### frontend-design
**Path**: `.agents/skills/frontend-design/SKILL.md`
**Description**: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications. Generates creative, polished code and UI design that avoids generic AI aesthetics.
**When to Use**: When building or styling new frontend components or pages.

### web-design-guidelines
**Path**: `.agents/skills/web-design-guidelines/SKILL.md`
**Description**: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
**When to Use**: During code review or refactoring of frontend code to ensure high UX/UI standards.

### vercel-react-best-practices
**Path**: `.agents/skills/vercel-react-best-practices/SKILL.md`
**Description**: React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns.
**When to Use**: During React/Next.js development to optimize performance, bundle size, and rendering.

### fastapi-templates
**Path**: `.agents/skills/fastapi-templates/SKILL.md`
**Description**: Create production-ready FastAPI projects with async patterns, dependency injection, and comprehensive error handling. Use when building new FastAPI applications or setting up backend API projects.
**When to Use**: When designing or implementing backend endpoints and services in FastAPI.

### sql-optimization-patterns
**Path**: `.agents/skills/sql-optimization-patterns/SKILL.md`
**Description**: Master SQL query optimization, indexing strategies, and EXPLAIN analysis to dramatically improve database performance and eliminate slow queries. Use when debugging slow queries, designing database schemas, or optimizing application performance.
**When to Use**: When diagnosing slow database operations or designing complex queries.

### postgresql-table-design
**Path**: `.agents/skills/postgresql-table-design/SKILL.md`
**Description**: Design a PostgreSQL-specific schema. Covers best-practices, data types, indexing, constraints, performance patterns, and advanced features.
**When to Use**: When designing new database tables or altering existing schema definitions in PostgreSQL.

### SQLite Database Expert
**Path**: `.agents/skills/sqlite-database-expert/SKILL.md`
**Description**: Expert in SQLite embedded database development for Tauri/desktop applications with focus on SQL injection prevention, migrations, FTS search, and secure data handling.
**When to Use**: When working with SQLite databases (like `hrportal.db` in this repository).

### typescript-advanced-types
**Path**: `.agents/skills/typescript-advanced-types/SKILL.md`
**Description**: Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript projects.
**When to Use**: When defining complex types, interfaces, or generic components in the frontend/TypeScript codebase.
