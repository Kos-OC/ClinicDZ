You are an expert React developer building ClinicDZ, a free offline clinic management webapp for Algerian general practitioners. You will execute Phase 1 only (a React web application). The app must be built so that it can be seamlessly wrapped in Electron and migrated to SQLite later without rewriting the UI logic.

⚠️ RULES OF ENGAGEMENT — STRICT COMPLIANCE REQUIRED ⚠️
NO SCOPE CREEP: Do not add features, libraries, or files not explicitly listed in this document.
STEP-GATING: Execute the plan sequentially. Do NOT move to the next step until the current step is 100% complete.
DEFINITION OF DONE: A step is only complete when:
All files for that step are created.
npm run test passes (no failing tests).
npm run dev launches without errors.
You have updated the CHANGELOG.md.
FAILURE HANDLING: If a test fails or the app crashes, STOP. Fix the error. Do not proceed to the next step with broken code.
NO HALLUCINATED IMPORTS: Only use libraries explicitly listed in Step 1.
FILE BOUNDARIES: Only create or modify files specified in the Project Structure.
🎯 Global Rules
Framework: React 18 + Vite.
Styling: Tailwind CSS. Clean professional colors: white, light gray, dark blue (bg-slate-900) for headers/sidebar.
UI Components: Use Headless UI (@headlessui/react) for modals, dropdowns, and comboboxes.
Forms & Validation: Use React Hook Form + Zod for all forms (Patient, Doctor, Prescriptions). Provide clear French error messages.
Notifications: Use React Hot Toast (react-hot-toast) for auto-save feedback and success/error messages.
Language: 100% French UI. Minimum font size: 14px.
State Management: Zustand.
Routing: React Router DOM v6.
Data Persistence: localStorage wrapped in a Storage Adapter. Do NOT use localStorage directly outside src/adapter/storage.js.
Data Structure: Structure data relationally (use id and patientId links) even in JSON.
Auto-save: Every change saves immediately via Zustand. Trigger a success toast on save.
Testing: Use Vitest + React Testing Library. Write tests alongside features.
Changelog: Maintain CHANGELOG.md at the project root. Update it after every step.
Business Logic: Keep calculations and pure logic in src/utils/, not inside React components.
Dev Server: The Vite dev server MUST be exposed to 0.0.0.0 so it can be accessed from a host machine.
📁 Project Structure
text

clinicdz/
├── CHANGELOG.md
├── src/
│   ├── main.jsx               
│   ├── App.jsx                
│   ├── adapter/
│   │   ├── storage.js         
│   │   └── storage.test.js
│   ├── store/
│   │   ├── useStore.js        
│   │   └── useStore.test.js
│   ├── data/
│   │   ├── defaultDrugs.js   
│   │   └── defaultAnalyses.js 
│   ├── utils/
│   │   ├── calculations.js    (e.g., age from dateNaissance)
│   │   ├── calculations.test.js
│   │   ├── exportData.js      (JSON export logic)
│   │   └── importData.js      (JSON import logic)
│   ├── components/
│   │   └── EmptyState.jsx     (Reusable empty state component)
│   ├── pages/
│   │   ├── Parametres.jsx     
│   │   ├── Patients.jsx       
│   │   ├── PatientDetail.jsx  
│   │   ├── Medicaments.jsx    
│   │   ├── Ordonnance.jsx     
│   │   └── Analyses.jsx       
│   └── index.css              
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
🛠️ Step-by-Step Execution
Step 1: Scaffolding & Dependencies
Create Vite project: npm create vite@latest clinicdz -- --template react
Install dependencies: npm install react-router-dom zustand uuid @headlessui/react react-hook-form @hookform/resolvers zod react-hot-toast
Install dev dependencies: npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
Initialize Tailwind: npx tailwindcss init -p
Configure tailwind.config.js to scan ./src/**/*.{js,jsx}.
Add test script to package.json: "test": "vitest"
Configure vite.config.js:
Add Vitest config: test: { environment: 'jsdom', globals: true }
Add server config: server: { host: '0.0.0.0', port: 5173 }
Create CHANGELOG.md with initial entry.
Step 2: Storage Adapter & Zustand Store
Create src/adapter/storage.js (localStorage wrapper with clinicdz_ prefix).
Create src/store/useStore.js using Zustand. It must call storage.saveData() on state changes. Slices: doctor, patients, drugs, prescriptions.
Create src/data/defaultDrugs.js and src/data/defaultAnalyses.js. Initialize store with these if empty.
Write tests for storage.test.js and useStore.test.js.
Update CHANGELOG.md.
Step 3: Utils & Business Logic
Create src/utils/calculations.js: Function to calculate age from dateNaissance.
Create src/utils/exportData.js: Function to gather all Zustand state and trigger a JSON file download.
Create src/utils/importData.js: Function to read a JSON file and overwrite Zustand state (with validation).
Write tests for calculations.test.js.
Update CHANGELOG.md.
Step 4: App Layout, Routing & Empty States
Create src/components/EmptyState.jsx (reusable component taking title and description props).
Create App.jsx with React Router, Sidebar (w-64 bg-slate-900 text-white), Main (flex-1 bg-gray-50 p-6), and <Toaster /> from react-hot-toast.
Set up routes for all pages.
Update CHANGELOG.md.
Step 5: Pages Implementation (Core CRUD)
1. Parametres.jsx

