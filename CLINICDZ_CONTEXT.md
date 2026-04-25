# ClinicDZ — Project Context

## Overview
**ClinicDZ** is a free offline clinic management webapp for Algerian general practitioners. 100% French UI, A5 print layouts, offline-first with localStorage persistence.

- **Stack:** React 18 + Vite, Tailwind CSS, Zustand, React Router v6, React Hook Form + Zod, Headless UI, react-hot-toast
- **Repo:** `https://github.com/Kos-OC/ClinicDZ`
- **Local path:** `~/.openclaw/workspace/ClinicDZ/clinicdz/`
- **Spec:** `AGENT.md` (step-by-step execution), `PROJECT_MAP.md` (quick reference)
- **Target:** Phase 1 = offline React app. Phase 2 = Electron + SQLite migration (no rewriting of UI logic).

---

## Architecture

```
clinicdz/
├── src/
│   ├── adapter/storage.js          ← localStorage wrapper, clinicdz_ prefix
│   ├── store/useStore.js            ← Zustand, single source of truth
│   ├── data/
│   │   ├── defaultDrugs.js          ← 34 preloaded drugs
│   │   ├── defaultAnalyses.js       ← 40+ preloaded analyses grouped by category
│   │   └── defaultCertificates.js   ← 6 templates with {{PLACEHOLDER}} syntax
│   ├── utils/
│   │   ├── calculations.js           ← calculateAge(), formatFrenchDate()
│   │   ├── exportData.js             ← JSON export
│   │   ├── importData.js             ← JSON import with validation
│   │   └── certificates.js          ← renderCertificate(body, vars) → string
│   ├── pages/
│   │   ├── Statistiques.jsx          ← Dashboard / Accueil (default page)
│   │   ├── Patients.jsx             ← search + add modal (RHF+Zod)
│   │   ├── PatientDetail.jsx        ← inline edit + 3 history tabs
│   │   ├── Medicaments.jsx          ← full CRUD
│   │   ├── Ordonnance.jsx           ← patient+drug comboboxes, items list, print
│   │   ├── Analyses.jsx            ← categorized checkboxes, urgent, notes, print
│   │   ├── Certificats.jsx          ← 3-col: template list / form / live preview
│   │   └── Parametres.jsx           ← doctor profile + JSON export/import
│   └── components/EmptyState.jsx
├── index.css                        ← dark mode overrides + @media print
├── App.jsx                          ← collapsible sidebar + theme toggle + routes
└── package.json
```

---

## Data Model

All data flows through `storage.saveData()` via Zustand actions.

| Slice | Shape |
|-------|-------|
| `doctor` | `{ prenom, nom, specialite, adresse, telephone, cnasCasnos, piedDePage }` |
| `patients[]` | `{ id, nom, prenom, dateNaissance, genre, telephone, adresse }` — stored uppercase |
| `drugs[]` | `{ id, nom, dosage, forme, categorie, posologieDefaut }` |
| `prescriptions[]` | `{ id, patientId, patientName, date, items[], notes, type }` where `type` = `'ordonnance'` or `'analyse'` |
| `certificats[]` | `{ id, patientId, templateId, titre, date, contenuFinal, createdAt }` |
| `analyses[]` | static reference data (not history) |
| `theme` | `'light'` \| `'dark'` |

---

## Key Rules

1. **Never use localStorage directly** — go through `src/adapter/storage.js`
2. **Nom/Prénom** — forced uppercase in all forms and stored uppercase
3. **Date format** — always `DD/MM/AAAA` (French), stored as string
4. **Print** — all printable content in `#print-area` div. `Ctrl+P` globally bound. `@media print` hides sidebar, inputs, toasts.
5. **Validation** — React Hook Form + Zod on ALL forms, French error messages
6. **Auto-save** — every Zustand action calls `storage.saveData()` immediately
7. **Sequential execution** — follow AGENT.md steps in order, no skipping
8. **Changelog** — update `CHANGELOG.md` after every meaningful change

---

## Built Features

### UI
- **Collapsible sidebar** — toggle button shrinks 64px → 16px (icon-only mode)
- **Dark/Light theme** — 🌙/☀️ toggle at sidebar bottom, persisted in Zustand, applied via `document.documentElement.className`
- **Toast notifications** — on every save operation

### Pages
- **Accueil (Statistiques)** — overview cards, "Ce mois-ci" banner, monthly bar chart (6 months), age group distribution, top prescribed drugs
- **Patients** — search by nom/prénom, add via modal, uppercase enforced, DD/MM/AAAA validation
- **PatientDetail** — inline edit form, 3 history tabs (Ordonnances / Analyses / Certificats), "Réimprimer" for certificates
- **Medicaments** — full CRUD with search
- **Ordonnance** — patient + drug comboboxes, dynamic items list, notes, type:'ordonnance' on save
- **Analyses** — categorized checkboxes, urgent flag, notes field, `addAnalyse()` saves with type:'analyse'
- **Certificats** — 6 templates, 3-column layout (template picker / form / live A5 preview), `renderCertificate()` resolves all `{{PLACEHOLDER}}`
- **Parametres** — doctor profile, JSON data export/import with confirmation

### Certificate Templates (defaultCertificates.js)
Uses `{{PLACEHOLDER}}` syntax. Auto-resolved (never shown as form fields): `{{NOM_PATIENT}}`, `{{AGE}}`, `{{SEXE_ARTICLE}}` (M. / Mme), `{{DATE}}`, `{{NOM_MEDECIN}}`, `{{SPECIALITE}}`. Required per-template: `DATE_DEBUT`, `DATE_FIN`, `NOMBRE_JOURS`, `MOTIF`.

Templates: Arrêt de travail, Certificat de bonne santé, Contre-indication au sport, Aptitude physique, Nécessité d'hospitalisation, Suivi médical.

---

## Git Workflow

**Push:**
```bash
git add -A && git commit -m "message"
GIT_ASKPASS=echo git push https://Kos-OC:$(gh auth token)@github.com/Kos-OC/ClinicDZ.git HEAD:master
```

**Pull:**
```bash
GIT_ASKPASS=echo git pull https://Kos-OC:$(gh auth token)@github.com/Kos-OC/ClinicDZ.git HEAD:master
```

---

## Commands

```bash
cd ClinicDZ/clinicdz
npm run dev    # dev server exposed on 0.0.0.0:5173
npm run test   # vitest --run
```

---

## For Other AIs

If adding a feature:
1. Read `AGENT.md` — follow the spec sequentially
2. Read `PROJECT_MAP.md` — architecture reference
3. Business logic goes in `src/utils/`, state changes in `src/store/useStore.js`
4. New pages go in `src/pages/`, reusable components in `src/components/`
5. Tests alongside features in `*.test.js` / `*.test.jsx`
6. Update `CHANGELOG.md` after every change
7. Follow the data model and naming conventions already established