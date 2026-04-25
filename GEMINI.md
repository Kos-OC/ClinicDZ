# ClinicDZ - Global Context & Instructions

ClinicDZ is a free, offline-first clinic management web application specifically designed for Algerian general practitioners. It is a React-based application architected for future migration to Electron and SQLite.

## Project Overview

- **Core Goal:** Provide a lightweight, offline management system for patient records, prescriptions, and analyses.
- **Primary Users:** Algerian general practitioners (100% French UI).
- **Architecture:** React 18 + Vite. Data is persisted relationally in `localStorage` via a dedicated Storage Adapter, designed for easy swap to SQLite later.
- **State Management:** Zustand for reactive updates and auto-saving.

## Key Technologies

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Headless UI for accessible components)
- **Forms:** React Hook Form + Zod (French error messages)
- **Routing:** React Router DOM v6
- **Notifications:** React Hot Toast
- **Testing:** Vitest + React Testing Library

## Development Mandates (Strict Compliance)

1.  **French UI:** All user-facing text must be in French. Minimum font size: 14px.
2.  **Offline-First:** All data operations must go through `src/adapter/storage.js`. Never use `localStorage` directly in components.
3.  **Auto-Save:** Changes must trigger immediate saves via Zustand, accompanied by success toasts.
4.  **Separation of Concerns:** Keep business logic and calculations in `src/utils/`. Components should focus on UI and interaction.
5.  **Step-Gating:** Follow the execution plan in `AGENT.md` sequentially. Do not move to the next step until the current one is fully implemented and tested.
6.  **Testing:** Every feature must include corresponding tests in `*.test.js` or `*.test.jsx`.

## Project Structure (Target)

```text
clinicdz/
├── CHANGELOG.md
├── src/
│   ├── main.jsx               
│   ├── App.jsx                
│   ├── adapter/               # Data persistence layer
│   ├── store/                 # Zustand state management
│   ├── data/                  # Default drugs/analyses data
│   ├── utils/                 # Pure business logic
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Route-level components
│   └── index.css              
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Critical Commands

-   `npm run dev`: Launches the Vite development server (exposed to `0.0.0.0`).
-   `npm run test`: Executes the Vitest test suite.
-   `npx tailwindcss init -p`: Initializes Tailwind (Step 1).

## Print System

The application uses specific `@media print` rules in `index.css` to format A5 portrait prescriptions and analyses. Ensure the `#print-area` is correctly targeted and all UI elements (sidebar, buttons) are hidden during printing.
