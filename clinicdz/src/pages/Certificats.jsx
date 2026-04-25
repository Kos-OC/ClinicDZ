import React, { useState, useEffect, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { defaultCertificates } from '../data/defaultCertificates';
import { renderCertificate } from '../utils/certificates';
import { calculateAge, formatFrenchDate } from '../utils/calculations';

const schema = z.object({
  patientId: z.string().min(1, 'Veuillez sélectionner un patient'),
  date: z.string().min(1, 'La date est requise'),
  DATE_DEBUT: z.string().optional(),
  DATE_FIN: z.string().optional(),
  NOMBRE_JOURS: z.string().optional(),
  MOTIF: z.string().optional(),
});

const REQUIRED_LABELS = {
  DATE_DEBUT: 'Date de début',
  DATE_FIN: 'Date de fin',
  NOMBRE_JOURS: 'Nombre de jours',
  MOTIF: 'Motif / Observations',
};

export default function Certificats() {
  const { patients, doctor, addCertificat } = useStore();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientQuery, setPatientQuery] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  });

  const watchedValues = watch();

  // Auto-select first template on mount
  useEffect(() => {
    if (!selectedTemplate && defaultCertificates.length > 0) {
      setSelectedTemplate(defaultCertificates[0]);
    }
  }, []);

  // Update preview whenever form values or template change
  useEffect(() => {
    if (!selectedTemplate) return;

    const patient = patients.find(p => p.id === watchedValues.patientId);
    const sex = patient?.genre === 'Féminin' ? 'Mme' : 'M.';
    const age = patient ? calculateAge(patient.dateNaissance) : '';
    const sexArticle = patient ? sex : 'M./Mme';

    const variables = {
      NOM_PATIENT: patient ? `${patient.nom} ${patient.prenom}` : '{{NOM_PATIENT}}',
      AGE: age || '{{AGE}}',
      SEXE_ARTICLE: sexArticle,
      DATE: watchedValues.date || '{{DATE}}',
      NOM_MEDECIN: doctor.prenom && doctor.nom ? `Dr ${doctor.prenom} ${doctor.nom}` : '{{NOM_MEDECIN}}',
      SPECIALITE: doctor.specialite || '{{SPECIALITE}}',
      DATE_DEBUT: watchedValues.DATE_DEBUT || '{{DATE_DEBUT}}',
      DATE_FIN: watchedValues.DATE_FIN || '{{DATE_FIN}}',
      NOMBRE_JOURS: watchedValues.NOMBRE_JOURS || '{{NOMBRE_JOURS}}',
      MOTIF: watchedValues.MOTIF || '{{MOTIF}}',
    };

    setPreviewContent(renderCertificate(selectedTemplate.body, variables));
  }, [selectedTemplate, watchedValues, patients, doctor]);

  const filteredPatients = patientQuery === ''
    ? patients
    : patients.filter(p =>
        `${p.nom} ${p.prenom}`.toLowerCase().includes(patientQuery.toLowerCase())
      );

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    reset();
    setSelectedPatient(null);
    setPatientQuery('');
    setValue('date', new Date().toISOString().split('T')[0]);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient?.id || '');
  };

  const onSubmit = (data) => {
    if (!selectedTemplate) return;

    const patient = patients.find(p => p.id === data.patientId);
    const sex = patient?.genre === 'Féminin' ? 'Mme' : 'M.';
    const age = patient ? calculateAge(patient.dateNaissance) : '';
    const sexArticle = patient ? sex : 'M./Mme';

    const variables = {
      NOM_PATIENT: patient ? `${patient.nom} ${patient.prenom}` : '',
      AGE: age,
      SEXE_ARTICLE: sexArticle,
      DATE: data.date,
      NOM_MEDECIN: doctor.prenom && doctor.nom ? `Dr ${doctor.prenom} ${doctor.nom}` : '',
      SPECIALITE: doctor.specialite || '',
      DATE_DEBUT: data.DATE_DEBUT || '',
      DATE_FIN: data.DATE_FIN || '',
      NOMBRE_JOURS: data.NOMBRE_JOURS || '',
      MOTIF: data.MOTIF || '',
    };

    const contenuFinal = renderCertificate(selectedTemplate.body, variables);

    const certificat = {
      id: uuidv4(),
      patientId: data.patientId,
      templateId: selectedTemplate.id,
      titre: selectedTemplate.titre,
      date: data.date,
      contenuFinal,
      createdAt: new Date().toISOString(),
    };

    addCertificat(certificat);
    toast.success('Certificat enregistré');
    setTimeout(() => window.print(), 500);
  };

  const handleReset = () => {
    reset();
    setSelectedPatient(null);
    setPatientQuery('');
    setValue('date', new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Certificats Médicaux</h1>
        <button
          onClick={handleReset}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200"
        >
          Réinitialiser
        </button>
      </div>

      <div className="flex gap-6">
        {/* Column 1: Template List (w-1/4) */}
        <div className="no-print w-1/4 space-y-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Modèles</h2>
          {defaultCertificates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => handleTemplateSelect(tpl)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedTemplate?.id === tpl.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="font-semibold text-sm">{tpl.titre}</div>
              <div className={`text-xs mt-1 ${selectedTemplate?.id === tpl.id ? 'text-slate-300' : 'text-slate-400'}`}>
                {tpl.description}
              </div>
            </button>
          ))}
        </div>

        {/* Column 2: Form (w-1/3) */}
        <div className="no-print w-1/3 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Informations</h2>

            {/* Patient Combobox */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
              <Combobox value={selectedPatient} onChange={handlePatientSelect}>
                <div className="relative">
                  <Combobox.Input
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    displayValue={(p) => p ? `${p.nom} ${p.prenom}` : ''}
                    onChange={(e) => {
                      setPatientQuery(e.target.value);
                      if (!e.target.value) setSelectedPatient(null);
                    }}
                    placeholder="Rechercher un patient..."
                  />
                  <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                    {filteredPatients.length === 0 && patientQuery !== '' ? (
                      <div className="p-2 text-slate-500">Aucun patient trouvé</div>
                    ) : (
                      filteredPatients.map((p) => (
                        <Combobox.Option
                          key={p.id}
                          value={p}
                          className={({ active }) =>
                            `p-2 cursor-pointer ${active ? 'bg-blue-600 text-white' : 'text-slate-900'}`
                          }
                        >
                          {p.nom} {p.prenom}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </div>
              </Combobox>
              {errors.patientId && (
                <p className="text-red-500 text-xs mt-1">{errors.patientId.message}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                {...register('date')}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
              )}
            </div>

            {/* Dynamic Required Fields */}
            {selectedTemplate?.requiredFields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {REQUIRED_LABELS[field] || field}
                </label>
                {field === 'NOMBRE_JOURS' ? (
                  <input
                    type="number"
                    {...register(field)}
                    min="1"
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ex: 7"
                  />
                ) : field.startsWith('DATE') ? (
                  <input
                    type="date"
                    {...register(field)}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <textarea
                    {...register(field)}
                    rows={3}
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Saisissez le motif ou les observations..."
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-sm"
          >
            Imprimer
          </button>
        </div>

        {/* Column 3: Live Preview (w-5/12) */}
        <div className="w-5/12">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Aperçu</h2>
          <div
            id="print-area"
            className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
          >
            {/* Doctor Header */}
            <div className="bg-slate-900 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold uppercase">
                    {doctor.prenom} {doctor.nom}
                  </div>
                  <div className="text-slate-300 text-sm">{doctor.specialite}</div>
                  <div className="text-slate-300 text-xs mt-1">{doctor.adresse}</div>
                  <div className="text-slate-300 text-xs">{doctor.telephone}</div>
                </div>
                <div className="text-right text-xs text-slate-300">
                  {watchedValues.date && formatFrenchDate(watchedValues.date)}
                </div>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-8 min-h-[500px]">
              <div className="text-center border-b-2 border-slate-900 pb-3 mb-6">
                <h3 className="text-xl font-bold uppercase">
                  {selectedTemplate?.titre || 'Sélectionnez un modèle'}
                </h3>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                {previewContent || (
                  <span className="text-slate-400 italic">Remplissez le formulaire pour voir l'aperçu...</span>
                )}
              </div>
            </div>

            {/* Footer with Signature */}
            <div className="border-t-2 border-slate-900 p-6 flex justify-between items-end">
              <div className="text-xs text-slate-500 max-w-[60%]">
                {doctor.piedDePage}
              </div>
              <div className="text-center border-2 border-slate-200 p-6 rounded min-w-[180px]">
                <p className="text-xs font-bold uppercase mb-8">Cachet et Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}