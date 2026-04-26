import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import EmptyState from '../components/EmptyState';
import PatientAvatar from '../components/PatientAvatar';
import { calculateAge, calculateBirthYear, formatFrenchDate } from '../utils/calculations';
import { WILAYAS } from '../data/wilayas';

const schema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  dateNaissance: z.string().optional(),
  age: z.string().optional(),
  genre: z.enum(['Homme', 'Femme']),
  telephone: z.string().optional(),
  email: z.string().email({ message: "Email invalide" }).optional().or(z.literal('')),
  wilaya: z.string().optional(),
  groupeSanguin: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
  etatCivil: z.enum(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve', '']).optional(),
  assurance: z.enum(['Non assuré(e)', 'Assuré(e)', 'CNAS', 'CASNOS', '']).optional(),
  profession: z.string().optional(),
  moyenContact: z.enum(['Téléphone', 'Email', 'Ami', 'Famille', '']).optional(),
  notes: z.string().optional(),
  adresse: z.string().optional(),
}).refine(data => data.dateNaissance || data.age, {
  message: "Veuillez saisir soit la date de naissance, soit l'âge",
  path: ['dateNaissance'],
});

export default function Patients() {
  const navigate = useNavigate();
  const { patients, addPatient, deletePatient, updatePatient } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('nom');
  const [isOpen, setIsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { genre: 'Homme' },
  });

  const watchDate = watch('dateNaissance');

  React.useEffect(() => {
    if (watchDate) {
      const age = calculateAge(watchDate);
      if (age !== '') setValue('age', age.toString());
    }
  }, [watchDate, setValue]);

  const filteredPatients = patients.filter((p) => {
    if (filterType === 'nom') return `${p.prenom} ${p.nom}`.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'age') return calculateAge(p.dateNaissance).toString().includes(searchTerm);
    if (filterType === 'sexe') return p.genre.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'wilaya') return p.wilaya?.toLowerCase().includes(searchTerm.toLowerCase());
    return true;
  });

  const onSubmit = (data) => {
    let finalData = { 
      ...data, 
      nom: data.nom.toUpperCase(), 
      prenom: data.prenom.toUpperCase() 
    };
    if (!data.dateNaissance && data.age) {
      finalData.dateNaissance = calculateBirthYear(data.age);
    }
    finalData.dateNaissance = formatFrenchDate(finalData.dateNaissance);

    if (editingPatient) {
      updatePatient({ ...finalData, id: editingPatient.id });
      toast.success('Patient mis à jour');
    } else {
      addPatient({ ...finalData, id: uuidv4() });
      toast.success('Patient ajouté');
    }
    setIsOpen(false);
    setEditingPatient(null);
    reset();
  };

  const handleEdit = (e, patient) => {
    e.stopPropagation();
    setEditingPatient(patient);
    Object.keys(patient).forEach((key) => setValue(key, patient[key]));
    setIsOpen(true);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      deletePatient(id);
      toast.success('Patient supprimé');
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  React.useEffect(() => {
    if (!confirmDeleteId) return;
    const handler = (e) => {
      if (!e.target.closest('.delete-confirm')) {
        setConfirmDeleteId(null);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [confirmDeleteId]);

  const PatientForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-slate-700">Nom</label><input {...register('nom')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Prénom</label><input {...register('prenom')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-slate-700">Date de Naissance</label><input type="text" {...register('dateNaissance')} placeholder="JJ/MM/AAAA" className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium text-slate-700">Âge</label><input type="number" {...register('age')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
      </div>
      <div><label className="block text-sm font-medium text-slate-700">Genre</label><select {...register('genre')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"><option value="Homme">Homme</option><option value="Femme">Femme</option></select></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-slate-700">Wilaya</label><select {...register('wilaya')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"><option value="">-- Wilaya --</option>{WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-slate-700">Groupe Sanguin</label><select {...register('groupeSanguin')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"><option value="">-- GS --</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(gs => <option key={gs} value={gs}>{gs}</option>)}</select></div>
      </div>
      <div><label className="block text-sm font-medium text-slate-700">Téléphone</label><input {...register('telephone')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
      <div><label className="block text-sm font-medium text-slate-700">Email</label><input {...register('email')} className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" /></div>
      <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => {setIsOpen(false); setEditingPatient(null); reset();}} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Annuler</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Enregistrer</button></div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-1">{patients.length} patient(s)</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">Ajouter un patient</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="font-medium">Filtrer sur:</span>
            {['nom', 'age', 'sexe', 'wilaya'].map((type) => (
              <label key={type} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" checked={filterType === type} onChange={() => setFilterType(type)} className="text-blue-600" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg" />
        </div>

        {filteredPatients.length > 0 ? (
          <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Nom & Prénom</th>
                <th className="px-6 py-3">Âge</th>
                <th className="px-6 py-3">Sexe</th>
                <th className="px-6 py-3">GS</th>
                <th className="px-6 py-3">Mobile</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Wilaya</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} onClick={() => navigate(`/patients/${patient.id}`)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-4"><PatientAvatar sexe={patient.genre} size="sm" /></td>
                  <td className="px-6 py-4 font-medium">{patient.nom} {patient.prenom}</td>
                  <td className="px-6 py-4">{calculateAge(patient.dateNaissance)}</td>
                  <td className="px-6 py-4">{patient.genre}</td>
                  <td className="px-6 py-4">{patient.groupeSanguin || '—'}</td>
                  <td className="px-6 py-4">{patient.telephone || '—'}</td>
                  <td className="px-6 py-4">{patient.email || '—'}</td>
                  <td className="px-6 py-4">{patient.wilaya || '—'}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/patients/${patient.id}`); }} className="text-blue-600 hover:text-blue-800">Info</button>
                    <button onClick={(e) => handleEdit(e, patient)} className="text-amber-600 hover:text-amber-800">Edit</button>
                    {confirmDeleteId === patient.id ? (
                      <span className="flex items-center gap-1">
                        <span className="text-red-600 text-sm">Confirmer ?</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(e, patient.id); }} className="text-red-600 hover:text-red-800 font-medium text-sm">Oui</button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} className="text-slate-400 hover:text-slate-600 text-sm">Non</button>
                      </span>
                    ) : (
                      <button onClick={(e) => handleDelete(e, patient.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : <EmptyState title="Aucun résultat" description="Essayez une autre recherche." />}
      </div>

      <Transition show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {setIsOpen(false); setEditingPatient(null); reset();}}>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl">
                <Dialog.Title className="text-lg font-bold mb-4">{editingPatient ? 'Modifier' : 'Ajouter'} un patient</Dialog.Title>
                <PatientForm />
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
