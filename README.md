# HR Ops Portal

A unified command center for high-volume employee onboarding, replacing fragmented spreadsheets with rigorous automation and data integrity.

## Documentation

The project documentation is built with Docusaurus and is available at:
[https://shashank-mugiwara.github.io/hrops/](https://shashank-mugiwara.github.io/hrops/)

To work on the documentation locally:

```bash
cd website
pnpm install
pnpm start
```

Documentation source files (Markdown) are located in the `/docs` directory at the root of the repository.

## Project Setup

This is a Vite + React + TypeScript project.

### Prerequisites

- Node.js (v20 or higher)
- pnpm (v9 or higher)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`.

### Build

```bash
pnpm run build
```

The production build will be generated in the `dist/` directory.

## Core Features

- **Candidate Repository:** Data-dense management of all joinees.
- **Automation Rules:** Logic-based email and document dispatch.
- **Import Wizard:** CSV ingestion with intelligent deduplication.
- **Welcome Canvas:** Branded asset generation for Slack.
