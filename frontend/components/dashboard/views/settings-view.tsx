'use client'

import { Building2, DoorOpen, Sliders, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import {
  TECHNIX_SITES,
  TRAINING_DOMAINS,
} from '@/components/dashboard/planning/planning-reference'
export function SettingsView() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs animate-in fade-in duration-200">
      <div className="border-b border-border pb-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sliders className="size-4 text-primary" />
          {t.settings}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
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
            {TECHNIX_SITES.map((site) => site.name).join(', ')}
          </span>
        </div>
      </div>

      {/* Référentiel : sites, salles et domaines */}
      <div className="space-y-4 border-t border-border pt-6">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Building2 className="size-4 text-primary" />
            {t.referenceDataTitle}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.referenceDataSubtitle}</p>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t.sitesAndRoomsLabel}
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {TECHNIX_SITES.map((site) => (
              <div key={site.id} className="rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{site.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{site.role}</p>
                  </div>
                  <span className="shrink-0 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {site.rooms.length} {t.roomsCountLabel}
                  </span>
                </div>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {site.rooms.map((room) => (
                    <li
                      key={room}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      <DoorOpen className="size-2.5" />
                      {room}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{t.domainsCatalogLabel}</p>
            <span className="shrink-0 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:text-purple-300">
              {TRAINING_DOMAINS.length} {t.domainsCountLabel}
            </span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {TRAINING_DOMAINS.map((domain) => (
              <li
                key={domain}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground"
              >
                <Sparkles className="size-2.5 text-purple-600" />
                {domain}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
