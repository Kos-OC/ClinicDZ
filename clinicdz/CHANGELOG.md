# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-04-25

### Added
- Project scaffolding using Vite and React.
- Initial dependencies: `react-router-dom`, `zustand`, `uuid`, `@headlessui/react`, `react-hook-form`, `zod`, `react-hot-toast`.
- Tailwind CSS and Vitest configuration.
- Storage Adapter (`src/adapter/storage.js`) for `localStorage` persistence with prefix.
- Zustand Store (`src/store/useStore.js`) for global state management with auto-save.
- Default data for drugs (34 entries) and analyses (40+ entries).
- Business logic utils: `calculateAge` (robust date parsing), `exportToJson`, and `importFromJson`.
- App Layout with responsive Sidebar navigation and React Router.
- Reusable `EmptyState` component with SVG illustration.
- **Parametres Page**: Doctor profile management and data import/export.
- **Patients Page**: List, Search, and Add Patient (Headless UI Modal).
- **Patient Detail Page**: Profile summary and prescription history.
- **Medicaments Page**: Complete CRUD for drug database.
- **Ordonnance Page**: Advanced creation form with Combobox search, items list, and A5 Print preview.
- **Analyses Page**: Request form with categorized checkboxes, Urgent flag, and A5 Print preview.
- Professional Print CSS for A5 portrait documents.
- Global `Ctrl+P` shortcut for printing.
- Comprehensive unit test suite (Storage, Store, Utils, Pages).
