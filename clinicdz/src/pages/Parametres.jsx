import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { exportToJson } from '../utils/exportData';
import { importFromJson } from '../utils/importData';

const schema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  specialite: z.string().min(1, 'La spécialité est requise'),
  adresse: z.string().min(1, 'L\'adresse est requise'),
  telephone: z.string().min(1, 'Le téléphone est requis'),
  cnasCasnos: z.string().optional(),
  piedDePage: z.string().optional(),
});

export default function Parametres() {
  const { doctor, updateDoctor } = useStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: doctor,
  });

  const onSubmit = (data) => {
    updateDoctor(data);
    toast.success('Paramètres enregistrés avec succès');
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (window.confirm('Êtes-vous sûr de vouloir importer ces données ? Cela écrasera toutes vos données actuelles.')) {
      try {
        await importFromJson(file);
        toast.success('Données importées avec succès');
        // Refresh page to ensure store is reloaded (though Zustand should handle it)
        window.location.reload();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-2">Gérez vos informations professionnelles et vos données.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Profil du Docteur</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
            <input
              {...register('prenom')}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.prenom && <p className="text-red-600 text-sm mt-1">{errors.prenom.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input
              {...register('nom')}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Spécialité</label>
            <input
              {...register('specialite')}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.specialite && <p className="text-red-600 text-sm mt-1">{errors.specialite.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
            <input
              {...register('telephone')}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.telephone && <p className="text-red-600 text-sm mt-1">{errors.telephone.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
            <input
              {...register('adresse')}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.adresse && <p className="text-red-600 text-sm mt-1">{errors.adresse.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">N° CNAS/CASNOS</label>
            <input
              {...register('cnasCasnos')}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Pied de page (Prescription)</label>
            <textarea
              {...register('piedDePage')}
              rows={3}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Maintenance des données</h2>
        <p className="text-slate-500 mb-6 text-sm">
          Sauvegardez vos données localement ou restaurez-les à partir d'un fichier de sauvegarde.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportToJson}
            className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors shadow-sm"
          >
            Exporter les données (JSON)
          </button>
          
          <label className="bg-slate-100 text-slate-800 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300">
            Importer les données (JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
