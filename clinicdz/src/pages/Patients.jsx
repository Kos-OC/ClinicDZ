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
import { calculateAge, calculateBirthYear, formatFrenchDate } from '../utils/calculations';

const schema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  dateNaissance: z.string().optional(),
  age: z.string().optional(),
  genre: z.enum(['Masculin', 'Féminin']),
  telephone: z.string().optional(),
  adresse: z.string().optional(),
}).refine(data => data.dateNaissance || data.age, {
  message: "Veuillez saisir soit la date de naissance, soit l'âge",
  path: ['dateNaissance'],
});

export default function Patients() {
  const navigate = useNavigate();
  const { patients, addPatient, deletePatient } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { genre: 'Masculin' },
  });

  const watchDate = watch('dateNaissance');
  const watchAge = watch('age');

  // Auto-calculate age when date is picked
  React.useEffect(() => {
    if (watchDate) {
      const age = calculateAge(watchDate);
      if (age !== '') setValue('age', age.toString());
    }
  }, [watchDate, setValue]);

  // Auto-calculate rough date when age is entered
  const handleAgeChange = (e) => {
    const age = e.target.value;
    setValue('age', age);
    if (age && !watchDate) {
      // Only auto-fill if date is empty to avoid overwriting precise date
      // We don't necessarily want to fill dateNaissance here if they only want to provide age
    }
  };

  const filteredPatients = patients.filter((p) =>
    `${p.prenom} ${p.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data) => {
    // If date is missing but age is provided, we can either leave it or guess a year
    let finalData = { 
      ...data, 
      nom: data.nom.toUpperCase(), 
      prenom: data.prenom.toUpperCase() 
    };
    if (!data.dateNaissance && data.age) {
      finalData.dateNaissance = calculateBirthYear(data.age);
    }
    
    // Store formatted date
    finalData.dateNaissance = formatFrenchDate(finalData.dateNaissance);

    const newPatient = { ...finalData, id: uuidv4() };
    addPatient(newPatient);
    toast.success('Patient ajouté avec succès');
    setIsOpen(false);
    reset();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      deletePatient(id);
      toast.success('Patient supprimé');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patients</h1>
          <p className="text-slate-500 mt-1">{patients.length} patient(s) enregistré(s)</p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          Ajouter un patient
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {filteredPatients.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Genre</th>
                <th className="px-6 py-3">Date de Naissance</th>
                <th className="px-6 py-3">Téléphone</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {patient.nom} {patient.prenom}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{patient.genre}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {patient.dateNaissance} 
                    <span className="text-xs text-slate-400 ml-2">
                      ({calculateAge(patient.dateNaissance)} ans)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{patient.telephone || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => handleDelete(e, patient.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title={searchTerm ? 'Aucun résultat' : 'Aucun patient'}
            description={
              searchTerm
                ? 'Aucun patient ne correspond à votre recherche.'
                : 'Commencez par ajouter votre premier patient.'
            }
          />
        )}
      </div>

      <Transition show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900 mb-4">
                    Ajouter un patient
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Nom</label>
                        <input
                          {...register('nom')}
                          onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                          }}
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        />
                        {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Prénom</label>
                        <input
                          {...register('prenom')}
                          onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                          }}
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                        />
                        {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Date de Naissance</label>
                        <input
                          type="text"
                          {...register('dateNaissance')}
                          placeholder="JJ/MM/AAAA"
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Âge</label>
                        <input
                          type="number"
                          {...register('age')}
                          onChange={handleAgeChange}
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ans"
                        />
                      </div>
                    </div>
                    {(errors.dateNaissance || errors.age) && (
                      <p className="text-red-500 text-xs mt-1">{errors.dateNaissance?.message || errors.age?.message}</p>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Genre</label>
                      <select
                        {...register('genre')}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Masculin">Masculin</option>
                        <option value="Féminin">Féminin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Téléphone</label>
                      <input
                        {...register('telephone')}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Adresse</label>
                      <input
                        {...register('adresse')}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                      >
                        Ajouter
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
