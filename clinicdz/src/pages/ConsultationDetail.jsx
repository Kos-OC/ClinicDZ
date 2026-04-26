import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useStore';
import { calculateBMI, calculateReste } from '../utils/calculations';
import TabPanel from '../components/TabPanel';
import { Combobox } from '@headlessui/react';

const schema = z.object({
  patientId: z.string().min(1, "Veuillez sélectionner un patient"),
  date: z.string().min(1, "La date est requise"),
  motif: z.string().optional(),
  antecedents: z.string().optional(),
  diagnostic: z.string().optional(),
  examenClinique: z.string().optional(),
  poids: z.coerce.number().nullable().optional(),
  taille: z.coerce.number().nullable().optional(),
  imc: z.coerce.number().nullable().optional(),
  temperature: z.coerce.number().nullable().optional(),
  frequenceCardiaque: z.coerce.number().nullable().optional(),
  pressionArterielle: z.string().optional(),
  observation: z.string().optional(),
  prochainRdv: z.string().optional(),
  notesRdv: z.string().optional(),
  montant: z.coerce.number().default(0),
  paiement: z.coerce.number().default(0),
});

export default function ConsultationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, consultations, addConsultation, updateConsultation } = useStore();
  
  const existing = consultations.find(c => c.id === id);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: existing || { date: new Date().toISOString().split('T')[0], montant: 0, paiement: 0 }
  });

  const patientId = watch('patientId');
  const selectedPatient = patients.find(p => p.id === patientId);
  const poids = watch('poids');
  const taille = watch('taille');
  const montant = watch('montant');
  const paiement = watch('paiement');

  useEffect(() => {
    if (selectedPatient && !existing) setValue('antecedents', selectedPatient.notes || '');
  }, [patientId, selectedPatient, existing, setValue]);

  useEffect(() => {
    setValue('imc', calculateBMI(poids, taille));
  }, [poids, taille, setValue]);

  const onSubmit = (data) => {
    const consultation = { 
      ...data, 
      id: id || uuidv4(), 
      createdAt: existing ? existing.createdAt : new Date().toISOString() 
    };
    if (id) updateConsultation(id, consultation);
    else addConsultation(consultation);
    toast.success('Consultation enregistrée');
    navigate('/consultations');
  };

  const tabs = [
    { label: 'Fiche de consultation', content: (
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><label htmlFor="motif" className="block text-sm">Motif</label><input id="motif" name="motif" {...register('motif')} className="w-full border p-2 rounded" /></div>
          <div><label htmlFor="antecedents" className="block text-sm">Antécédents</label><textarea id="antecedents" name="antecedents" {...register('antecedents')} className="w-full border p-2 rounded" /></div>
          <div><label htmlFor="diagnostic" className="block text-sm">Diagnostic médical</label><textarea id="diagnostic" name="diagnostic" {...register('diagnostic')} className="w-full border p-2 rounded" /></div>
          <div><label htmlFor="examenClinique" className="block text-sm">Résultat de l'examen clinique</label><textarea id="examenClinique" name="examenClinique" {...register('examenClinique')} className="w-full border p-2 rounded" /></div>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold">Constantes vitales</h3>
          <div><label htmlFor="poids" className="block text-sm">Poids (Kg)</label><input aria-label="Poids (Kg)" id="poids" name="poids" type="number" {...register('poids')} className="w-full border p-2 rounded" /></div>
          <div><label htmlFor="taille" className="block text-sm">Taille (Cm)</label><input aria-label="Taille (Cm)" id="taille" name="taille" type="number" {...register('taille')} className="w-full border p-2 rounded" /></div>
          <div><label htmlFor="imc" className="block text-sm">IMC</label><input aria-label="IMC" id="imc" name="imc" type="number" {...register('imc')} readOnly className="w-full border p-2 rounded bg-gray-50" /></div>
          <div><label htmlFor="temperature" className="block text-sm">Température (°C)</label><input id="temperature" name="temperature" type="number" {...register('temperature')} className="w-full border p-2 rounded" /></div>
          <div><label htmlFor="frequenceCardiaque" className="block text-sm">Fréquence cardiaque</label><input id="frequenceCardiaque" name="frequenceCardiaque" type="number" {...register('frequenceCardiaque')} className="w-full border p-2 rounded" /></div>
          <div><label htmlFor="pressionArterielle" className="block text-sm">Pression artérielle</label><input id="pressionArterielle" name="pressionArterielle" {...register('pressionArterielle')} className="w-full border p-2 rounded" /></div>
        </div>
      </div>
    )},
    { label: 'Informations', content: selectedPatient ? (
      <dl className="grid grid-cols-2 gap-4">
        {Object.entries(selectedPatient).map(([k, v]) => <div key={k}><dt className="text-xs text-gray-500 capitalize">{k}</dt><dd className="font-medium">{v || '-'}</dd></div>)}
      </dl>
    ) : <p>Veuillez sélectionner un patient.</p> },
    { label: 'Prochain RDV', content: (
      <div className="space-y-4">
        <div><label htmlFor="prochainRdv" className="block text-sm">Prochain RDV</label><input id="prochainRdv" name="prochainRdv" type="date" {...register('prochainRdv')} className="w-full border p-2 rounded" /></div>
        <div><label htmlFor="notesRdv" className="block text-sm">Notes RDV</label><textarea id="notesRdv" name="notesRdv" {...register('notesRdv')} className="w-full border p-2 rounded" /></div>
      </div>
    )},
    { label: 'Paiement', content: (
      <div className="space-y-4">
        <div><label htmlFor="montant" className="block text-sm">Montant</label><input aria-label="Montant" id="montant" name="montant" type="number" {...register('montant')} className="w-full border p-2 rounded" /></div>
        <div><label htmlFor="paiement" className="block text-sm">Paiement</label><input aria-label="Paiement" id="paiement" name="paiement" type="number" {...register('paiement')} className="w-full border p-2 rounded" /></div>
        <div><label htmlFor="reste" className="block text-sm">Reste</label><input aria-label="Reste" id="reste" name="reste" type="number" value={calculateReste(montant, paiement)} readOnly className="w-full border p-2 rounded bg-gray-50" /></div>
      </div>
    )}
  ];

  return (
    <form role="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white p-4 border rounded shadow-sm flex items-center gap-4">
        <Combobox value={patientId} onChange={(val) => setValue('patientId', val)}>
          <Combobox.Input className="border p-2 rounded w-64" displayValue={(id) => patients.find(p => p.id === id)?.nom} />
          <Combobox.Options className="absolute bg-white border mt-1 max-h-40 overflow-auto">
            {patients.map(p => <Combobox.Option key={p.id} value={p.id} className="p-2 cursor-pointer hover:bg-gray-100">{p.nom} {p.prenom}</Combobox.Option>)}
          </Combobox.Options>
        </Combobox>
        <input type="date" {...register('date')} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sauvegarder</button>
      </div>
      <div className="flex gap-2">
        {['Ordonnance', 'Bilan', 'Arrêt de travail', 'Certificat Médical', 'Lettre d\'orientation'].map(a => <button key={a} type="button" className="bg-blue-600 text-white px-3 py-1 text-sm rounded">{a}</button>)}
      </div>
      <TabPanel tabs={tabs} />
    </form>
  );
}
