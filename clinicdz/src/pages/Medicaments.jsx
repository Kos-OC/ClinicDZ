import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, Transition } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import EmptyState from '../components/EmptyState';

const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  dosage: z.string().min(1, 'Le dosage est requis'),
  forme: z.string().min(1, 'La forme est requise'),
  categorie: z.string().min(1, 'La catégorie est requise'),
  posologieDefaut: z.string().optional(),
});

export default function Medicaments() {
  const { drugs, addDrug, updateDrug, deleteDrug } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const filteredDrugs = drugs.filter((d) =>
    d.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data) => {
    if (editingDrug) {
      updateDrug({ ...data, id: editingDrug.id });
      toast.success('Médicament mis à jour');
    } else {
      addDrug({ ...data, id: uuidv4() });
      toast.success('Médicament ajouté');
    }
    closeModal();
  };

  const openModal = (drug = null) => {
    setEditingDrug(drug);
    if (drug) {
      reset(drug);
    } else {
      reset({ nom: '', dosage: '', forme: '', categorie: '', posologieDefaut: '' });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingDrug(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce médicament ?')) {
      deleteDrug(id);
      toast.success('Médicament supprimé');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Médicaments</h1>
          <p className="text-slate-500 mt-1">{drugs.length} médicament(s) dans la base</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm"
        >
          Ajouter un médicament
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <input
            type="text"
            placeholder="Rechercher par nom ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {filteredDrugs.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Dosage / Forme</th>
                <th className="px-6 py-3">Catégorie</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDrugs.map((drug) => (
                <tr key={drug.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{drug.nom}</td>
                  <td className="px-6 py-4 text-slate-600">{drug.dosage} - {drug.forme}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                      {drug.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => openModal(drug)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(drug.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="Aucun médicament" description="Base de données vide." />
        )}
      </div>

      <Transition show={isOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                    {editingDrug ? 'Modifier' : 'Ajouter'} un médicament
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Nom</label>
                      <input
                        {...register('nom')}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Dosage</label>
                        <input
                          {...register('dosage')}
                          placeholder="ex: 500mg"
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.dosage && <p className="text-red-500 text-xs mt-1">{errors.dosage.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Forme</label>
                        <input
                          {...register('forme')}
                          placeholder="ex: Comprimé"
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.forme && <p className="text-red-500 text-xs mt-1">{errors.forme.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Catégorie</label>
                      <input
                        {...register('categorie')}
                        placeholder="ex: Antalgique"
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.categorie && <p className="text-red-500 text-xs mt-1">{errors.categorie.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Posologie par défaut</label>
                      <textarea
                        {...register('posologieDefaut')}
                        rows={2}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                      >
                        {editingDrug ? 'Mettre à jour' : 'Ajouter'}
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
