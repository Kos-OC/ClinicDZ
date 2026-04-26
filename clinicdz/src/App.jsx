import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import Certificats from './pages/Certificats';
import Statistiques from './pages/Statistiques';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Medicaments from './pages/Medicaments';
import Ordonnance from './pages/Ordonnance';
import Analyses from './pages/Analyses';
import Parametres from './pages/Parametres';
import Consultations from './pages/Consultations';
import ConsultationDetail from './pages/ConsultationDetail';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useStore();
  
  return (
    <div className={`bg-slate-900 text-white min-h-screen flex flex-col shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className={`flex items-center border-b border-slate-800 ${collapsed ? 'justify-center p-4' : 'p-6'}`}>
        {!collapsed && <div className="text-2xl font-bold">ClinicDZ</div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-slate-400 hover:text-white transition-colors text-xl ${collapsed ? 'p-2' : 'ml-auto'}`}
          aria-label={collapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 mt-2">
        <NavLink to="/accueil" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>📊 {!collapsed && <span className="ml-3">Accueil</span>}</NavLink>
        <NavLink to="/patients" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>👥 {!collapsed && <span className="ml-3">Patients</span>}</NavLink>
        
        {!collapsed && <div className="text-xs font-bold text-slate-500 uppercase px-3 mt-4 mb-2">Consultations</div>}
        <NavLink to="/consultations" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>📅 {!collapsed && <span className="ml-3">Liste</span>}</NavLink>
        <NavLink to="/consultations/new" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>➕ {!collapsed && <span className="ml-3">Ajouter</span>}</NavLink>

        <NavLink to="/ordonnance" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>📝 {!collapsed && <span className="ml-3">Ordonnance</span>}</NavLink>
        <NavLink to="/analyses" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>🧪 {!collapsed && <span className="ml-3">Analyses</span>}</NavLink>
        <NavLink to="/certificats" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>📋 {!collapsed && <span className="ml-3">Certificats</span>}</NavLink>
        <NavLink to="/medicaments" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>💊 {!collapsed && <span className="ml-3">Médicaments</span>}</NavLink>
        <NavLink to="/parametres" className={({isActive}) => `flex items-center p-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400'}`}>⚙️ {!collapsed && <span className="ml-3">Paramètres</span>}</NavLink>
      </nav>
      <button onClick={toggleTheme} className="m-4 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center" aria-label={theme === 'light' ? 'Passer au thème sombre' : 'Passer au thème clair'}>{theme === 'light' ? '🌙' : '☀️'}</button>
    </div>
  );
};

function App() {
  const { theme } = useStore();
  useEffect(() => { document.documentElement.className = theme; }, [theme]);

  return (
    <BrowserRouter>
      <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-900'} font-sans`}>
        <Sidebar />
        <main className="flex-1 h-screen overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/accueil" replace />} />
              <Route path="/accueil" element={<Statistiques />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/consultations" element={<Consultations />} />
              <Route path="/consultations/new" element={<ConsultationDetail />} />
              <Route path="/consultations/:id" element={<ConsultationDetail />} />
              <Route path="/ordonnance" element={<Ordonnance />} />
              <Route path="/analyses" element={<Analyses />} />
              <Route path="/medicaments" element={<Medicaments />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="/certificats" element={<Certificats />} />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