Form (React Hook Form + Zod). Fields: Prénom, Nom, Spécialité, Adresse, Téléphone, N° CNAS/CASNOS, Pied de page.
"Enregistrer" button. On save, trigger toast.
Add UI for "Exporter les données (JSON)" and "Importer les données (JSON)" using the utils from Step 3. Import must require confirmation.
2. Patients.jsx
- Search input (filters by nom or prénom).
- "Ajouter un patient" button -> Headless UI Dialog modal with RHF+Zod form.
- **Form Constraints:** 
    - Forced Uppercase for Nom and Prénom (visual + data).
    - Date of Birth: Text input with placeholder "JJ/MM/AAAA". 
    - **Validation:** Zod regex to ensure `DD/MM/YYYY` or `DD-MM-YYYY` format.
    - Optional toggle between providing Age or Date of Birth.
- Table of patients. If no patients, show EmptyState.
- Click patient -> /patients/:id. Delete -> window.confirm().

3. PatientDetail.jsx
- Display patient info (use calculations.js for age). 
- **Display:** Show formatted birth date (DD/MM/YYYY) and uppercase names.
- List prescription history (filtered by patientId). If empty, show EmptyState.
- **History Actions:** Ability to view/reprint previous prescriptions and analyses.
- Button to create new Ordonnance/Analyse.
4. Medicaments.jsx

Search bar, Table, Add/Edit/Delete. Use RHF+Zod for add/edit. Empty state if empty.
5. Ordonnance.jsx

Select Patient (Headless UI Combobox).
Date input.
Drug search (Headless UI Combobox).
Prescription items list: { drugId, nom, posologie, duree, quantite }. Option for "Médicament libre".
Notes field. RHF+Zod validation ensuring at least one item or note.
"Imprimer" button. Save to store on add/print.
6. Analyses.jsx

Select Patient, Date.
Checkboxes grouped by Category (from defaultAnalyses.js).
"URGENT" checkbox. Custom text input.
"Imprimer" button. Save to store.
Step 6: Print CSS (index.css)
Add @media print rules hiding sidebar, inputs, toasts, buttons. Show only #print-area.
Format A5 portrait. Header (Doctor info), Patient Info, Body (numbered list), Footer (piedDePage + signature space).
Bind Ctrl+P globally to window.print().
Step 7: Final Testing & Polish
Ensure Patients.test.jsx tests the search filter.
Ensure Ordonnance.test.jsx tests adding a drug to the list.
Run full test suite (npm run test). Ensure dev server runs cleanly.
Final CHANGELOG.md update.
💊 Pre-loaded Drug List (src/data/defaultDrugs.js)
Map into array: { id: uuid(), nom, dosage, forme, posologieDefaut, categorie }

text

