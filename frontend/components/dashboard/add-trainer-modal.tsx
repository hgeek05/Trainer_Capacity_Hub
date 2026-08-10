'use client'

import React, { useState } from 'react'
import { CheckCircle2, Loader2, Sparkles, UserPlus, X } from 'lucide-react'
import { createTrainer, type TrainerApiData } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'
import { TrainerFormFields, type TrainerFormData } from '@/components/dashboard/add-trainer/trainer-form-fields'

interface AddTrainerModalProps {
  isOpen: boolean
  onClose: () => void
  onTrainerAdded?: (newTrainer: TrainerApiData) => void
}

export function AddTrainerModal({ isOpen, onClose, onTrainerAdded }: AddTrainerModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<TrainerFormData>({
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

    const sanitizedData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      center: formData.center.trim(),
      domain: formData.domain.trim(),
      role: formData.role.trim(),
    }

    if (sanitizedData.name.length < 2) {
      setErrorMsg('Le nom doit contenir au moins 2 caractères.')
      setLoading(false)
      return
    }

    try {
      const created = await createTrainer(sanitizedData)
      if (created) {
        setSuccessMsg(t.trainerSavedSuccess)
        if (onTrainerAdded) onTrainerAdded(created)
        setTimeout(() => {
          setSuccessMsg(null)
          onClose()
          setFormData({ name: '', email: '', center: 'Ben Guerir', domain: 'Digital', role: 'Formateur' })
        }, 1200)
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erreur de connexion avec le backend FastAPI.')
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
              <h3 className="text-base font-bold text-foreground">{t.addTrainerTitle}</h3>
              <p className="text-xs text-muted-foreground">{t.addTrainerSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {errorMsg && <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-700 dark:text-rose-300">⚠️ {errorMsg}</div>}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 text-emerald-500" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TrainerFormFields formData={formData} onChange={setFormData} />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button onClick={onClose} type="button" className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer">
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? <><Loader2 className="size-3.5 animate-spin" />{t.savingProgress}</> : <><Sparkles className="size-3.5" />{t.saveTrainer}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
