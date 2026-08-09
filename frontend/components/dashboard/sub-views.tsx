'use client'

import { useEffect, useState } from 'react'
import { Activity, Building2, Calendar, CheckCircle, FileSpreadsheet, Sparkles, Sliders, UserPlus, Users } from 'lucide-react'
import { CalendarWidget } from '@/components/dashboard/calendar-widget'
import { fetchMoroccoHolidays, type MoroccoHoliday } from '@/lib/api'

export function TrainersView() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="size-5 text-primary" />
            Gestion détaillée des Formateurs
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Administration centrale des profils, habilitations et affectations par centre (Ben Guerir, Safi, Jorf Lasfar, Khouribga).
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 cursor-pointer"
        >
          <UserPlus className="size-4" />
          Nouveau Formateur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground font-medium">Formateurs Actifs</p>
          <p className="text-2xl font-bold text-foreground mt-1">12 Formateurs</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">✓ 100% qualifiés pour 2026</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground font-medium">Formateurs Seniors / Experts</p>
          <p className="text-2xl font-bold text-foreground mt-1">8 Formateurs</p>
          <p className="text-[11px] text-primary mt-1 font-medium">Ben Guerir & Safi en priorité</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground font-medium">Taux d'affectation</p>
          <p className="text-2xl font-bold text-foreground mt-1">94.2%</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">⚡ 2 en surcharge imminente</p>
        </div>
      </div>
    </div>
  )
}

export function ActivitiesView() {
  const [holidaysList, setHolidaysList] = useState<MoroccoHoliday[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMoroccoHolidays(2026).then((res) => {
      setHolidaysList(res.holidays || [])
      setLoading(false)
    })
  }, [])

  const handleExport = () => {
    const csvHeader = 'Intitule,Date,Type_Neutralisation,Statut\n'
    const csvRows = (holidaysList || [])
      .map((h) => `"${h.name}","${h.date}","Jour Férié / Fête Religieuse Maroc","${h.status || 'Neutralisé'}"`)
      .join('\n')

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Planning_Officiel_Jours_Neutralises_2026_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Suivi des Activités & Planning des Jours Neutralisés
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Génération algorithmique automatique des jours fériés légaux et religieux du Maroc pour 2026.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-xs"
        >
          <FileSpreadsheet className="size-4" />
          Exporter Planning (.xlsx)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="size-4 text-emerald-500" />
            Jours Favorables d'Animation (2026)
          </h3>
          <p className="text-3xl font-bold text-foreground">178 Jours</p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Calculé automatiquement en neutralisant 83 jours de fenêtres bloquées (Aïd, congés légaux, séminaires réseau).
          </p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            Cible d'Animation Optimale
          </h3>
          <p className="text-3xl font-bold text-primary">107 Jours / an</p>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Standard légal préconisé par le tuteur OCP/Technix pour garantir l'équilibre et éviter l'épuisement des ressources.
          </p>
        </div>
      </div>

      {/* Composant Calendrier Interactif autonome */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalendarWidget />
        </div>

        {/* Section des jours fériés calculés automatiquement par Python `holidays` */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-secondary/20 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-4.5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">
                Calendrier Officiel des Jours Fériés du Maroc (2026)
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary">
              <Sparkles className="size-3" />
              Neutralisation Automatique Officielle
            </span>
          </div>

          {loading ? (
            <p className="text-xs text-muted-foreground text-center py-6">Chargement du calendrier officiel...</p>
          ) : holidaysList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {holidaysList.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs hover:border-primary/40 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{h.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{h.date}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    {h.status || 'Neutralisé'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Aucun jour férié trouvé.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function SettingsView() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs animate-in fade-in duration-200">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sliders className="size-5 text-primary" />
          Paramètres du Système & Règles Métier
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
          <span className="font-mono text-sm font-bold bg-card border border-border px-3 py-1.5 rounded-lg">107 Jours</span>
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
