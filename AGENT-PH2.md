# ClinicDZ — Phase 2 Integration Plan (Agent Instructions)

You are an expert React developer continuing the development of ClinicDZ.
Phase 1 is complete. You are now executing Phase 2: integrating a Consultations module
and enriching the Patient profile, inspired by a reference app (screenshots provided separately).

The app UI stays 100% in French. All code, comments, and this document are in English.

---

## ⚠️ RULES OF ENGAGEMENT — STRICT COMPLIANCE REQUIRED ⚠️

- **NO SCOPE CREEP:** Do not add features, libraries, or files not explicitly listed here.
- **STEP-GATING:** Execute steps sequentially. Do NOT start the next step until the current one is 100% done.
- **DEFINITION OF DONE:** A step is complete only when:
  - All files for that step are created or modified.
  - `npm run test` passes with no failing tests.
  - `npm run dev` launches without errors.
  - `CHANGELOG.md` is updated.
- **FAILURE HANDLING:** If a test fails or the app crashes, STOP. Fix it. Do not proceed.
- **NO NEW LIBRARIES:** Do not install any package not already in `package.json`.
- **NO DIRECT localStorage:** All reads/writes go through `src/adapter/storage.js` only.
- **FRENCH UI:** Every label, placeholder, button, toast, error message, and heading visible to the user must be in French.

---

## 🎯 Global Rules (unchanged from Phase 1)

- Framework: React 18 + Vite
- Styling: Tailwind CSS — sidebar `bg-slate-900`, content area `bg-gray-50`
- UI Components: Headless UI for all modals, dropdowns, comboboxes
- Forms: React Hook Form + Zod — French error messages
- Notifications: React Hot Toast
- State: Zustand — auto-save on every mutation, success toast on save
- Routing: React Router DOM v6
- Testing: Vitest + React Testing Library
- Business logic: `src/utils/` only — never inside components

---

## 📁 New and Modified Files (Phase 2)

```
src/
├── adapter/
│   └── storage.js                  ← NO CHANGE
├── store/
│   └── useStore.js                 ← ADD consultations slice
├── utils/
│   ├── calculations.js             ← ADD calculateBMI, formatCurrency
│   └── calculations.test.js        ← ADD tests for new utils
├── data/
│   └── wilayas.js                  ← NEW: list of 58 Algerian wilayas
├── components/
│   ├── EmptyState.jsx              ← NO CHANGE
│   ├── PatientAvatar.jsx           ← NEW: generic M/F icon component
│   └── TabPanel.jsx                ← NEW: reusable tab container
├── pages/
│   ├── Patients.jsx                ← MODIFY: add columns, filters, richer form
│   ├── PatientDetail.jsx           ← MODIFY: show new fields
│   ├── Consultations.jsx           ← NEW: list of all consultations
│   ├── ConsultationDetail.jsx      ← NEW: full consultation form (tabbed)
│   ├── Analyses.jsx                ← MODIFY: new click-to-add UX
│   └── Ordonnance.jsx              ← MODIFY: accept consultationId context
└── App.jsx                         ← MODIFY: add new routes + sidebar entries
```

---

## 🛠️ Step-by-Step Execution

---

### Step 1 — Data Layer: Wilayas + Consultation Schema

**1a. Create `src/data/wilayas.js`**

Export a sorted array of the 58 Algerian wilayas as strings (French names):

```js
export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna",
  "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou",
  "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine",
  "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
  "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
  "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam",
  "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];
```

**1b. Extend `src/store/useStore.js` — add `consultations` slice**

Add to the existing Zustand store (do NOT rewrite the full store — only add):

