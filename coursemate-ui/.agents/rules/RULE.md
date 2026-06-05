---
trigger: always_on
---

rules:

- name: project-structure
  description: Standard folder structure for Next.js projects.
  guidelines:
  - Use App Router (app/)
  - Reusable components should be placed in /components
  - Custom hooks should be placed in /hooks
  - Utility functions should be placed in /lib
  - TypeScript type definitions should be placed in /types
  - API services should be placed in /services

- name: code-conventions
  guidelines:
  - Use functional components
  - Use TypeScript for typing
  - Component names should use PascalCase
  - One component per file
  - Avoid complex logic inside JSX
  - Avoid writing comments unless necessary
  - Prefer clear naming for variables, functions, and components
  - Use comments only for complex logic or important notes
  - Do not add redundant or obvious comments
  - Do not leave empty lines between import statements
  - Keep all imports grouped together at the top of the file
  - Sort imports logically when possible

- name: ui-components
  description: UI component usage guidelines.
  guidelines:
  - Prefer using components from :contentReference[oaicite:0]{index=0}
  - Avoid creating new custom components unless necessary
  - Extend or compose existing shadcn/ui components when possible
  - Keep UI components simple and reusable
  - UI text should be concise, easy to understand, and task-focused
  - Avoid overly expressive copy, excessive emphasis, or multiple exclamation-style phrases in buttons, labels, toasts, and empty states

- name: data-fetching
  description: Best practices for fetching data.
  guidelines:
  - Prefer Server Components when possible
  - Use fetch on the server side
  - Use React Query or SWR for client-side data fetching
  - Never expose secrets on the client
  - Use `async/await` instead of `.then()`.

- name: styling
  description: Styling conventions.
  guidelines:
  - Prefer :contentReference[oaicite:1]{index=1}
  - Avoid unnecessary global CSS
  - Components should encapsulate their styles
  - Avoid raw color values such as `rgb(...)`, `rgba(...)`, hex codes, or arbitrary one-off color literals in UI code when semantic Tailwind tokens or shared design tokens can be used instead

- name: performance
  description: Performance rules.
  guidelines:
  - Use next/image for images
  - Use dynamic import for code splitting
  - Avoid unnecessary re-renders

- name: security
  description: Security best practices.
  guidelines:
  - Never place API keys on the client
  - Validate user input
  - Sanitize data received from the backend
