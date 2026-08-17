'use client'

import React from 'react'
import { Clock, DoorOpen, MapPin, Pencil, Sparkles, Trash2, UserCheck, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { PlanningSession } from './planning-data'

interface PlanningTableProps {
  sessions: PlanningSession[]
  /** Ouvre le modal d'édition. La colonne Actions n'apparaît que si au moins un handler est fourni. */
  onEditSession?: (session: PlanningSession) => void
  onDeleteSession?: (session: PlanningSession) => void
}

export function PlanningTable({ sessions, onEditSession, onDeleteSession }: PlanningTableProps) {
  const { t, lang } = useLanguage()

  const hasActions = Boolean(onEditSession || onDeleteSession)

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-border bg-secondary/50 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">{t.courseTitleLabel.replace(' *', '')}</th>
            <th className="px-4 py-3 text-left">{t.trainer}</th>
            <th className="px-4 py-3 text-left">{t.domainPole}</th>
            <th className="px-4 py-3 text-left">{t.center}</th>
            <th className="px-4 py-3 text-left whitespace-nowrap">{t.period}</th>
            <th className="px-4 py-3 text-center w-16">{lang === 'en' ? 'DURATION' : 'DURÉE'}</th>
            <th className="px-4 py-3 text-left">{t.status}</th>
            {hasActions && <th className="px-4 py-3 text-right">{t.actions}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 bg-card">
          {sessions.map((session) => (
            <tr key={session.id} className="hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3 text-left font-mono text-xs font-medium text-slate-500 dark:text-slate-400">{session.id}</td>
              <td className="px-4 py-3 text-left font-semibold text-foreground">{session.title}</td>
              <td className="px-4 py-3 text-left font-medium text-foreground">
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
              <td className="px-4 py-3 text-left">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Sparkles className="size-2.5 text-slate-400" />
                  {session.trainerDomain}
                </span>
              </td>
              <td className="px-4 py-3 text-left font-medium text-muted-foreground">
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
              <td className="px-4 py-3 text-left text-muted-foreground font-mono text-[11px] whitespace-nowrap">
                {session.startDate} ➔ {session.endDate}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-14 py-0.5 rounded-md bg-secondary/80 font-bold font-mono text-xs text-foreground">
                  {session.durationDays}j
                </span>
              </td>
              <td className="px-4 py-3 text-left">
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
              {hasActions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEditSession && (
                      <button
                        type="button"
                        onClick={() => onEditSession(session)}
                        aria-label={`${t.edit} ${session.id}`}
                        title={t.edit}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card p-1.5 text-slate-500 hover:bg-secondary hover:text-foreground transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    )}
                    {onDeleteSession && (
                      <button
                        type="button"
                        onClick={() => onDeleteSession(session)}
                        aria-label={`${t.delete} ${session.id}`}
                        title={t.delete}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-500/10 p-1.5 text-rose-500 hover:bg-rose-500/20 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
