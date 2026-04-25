# ClinicDZ Project Map

## Core Philosophy
Offline-first, React 18 + Vite, Tailwind CSS, Zustand state management. 
Strict adherence to French UI and A5 print layouts.

## Architecture
- `src/adapter/`: Data persistence layer (localStorage wrapper).
- `src/store/`: Zustand state management (single source of truth).
- `src/utils/`: Pure business logic (age calculations, date formatting, import/export).
- `src/pages/`: Route-level components.
- `src/data/`: Static reference data (drugs, analyses).

## Key Files & Logic
- **`storage.js`**: NEVER call `localStorage` directly in components. All data must go through here.
- **`useStore.js`**: Reactive state management. Must call `storage.saveData()` on any change.
- **`calculations.js`**: Core utility for business logic. Used across Ordonnance, Analyses, and Patients pages.

## Workflow Rules
1. **Step-Gating**: Follow `AGENT.md` sequentially.
2. **Persistence**: Use relational data structure (patientId linking).
3. **Print CSS**: All printable areas are wrapped in `#print-area` in `index.css`.
4. **Validation**: Use Zod + React Hook Form for all inputs.
5. **Formatting**: Nom/Prénom must be forced to uppercase. Date format is JJ/MM/AAAA.
