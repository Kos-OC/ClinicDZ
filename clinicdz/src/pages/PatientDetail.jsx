import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateAge } from '../utils/calculations';
import EmptyState from '../components/EmptyState';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, prescriptions, certificats } = useStore();

  const patient = patients.find((p) => p.id === id);
  const patientPrescriptions = prescriptions.filter((p) => p.patientId === id);
  const patientCertificats = certificats.filter((c) => c.patientId === id);

  if (!patient) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Patient non trouvé</h2>
        <button
          onClick={() => navigate('/patients')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => navigate('/patients')}
            className="text-slate-500 hover:text-slate-700 text-sm flex items-center mb-2"
          >
            ← Retour à la liste
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            {patient.nom} {patient.prenom}
          </h1>
          <div className="flex gap-4 mt-2 text-slate-600">
            <span>{patient.genre}</span>
            <span>•</span>
            <span>{calculateAge(patient.dateNaissance)} ans ({patient.dateNaissance})</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/certificats?patientId=${patient.id}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 shadow-sm"
          >
            Nouveau Certificat
          </Link>
          <Link
            to={`/ordonnance?patientId=${patient.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm"
          >
            Nouvelle Ordonnance
          </Link>
          <Link
            to={`/analyses?patientId=${patient.id}`}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900 shadow-sm"
          >
            Nouvelle Analyse
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">
              Coordonnées
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500">Téléphone</label>
                <p className="text-slate-900 font-medium">{patient.telephone || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block text-xs text-slate-500">Adresse</label>
                <p className="text-slate-900 font-medium">{patient.adresse || 'Non renseignée'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-900">
              Historique des Ordonnances
            </div>
            {patientCertificats.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Titre</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {patientCertificats.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">{cert.titre}</td>
                      <td className="px-6 py-4 text-slate-600">{cert.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            const printArea = document.getElementById('print-area');
                            if (printArea) {
                              printArea.innerHTML = cert.contenuFinal;
                              window.print();
                            }
                          }}
                          className="text-green-600 hover:text-green-800 font-medium text-sm"
                        >
                          Réimprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                title="Aucun certificat"
                description="Ce patient n'a pas encore de certificat médical."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
