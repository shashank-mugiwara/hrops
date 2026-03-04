# Technical Overview

The HR Ops Portal is a modern web application built with React, TypeScript, and Vite. It follows a modular architecture designed for high-volume HR operations, emphasizing data density and performance.

## Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Icons:** [Google Material Symbols Outlined](https://fonts.google.com/icons)
- **State Management:** React Hooks (`useState`, `useEffect`)

## Directory Structure

```text
src/
├── assets/             # Static assets like images and fonts
├── components/         # Reusable UI components
│   ├── Header.tsx      # Top navigation and search bar
│   ├── Sidebar.tsx     # Main navigation sidebar
│   └── ...
├── layouts/            # Page layout wrappers
│   └── MainLayout.tsx  # Common layout with Sidebar and Header
├── pages/              # Individual page components
│   ├── Dashboard.tsx
│   ├── CandidateRepository.tsx
│   └── ...
├── App.tsx             # Main application entry point and routing
├── index.css           # Global styles and Tailwind imports
└── main.tsx            # React DOM mounting
```

## State Management

The application currently uses local React state (`useState`) and effects (`useEffect`) for managing UI state and data.

### Theme State
The dark mode toggle is managed in `App.tsx` and persists the `dark` class on the `document.documentElement` to enable Tailwind's dark mode utility classes.

```tsx
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

## Build and Deployment

### Development
To start the development server:
```bash
pnpm install
pnpm run dev
```

### Production Build
To create a production-ready build:
```bash
pnpm run build
```
This executes `tsc -b && vite build`, which compiles TypeScript and bundles the assets into the `dist/` directory.
