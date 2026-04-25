import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Statistiques from './pages/Statistiques';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Medicaments from './pages/Medicaments';
import Ordonnance from './pages/Ordonnance';
import Analyses from './pages/Analyses';
import Parametres from './pages/Parametres';

const Sidebar = () => {
  const links = [
    { to: '/accueil', label: 'Accueil', icon: '📊' },
    { to: '/patients', label: 'Patients' },
    { to: '/medicaments', label: 'Médicaments' },
    { to: '/ordonnance', label: 'Ordonnance' },
    { to: '/analyses', label: 'Analyses' },
    { to: '/parametres', label: 'Paramètres' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-6 text-2xl font-bold border-b border-slate-800">
        ClinicDZ
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block p-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 text-slate-500 text-xs text-center">
        ClinicDZ v1.0.0
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50 text-slate-900 font-sans">
        <Sidebar />
        <main className="flex-1 h-screen overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/accueil" replace />} />
              <Route path="/accueil" element={<Statistiques />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/medicaments" element={<Medicaments />} />
              <Route path="/ordonnance" element={<Ordonnance />} />
              <Route path="/analyses" element={<Analyses />} />
              <Route path="/parametres" element={<Parametres />} />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'bg-white text-slate-900 shadow-xl border border-slate-100',
          duration: 3000,
        }} 
      />
    </BrowserRouter>
  );
}

export default App;
