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
    <section className="rounded-xl border border-border bg-card p-3.5">
      <div className="mb-3 flex items-center gap-1.5">
        <CalendarDays className="size-3.5 text-[#d6492a]" />
        <h2 className="text-xs font-extrabold tracking-tight text-foreground">
          {t.upcomingEvents || 'Événements & Neutralisations'}
        </h2>
      </div>
      <ul className="flex flex-col gap-2">
        {events.map((event) => (
          <li
            key={event.title}
            className={`rounded-lg border border-border bg-card p-2.5 transition-all hover:bg-secondary/40 ${event.borderClass}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-foreground truncate">{event.title}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground leading-snug line-clamp-1">{event.description}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold whitespace-nowrap ${event.badgeClass}`}>
                {event.remaining}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
              <Lock className="size-2.5 text-[#d6492a]" aria-hidden="true" />
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
    <div className="flex w-full flex-col gap-3">
      <CalendarWidget />
      <EventsPanel />
    </div>
  )
}
