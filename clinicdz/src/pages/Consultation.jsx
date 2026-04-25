import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';

const schema = z.object({
  motif: z.string().min(1, 'Motif requis'),
  observations: z.string().optional(),
});

export default function Consultation() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const navigate = useNavigate();
  const { addConsultation } = useStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    addConsultation({
      id: crypto.randomUUID(),
      patientId,
      date: new Date().toLocaleDateString('fr-FR'),
      ...data,
    });
    toast.success('Consultation enregistrée');
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Consultation</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Motif</label>
          <input {...register('motif')} className="w-full p-2 border rounded" />
          {errors.motif && <p className="text-red-500 text-xs">{errors.motif.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Observations</label>
          <textarea {...register('observations')} className="w-full p-2 border rounded" rows="4" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">Enregistrer</button>
      </form>
    </div>
  );
}
