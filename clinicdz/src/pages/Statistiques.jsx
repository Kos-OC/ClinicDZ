import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { calculateAge } from '../utils/calculations';

export default function Statistiques() {
  const { patients, prescriptions, drugs } = useStore();

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    // Basic counts
    const totalPatients = patients.length;
    const totalOrdonances = prescriptions.filter(p => p.type === 'ordonnance').length;
    const totalAnalyses = prescriptions.filter(p => p.type === 'analyse').length;
    const totalPrescriptions = prescriptions.length;
    const totalDrugs = drugs.length;

    // Prescriptions this month
    const thisMonthPrescriptions = prescriptions.filter(p => {
      const d = new Date(p.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    // Age group distribution
    const ageGroups = {
      '0-14': 0,
      '15-34': 0,
      '35-54': 0,
      '55-74': 0,
      '75+': 0,
    };

    patients.forEach(p => {
      const age = calculateAge(p.dateNaissance);
      if (age === '') return;
      if (age < 15) ageGroups['0-14']++;
      else if (age < 35) ageGroups['15-34']++;
      else if (age < 55) ageGroups['35-54']++;
      else if (age < 75) ageGroups['55-74']++;
      else ageGroups['75+']++;
    });

    // Monthly prescriptions for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      const count = prescriptions.filter(p => {
        const pd = new Date(p.date);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      }).length;
      monthlyData.push({ month, count });
    }

    // Most prescribed drugs (top 10)
    const drugCount = {};
    prescriptions.forEach(p => {
      if (p.items) {
        p.items.forEach(item => {
          if (item.drugId) {
            drugCount[item.drugId] = (drugCount[item.drugId] || 0) + 1;
          }
        });
      }
    });
    const topDrugs = Object.entries(drugCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([drugId, count]) => {
        const drug = drugs.find(d => d.id === drugId);
        return { name: drug ? drug.nom : 'Inconnu', count };
      });

    return {
      totalPatients,
      totalOrdonances,
      totalAnalyses,
      totalPrescriptions,
      totalDrugs,
      thisMonthPrescriptions,
      ageGroups,
      monthlyData,
      topDrugs,
    };
  }, [patients, prescriptions, drugs]);

  const maxMonthlyCount = Math.max(...stats.monthlyData.map(d => d.count), 1);
  const maxDrugCount = Math.max(...stats.topDrugs.map(d => d.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Statistiques</h1>
        <p className="text-slate-500 mt-1">Aperçu de votre activité</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-3xl font-bold text-blue-600">{stats.totalPatients}</div>
          <div className="text-sm text-slate-500 mt-1">Patients</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-3xl font-bold text-green-600">{stats.totalOrdonances}</div>
          <div className="text-sm text-slate-500 mt-1">Ordonnances</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-3xl font-bold text-purple-600">{stats.totalAnalyses}</div>
          <div className="text-sm text-slate-500 mt-1">Analyses</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="text-3xl font-bold text-orange-600">{stats.totalDrugs}</div>
          <div className="text-sm text-slate-500 mt-1">Médicaments</div>
        </div>
      </div>

      {/* This month */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
        <div className="text-lg font-medium opacity-80">Ce mois-ci</div>
        <div className="text-4xl font-bold mt-2">{stats.thisMonthPrescriptions}</div>
        <div className="text-sm opacity-80 mt-1">prescriptions émises</div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly prescriptions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Prescriptions par mois</h2>
          <div className="space-y-3">
            {stats.monthlyData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-16 text-xs text-slate-500">{d.month}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${(d.count / maxMonthlyCount) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-xs text-slate-600 text-right">{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Age distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Patients par âge</h2>
          <div className="space-y-3">
            {Object.entries(stats.ageGroups).map(([group, count]) => (
              <div key={group} className="flex items-center gap-3">
                <div className="w-12 text-xs text-slate-500">{group}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all"
                    style={{ width: `${(count / stats.totalPatients) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-xs text-slate-600 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top prescribed drugs */}
      {stats.topDrugs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Médicaments les plus prescrits</h2>
          <div className="space-y-3">
            {stats.topDrugs.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 text-xs text-slate-400">{i + 1}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all"
                    style={{ width: `${(d.count / maxDrugCount) * 100}%` }}
                  />
                </div>
                <div className="flex-1 text-xs text-slate-600 truncate">{d.name}</div>
                <div className="w-8 text-xs text-slate-600 text-right">{d.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no data */}
      {stats.totalPrescriptions === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-slate-900">Pas encore de données</h3>
          <p className="text-slate-500 mt-2">Les statistiques apparaîtront une fois que vous aurez créé des ordonnances et des analyses.</p>
        </div>
      )}
    </div>
  );
}