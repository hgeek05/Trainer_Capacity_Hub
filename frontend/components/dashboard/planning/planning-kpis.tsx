'use client'

import { useLanguage } from '@/lib/i18n'

interface PlanningKpisProps {
  totalSessions: number
}

export function PlanningKpis({ totalSessions }: PlanningKpisProps) {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl border border-border bg-secondary/30">
        <p className="text-xs text-muted-foreground font-medium">{t.plannedSessions}</p>
        <p className="text-2xl font-bold text-foreground mt-1">{totalSessions} {t.sessionsCountLabel}</p>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">{t.scheduleUpToDate}</p>
      </div>

      <div className="p-4 rounded-xl border border-border bg-secondary/30">
        <p className="text-xs text-muted-foreground font-medium">{t.trainersInSession}</p>
        <p className="text-2xl font-bold text-foreground mt-1">12 {t.mobilized}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-semibold">{t.across4Centers}</p>
      </div>

      <div className="p-4 rounded-xl border border-border bg-secondary/30">
        <p className="text-xs text-muted-foreground font-medium">{t.volumeEngaged}</p>
        <p className="text-2xl font-bold text-foreground mt-1">856 {t.days}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-semibold">{t.targetMax}</p>
      </div>

      <div className="p-4 rounded-xl border border-border bg-secondary/30">
        <p className="text-xs text-muted-foreground font-medium">{t.assignmentRate}</p>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">94.8%</p>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">{t.onTrack}</p>
      </div>
    </div>
  )
}
