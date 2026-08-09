'use client';

import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:8000';

function MetricCard({ label, value, accent = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.35)] backdrop-blur">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ value }) {
  const tone = useMemo(() => {
    if (value === 'Bloquée') {
      return 'bg-red-500/15 text-red-200 ring-1 ring-red-500/30';
    }
    if (value === 'Surveille') {
      return 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30';
    }
    return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30';
  }, [value]);

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${tone}`}>{value}</span>;
}

export default function SuperAdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [summaryResponse, dashboardResponse] = await Promise.all([
          fetch(`${API_BASE}/capacity/summary`),
          fetch(`${API_BASE}/capacity/dashboard`),
        ]);

        if (!summaryResponse.ok || !dashboardResponse.ok) {
          throw new Error('Impossible de charger le dashboard');
        }

        const [summaryData, dashboardData] = await Promise.all([
          summaryResponse.json(),
          dashboardResponse.json(),
        ]);

        if (!isMounted) {
          return;
        }

        setSummary(summaryData);
        setItems(dashboardData);
      } catch (exception) {
        if (isMounted) {
          setError(exception instanceof Error ? exception.message : 'Erreur inconnue');
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#0f172a_40%,_#111827_100%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300/80">Trainer Capacity Hub</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Cockpit Super Admin</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Vue consolidée des KPI de capacité et du suivi opérationnel des formateurs.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-sm text-sky-100">
            API connectée sur <span className="font-semibold">localhost:8000</span>
          </div>
        </div>

        {error ? (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Capacité Globale Nette" value={summary ? `${summary.capacite_globale_nette} j` : '...'} accent="text-sky-200" />
          <MetricCard label="Jours Favorables" value={summary ? `${summary.jours_favorables_animation} j` : '...'} accent="text-emerald-200" />
          <MetricCard label="Cible Animation" value={summary ? `${summary.cible_animation} j` : '...'} accent="text-violet-200" />
          <MetricCard label="Fenêtres Bloquées" value={summary ? `${summary.fenetres_bloquees} j` : '...'} accent="text-red-200" />
          <MetricCard label="Hors Animation Cible" value={summary ? `${summary.hors_animation_cible} j` : '...'} accent="text-amber-200" />
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_24px_70px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold">Suivi des formateurs</h2>
              <p className="mt-1 text-sm text-slate-400">Synthèse de charge, animation et alertes.</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {items.length} formateurs
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-6 py-4 font-medium">Formateur</th>
                  <th className="px-6 py-4 font-medium">Global</th>
                  <th className="px-6 py-4 font-medium">Animation</th>
                  <th className="px-6 py-4 font-medium">Fenêtre</th>
                  <th className="px-6 py-4 font-medium">Taux</th>
                  <th className="px-6 py-4 font-medium">Alerte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-100">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.formateur_id} className="hover:bg-white/5">
                      <td className="px-6 py-4 font-medium">{item.formateur_id}</td>
                      <td className="px-6 py-4 text-slate-300">{item.global_days}</td>
                      <td className="px-6 py-4 text-slate-300">{item.animation_days}</td>
                      <td className={item.statut_fenetre === 'Bloquée' ? 'px-6 py-4 text-red-300' : 'px-6 py-4 text-slate-300'}>
                        {item.statut_fenetre}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{item.taux}%</td>
                      <td className="px-6 py-4">
                        <StatusBadge value={item.alerte} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-10 text-center text-slate-400" colSpan={6}>
                      Aucune donnée disponible pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}