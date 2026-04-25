import { create } from 'zustand';
import { storage } from '../adapter/storage';
import { defaultDrugs } from '../data/defaultDrugs';
import { defaultAnalyses } from '../data/defaultAnalyses';

const savedState = storage.loadData();

const initialState = {
  theme: savedState?.theme || 'light',
  doctor: savedState?.doctor || {
    prenom: '',
    nom: '',
    specialite: '',
    adresse: '',
    telephone: '',
    cnasCasnos: '',
    piedDePage: '',
  },
  patients: savedState?.patients || [],
  drugs: savedState?.drugs || defaultDrugs,
  prescriptions: savedState?.prescriptions || [],
  analyses: savedState?.analyses || defaultAnalyses,
  certificats: savedState?.certificats || [],
  consultations: savedState?.consultations || [],
};

export const useStore = create((set) => ({
  ...initialState,

  // Doctor Actions
  updateDoctor: (doctorInfo) => set((state) => {
    const newState = { ...state, doctor: { ...state.doctor, ...doctorInfo } };
    storage.saveData(newState);
    return newState;
  }),

  // Patient Actions
  addPatient: (patient) => set((state) => {
    const newState = { ...state, patients: [...state.patients, patient] };
    storage.saveData(newState);
    return newState;
  }),
  updatePatient: (updatedPatient) => set((state) => {
    const newState = {
      ...state,
      patients: state.patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    };
    storage.saveData(newState);
    return newState;
  }),
  deletePatient: (id) => set((state) => {
    const newState = {
      ...state,
      patients: state.patients.filter((p) => p.id !== id),
    };
    storage.saveData(newState);
    return newState;
  }),

  // Drug Actions
  addDrug: (drug) => set((state) => {
    const newState = { ...state, drugs: [...state.drugs, drug] };
    storage.saveData(newState);
    return newState;
  }),
  updateDrug: (updatedDrug) => set((state) => {
    const newState = {
      ...state,
      drugs: state.drugs.map((d) => (d.id === updatedDrug.id ? updatedDrug : d)),
    };
    storage.saveData(newState);
    return newState;
  }),
  deleteDrug: (id) => set((state) => {
    const newState = {
      ...state,
      drugs: state.drugs.filter((d) => d.id !== id),
    };
    storage.saveData(newState);
    return newState;
  }),

  // Prescription Actions
  addPrescription: (prescription) => set((state) => {
    const newState = { ...state, prescriptions: [...state.prescriptions, prescription] };
    storage.saveData(newState);
    return newState;
  }),
  addAnalyse: (analyse) => set((state) => {
    const newState = { ...state, prescriptions: [...state.prescriptions, { ...analyse, type: 'analyse' }] };
    storage.saveData(newState);
    return newState;
  }),

  // Certificat Actions
  addCertificat: (certificat) => set((state) => {
    const newState = { ...state, certificats: [certificat, ...state.certificats] };
    storage.saveData(newState);
    return newState;
  }),

  // Consultation Actions
  addConsultation: (consultation) => set((state) => {
    const newState = { ...state, consultations: [consultation, ...state.consultations] };
    storage.saveData(newState);
    return newState;
  }),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    const newState = { ...state, theme: newTheme };
    storage.saveData(newState);
    return newState;
  }),

  // General Actions
  resetStore: () => {
    const newState = {
      doctor: { prenom: '', nom: '', specialite: '', adresse: '', telephone: '', cnasCasnos: '', piedDePage: '' },
      patients: [],
      drugs: defaultDrugs,
      prescriptions: [],
      analyses: defaultAnalyses,
      certificats: [],
    };
    storage.saveData(newState);
    set(newState);
  },
  
  importState: (newState) => {
    storage.saveData(newState);
    set(newState);
  }
}));
