import { v4 as uuidv4 } from 'uuid';

export const defaultAnalyses = [
  // Hématologie
  { id: uuidv4(), nom: "NFS", categorie: "Hématologie" },
  { id: uuidv4(), nom: "VS", categorie: "Hématologie" },
  { id: uuidv4(), nom: "CRP", categorie: "Hématologie" },
  { id: uuidv4(), nom: "Groupage Rhésus", categorie: "Hématologie" },
  { id: uuidv4(), nom: "Taux de Prothrombine (TP)", categorie: "Hématologie" },
  { id: uuidv4(), nom: "TCA", categorie: "Hématologie" },
  { id: uuidv4(), nom: "Hémoglobine", categorie: "Hématologie" },
  // Biochimie
  { id: uuidv4(), nom: "Glycémie", categorie: "Biochimie" },
  { id: uuidv4(), nom: "Urée", categorie: "Biochimie" },
  { id: uuidv4(), nom: "Créatinine", categorie: "Biochimie" },
  { id: uuidv4(), nom: "Acide Urique", categorie: "Biochimie" },
  { id: uuidv4(), nom: "Ionogramme (Na, K, Cl)", categorie: "Biochimie" },
  // Lipides
  { id: uuidv4(), nom: "Cholestérol Total", categorie: "Lipides" },
  { id: uuidv4(), nom: "HDL", categorie: "Lipides" },
  { id: uuidv4(), nom: "LDL", categorie: "Lipides" },
  { id: uuidv4(), nom: "Triglycérides", categorie: "Lipides" },
  // Hépatique
  { id: uuidv4(), nom: "ASAT (GOT)", categorie: "Hépatique" },
  { id: uuidv4(), nom: "ALAT (GPT)", categorie: "Hépatique" },
  { id: uuidv4(), nom: "Gamma GT", categorie: "Hépatique" },
  { id: uuidv4(), nom: "Phosphatases Alcalines", categorie: "Hépatique" },
  { id: uuidv4(), nom: "Bilirubine Totale", categorie: "Hépatique" },
  // Thyroïde
  { id: uuidv4(), nom: "TSH", categorie: "Thyroïde" },
  { id: uuidv4(), nom: "T4 Libre", categorie: "Thyroïde" },
  // Infectieux
  { id: uuidv4(), nom: "Sérologie VIH", categorie: "Infectieux" },
  { id: uuidv4(), nom: "Antigène HBs", categorie: "Infectieux" },
  { id: uuidv4(), nom: "Sérologie HCV", categorie: "Infectieux" },
  { id: uuidv4(), nom: "Widal", categorie: "Infectieux" },
  { id: uuidv4(), nom: "BW", categorie: "Infectieux" },
  // Fer
  { id: uuidv4(), nom: "Ferritine", categorie: "Fer" },
  { id: uuidv4(), nom: "Fer Sérique", categorie: "Fer" },
  // Hormonaux
  { id: uuidv4(), nom: "FSH", categorie: "Hormonaux" },
  { id: uuidv4(), nom: "LH", categorie: "Hormonaux" },
  { id: uuidv4(), nom: "Estradiol", categorie: "Hormonaux" },
  { id: uuidv4(), nom: "Progestérone", categorie: "Hormonaux" },
  { id: uuidv4(), nom: "Prolactine", categorie: "Hormonaux" },
  { id: uuidv4(), nom: "Cortisol", categorie: "Hormonaux" },
  // Imagerie
  { id: uuidv4(), nom: "Radiographie Thoracique", categorie: "Imagerie" },
  { id: uuidv4(), nom: "Échographie Abdominale", categorie: "Imagerie" },
  { id: uuidv4(), nom: "Échographie Pelvienne", categorie: "Imagerie" },
  { id: uuidv4(), nom: "ECG", categorie: "Imagerie" },
  { id: uuidv4(), nom: "Mammographie", categorie: "Imagerie" },
];
