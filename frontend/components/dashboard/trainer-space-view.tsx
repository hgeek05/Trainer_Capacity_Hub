'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, PlusCircle, User, X, Clock, MapPin, Calendar, ShieldCheck } from 'lucide-react'
import { EditProfileModal } from './edit-profile-modal'
import { cn } from '@/lib/utils'

export function TrainerSpaceView({ trainerName: initialName = 'Hiba AIT BELMOUMENE' }: { trainerName?: string }) {
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
    <div className="space-y-4 text-xs text-foreground">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-foreground">Mon Espace d'Activité</h1>
            <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-[10px] font-bold">Formateur</span>
          </div>
          <p className="text-muted-foreground text-[11px] mt-0.5">Bienvenue, {trainerName} • Formateur HSE (Pôle AaiT)</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-secondary/80 border border-border px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-medium text-muted-foreground">Statut :</span>
            <button type="button" onClick={toggleAvailability} className={`flex items-center gap-2 px-2.5 py-1 rounded-lg font-semibold text-xs transition-all cursor-pointer shadow-xs ${isAvailable ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'}`}>
              <span className={`size-2 rounded-full bg-white ${isAvailable ? 'animate-pulse' : ''}`} />
              <span>{isAvailable ? 'Disponible' : 'Indisponible'}</span>
            </button>
          </div>
          <button type="button" onClick={() => setShowProfile(true)} className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-border cursor-pointer transition-colors">
            <User className="w-3.5 h-3.5 text-muted-foreground" /> Mon profil
          </button>
          <button type="button" onClick={() => setShowDeclare(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors">
            <PlusCircle className="w-3.5 h-3.5" /> Déclarer une activité
          </button>
        </div>
      </div>

      {toast && <div className="p-3 bg-secondary border border-border text-foreground rounded-xl flex justify-between items-center shadow-lg"><span>{toast}</span><button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="size-4" /></button></div>}
      {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /><span>Activité soumise avec succès au manager (N+1).</span></div>}
      <EditProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} onProfileUpdated={(u) => u?.name && setTrainerName(u.name)} />

      {/* 2. Jauge & Validation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col justify-between">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-foreground">Ma Capacité d'Animation Annuelle</span>
            <span className="text-[11px] text-muted-foreground">Cible : 107 jours / an</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-xs">
              <span className="text-primary">82 jours réalisés / validés</span>
              <span className="text-muted-foreground font-medium">77%</span>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden border border-border/40">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '77%' }} />
            </div>
            <div className="text-[11px] text-muted-foreground">Reste 25 jours favorables d'animation pour atteindre la cible 2026.</div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col justify-between">
          <span className="font-semibold text-foreground">Validation Hiérarchique (N+1)</span>
          <div className="my-2 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs">SA</div>
            <div>
              <div className="font-semibold text-foreground">Soufiane ARROUB</div>
              <div className="text-[11px] text-muted-foreground">Planning Manager</div>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md w-max font-medium flex items-center gap-1">
            <ShieldCheck className="size-3 text-emerald-400" /> Flux de validation actif
          </span>
        </div>
      </div>

      {/* 3. Table des sessions */}
      <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
        <div className="flex border-b border-border px-4 py-2.5 bg-secondary/40 gap-2">
          {(['upcoming', 'completed'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer',
                activeTab === tab
                  ? 'bg-card text-foreground shadow-xs border border-border font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'upcoming' ? `Sessions Planifiées (${sessions.filter(s => s.isUpcoming).length})` : `Sessions Réalisées (${sessions.filter(s => !s.isUpcoming).length})`}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/60 font-semibold text-muted-foreground border-b border-border">
              <tr>
                {['Code', 'Formation / Module', 'Type', 'Lieu / Salle', 'Période', 'Durée', 'Statut N+1'].map((h, i) => (
                  <th key={i} className={`px-3.5 py-2.5 ${h === 'Durée' ? 'text-center' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono text-muted-foreground">{s.id}</td>
                  <td className="px-3.5 py-2.5 font-semibold text-foreground">{s.title}</td>
                  <td className="px-3.5 py-2.5">
                    <span className="bg-secondary text-foreground border border-border px-2 py-0.5 rounded text-[11px] font-medium">{s.type}</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-muted-foreground">{s.center}</td>
                  <td className="px-3.5 py-2.5 text-muted-foreground font-medium">{s.dates}</td>
                  <td className="px-3.5 py-2.5 text-center font-bold text-foreground">{s.duration}j</td>
                  <td className="px-3.5 py-2.5">
                    <span className={cn(
                      'px-2 py-0.5 rounded-md font-medium text-[11px] border inline-flex items-center gap-1',
                      s.status === 'Validé'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    )}>
                      {s.status === 'Validé' ? '✓ Validé' : '⏳ En attente N+1'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Modal Déclaration */}
      {showDeclare && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-foreground rounded-xl max-w-md w-full p-5 shadow-2xl border border-border text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-foreground">Déclarer une Activité</h3>
              <button type="button" onClick={() => setShowDeclare(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleDeclare} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-foreground">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-secondary/70 border border-border rounded-lg p-2 text-foreground focus:border-primary focus:outline-none">
                  {['Animation de session', 'Préparation & Ingénierie', 'Congé Payé Annuel', 'Mission Inter-Centres', 'Indisponibilité'].map(o => <option key={o} value={o} className="bg-card text-foreground">{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-foreground">Intitulé</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Session HSE Sécurité Chimique" className="w-full bg-secondary/70 border border-border rounded-lg p-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-foreground">Centre / Campus</label>
                <select value={form.center} onChange={e => setForm({ ...form, center: e.target.value })} className="w-full bg-secondary/70 border border-border rounded-lg p-2 text-foreground focus:border-primary focus:outline-none">
                  {['Ben Guerir Campus', 'Safi (Atelier Pilote)', 'Jorf Lasfar Campus', 'Khouribga Site'].map(c => <option key={c} value={c} className="bg-card text-foreground">{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-foreground">Début</label>
                  <input type="date" required value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} className="w-full bg-secondary/70 border border-border rounded-lg p-2 text-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-foreground">Fin</label>
                  <input type="date" required value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} className="w-full bg-secondary/70 border border-border rounded-lg p-2 text-foreground focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
                <button type="button" onClick={() => setShowDeclare(false)} className="px-3 py-1.5 bg-secondary text-foreground hover:bg-secondary/80 rounded-lg cursor-pointer transition-colors font-medium">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg cursor-pointer transition-colors shadow-xs">
                  Soumettre (N+1)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrainerSpaceView
