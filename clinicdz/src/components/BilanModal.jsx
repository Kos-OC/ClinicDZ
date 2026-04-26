import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useStore } from '../store/useStore';

export default function BilanModal({ isOpen, onClose, patient }) {
  const { analyses } = useStore();
  const [selected, setSelected] = useState([]);

  const toggleAnalysis = (item) => {
    if (selected.includes(item)) setSelected(selected.filter(i => i !== item));
    else setSelected([...selected, item]);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">Prescription d'Analyses</h2>
        <div className="flex flex-1 gap-6 overflow-hidden">
          <div className="w-1/2 border rounded p-4 overflow-y-auto">
            {analyses.map(item => (
              <div key={item} onClick={() => toggleAnalysis(item)} className={`p-2 cursor-pointer ${selected.includes(item) ? 'opacity-50' : ''}`}>
                {item}
              </div>
            ))}
          </div>
          <div id="print-area" className="w-1/2 border rounded p-4 overflow-y-auto">
            <h3 className="font-bold">Tests sélectionnés (Cliquer 2 fois pour supprimer)</h3>
            {selected.map((item, i) => (
              <div key={i} onDoubleClick={() => toggleAnalysis(item)} className="p-2 border-b">
                {i + 1}. {item}
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => window.print()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Imprimer</button>
      </Dialog.Panel>
    </Dialog>
  );
}
