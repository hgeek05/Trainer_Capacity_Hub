'use client'

import { useState } from 'react'
import { Building2, CheckCircle2, Loader2, Sparkles, UserPlus, X } from 'lucide-react'
import { createTrainer, type TrainerApiData } from '@/lib/api'

interface AddTrainerModalProps {
  isOpen: boolean
  onClose: () => void
  onTrainerAdded?: (newTrainer: TrainerApiData) => void
}

export function AddTrainerModal({ isOpen, onClose, onTrainerAdded }: AddTrainerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    center: 'Ben Guerir',
    domain: 'Digital',
    role: 'Formateur',
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const created = await createTrainer(formData)
      if (created) {
        setSuccessMsg(`Formateur ${created.name} enregistré avec succès !`)
        if (onTrainerAdded) {
          onTrainerAdded(created)
        }
        setTimeout(() => {
          setSuccessMsg(null)
          onClose()
          setFormData({
            name: '',
            email: '',
            center: 'Ben Guerir',
            domain: 'Digital',
            role: 'Formateur',
          })
        }, 1200)
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Erreur de connexion avec le backend FastAPI.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Enregistrer un Nouveau Formateur</h3>
              <p className="text-xs text-muted-foreground">Expertises TechniX & Écosystème UM6P / OCP</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-700 dark:text-rose-300">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 text-emerald-500" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Nom et Prénom *</label>
            <input
              type="text"
              required
              placeholder="Ex: Fatima Ait Zzi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-border bg-secondary/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Email Professionnel *</label>
            <input
              type="email"
              required
              placeholder="f.aitzzi@technix.ma"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-border bg-secondary/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Centre d'affectation</label>
              <select
                value={formData.center}
                onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Ben Guerir">Ben Guerir</option>
                <option value="Safi">Safi</option>
                <option value="Jorf Lasfar">Jorf Lasfar</option>
                <option value="Khouribga">Khouribga</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Domaine d'Activité / Pôle</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Digital">Digital</option>
                <option value="HSE">HSE (Sécurité / Environnement)</option>
                <option value="Maintenance industrielle">Maintenance industrielle</option>
                <option value="Chimie et procédés">Chimie et procédés</option>
                <option value="Industrie minière">Industrie minière</option>
                <option value="Énergies renouvelables">Énergies renouvelables</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Niveau / Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="Formateur">Formateur</option>
              <option value="Lead Formateur">Lead Formateur</option>
              <option value="Formateur Senior">Formateur Senior</option>
              <option value="Formateur Expert">Formateur Expert</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Enregistrer dans la BDD
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
