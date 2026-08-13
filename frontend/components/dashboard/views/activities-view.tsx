'use client'

import { useEffect, useState } from 'react'
import { Activity, Building2, Calendar, CheckCircle, FileSpreadsheet, Sparkles } from 'lucide-react'
import { CalendarWidget } from '@/components/dashboard/calendar-widget'
import { fetchMoroccoHolidays, type MoroccoHoliday } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'

export function ActivitiesView() {
  const { t } = useLanguage()
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
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            {t.activitiesViewTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.activitiesViewSubtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-xs"
        >
          <FileSpreadsheet className="size-3.5" />
          {t.exportPlanning}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <CheckCircle className="size-4 text-emerald-500" />
            {t.favorableDaysCount}
          </h3>
          <p className="text-2xl font-bold text-foreground">178 {t.daysCount}</p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {t.favorableDaysDesc}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            {t.optimalTargetTitle}
          </h3>
          <p className="text-2xl font-bold text-primary">107 {t.daysPerYearUnit}</p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {t.optimalTargetDesc}
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
                {t.officialCalendarTitle}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary">
              <Sparkles className="size-3" />
              {t.autoNeutralization}
            </span>
          </div>

          {loading ? (
            <p className="text-xs text-muted-foreground text-center py-6">{t.loadingOfficialCalendar}</p>
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
                    {h.status || t.blocked}
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