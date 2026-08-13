'use client'

import React from 'react'
import { Clock, MapPin } from 'lucide-react'

export interface SessionInfo {
  trainerName: string
  trainerDomain: string
  courseTitle: string
  center: string
}

interface CalendarSessionItemProps {
  session: SessionInfo
  confirmedLabel: string
}

export function CalendarSessionItem({ session, confirmedLabel }: CalendarSessionItemProps) {
  return (
    <div className="p-3 rounded-xl border border-border bg-secondary/30 text-xs space-y-1">
      <div className="flex items-center justify-between font-bold text-foreground">
        <span>{session.trainerName}</span>
        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
          {session.trainerDomain}
        </span>
      </div>
      <p className="text-muted-foreground text-[11px]">{session.courseTitle}</p>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <MapPin className="size-3 text-slate-400" /> {session.center}
        </span>
        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          <Clock className="size-3 text-slate-400" /> {confirmedLabel}
        </span>
      </div>
    </div>
  )
}