```js
// Inside the store object, alongside patients, drugs, prescriptions:
consultations: storage.getData('consultations') || [],

addConsultation: (consultation) => set((state) => {
  const updated = [...state.consultations, consultation];
  storage.saveData('consultations', updated);
  return { consultations: updated };
}),

updateConsultation: (id, data) => set((state) => {
  const updated = state.consultations.map(c => c.id === id ? { ...c, ...data } : c);
  storage.saveData('consultations', updated);
  return { consultations: updated };
}),

deleteConsultation: (id) => set((state) => {
  const updated = state.consultations.filter(c => c.id !== id);
  storage.saveData('consultations', updated);
  return { consultations: updated };
}),
```

**Consultation data schema:**

```js
{
  id: uuid(),
  patientId: string,           // FK → patient.id
  date: string,                // 'YYYY-MM-DD'
  motif: string,               // reason for visit
  antecedents: string,         // medical history (pre-filled from patient)
  diagnostic: string,          // doctor's diagnosis
  examenClinique: string,      // clinical exam result

  // Vital signs
  poids: number | null,        // kg
  taille: number | null,       // cm
  imc: number | null,          // auto-calculated: poids/(taille/100)^2
  temperature: number | null,  // °C
  frequenceCardiaque: number | null, // bpm
  pressionArterielle: string,  // e.g. "12/8"
  observation: string,

  // Next appointment
  prochainRdv: string | null,  // 'YYYY-MM-DD'
  notesRdv: string,

  // Payment
  montant: number,             // consultation fee
  paiement: number,            // amount paid
  // 'reste' is always computed: montant - paiement — never stored

  createdAt: string,           // ISO timestamp
}
```

**Write tests in `src/store/useStore.test.js`:**
- Test `addConsultation` adds to the array and persists.
- Test `updateConsultation` modifies the correct record.
- Test `deleteConsultation` removes by id.

**Update `CHANGELOG.md`.**

---

### Step 2 — Utils: BMI + Currency

**Modify `src/utils/calculations.js` — add two pure functions:**

```js
// Calculate BMI from weight (kg) and height (cm)
// Returns null if either value is missing or zero
export function calculateBMI(poids, taille) {
  if (!poids || !taille || taille === 0) return null;
  return Math.round((poids / Math.pow(taille / 100, 2)) * 10) / 10;
}

// Calculate remaining balance
// Returns montant - paiement, floored at 0 for display but stored as-is
export function calculateReste(montant, paiement) {
  return (Number(montant) || 0) - (Number(paiement) || 0);
}
```

**Write tests in `src/utils/calculations.test.js`:**
- `calculateBMI(70, 175)` → `22.9`
- `calculateBMI(0, 175)` → `null`
- `calculateBMI(70, 0)` → `null`
- `calculateReste(1500, 1000)` → `500`
- `calculateReste(1000, 1500)` → `-500`

**Update `CHANGELOG.md`.**

---

### Step 3 — New Shared Components

**3a. Create `src/components/PatientAvatar.jsx`**

A small presentational component. Renders a simple colored circle with an icon based on sex.

Props: `{ sexe: 'Homme' | 'Femme', size?: 'sm' | 'md' }` (default `'md'`)

- `'md'`: `w-10 h-10` circle
- `'sm'`: `w-8 h-8` circle
- Male: `bg-blue-100 text-blue-600`
- Female: `bg-pink-100 text-pink-600`
- Use a simple SVG person icon inline (no external icon library).

```jsx
// Example output for Homme md:
<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
  <svg ...person icon... className="w-5 h-5 text-blue-600" />
</div>
```

**3b. Create `src/components/TabPanel.jsx`**

A reusable tab container using Headless UI `Tab` components.

Props:
```js
{
  tabs: [{ label: string, content: ReactNode }]
}
```

Renders a `Tab.Group` with a horizontal `Tab.List` styled with `border-b border-gray-200` and individual tabs styled as:
- Default: `px-4 py-2 text-sm text-gray-500 hover:text-gray-700`
- Selected: `border-b-2 border-blue-600 text-blue-600 font-medium`

**Update `CHANGELOG.md`.**

---

### Step 4 — Extend Patient Module

**Modify `src/pages/Patients.jsx`**

