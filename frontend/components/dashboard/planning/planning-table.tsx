'use client'

import React from 'react'
import { Clock, DoorOpen, MapPin, Pencil, Sparkles, UserCheck, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { PlanningSession } from './planning-data'

interface PlanningTableProps {
  sessions: PlanningSession[]
  /** Ouvre le modal d'édition. La colonne Actions n'apparaît que si le handler est fourni. */
  onEditSession?: (session: PlanningSession) => void
}

export function PlanningTable({ sessions, onEditSession }: PlanningTableProps) {
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
            {onEditSession && <th className="px-4 py-3 text-right">{t.actions}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-card">
          {sessions.map((session) => (
            <tr key={session.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 font-mono text-xs font-medium text-slate-500 dark:text-slate-400">{session.id}</td>
              <td className="px-4 py-3 font-semibold text-foreground">{session.title}</td>
              <td className="px-4 py-3 font-medium text-foreground">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-slate-400" />
                  {session.trainerName}
                </span>
                {session.coTrainerName && (
                  <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-normal text-muted-foreground">
                    <Users className="size-2.5 text-slate-400" />
                    {session.coTrainerName}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Sparkles className="size-2.5 text-slate-400" />
                  {session.trainerDomain}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-muted-foreground">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 text-xs">
                  <MapPin className="size-3 text-slate-400" />
                  {session.center}
                </span>
                {session.room && (
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground/80">
                    <DoorOpen className="size-2.5 text-slate-400" />
                    {session.room}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                {session.startDate} ➔ {session.endDate}
              </td>
              <td className="px-4 py-3 font-bold text-foreground">{session.durationDays}{t.days}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border',
                    session.status === 'IN_PROGRESS'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : session.status === 'CONFIRMED'
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                  )}
                >
                  <Clock className="size-2.5" />
                  {session.status === 'IN_PROGRESS' ? (lang === 'en' ? 'Ongoing' : 'En Cours') : session.status === 'CONFIRMED' ? (lang === 'en' ? 'Confirmed' : 'Confirmé') : (lang === 'en' ? 'Scheduled' : 'Planifié')}
                </span>
              </td>
              {onEditSession && (
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onEditSession(session)}
                    aria-label={`${t.edit} ${session.id}`}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="size-3 text-slate-400" />
                    {t.edit}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
