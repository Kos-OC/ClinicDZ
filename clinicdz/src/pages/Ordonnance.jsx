import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Combobox } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { calculateAge } from '../utils/calculations';

export default function Ordonnance() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { patients, drugs, addPrescription, doctor } = useStore();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientQuery, setPatientQuery] = useState('');
  
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [drugQuery, setDrugQuery] = useState('');
  
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ageOverride, setAgeOverride] = useState('');

  // Handle pre-selected patient from URL
  useEffect(() => {
    const patientId = searchParams.get('patientId');
    if (patientId) {
      const p = patients.find((p) => p.id === patientId);
      if (p) {
        setSelectedPatient(p);
        setAgeOverride(calculateAge(p.dateNaissance));
      }
    }
  }, [searchParams, patients]);

  const handlePatientSelect = (p) => {
    setSelectedPatient(p);
    if (p) {
      setAgeOverride(calculateAge(p.dateNaissance));
    } else {
      setAgeOverride('');
    }
  };

  const filteredPatients = patientQuery === ''
    ? patients
    : patients.filter((p) =>
        `${p.nom} ${p.prenom}`.toLowerCase().includes(patientQuery.toLowerCase())
      );

  const filteredDrugs = drugQuery === ''
    ? drugs
    : drugs.filter((d) => d.nom.toLowerCase().includes(drugQuery.toLowerCase()));

  const addItem = (drug) => {
    if (!drug) return;
    const newItem = {
      id: uuidv4(),
      drugId: drug.id,
      nom: drug.nom,
      dosage: drug.dosage,
      forme: drug.forme,
      posologie: drug.posologieDefaut || '',
      duree: '',
      quantite: '',
    };
    setItems([...items, newItem]);
    setSelectedDrug(null);
    setDrugQuery('');
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSave = (shouldPrint = false) => {
    if (!selectedPatient) {
      toast.error('Veuillez sélectionner un patient');
      return;
    }
    if (items.length === 0 && !notes) {
      toast.error('L\'ordonnance est vide');
      return;
    }

    const prescription = {
      id: uuidv4(),
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.nom} ${selectedPatient.prenom}`,
      date,
      items,
      notes,
      type: 'ordonnance',
    };

    addPrescription(prescription);
    toast.success('Ordonnance enregistrée');

    if (shouldPrint) {
      setTimeout(() => window.print(), 500);
    } else {
      navigate(`/patients/${selectedPatient.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Nouvelle Ordonnance</h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200"
          >
            Enregistrer seulement
          </button>
          <button
            onClick={() => handleSave(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm"
          >
            Imprimer & Enregistrer
          </button>
        </div>
      </div>

      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Patient</label>
            <Combobox value={selectedPatient} onChange={handlePatientSelect}>
              <div className="relative">
                <Combobox.Input
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  displayValue={(p) => p ? `${p.nom} ${p.prenom}` : ''}
                  onChange={(event) => setPatientQuery(event.target.value)}
                  placeholder="Rechercher un patient..."
                />
                <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Âge</label>
              <input
                type="number"
                value={ageOverride}
                onChange={(e) => setAgeOverride(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-1">Ajouter un médicament</label>
          <Combobox value={selectedDrug} onChange={addItem}>
            <div className="relative">
              <Combobox.Input
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                displayValue={(d) => d?.nom || ''}
                onChange={(event) => setDrugQuery(event.target.value)}
                placeholder="Rechercher un médicament..."
              />
              <Combobox.Options className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredDrugs.length === 0 && drugQuery !== '' ? (
                  <div className="p-2 text-slate-500">Aucun médicament trouvé</div>
                ) : (
                  filteredDrugs.map((d) => (
                    <Combobox.Option
                      key={d.id}
                      value={d}
                      className={({ active }) =>
                        `p-2 cursor-pointer ${active ? 'bg-blue-600 text-white' : 'text-slate-900'}`
                      }
                    >
                      <div className="font-medium">{d.nom}</div>
                      <div className="text-xs opacity-80">{d.dosage} - {d.forme}</div>
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </div>
          </Combobox>
          <button
            onClick={() => addItem({ id: 'custom', nom: drugQuery || 'Nouveau Médicament', dosage: '', forme: '', posologieDefaut: '' })}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            + Ajouter comme médicament libre
          </button>
        </div>
      </div>

      <div className="no-print bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Médicament</th>
              <th className="px-6 py-3">Posologie</th>
              <th className="px-6 py-3 w-32">Durée</th>
              <th className="px-6 py-3 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{item.nom}</div>
                  <div className="text-xs text-slate-500">{item.dosage} {item.forme}</div>
                </td>
                <td className="px-6 py-4">
                  <input
                    value={item.posologie}
                    onChange={(e) => updateItem(item.id, 'posologie', e.target.value)}
                    className="w-full p-1 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded outline-none"
                    placeholder="ex: 1 cp 3 fois/jour"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    value={item.duree}
                    onChange={(e) => updateItem(item.id, 'duree', e.target.value)}
                    className="w-full p-1 border border-transparent hover:border-slate-200 focus:border-blue-500 rounded outline-none"
                    placeholder="ex: 7 jours"
                  />
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-400 italic">
                  Aucun médicament ajouté
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <div className="no-print">
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Observations</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Notes additionnelles..."
        ></textarea>
      </div>

      {/* PRINT AREA */}
      <div id="print-area" className="hidden print:block p-8 text-black bg-white min-h-screen">
        <div className="flex justify-between border-b-2 border-slate-900 pb-4 mb-8">
          <div>
            <h2 className="text-xl font-bold uppercase">Dr. {doctor.prenom} {doctor.nom}</h2>
            <p className="text-sm">{doctor.specialite}</p>
            <p className="text-sm">{doctor.adresse}</p>
            <p className="text-sm">Tél: {doctor.telephone}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Le: {date}</p>
            {doctor.cnasCasnos && <p className="text-sm">N°: {doctor.cnasCasnos}</p>}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold underline mb-4">Patient:</h3>
          <p className="text-xl font-medium">
            {selectedPatient?.nom} {selectedPatient?.prenom} 
            <span className="text-base font-normal ml-2">
              ({ageOverride} ans)
            </span>
          </p>
        </div>

        <div className="space-y-6 min-h-[400px]">
          <ol className="list-decimal pl-5 space-y-4">
            {items.map((item) => (
              <li key={item.id} className="pl-2">
                <div className="font-bold uppercase">{item.nom} {item.dosage} {item.forme}</div>
                <div className="italic ml-4">{item.posologie} {item.duree ? `pendant ${item.duree}` : ''}</div>
              </li>
            ))}
          </ol>
          {notes && (
            <div className="mt-8 pt-4 border-t border-slate-100 italic whitespace-pre-wrap">
              {notes}
            </div>
          )}
        </div>

        <div className="mt-20 flex justify-between items-end border-t-2 border-slate-900 pt-8">
          <div className="text-xs text-slate-500 max-w-[60%]">
            {doctor.piedDePage}
          </div>
          <div className="text-center border-2 border-slate-200 p-8 rounded min-w-[200px]">
            <p className="text-xs font-bold uppercase mb-10">Cachet et Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
