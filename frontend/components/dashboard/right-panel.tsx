'use client'

import { CalendarDays, Lock } from 'lucide-react'
import { CalendarWidget } from '@/components/dashboard/calendar-widget'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

function EventsPanel() {
  const { t } = useLanguage()

  const events = [
    {
      title: t.eventAid || "Aïd al-Fitr & Al-Adha",
      description: t.eventAidDesc || "Neutralisation automatique des fenêtres religieuses (Maroc)",
      dates: '20-22 Mars & 27-28 Mai',
      remaining: `Maroc 2026`,
      tone: 'bg-pastel-purple',
      toneFg: 'text-pastel-purple-foreground',
    },
    {
      title: t.eventLeave || "Fenêtre de Congés Légaux",
      description: t.eventLeaveDesc || "Neutralisation des périodes d'absence programmée",
      dates: '21 Avr — 02 Mai',
      remaining: `12d neutralisés`,
      tone: 'bg-pastel-amber',
      toneFg: 'text-pastel-amber-foreground',
    },
    {
      title: t.eventSummer || "Fermeture Estivale Réseau",
      description: t.eventSummerDesc || "Période d'été neutralisée hors animation",
      dates: '01 Juil — 31 Août',
      remaining: t.inProgress || "En cours",
      tone: 'bg-pastel-blue',
      toneFg: 'text-pastel-blue-foreground',
    },
  ]

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="size-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-pretty">{t.upcomingEvents || "Événements & Neutralisations"}</h2>
      </div>
      <ul className="flex flex-col gap-3">
        {events.map((event) => (
          <li key={event.title} className={cn('rounded-xl p-4', event.tone)}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={cn('text-sm font-semibold', event.toneFg)}>{event.title}</p>
                <p className={cn('mt-0.5 text-xs opacity-80', event.toneFg)}>{event.description}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full bg-card/70 px-2.5 py-1 text-xs font-medium whitespace-nowrap',
                  event.toneFg,
                )}
              >
                {event.remaining}
              </span>
            </div>
            <div className={cn('mt-3 flex items-center gap-1.5 text-xs', event.toneFg)}>
              <Lock className="size-3" aria-hidden="true" />
              {event.dates}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function RightPanel() {
  return (
    <div className="flex w-full shrink-0 flex-col gap-4 xl:w-80">
      <CalendarWidget />
      <EventsPanel />
    </div>
  )
}
