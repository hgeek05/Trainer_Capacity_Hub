'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CalendarCheck, Gauge, Target } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { fetchCapacitySummary, type CapacitySummary } from '@/lib/api'

interface KpiCardsProps {
  timeframe?: 'week' | 'month' | 'year'
}

export function KpiCards({ timeframe = 'year' }: KpiCardsProps) {
  const { t } = useLanguage()
  const [data, setData] = useState<CapacitySummary | null>(null)

  useEffect(() => {
    fetchCapacitySummary().then((res) => {
      if (res) setData(res)
    })
  }, [])

  const scale = timeframe === 'week' ? 1 / 52 : timeframe === 'month' ? 1 / 12 : 1
  const unitLabel = timeframe === 'week' ? 'j/sem' : timeframe === 'month' ? 'j/mois' : t.daysPerYear

  const rawNet = data ? data.capacite_globale_nette : 189
  const rawFav = data ? data.jours_favorables_animation : 178
  const rawTarget = data ? data.cible_animation : 107
  const rawBlocked = data ? data.fenetres_bloquees : 83

  const kpis = [
    {
      label: t.netGlobalCapacity,
      value: (rawNet * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: unitLabel,
      icon: Gauge,
      tone: 'bg-[#d6492a]/15 text-[#d6492a] border border-[#d6492a]/30',
    },
    {
      label: t.favorableDays,
      value: (rawFav * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: CalendarCheck,
      tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    },
    {
      label: t.animationTarget,
      value: (rawTarget * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: Target,
      tone: 'bg-[#5b0dbc]/15 text-[#5b0dbc] dark:text-[#a87bf0] border border-[#5b0dbc]/30',
    },
    {
      label: t.blockedWindows,
      value: (rawBlocked * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: AlertTriangle,
      tone: 'bg-[#1e1b4b] text-amber-300 border border-indigo-900/60 shadow-xs',
    },
  ]

  return (
    <section aria-label="KPI" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <article
            key={kpi.label}
            className="flex items-start justify-between rounded-2xl border border-border/80 bg-card p-4.5 transition-all hover:shadow-md"
          >
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-extrabold tracking-tight text-foreground">
                {kpi.value}
                <span className="ml-1 text-xs font-semibold text-muted-foreground">{kpi.unit}</span>
              </p>
            </div>
            <div className={`flex size-10 items-center justify-center rounded-xl ${kpi.tone}`}>
              <Icon className="size-5" strokeWidth={1.75} />
            </div>
          </article>
        )
      })}
    </section>
  )
}
