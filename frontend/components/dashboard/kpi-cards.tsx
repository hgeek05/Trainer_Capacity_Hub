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
      tone: 'bg-secondary text-muted-foreground border border-border',
    },
    {
      label: t.favorableDays,
      value: (rawFav * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: CalendarCheck,
      tone: 'bg-secondary text-muted-foreground border border-border',
    },
    {
      label: t.animationTarget,
      value: (rawTarget * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: Target,
      tone: 'bg-secondary text-muted-foreground border border-border',
    },
    {
      label: t.blockedWindows,
      value: (rawBlocked * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: AlertTriangle,
      tone: 'bg-secondary text-muted-foreground border border-border',
    },
  ]

  return (
    <section aria-label="KPI" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <article
            key={kpi.label}
            className="flex items-start justify-between rounded-xl border border-border/80 bg-card p-3.5 transition-all hover:shadow-xs"
          >
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-medium text-muted-foreground">{kpi.label}</p>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {kpi.value}
                <span className="ml-1 text-xs font-normal text-muted-foreground">{kpi.unit}</span>
              </p>
            </div>
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${kpi.tone}`}>
              <Icon className="size-4" strokeWidth={1.75} />
            </div>
          </article>
        )
      })}
    </section>
  )
}
