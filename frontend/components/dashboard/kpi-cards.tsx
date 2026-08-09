'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck, CalendarX, Gauge, Target } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
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

  // Scaling factor for dynamic timeframe: year = 1, month = 1/12, week = 1/52
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
      tone: 'bg-pastel-blue text-pastel-blue-foreground',
    },
    {
      label: t.favorableDays,
      value: (rawFav * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: CalendarCheck,
      tone: 'bg-pastel-green text-pastel-green-foreground',
    },
    {
      label: t.animationTarget,
      value: (rawTarget * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: Target,
      tone: 'bg-pastel-purple text-pastel-purple-foreground',
    },
    {
      label: t.blockedWindows,
      value: (rawBlocked * scale).toFixed(timeframe === 'year' ? 0 : 1),
      unit: t.days,
      icon: CalendarX,
      tone: 'bg-pastel-red text-pastel-red-foreground',
    },
  ]

  return (
    <section aria-label="KPI" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <article
          key={kpi.label}
          className="flex items-start justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-xs"
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground text-pretty">{kpi.label}</p>
            <p className="text-2xl font-semibold tracking-tight">
              {kpi.value}
              <span className="ml-1 text-sm font-normal text-muted-foreground">{kpi.unit}</span>
            </p>
          </div>
          <div className={cn('flex size-10 items-center justify-center rounded-xl', kpi.tone)}>
            <kpi.icon className="size-5" strokeWidth={1.75} />
          </div>
        </article>
      ))}
    </section>
  )
}
