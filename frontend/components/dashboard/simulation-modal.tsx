'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, Sliders, Sparkles, X } from 'lucide-react'

interface TrainerOption {
  name: string
  center: string
  animUsed: number
  animTotal: number
}

interface SimulationModalProps {
  isOpen: boolean
  onClose: () => void
  trainers: TrainerOption[]
  onApplySimulation: (sourceName: string, targetName: string, daysToTransfer: number) => void
}

export function SimulationModal({
  isOpen,
  onClose,
  trainers,
  onApplySimulation,
}: SimulationModalProps) {
  const [sourceName, setSourceName] = useState<string>('Nadia Amrani')
  const [targetName, setTargetName] = useState<string>('Omar Chraibi')
  const [daysToTransfer, setDaysToTransfer] = useState<number>(20)
  const [applied, setApplied] = useState<boolean>(false)

  if (!isOpen) return null

  const sourceTrainer = trainers.find((t) => t.name === sourceName) || trainers[0] || {
    name: 'Nadia Amrani',
    center: 'Khouribga',
    animUsed: 135,
    animTotal: 107,
  }

  const targetTrainer = trainers.find((t) => t.name === targetName) || trainers[1] || {
    name: 'Omar Chraibi',
    center: 'Ben Guerir',
    animUsed: 51,
    animTotal: 107,
  }

  // Current metrics
  const sourceCurrent = sourceTrainer.animUsed
  const targetCurrent = targetTrainer.animUsed

  // Simulated metrics
  const sourceNew = Math.max(0, sourceCurrent - daysToTransfer)
  const targetNew = targetCurrent + daysToTransfer

  const sourceCurrentDelta = sourceCurrent - 107
  const sourceNewDelta = sourceNew - 107

  const targetCurrentDelta = targetCurrent - 107
  const targetNewDelta = targetNew - 107

  const handleApply = () => {
    onApplySimulation(sourceName, targetName, daysToTransfer)
    setApplied(true)
    setTimeout(() => {
      setApplied(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sliders className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Simulation d'Impact "What-If"</h3>
              <p className="text-xs text-muted-foreground">Rééquilibrage prédictif de charge entre formateurs</p>
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

        {applied && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Rééquilibrage appliqué avec succès dans le planning courant !
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Formateur Source (Surchargé) */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5">
              <label className="block text-xs font-semibold text-rose-700 dark:text-rose-300 mb-1.5">
                🔴 Formateur Source (Transfert de charge)
              </label>
              <select
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                {trainers.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.center}) — {t.animUsed}j
                  </option>
                ))}
              </select>
            </div>

            {/* Formateur Cible (Disponible) */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1.5">
                🟢 Formateur Cible (Réception de charge)
              </label>
              <select
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {trainers.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name} ({t.center}) — {t.animUsed}j
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slider de transfert */}
          <div className="p-4 rounded-xl border border-border bg-secondary/30">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-foreground">Volume de jours d'animation à transférer</span>
              <span className="font-bold text-primary text-sm font-mono">{daysToTransfer} Jours</span>
            </div>
            <input
              type="range"
              min={5}
              max={40}
              step={5}
              value={daysToTransfer}
              onChange={(e) => setDaysToTransfer(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>5 jours</span>
              <span>20 jours (Recommandé)</span>
              <span>40 jours</span>
            </div>
          </div>

          {/* Comparatif visuel Avant / Après */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Impact Source */}
            <div className="p-3.5 rounded-xl border border-border bg-card text-xs space-y-2">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <span>{sourceName}</span>
                <span className="text-[10px] text-muted-foreground">({sourceTrainer.center})</span>
              </p>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Avant : <strong className="text-rose-600">{sourceCurrent}j</strong> (+{sourceCurrentDelta}j)</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
                <span>Après : <strong className="text-emerald-600">{sourceNew}j</strong> ({sourceNewDelta >= 0 ? `+${sourceNewDelta}j` : `${sourceNewDelta}j`})</span>
              </div>
            </div>

            {/* Impact Cible */}
            <div className="p-3.5 rounded-xl border border-border bg-card text-xs space-y-2">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <span>{targetName}</span>
                <span className="text-[10px] text-muted-foreground">({targetTrainer.center})</span>
              </p>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Avant : <strong className="text-emerald-600">{targetCurrent}j</strong> ({targetCurrentDelta}j)</span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
                <span>Après : <strong className="text-primary font-bold">{targetNew}j</strong> ({targetNewDelta}j)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-border mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-primary-foreground bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            Appliquer le Rééquilibrage
          </button>
        </div>
      </div>
    </div>
  )
}