**4a. Extend the "Ajouter un patient" modal form** — add these optional fields below the existing required ones. All new fields are optional (no Zod `required`).

New fields to add to the Zod schema and form:
```js
telephone: z.string().optional(),
email: z.string().email({ message: "Email invalide" }).optional().or(z.literal('')),
wilaya: z.string().optional(),
groupeSanguin: z.enum(['A+','A-','B+','B-','AB+','AB-','O+','O-','']).optional(),
etatCivil: z.enum(['Célibataire','Marié(e)','Divorcé(e)','Veuf/Veuve','']).optional(),
assurance: z.enum(['Non assuré(e)','Assuré(e)','CNAS','CASNOS','']).optional(),
profession: z.string().optional(),
moyenContact: z.enum(['Téléphone','Email','Ami','Famille','']).optional(),
notes: z.string().optional(),
```

Wilaya field: use a `<select>` populated from `src/data/wilayas.js`. First option: `"-- Wilaya --"` (empty string value).

**4b. Update patient table columns:**

Replace current columns with:
`Image | Nom & Prénom | Âge | Sexe | GS | Mobile | Email | Wilaya | Actions`

- `Image` column: render `<PatientAvatar sexe={p.sexe} size="sm" />`
- `GS` column: display `groupeSanguin` or `—` if empty
- `Wilaya` column: display `wilaya` or `—` if empty
- Actions: three icon buttons — Info (navigate to detail), Edit (open edit modal), Delete (window.confirm)

**4c. Add filter radio buttons** above the table:

`Filtrer sur: ● Nom & Prénom ○ Âge ○ Sexe ○ Wilaya`

The search input filters against the selected field. Age filter: numeric match on calculated age.

**4d. Add edit modal** — same form as add modal, pre-filled with existing patient data. Triggered by the Edit button. On save: call `updatePatient` in the store.

**Write tests in `src/pages/Patients.test.jsx`:**
- Test that the filter by Nom & Prénom still works.
- Test that filter by Wilaya filters correctly.

**Modify `src/pages/PatientDetail.jsx`:**
- Display all new fields if they have values (use a definition list `<dl>` layout).
- Show `PatientAvatar` at the top of the profile card.

**Update `CHANGELOG.md`.**

---

### Step 5 — Consultations List Page

**Create `src/pages/Consultations.jsx`**

This page lists ALL consultations across all patients.

**Layout:**
- Page title: `"Liste des Consultations"`
- Search input + "Nettoyer" button
- Filter radio: `● Nom & Prénom ○ Motif ○ Date`
- "Nouvelle consultation" button → navigates to `/consultations/new`
- Table with columns: `Image | Nom & Prénom | Date | Motif | Montant | Paiement | Reste | Actions`

**Table behavior:**
- `Image`: render `<PatientAvatar>` using the linked patient's sex (look up patient by `patientId`).
- `Nom & Prénom`: resolved from `patients` store by `patientId`.
- `Date`: formatted as `DD/MM/YYYY`.
- `Montant`, `Paiement`: display as numbers suffixed with ` DA`.
- `Reste`: computed with `calculateReste(montant, paiement)` — display in red if negative, green if zero, black otherwise.
- Actions: Edit button (navigate to `/consultations/:id`) + Delete button (`window.confirm`).

**Pagination:**
- "Par page" `<select>` with options `[10, 25, 50]`.
- Show current page indicator and prev/next buttons.
- Implement pagination in pure JS (slice the filtered array — no library).

**Empty state:** If no consultations, render `<EmptyState title="Aucune consultation" description="Ajoutez une nouvelle consultation pour commencer." />`

**Write tests in `src/pages/Consultations.test.jsx`:**
- Test search filter by patient name.
- Test that `Reste` displays correctly.

**Update `CHANGELOG.md`.**

---

### Step 6 — Consultation Detail Page (Tabbed Form)

**Create `src/pages/ConsultationDetail.jsx`**

