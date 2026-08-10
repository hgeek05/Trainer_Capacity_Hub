'use client'

import React from 'react'
import { Clock, MapPin, Sparkles, UserCheck } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { PlanningSession } from './planning-data'

interface PlanningTableProps {
  sessions: PlanningSession[]
}

export function PlanningTable({ sessions }: PlanningTableProps) {
  const { t, lang } = useLanguage()

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-border bg-secondary/50 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">{t.courseTitleLabel.replace(' *', '')}</th>
            <th className="px-4 py-3">{t.trainer}</th>
            <th className="px-4 py-3">{t.domainPole}</th>
            <th className="px-4 py-3">{t.center}</th>
            <th className="px-4 py-3">{t.period}</th>
            <th className="px-4 py-3">{t.days}</th>
            <th className="px-4 py-3">{t.status}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-card">
          {sessions.map((session) => (
            <tr key={session.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 font-mono font-bold text-primary">{session.id}</td>
              <td className="px-4 py-3 font-semibold text-foreground">{session.title}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-purple-600" />
                  {session.trainerName}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-600/10 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                  <Sparkles className="size-2.5" />
                  {session.trainerDomain}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-rose-500" />
                  {session.center}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                {session.startDate} ➔ {session.endDate}
              </td>
              <td className="px-4 py-3 font-bold text-foreground">{session.durationDays}{t.days}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                    session.status === 'IN_PROGRESS'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                      : session.status === 'CONFIRMED'
                        ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20',
                  )}
                >
                  <Clock className="size-2.5" />
                  {session.status === 'IN_PROGRESS' ? (lang === 'en' ? 'Ongoing' : 'En Cours') : session.status === 'CONFIRMED' ? (lang === 'en' ? 'Confirmed' : 'Confirmé') : (lang === 'en' ? 'Scheduled' : 'Planifié')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
