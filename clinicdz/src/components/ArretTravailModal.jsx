import React from 'react';
import { Dialog } from '@headlessui/react';

export default function ArretTravailModal({ isOpen, onClose, patient }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Arrêt de travail</h2>
        <div id="print-area" className="space-y-4">
          <p>Nom: {patient?.nom} {patient?.prenom}</p>
          <input type="number" placeholder="Durée" className="w-full border p-2" />
          <input type="date" placeholder="Date début" className="w-full border p-2" />
          <textarea placeholder="Motif" className="w-full border p-2" />
        </div>
        <button onClick={() => window.print()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Imprimer</button>
      </Dialog.Panel>
    </Dialog>
  );
}