This is the most complex page in Phase 2. It handles both creating (`/consultations/new`) and editing (`/consultations/:id`) a consultation.

**Header bar (always visible, above tabs):**
```
Patient : [NOM Prénom]    Âge : [X ans]          date: [date input]    [Sauvegarder button]
```
- Patient is selected via a Headless UI `Combobox` (same pattern as `Ordonnance.jsx`).
- Date defaults to today in `YYYY-MM-DD` format.
- "Sauvegarder" button: validates with RHF+Zod and calls `addConsultation` or `updateConsultation`.

**Action buttons row (below header, above tabs):**
```
[Ordonnance] [Bilan] [Arrêt de travail] [Certificat Médical] [Lettre d'orientation]
```
All buttons are `bg-blue-600 text-white` with a small icon prefix.
- **Ordonnance**: navigate to `/ordonnance?patientId=X&consultationId=Y`
- **Bilan**: open `<BilanModal>` (see Step 7)
- **Arrêt de travail**: open `<ArretTravailModal>` (see Step 7)
- **Certificat Médical**: open `<CertificatModal>` (see Step 7)
- **Lettre d'orientation**: open `<LettreOrientationModal>` (see Step 7)

**Tabs** (use `<TabPanel>` component from Step 3):

**Tab 1 — Fiche de consultation**

Two-column layout: left column (general) + right column (constantes vitales).

Left column fields (all optional, `<textarea>` or `<input>`):
- `Motif` — text input, placeholder `"Le motif de la consultation"`
- `Antécédents` — textarea, placeholder `"Les antécédents"`, pre-filled from `patient.antecedents`
- `Diagnostic médical` — textarea, placeholder `"Le diagnostique"`
- `Résultat de l'examen clinique` — textarea, placeholder `"Examen clinique"`

Right column — "Constantes vitales" section heading:

| Label | Field | Type | Notes |
|---|---|---|---|
| Poids (Kg) | `poids` | number input | placeholder `"Le poids en Kg"` |
| Taille (Cm) | `taille` | number input | placeholder `"La taille en Cm"` |
| IMC | `imc` | read-only input | auto-computed via `calculateBMI` on poids/taille change |
| Température (°C) | `temperature` | number input | placeholder `"La température en Celsius"` |
| Fréquence cardiaque | `frequenceCardiaque` | number input | placeholder `"Ex : 70"` |
| Pression artérielle | `pressionArterielle` | text input | placeholder `"Ex : 12/8"` |
| Observation | `observation` | textarea | placeholder `"Remarques ..."` |

IMC auto-calculation: use a `useEffect` that watches `poids` and `taille` via `watch()` from RHF, calls `calculateBMI`, and calls `setValue('imc', result)`.

**Tab 2 — Informations**

Display-only tab for now. Shows patient full profile (all fields from the extended patient form). Read from `patients` store by `patientId`. Use `<dl>` layout, two columns.

**Tab 3 — Prochain RDV**

- `Prochain RDV` — date input (`prochainRdv`)
- `Notes RDV` — textarea (`notesRdv`)

**Tab 4 — Paiement**

Three fields:
- `Montant de la consultation (DA)` — number input (`montant`), placeholder `"0"`
- `Montant payé (DA)` — number input (`paiement`), placeholder `"0"`
- `Reste (DA)` — read-only input, auto-computed from `montant - paiement`, colored red if negative

Same auto-calculation pattern as IMC: `useEffect` watching `montant` and `paiement`.

**Zod schema for the whole form:**
```js
z.object({
  patientId: z.string().min(1, { message: "Veuillez sélectionner un patient" }),
  date: z.string().min(1, { message: "La date est requise" }),
  motif: z.string().optional(),
  antecedents: z.string().optional(),
  diagnostic: z.string().optional(),
  examenClinique: z.string().optional(),
  poids: z.coerce.number().nullable().optional(),
  taille: z.coerce.number().nullable().optional(),
  imc: z.coerce.number().nullable().optional(),
  temperature: z.coerce.number().nullable().optional(),
  frequenceCardiaque: z.coerce.number().nullable().optional(),
  pressionArterielle: z.string().optional(),
  observation: z.string().optional(),
  prochainRdv: z.string().optional(),
  notesRdv: z.string().optional(),
  montant: z.coerce.number().default(0),
  paiement: z.coerce.number().default(0),
})
```

