'use client'

import { CalendarDays, Lock } from 'lucide-react'
import { CalendarWidget } from '@/components/dashboard/calendar-widget'
import { useLanguage } from '@/lib/i18n'

function EventsPanel() {
  const { t } = useLanguage()

  const events = [
    {
      title: t.eventAid || 'Aïd al-Fitr & Al-Adha',
      description: t.eventAidDesc || 'Neutralisation automatique des fenêtres religieuses (Maroc)',
      dates: '20-22 Mars & 27-28 Mai',
      remaining: 'Maroc 2026',
      borderClass: 'border-l-4 border-l-[#d6492a]',
      badgeClass: 'bg-[#d6492a]/10 text-[#d6492a] border border-[#d6492a]/30',
    },
    {
      title: t.eventLeave || 'Fenêtre de Congés Légaux',
      description: t.eventLeaveDesc || "Neutralisation des périodes d'absence programmée",
      dates: '21 Avr — 02 Mai',
      remaining: '12j neutralisés',
      borderClass: 'border-l-4 border-l-[#5b0dbc]',
      badgeClass: 'bg-[#5b0dbc]/10 text-[#5b0dbc] dark:text-[#a87bf0] border border-[#5b0dbc]/30',
    },
    {
      title: t.eventSummer || 'Fermeture Estivale Réseau',
      description: t.eventSummerDesc || "Période d'été neutralisée hors animation",
      dates: '01 Juil — 31 Août',
      remaining: t.inProgress || 'En cours',
      borderClass: 'border-l-4 border-l-[#1e1b4b] dark:border-l-slate-400',
      badgeClass: 'bg-secondary text-muted-foreground border border-border',
    },
  ]

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="size-4 text-[#d6492a]" />
        <h2 className="text-base font-extrabold tracking-tight text-foreground">
          {t.upcomingEvents || 'Événements & Neutralisations'}
        </h2>
      </div>
      <ul className="flex flex-col gap-3">
        {events.map((event) => (
          <li
            key={event.title}
            className={`rounded-xl border border-border bg-card p-4 transition-all hover:bg-secondary/40 ${event.borderClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">{event.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap shadow-2xs ${event.badgeClass}`}>
                {event.remaining}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground font-semibold">
              <Lock className="size-3 text-[#d6492a]" aria-hidden="true" />
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
