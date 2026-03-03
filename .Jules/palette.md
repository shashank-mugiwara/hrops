# Palette's Journal

## 2025-05-15 - [Accessible Form Patterns]
**Learning:** In complex layouts like the "Mad-lib" rule editor, screen readers struggle without explicit ARIA labels on inline selects and inputs, as traditional labels may not be structurally adjacent or clearly associated.
**Action:** Always use `aria-label` for inline form elements that are part of a sentence-like structure to provide clear context.

## 2025-05-15 - [Destructive Action Safety]
**Learning:** Users in HR Ops frequently manage sensitive data; a single-click delete on automation rules is a high-risk interaction.
**Action:** Implement "click-to-confirm" states for destructive actions to provide a low-friction but effective safety net.
