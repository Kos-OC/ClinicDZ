import { useStore } from '../store/useStore';

export const exportToJson = () => {
  const state = useStore.getState();
  
  // Extract only data, exclude functions
  const dataToExport = {
    doctor: state.doctor,
    patients: state.patients,
    drugs: state.drugs,
    prescriptions: state.prescriptions,
    analyses: state.analyses,
    consultations: state.consultations,
  };

  const dataStr = JSON.stringify(dataToExport, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = `clinicdz_export_${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
