import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import EmptyState from '../components/EmptyState';
import PatientAvatar from '../components/PatientAvatar';
import { calculateReste } from '../utils/calculations';

export default function Consultations() {
  const navigate = useNavigate();
  const { consultations, patients, deleteConsultation } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('nom');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredConsultations = consultations.filter((c) => {
    const patient = patients.find((p) => p.id === c.patientId);
    const patientName = patient ? `${patient.nom} ${patient.prenom}`.toLowerCase() : '';

    if (filterType === 'nom') return patientName.includes(searchTerm.toLowerCase());
    if (filterType === 'motif') return c.motif?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'date') return c.date?.includes(searchTerm);
    return true;
  });

  const totalPages = Math.ceil(filteredConsultations.length / rowsPerPage);
  const paginatedConsultations = filteredConsultations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      deleteConsultation(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Liste des Consultations</h1>
        <button onClick={() => navigate('/consultations/new')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
          Nouvelle consultation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="font-medium">Filtrer sur:</span>
            {['nom', 'motif', 'date'].map((type) => (
              <label key={type} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" checked={filterType === type} onChange={() => { setFilterType(type); setCurrentPage(1); }} className="text-blue-600" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full p-2 border border-slate-300 rounded-lg" />
        </div>

        {paginatedConsultations.length > 0 ? (
          <>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Nom & Prénom</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Motif</th>
                  <th className="px-6 py-3">Montant</th>
                  <th className="px-6 py-3">Paiement</th>
                  <th className="px-6 py-3">Reste</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedConsultations.map((c) => {
                  const patient = patients.find((p) => p.id === c.patientId);
                  const reste = calculateReste(c.montant, c.paiement);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4"><PatientAvatar sexe={patient?.genre || 'Homme'} size="sm" /></td>
                      <td className="px-6 py-4 font-medium">{patient ? `${patient.nom} ${patient.prenom}` : 'Inconnu'}</td>
                      <td className="px-6 py-4">{c.date}</td>
                      <td className="px-6 py-4">{c.motif}</td>
                      <td className="px-6 py-4">{c.montant} DA</td>
                      <td className="px-6 py-4">{c.paiement} DA</td>
                      <td className={`px-6 py-4 font-bold ${reste > 0 ? 'text-red-600' : reste === 0 ? 'text-green-600' : 'text-slate-900'}`}>{reste} DA</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => navigate(`/consultations/${c.id}`)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800">Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm">
              <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="border rounded p-1">
                {[10, 25, 50].map(v => <option key={v} value={v}>{v} par page</option>)}
              </select>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50">Précédent</button>
                <span className="py-1">Page {currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50">Suivant</button>
              </div>
            </div>
          </>
        ) : <EmptyState title="Aucune consultation" description="Ajoutez une nouvelle consultation pour commencer." />}
      </div>
    </div>
  );
}
