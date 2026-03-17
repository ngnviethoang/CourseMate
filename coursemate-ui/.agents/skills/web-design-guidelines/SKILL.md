# Design Guidelines

## Design Principles

**Consistency** – Components and layouts must maintain consistent spacing, typography, and colors across the application.
**Simplicity** – Interfaces should remain clean and minimal, focusing on essential user actions.
**Reusability** – UI components should be modular and reusable to support scalability.
**Desktop Focus** – The application is optimized for desktop screens only. Mobile and tablet layouts are not supported.

## Layout Structure

The platform has two main layout types.

**Student Layout** – Designed for learning and course browsing. Includes: Navbar, Course Catalog, Course Detail Page, Lesson Viewer, User Profile.

**Management Layout** – Used by instructors and administrators. Includes: Dashboard, Course Management, Content Management, User Management.

## Color System

The interface is based on a **light blue and white** palette to create a clean and modern learning environment.
**Primary Colors** – Light blue is used as the main brand color for buttons, links, and active elements. White is used as the main background color.
**Secondary Colors** – Used sparingly for UI accents and secondary actions.
**Neutral Colors** – Used for text, borders, dividers, cards, and secondary backgrounds (light gray, dark gray, muted gray).
**Status Colors** – Used only when necessary for success, warning, and error states.
**Gradient Usage** – Gradients should be avoided or used minimally; solid colors are preferred.
**Accessibility** – Colors must maintain sufficient contrast and should not rely solely on color to convey meaning.

## Typography

Typography should follow a clear hierarchy:
H1 – Page titles, H2 – Section titles, H3 – Subsections, Body – Content text, Small – Labels and metadata. Font usage must remain consistent across the application.

## Spacing and Layout

Spacing follows a consistent scale: 4px, 8px, 16px, 24px, 32px. Layouts should maintain consistent padding and margins to ensure visual balance.

## Components

Components should follow these rules: single responsibility, reusable across pages, typed with TypeScript, and styled using TailwindCSS. Common components include Button, Card, Input, Modal, Dropdown, and Course Card.

## Icons

Icons should be simple and consistent. Use a single icon library, maintain consistent sizes, and use icons to support actions rather than replace text.

## Accessibility

UI must follow accessibility best practices including semantic HTML, keyboard navigation support, sufficient color contrast, and visible focus states.

## Performance

Optimize UI performance by avoiding unnecessary re-renders, optimizing images, and using lazy loading when appropriate.
