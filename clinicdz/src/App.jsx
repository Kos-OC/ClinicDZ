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
import Consultation from './pages/Consultation';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useStore();
  const links = [
    { to: '/accueil', label: 'Accueil', icon: '📊' },
    { to: '/patients', label: 'Patients', icon: '👥' },
    { to: '/medicaments', label: 'Médicaments', icon: '💊' },
    { to: '/ordonnance', label: 'Ordonnance', icon: '📝' },
    { to: '/analyses', label: 'Analyses', icon: '🧪' },
    { to: '/certificats', label: 'Certificats', icon: '📄' },
    { to: '/parametres', label: 'Paramètres', icon: '⚙️' },
  ];

  return (
    <div className={`bg-slate-900 text-white min-h-screen flex flex-col shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className={`flex items-center border-b border-slate-800 ${collapsed ? 'justify-center p-4' : 'p-6'}`}>
        {!collapsed && <div className="text-2xl font-bold">ClinicDZ</div>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-slate-400 hover:text-white transition-colors text-xl ${collapsed ? 'p-2' : 'ml-auto'}`}
          title={collapsed ? 'Développer' : 'Réduire'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 mt-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            title={collapsed ? link.label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg transition-all ${
                collapsed
                  ? 'justify-center p-3'
                  : 'p-3'
              } ${isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {link.icon && <span className="text-lg">{link.icon}</span>}
            {!collapsed && <span className={link.icon ? 'ml-3' : ''}>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
      <button 
        onClick={toggleTheme}
        className="m-4 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-center"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className={`border-t border-slate-800 text-slate-500 text-xs text-center ${collapsed ? 'p-2' : 'p-4'}`}>
        {collapsed ? 'v1' : 'ClinicDZ v1.0.0'}
      </div>
    </div>
  );
};

function App() {
  const { theme } = useStore();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

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
      <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-900'} font-sans`}>
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
              <Route path="/certificats" element={<Certificats />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/parametres" element={<Parametres />} />
            </Routes>
          </div>
        </main>
      </div>
//...
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
