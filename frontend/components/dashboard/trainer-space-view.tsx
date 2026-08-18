'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, PlusCircle, User, X } from 'lucide-react'
import { EditProfileModal } from './edit-profile-modal'

export function TrainerSpaceView({ trainerName: initialName = 'Fatima AIT ZZI' }: { trainerName?: string }) {
  const [trainerName, setTrainerName] = useState(initialName)
  const [isAvailable, setIsAvailable] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [showDeclare, setShowDeclare] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('current_user') || '{}')
      if (u.name) setTrainerName(u.name)
      const av = localStorage.getItem('trainer_is_available')
      if (av !== null) setIsAvailable(av === 'true')
    } catch (e) { console.warn(e) }
  }, [])

  const toggleAvailability = () => {
    const next = !isAvailable
    setIsAvailable(next)
    localStorage.setItem('trainer_is_available', String(next))
    setToast(next ? '✅ Vous êtes marqué(e) comme DISPONIBLE.' : '⏸️ Vous êtes marqué(e) comme INDISPONIBLE.')
    setTimeout(() => setToast(null), 3500)
  }

  const [sessions, setSessions] = useState([
    { id: 'SES-2026-01', title: 'Prévention des Risques & Sécurité Industrielle', type: 'Animation HSE', dates: '10/08/2026 → 14/08/2026', duration: 5, center: 'Ben Guerir (Amphi Al Khwarizmi)', status: 'Validé', isUpcoming: true },
    { id: 'SES-2026-06', title: 'Audit Terrain & Conformité HSE', type: 'Visite Terrain', dates: '25/08/2026 → 28/08/2026', duration: 4, center: 'Safi (Atelier Pilote)', status: 'En Attente', isUpcoming: true },
    { id: 'SES-2026-07', title: 'Formation Risques Électriques', type: 'Animation', dates: '02/02/2026 → 06/02/2026', duration: 5, center: 'Ben Guerir Campus', status: 'Validé', isUpcoming: false },
  ])

  const [form, setForm] = useState({ type: 'Animation de session', title: '', center: 'Ben Guerir Campus', start: '', end: '' })
  const filtered = sessions.filter(s => activeTab === 'upcoming' ? s.isUpcoming : !s.isUpcoming)

  const handleDeclare = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return
    const diff = form.start && form.end ? Math.max(1, Math.ceil((new Date(form.end).getTime() - new Date(form.start).getTime()) / 86400000) + 1) : 3
    setSessions([{ id: `SES-2026-0${sessions.length + 1}`, title: form.title, type: form.type, dates: `${form.start || '2026-09-01'} → ${form.end || '2026-09-05'}`, duration: diff, center: form.center, status: 'En Attente', isUpcoming: true }, ...sessions])
    setShowDeclare(false); setForm({ ...form, title: '' }); setSuccess(true); setTimeout(() => setSuccess(false), 4000)
  }

  return (
    <div className="space-y-4 text-xs text-slate-700">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900">Mon Espace d'Activité</h1>
            <span className="bg-[#E04F26]/10 text-[#E04F26] border border-[#E04F26]/20 px-2 py-0.5 rounded-full text-[10px] font-bold">Formateur</span>
          </div>
          <p className="text-slate-500 text-[11px] mt-0.5">Bienvenue, {trainerName} • Formateur HSE (Pôle AaiT)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-medium text-slate-600">Statut :</span>
            <button type="button" onClick={toggleAvailability} className={`flex items-center gap-2 px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer shadow-xs ${isAvailable ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}>
              <span className={`size-2 rounded-full bg-white ${isAvailable ? 'animate-pulse' : ''}`} />
              <span>{isAvailable ? 'Disponible' : 'Indisponible'}</span>
            </button>
          </div>
          <button type="button" onClick={() => setShowProfile(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200 cursor-pointer">
            <User className="w-3.5 h-3.5 text-slate-500" /> Mon profil
          </button>
          <button type="button" onClick={() => setShowDeclare(true)} className="bg-[#E04F26] hover:bg-[#CC3B14] text-white font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer">
            <PlusCircle className="w-3.5 h-3.5" /> Déclarer une activité
          </button>
        </div>
      </div>

      {toast && <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center shadow-lg"><span>{toast}</span><button onClick={() => setToast(null)} className="text-slate-400 hover:text-white"><X className="size-4" /></button></div>}
      {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /><span>Activité soumise avec succès au manager (N+1).</span></div>}
      <EditProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} onProfileUpdated={(u) => u?.name && setTrainerName(u.name)} />

      {/* 2. Jauge & Validation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between mb-2"><span className="font-semibold text-slate-800">Ma Capacité d'Animation Annuelle</span><span className="text-[11px] text-slate-500">Cible : 107 jours / an</span></div>
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-xs"><span className="text-[#E04F26]">82 jours réalisés / validés</span><span className="text-slate-500">77%</span></div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#E04F26] rounded-full" style={{ width: '77%' }} /></div>
            <div className="text-[11px] text-slate-400">Reste 25 jours favorables d'animation pour atteindre la cible 2026.</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="font-semibold text-slate-800">Validation Hiérarchique (N+1)</span>
          <div className="my-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E04F26]/10 border border-[#E04F26]/20 flex items-center justify-center font-bold text-[#E04F26]">SA</div>
            <div><div className="font-semibold text-slate-900">Soufiane ARROUB</div><div className="text-[11px] text-slate-400">Planning Manager</div></div>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-max font-medium">Flux de validation actif</span>
        </div>
      </div>

      {/* 3. Table des sessions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 px-4 py-2.5 bg-slate-50/50 gap-2">
          {(['upcoming', 'completed'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${activeTab === tab ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold' : 'text-slate-500 hover:text-slate-800'}`}>
              {tab === 'upcoming' ? `Sessions Planifiées (${sessions.filter(s => s.isUpcoming).length})` : `Sessions Réalisées (${sessions.filter(s => !s.isUpcoming).length})`}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-600 border-b border-slate-200">
              <tr>{['Code', 'Formation / Module', 'Type', 'Lieu / Salle', 'Période', 'Durée', 'Statut N+1'].map((h, i) => <th key={i} className={`px-3 py-2.5 ${h === 'Durée' ? 'text-center' : ''}`}>{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-slate-400">{s.id}</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-900">{s.title}</td>
                  <td className="px-3 py-2.5"><span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px]">{s.type}</span></td>
                  <td className="px-3 py-2.5 text-slate-600">{s.center}</td>
                  <td className="px-3 py-2.5 text-slate-600 font-medium">{s.dates}</td>
                  <td className="px-3 py-2.5 text-center font-bold text-slate-800">{s.duration}j</td>
                  <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-md font-medium text-[11px] border ${s.status === 'Validé' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{s.status === 'Validé' ? '✓ Validé' : '⏳ En attente N+1'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Déclaration */}
      {showDeclare && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-100 text-xs">
            <div className="flex justify-between pb-3 border-b border-slate-100 mb-4"><h3 className="text-sm font-bold text-slate-900">Déclarer une Activité</h3><button type="button" onClick={() => setShowDeclare(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleDeclare} className="space-y-3">
              <div><label className="block font-semibold mb-1">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2">{['Animation de session', 'Préparation & Ingénierie', 'Congé Payé Annuel', 'Mission Inter-Centres', 'Indisponibilité'].map(o => <option key={o}>{o}</option>)}</select></div>
              <div><label className="block font-semibold mb-1">Intitulé</label><input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Session HSE Sécurité Chimique" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2" /></div>
              <div><label className="block font-semibold mb-1">Centre / Campus</label><select value={form.center} onChange={e => setForm({ ...form, center: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2">{['Ben Guerir Campus', 'Safi (Atelier Pilote)', 'Jorf Lasfar Campus', 'Khouribga Site'].map(c => <option key={c}>{c}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block font-semibold mb-1">Début</label><input type="date" required value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2" /></div>
                <div><label className="block font-semibold mb-1">Fin</label><input type="date" required value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2" /></div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100"><button type="button" onClick={() => setShowDeclare(false)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg cursor-pointer">Annuler</button><button type="submit" className="px-4 py-1.5 bg-[#E04F26] text-white font-semibold rounded-lg cursor-pointer">Soumettre (N+1)</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrainerSpaceView
