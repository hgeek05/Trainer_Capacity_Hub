'use client'

import { Sliders } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function SettingsView() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs animate-in fade-in duration-200">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sliders className="size-5 text-primary" />
          {t.settings}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Configuration des seuils d'audit intelligent, gestion des 4 centres et paramètres de calcul.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-border bg-secondary/30 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Cible d'Animation Annuelle (Standard Tuteur)</p>
            <p className="text-xs text-muted-foreground">Volume de jours d'animation maximal recommandé par formateur.</p>
          </div>
          <span className="font-mono text-sm font-bold bg-card border border-border px-3 py-1.5 rounded-lg">107 {t.daysCount}</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-secondary/30 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Génération Automatique des Jours Fériés</p>
            <p className="text-xs text-muted-foreground">Système de neutralisation automatique actif pour le calendrier 2026.</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            ✓ Automatisé (Maroc)
          </span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-secondary/30 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Module d'Analyse Intelligente de Charge</p>
            <p className="text-xs text-muted-foreground">Taux de sensibilité et détection des écarts atypiques.</p>
          </div>
          <span className="font-mono text-sm font-bold bg-card border border-border px-3 py-1.5 rounded-lg">30% (0.30)</span>
        </div>

        <div className="p-4 rounded-xl border border-border bg-secondary/30 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Centres Réseau Actifs</p>
            <p className="text-xs text-muted-foreground">Périmètre géographique restreint aux 4 centres officiels.</p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
            Ben Guerir, Safi, Jorf Lasfar, Khouribga
          </span>
        </div>
      </div>
    </div>
  )
}
