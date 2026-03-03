# Component APIs

This section documents the props and usage of key UI components.

## `Header`

The `Header` component displays the page title, an optional subtitle, a search bar, and user-specific actions.

### Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | The primary page heading. |
| `subtitle` | `string` | No | Secondary metadata or description. |

### Usage

```tsx
import { Header } from '../components/Header';

const Dashboard = () => (
  <Header title="Dashboard" subtitle="Operational Awareness at a Glance" />
);
```

---

## `Sidebar`

The `Sidebar` component provides the primary navigation for the application, featuring navigation links, the application logo, and user profile information.

### Props
This component does not accept any props.

### Navigation Items
The navigation is defined as a constant array of objects within the component:
- `Dashboard`: `/`
- `Repository`: `/repository`
- `Teams`: `/teams`
- `Import Wizard`: `/import`
- `Automation Rules`: `/rules`

---

## `MainLayout`

The `MainLayout` component serves as a wrapper for all pages, providing a consistent structure with the `Sidebar` and `Header`.

### Props

| Prop | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | Passed to the `Header` component. |
| `subtitle` | `string` | No | Passed to the `Header` component. |
| `children` | `React.ReactNode` | Yes | The main content of the page. |

### Usage

```tsx
import { MainLayout } from '../layouts/MainLayout';

const CandidateRepository = () => (
  <MainLayout title="Candidate Repository">
    <div className="p-6">
      {/* Table content goes here */}
    </div>
  </MainLayout>
);
```
