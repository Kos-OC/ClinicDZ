import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Combobox } from '@headlessui/react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { calculateAge } from '../utils/calculations';

export default function Analyses() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { patients, analyses, doctor, addAnalyse } = useStore();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientQuery, setPatientQuery] = useState('');
  
  const [selectedAnalyses, setSelectedAnalyses] = useState([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ageOverride, setAgeOverride] = useState('');

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

  const toggleAnalyse = (analyse) => {
    if (selectedAnalyses.some(a => a.id === analyse.id)) {
      setSelectedAnalyses(selectedAnalyses.filter(a => a.id !== analyse.id));
    } else {
      setSelectedAnalyses([...selectedAnalyses, analyse]);
    }
  };

  const handlePrint = () => {
    if (!selectedPatient) {
      toast.error('Veuillez sélectionner un patient');
      return;
    }
    if (selectedAnalyses.length === 0) {
      toast.error('Veuillez sélectionner au moins une analyse');
      return;
    }
    
    addAnalyse({
      patientId: selectedPatient.id,
      patientName: `${selectedPatient.nom} ${selectedPatient.prenom}`,
      date,
      analyses: selectedAnalyses,
      isUrgent
    });
    toast.success('Demande d\'analyse enregistrée');

    setTimeout(() => window.print(), 500);
  };

  // Group analyses by category
  const categories = [...new Set(analyses.map(a => a.categorie))];

  return (
    <div className="space-y-6">
      <div className="no-print flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Demande d'Analyses</h1>
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm"
        >
          Imprimer la demande
        </button>
      </div>

      <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                  {filteredPatients.map((p) => (
                    <Combobox.Option
                      key={p.id}
                      value={p}
                      className={({ active }) =>
                        `p-2 cursor-pointer ${active ? 'bg-blue-600 text-white' : 'text-slate-900'}`
                      }
                    >
                      {p.nom} {p.prenom}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Combobox>
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="urgent"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded"
            />
            <label htmlFor="urgent" className="text-sm font-bold text-red-600 uppercase tracking-wider">
              Urgent
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observations</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notes additionnelles..."
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
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

      <div className="no-print grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">{cat}</h3>
            <div className="space-y-2">
              {analyses.filter(a => a.categorie === cat).map(analyse => (
                <label key={analyse.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedAnalyses.some(a => a.id === analyse.id)}
                    onChange={() => toggleAnalyse(analyse)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                    {analyse.nom}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
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
            {isUrgent && <p className="text-xl font-black text-red-600 uppercase mt-2">!!! URGENT !!!</p>}
          </div>
        </div>

        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold underline uppercase tracking-widest">Demande d'examens biologiques</h2>
        </div>

        <div className="mb-10 bg-slate-50 p-4 border border-slate-200 rounded">
          <h3 className="text-lg font-bold mb-2">Patient:</h3>
          <p className="text-xl font-medium uppercase">
            {selectedPatient?.nom} {selectedPatient?.prenom} 
            <span className="text-base font-normal ml-2">
              ({ageOverride} ans)
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-4 min-h-[500px] content-start">
          {selectedAnalyses.map((analyse, index) => (
            <div key={analyse.id} className="flex gap-2 items-center py-1 border-b border-slate-100">
              <span className="font-bold">{index + 1}.</span>
              <span className="uppercase font-medium">{analyse.nom}</span>
              <span className="text-xs text-slate-400 ml-auto">({analyse.categorie})</span>
            </div>
          ))}
        </div>

        {notes && (
          <div className="mt-8 pt-4 border-t border-slate-100 italic whitespace-pre-wrap">
            <h4 className="font-bold mb-1">Observations:</h4>
            {notes}
          </div>
        )}

        <div className="mt-20 flex justify-between items-end border-t-2 border-slate-900 pt-8">
          <div className="text-xs text-slate-500 max-w-[60%] italic">
            {doctor.piedDePage || "Prière de nous communiquer les résultats dès que possible."}
          </div>
          <div className="text-center border-2 border-slate-200 p-8 rounded min-w-[200px]">
            <p className="text-xs font-bold uppercase mb-10">Cachet et Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}
