import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { calculateAge, formatFrenchDate } from '../utils/calculations';
import EmptyState from '../components/EmptyState';
import PatientAvatar from '../components/PatientAvatar';

const schema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  prenom: z.string().min(1, 'Prénom requis'),
  dateNaissance: z.string().optional(),
  age: z.string().optional(),
  genre: z.enum(['Masculin', 'Féminin']),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
});

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, prescriptions, certificats, updatePatient } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  const patient = patients.find((p) => p.id === id);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: patient
  });

  const onSubmit = (data) => {
    updatePatient({ ...data, id, nom: data.nom.toUpperCase(), prenom: data.prenom.toUpperCase(), dateNaissance: formatFrenchDate(data.dateNaissance) });
    toast.success('Patient mis à jour');
    setIsEditing(false);
  };
  const patientOrdonnances = prescriptions.filter((p) => p.patientId === id && p.type === 'ordonnance');
  const patientAnalyses = prescriptions.filter((p) => p.patientId === id && p.type === 'analyse');
  const patientCertificats = certificats.filter((c) => c.patientId === id);
  const { consultations } = useStore();
  const patientConsultations = consultations.filter((c) => c.patientId === id);

  if (!patient) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Patient non trouvé</h2>
        <button onClick={() => navigate('/patients')} className="mt-4 text-blue-600 hover:underline">
          Retour à la liste
        </button>
      </div>
    );
  }

  const HistoryTable = ({ title, data, type }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-900">{title}</div>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Détails</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-600">{item.date}</td>
                <td className="px-6 py-4 text-slate-900">
                  {type === 'ordonnance' ? `${item.items?.length} médicaments` : 
                   type === 'analyse' ? `${item.analyses?.length} analyses` : 
                   type === 'consultation' ? item.motif : item.titre}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Voir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 italic">Aucun historique trouvé.</div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <PatientAvatar sexe={patient.genre} size="md" />
          <div>
            <button onClick={() => navigate('/patients')} className="text-slate-500 hover:text-slate-700 text-sm mb-2">← Retour</button>
            <h1 className="text-3xl font-bold text-slate-900">{patient.nom} {patient.prenom}</h1>
            <div className="flex gap-4 mt-2 text-slate-600">
              <span>{patient.genre}</span>
              <span>{calculateAge(patient.dateNaissance)} ans ({patient.dateNaissance})</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to={`/certificats?patientId=${patient.id}`} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">Certificat</Link>
          <Link to={`/ordonnance?patientId=${patient.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Ordonnance</Link>
          <Link to={`/analyses?patientId=${patient.id}`} className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-900">Analyse</Link>
          <Link to={`/consultation?patientId=${patient.id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700">Consultation</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-900 uppercase text-xs mb-4">Informations</h2>
            <dl className="space-y-3">
              {[
                { label: 'Téléphone', value: patient.telephone },
                { label: 'Email', value: patient.email },
                { label: 'Wilaya', value: patient.wilaya },
                { label: 'Groupe Sanguin', value: patient.groupeSanguin },
                { label: 'État Civil', value: patient.etatCivil },
                { label: 'Assurance', value: patient.assurance },
                { label: 'Profession', value: patient.profession },
              ].map(item => item.value && (
                <div key={item.label}>
                  <dt className="text-xs text-slate-500">{item.label}</dt>
                  <dd className="font-medium text-slate-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="md:col-span-2">
          <HistoryTable title="Historique des Ordonnances" data={patientOrdonnances} type="ordonnance" />
          <HistoryTable title="Historique des Analyses" data={patientAnalyses} type="analyse" />
          <HistoryTable title="Historique des Certificats" data={patientCertificats} type="certificat" />
          <HistoryTable title="Historique des Consultations" data={patientConsultations} type="consultation" />
        </div>
      </div>
    </div>
  );
}