Paracétamol | 500mg | Comprimé | Antalgique | 1 à 2 cp toutes les 6h, max 6/jour
Paracétamol | 1g | Comprimé | Antalgique | 1 cp toutes les 6h, max 4/jour
Ibuprofène | 400mg | Comprimé | Anti-inflammatoire | 1 cp 3 fois/jour pendant les repas
Amoxicilline | 500mg | Gélule | Antibiotique | 1 cp 3 fois/jour pendant 7 jours
Amoxicilline | 1g | Comprimé | Antibiotique | 1 cp 2 fois/jour pendant 7 jours
Amoxicilline + Ac. clavulanique | 1g | Comprimé | Antibiotique | 1 cp 2 fois/jour pendant 7 jours
Azithromycine | 250mg | Gélule | Antibiotique | 2 cp J1 puis 1 cp/jour J2-J5
Ciprofloxacine | 500mg | Comprimé | Antibiotique | 1 cp 2 fois/jour pendant 7 jours
Métronidazole | 500mg | Comprimé | Antibiotique | 1 cp 3 fois/jour pendant 7 jours
Cotrimoxazole | 480mg | Comprimé | Antibiotique | 2 cp 2 fois/jour pendant 7 jours
Oméprazole | 20mg | Gélule | IPP | 1 cp à jeun le matin
Oméprazole | 40mg | Gélule | IPP | 1 cp à jeun le matin
Lansoprazole | 30mg | Gélule | IPP | 1 cp à jeun le matin
Metformine | 500mg | Comprimé | Antidiabétique | 1 cp 2 fois/jour pendant les repas
Metformine | 850mg | Comprimé | Antidiabétique | 1 cp 2 fois/jour pendant les repas
Metformine | 1000mg | Comprimé | Antidiabétique | 1 cp 2 fois/jour pendant les repas
Glibenclamide | 5mg | Comprimé | Antidiabétique | 1 cp/jour avant le repas principal
Amlodipine | 5mg | Comprimé | Antihypertenseur | 1 cp/jour
Amlodipine | 10mg | Comprimé | Antihypertenseur | 1 cp/jour
Captopril | 25mg | Comprimé | Antihypertenseur | 1 cp 2 fois/jour
Losartan | 50mg | Comprimé | Antihypertenseur | 1 cp/jour
Aténolol | 50mg | Comprimé | Bêtabloquant | 1 cp/jour
Bisoprolol | 5mg | Comprimé | Bêtabloquant | 1 cp/jour
Furosémide | 40mg | Comprimé | Diurétique | 1 cp/jour le matin
Atorvastatine | 10mg | Comprimé | Statine | 1 cp/jour le soir
Atorvastatine | 20mg | Comprimé | Statine | 1 cp/jour le soir
Diclofénac | 50mg | Comprimé | Anti-inflammatoire | 1 cp 3 fois/jour pendant les repas
Prednisolone | 5mg | Comprimé | Corticoïde | Selon prescription médicale
Salbutamol | inhalateur | Inhalateur | Bronchodilatateur | 2 bouffées en cas de crise
Loratadine | 10mg | Comprimé | Antihistaminique | 1 cp/jour
Cétirizine | 10mg | Comprimé | Antihistaminique | 1 cp/jour le soir
Domperidone | 10mg | Comprimé | Antiémétique | 1 cp 3 fois/jour avant les repas
Vitamine D3 | 200000 UI | Ampoule | Supplément | 1 ampoule en prise unique
Fer + Acide folique | - | Comprimé | Supplément | 1 cp/jour pendant les repas
🔬 Pre-loaded Analyses List (src/data/defaultAnalyses.js)
Structure: { id: uuid(), nom, categorie }
Hématologie: NFS, VS, CRP, Groupage Rhésus, Taux de Prothrombine (TP), TCA, Hémoglobine
Biochimie: Glycémie, Urée, Créatinine, Acide Urique, Ionogramme (Na, K, Cl)
Lipides: Cholestérol Total, HDL, LDL, Triglycérides
Hépatique: ASAT (GOT), ALAT (GPT), Gamma GT, Phosphatases Alcalines, Bilirubine Totale
Thyroïde: TSH, T4 Libre
Infectieux: Sérologie VIH, Antigène HBs, Sérologie HCV, Widal, BW
Fer: Ferritine, Fer Sérique
Hormonaux: FSH, LH, Estradiol, Progestérone, Prolactine, Cortisol
Imagerie: Radiographie Thoracique, Échographie Abdominale, Échographie Pelvienne, ECG, Mammographie

🛑 Strict Limitations
DO NOT install electron, electron-store, or electron-builder.
DO NOT build cloud sync, statistics, appointment calendar, or data encryption (Phase 2 concerns).
DO NOT use localStorage directly outside of src/adapter/storage.js.
Start execution from Step 1 and proceed sequentially.