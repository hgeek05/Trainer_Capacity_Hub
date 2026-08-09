'use client'

import { UserPlus, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export function TrainersView() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="size-5 text-primary" />
            {t.trainersViewTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t.trainersViewSubtitle}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 cursor-pointer"
        >
          <UserPlus className="size-4" />
          {t.newTrainer}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground font-medium">{t.activeTrainers}</p>
          <p className="text-2xl font-bold text-foreground mt-1">12 {t.trainers}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{t.qualified2026}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground font-medium">{t.seniorsExperts}</p>
          <p className="text-2xl font-bold text-foreground mt-1">8 {t.trainers}</p>
          <p className="text-[11px] text-primary mt-1 font-medium">{t.priorityCenters}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-secondary/30">
          <p className="text-xs text-muted-foreground font-medium">{t.assignmentRate}</p>
          <p className="text-2xl font-bold text-foreground mt-1">94.2%</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-medium">{t.imminentOverload}</p>
        </div>
      </div>
    </div>
  )
}
