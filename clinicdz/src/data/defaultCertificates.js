import { v4 as uuidv4 } from 'uuid';

export const defaultCertificates = [
  {
    id: 'certificat-bonne-sante',
    titre: 'Certificat de bonne santé',
    description: 'Atteste de l\'état de santé général du patient',
    requiredFields: [],
    body: `Je soussigné, Dr {{NOM_MEDECIN}}, {{SPECIALITE}}, certifie avoir examiné ce jour M./Mme {{NOM_PATIENT}}, {{AGE}} ans, et attesté qu\'elle/il est en bonne santé et apte à exercer toute activité.`
  },
  {
    id: 'arret-travail',
    titre: 'Arrêt de travail',
    description: 'Justificatif d\'incapacité temporaire de travail',
    requiredFields: ['DATE_DEBUT', 'DATE_FIN', 'NOMBRE_JOURS', 'MOTIF'],
    body: `Je soussigné, Dr {{NOM_MEDECIN}}, {{SPECIALITE}}, certifie que M./Mme {{NOM_PATIENT}}, {{AGE}} ans, {{SEXE_ARTICLE}} retenu(e) incapable(e) de travailler pour une durée de {{NOMBRE_JOURS}} jours, du {{DATE_DEBUT}} au {{DATE_FIN}}, pour le motif suivant : {{MOTIF}}.`
  },
  {
    id: 'contre-indication-sport',
    titre: 'Contre-indication au sport',
    description: 'Certificat de contre-indication à la pratique sportive',
    requiredFields: ['MOTIF', 'DATE_FIN'],
    body: `Je soussigné, Dr {{NOM_MEDECIN}}, {{SPECIALITE}}, certifie que M./Mme {{NOM_PATIENT}}, {{AGE}} ans, {{SEXE_ARTICLE}} en incapacité de pratiquer toute activité sportive jusqu\'au {{DATE_FIN}}, pour le motif suivant : {{MOTIF}}.`
  },
  {
    id: 'certificat-aptitude',
    titre: 'Certificat d\'aptitude physique',
    description: 'Atteste de l\'aptitude physique du patient',
    requiredFields: [],
    body: `Je soussigné, Dr {{NOM_MEDECIN}}, {{SPECIALITE}}, certifie avoir examiné ce jour M./Mme {{NOM_PATIENT}}, {{AGE}} ans, et attesté qu\'elle/il est apte sur le plan médical à la pratique de l\'activité sollicitée.`
  },
  {
    id: 'certificat-hospitalisation',
    titre: 'Certificat de nécessité d\'hospitalisation',
    description: 'Justifie la nécessité d\'une hospitalisation',
    requiredFields: ['MOTIF'],
    body: `Je soussigné, Dr {{NOM_MEDECIN}}, {{SPECIALITE}}, certifie que M./Mme {{NOM_PATIENT}}, {{AGE}} ans, {{SEXE_ARTICLE}} nécessité une hospitalisation pour le motif suivant : {{MOTIF}}.`
  },
  {
    id: 'certificat-suivi',
    titre: 'Certificat de suivi médical',
    description: 'Atteste du suivi médical régulier du patient',
    requiredFields: ['MOTIF'],
    body: `Je soussigné, Dr {{NOM_MEDECIN}}, {{SPECIALITE}}, certifie que M./Mme {{NOM_PATIENT}}, {{AGE}} ans, {{SEXE_ARTICLE}} suivi(e) régulièrement au cabinet pour le motif suivant : {{MOTIF}}.`
  }
];