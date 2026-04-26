import { useStore } from '../store/useStore';

export const importFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        
        // Basic validation of required fields
        const requiredFields = ['doctor', 'patients', 'drugs', 'prescriptions', 'analyses', 'consultations'];
        const hasAllFields = requiredFields.every(field => Object.prototype.hasOwnProperty.call(json, field));

        if (hasAllFields && Array.isArray(json.patients) && Array.isArray(json.drugs) && Array.isArray(json.consultations)) {
          useStore.getState().importState(json);
          resolve(true);
        } else {
          reject(new Error('Format de fichier invalide. Les données essentielles sont manquantes.'));
        }
      } catch (err) {
        reject(new Error('Erreur lors du traitement du fichier JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsText(file);
  });
};
