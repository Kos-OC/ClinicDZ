# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-26

### Added
- Phase 2 Integration: Consultations module data layer.
- Added 58 Algerian wilayas data.
- Extended store with consultation CRUD actions.
- Added BMI and Reste calculation utils.
- Added tests for consultation store and calculation utils.
- Added shared components: `PatientAvatar` and `TabPanel`.
- Added Consultations List Page (`Consultations.jsx`).
- Added Consultation Detail Page (`ConsultationDetail.jsx`) with auto-calculation logic and unit tests.
- Added action modals: Bilan, ArretTravail, Certificat, LettreOrientation with print support.
- Upgraded Analyses page to two-panel click-to-add UX.
- Implemented routing and sidebar integration for the new Consultations module.

### Added
- **Sidebar collapsible**: Toggle button shrinks sidebar to icon-only mode (w-64 → w-16) with smooth transition.
- **Statistiques Page** (Accueil): Dashboard with counts, this-month prescriptions, monthly bar chart, age distribution, top prescribed drugs.
- **Certificats Médicaux Feature**: 6 certificate templates, three-column layout (template list / form / live preview), RHF+Zod validation, auto-resolved placeholders from store, print with saved copies in patient history.

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