**On save:**
- Compute `imc` via `calculateBMI` before saving.
- Generate `id: uuid()` and `createdAt: new Date().toISOString()` for new records.
- Call `addConsultation` or `updateConsultation`.
- Show success toast: `"Consultation enregistrée"`
- Navigate to `/consultations` after save.

**Write tests in `src/pages/ConsultationDetail.test.jsx`:**
- Test BMI auto-calculates when poids and taille are entered.
- Test Reste auto-calculates from montant and paiement.
- Test form submission calls `addConsultation`.

**Update `CHANGELOG.md`.**

---

### Step 7 — Action Modals (Print Documents)

Create four modal components inside `src/components/`. Each modal:
- Is a Headless UI `Dialog`.
- Has a `#print-area` wrapper so the existing print CSS applies.
- Has "Annuler" and "Imprimer" buttons. "Imprimer" calls `window.print()`.
- Receives `patient` and `doctor` objects as props.
- All rendered content is French.

**7a. Create `src/components/BilanModal.jsx`**

This replaces opening `Analyses.jsx` in a new page — it's the same content as the existing Analyses page but wrapped in a Dialog modal.

UI changes from the existing `Analyses.jsx` checkbox UX:
- Left panel: a text input `"Filtrer par nom de test"` filtering the analyses list in real-time.
- Left panel list: renders all matching analyses as clickable `<li>` items. Single click → adds to the selected list (right panel).
- Right panel: `"La liste des tests à faire"` — a numbered list of selected analyses. Double-click on an item → removes it. Show hint: `"Cliquer 2 fois sur le test pour le supprimer"`
- "URGENT" checkbox remains.
- Custom text input remains.
- On "Sauvegarder": call `addPrescription` with `{ type: 'analyse', patientId, date, items, urgent, custom }` and close the modal.

Props: `{ isOpen, onClose, patient }`

**7b. Create `src/components/ArretTravailModal.jsx`**

A simple print modal with a form and print preview.

Fields (RHF, no Zod needed — all optional):
- `duree` — number input, label `"Durée (jours)"`, placeholder `"3"`
- `dateDebut` — date input, label `"Date de début"`, default today
- `motif` — textarea, label `"Motif"`

`#print-area` renders an A5 document:
- Header: doctor info (from `doctor` store)
- Title: `"CERTIFICAT D'ARRÊT DE TRAVAIL"`
- Body: `"Je soussigné(e), Dr [Nom], certifie que l'état de santé de [Patient Nom Prénom] nécessite un arrêt de travail de [durée] jour(s) à compter du [dateDebut]."` followed by Motif.
- Footer: date + signature space

Props: `{ isOpen, onClose, patient }`

**7c. Create `src/components/CertificatModal.jsx`**

Fields:
- `motif` — textarea, label `"Objet du certificat"`

`#print-area` renders:
- Header: doctor info
- Title: `"CERTIFICAT MÉDICAL"`
- Body: `"Je soussigné(e), Dr [Nom], certifie avoir examiné ce jour [Patient Nom Prénom], âgé(e) de [âge] ans. [motif]"`
- Footer: date + signature space

Props: `{ isOpen, onClose, patient }`

**7d. Create `src/components/LettreOrientationModal.jsx`**

Fields:
- `confrere` — text input, label `"Confrère / Spécialiste"`, placeholder `"Dr ..."`
- `motif` — textarea, label `"Motif de l'orientation"`

`#print-area` renders:
- Header: doctor info
- Title: `"LETTRE D'ORIENTATION"`
- Body: `"Cher(e) confrère/consoeur, Je me permets de vous adresser notre patient(e) [Nom], âgé(e) de [âge] ans, pour [motif]."`
- Footer: date + signature space

Props: `{ isOpen, onClose, patient }`

**No tests required for modal print components.** Only visual/manual verification needed.

**Update `CHANGELOG.md`.**

---

### Step 8 — Analyses UX Upgrade

**Modify `src/pages/Analyses.jsx`**

Replace the current checkbox-based analysis selection with the new click-to-add UX (same as `BilanModal` above, but as a standalone page).

UI layout: two-panel side by side.
- Left panel: text filter input + scrollable list of all analyses (grouped by category, category name as a small gray heading). Single click adds to the right panel. Already-selected items appear dimmed on the left.
- Right panel: numbered list of selected analyses. Double-click removes. Hint text at the bottom.

Keep the existing "URGENT" checkbox, custom text input, patient selector, date input, and "Imprimer" button.

**Update tests in `src/pages/Analyses.test.jsx`** (or create if missing):
- Test that clicking an analysis adds it to the selected list.
- Test that double-clicking removes it.

**Update `CHANGELOG.md`.**

---

### Step 9 — Routing & Sidebar

**Modify `src/App.jsx`**

**Add routes:**
```jsx
<Route path="/consultations" element={<Consultations />} />
<Route path="/consultations/new" element={<ConsultationDetail />} />
<Route path="/consultations/:id" element={<ConsultationDetail />} />
```

**Update the sidebar** — add a "Consultations" section between "Patients" and "Ordonnance":

```
Patients
  └─ Liste des patients
  └─ Ajouter un patient
Consultations                  ← NEW section
  └─ Liste des Consultations   ← navigates to /consultations
  └─ Ajouter une Consultation  ← navigates to /consultations/new
Ordonnance
Analyses
Médicaments
Paramètres
```

The sidebar section uses the same collapsible pattern if already implemented, or a plain nested `<ul>` with `pl-4` indentation for sub-items.

Active route: use `NavLink` with `className={({ isActive }) => isActive ? 'bg-slate-700 ...' : '...'}`.

**Update `CHANGELOG.md`.**

---

### Step 10 — Final Testing & Polish

1. Run the full test suite: `npm run test` — zero failing tests required.
2. Run `npm run dev` — no console errors on any page.
3. Manually verify:
   - Adding a patient with all new fields saves and displays correctly.
   - Creating a consultation with vital signs auto-calculates BMI.
   - Payment tab auto-calculates Reste.
   - BilanModal opens from the consultation page and saves an analysis.
   - Arrêt de travail, Certificat, and Lettre d'orientation print correctly.
   - Analyses page click-to-add UX works.
   - Sidebar navigation to all new routes works.
4. Final `CHANGELOG.md` update — add `[1.1.0]` section.

---

## 🛑 Strict Limitations

- DO NOT install any new npm packages.
- DO NOT add a statistics page, appointment calendar, or cloud sync (Phase 3+).
- DO NOT use `localStorage` directly — only via `src/adapter/storage.js`.
- DO NOT modify `src/data/defaultDrugs.js` or `src/data/defaultAnalyses.js`.
- DO NOT change the existing print CSS in `src/index.css` — only extend it if needed for new print modals.
- All modal print documents use the existing `#print-area` + `@media print` system.
- The `exportData` / `importData` utils must export and import the new `consultations` array alongside existing data.

---

## 🔗 Key Data Relationships

```
patients[]          ←── patientId ──→  consultations[]
patients[]          ←── patientId ──→  prescriptions[]
consultations[]     (loosely linked)   prescriptions[]  (via consultationId optional)
doctor{}            ──────────────→  all print headers
```

`consultationId` is an optional field on prescriptions. When an Ordonnance or Bilan is created from within a consultation, pass `?consultationId=X` in the URL and store it on the prescription object. This enables future linking but is not displayed in Phase 2.