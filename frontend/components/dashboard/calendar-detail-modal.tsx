'use client'

import React from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Sparkles, User, X } from 'lucide-react'
import {
  MOROCCO_HOLIDAYS_2026,
  MOROCCO_HOLIDAYS_2026_EN,
  MOCK_SESSIONS_MAP,
  MOCK_SESSIONS_MAP_EN,
} from '@/lib/calendar-data'

interface CalendarDetailModalProps {
  selectedDayDetails: { dateStr: string; dayNum: number } | null
  onClose: () => void
  todayStr: string
  t: any
  lang: string
}

export function CalendarDetailModal({
  selectedDayDetails,
  onClose,
  todayStr,
  t,
  lang,
}: CalendarDetailModalProps) {
  if (!selectedDayDetails) return null

  const { dateStr } = selectedDayDetails
  const holiday = MOROCCO_HOLIDAYS_2026[dateStr]
  const holidayName =
    lang === 'en' && MOROCCO_HOLIDAYS_2026_EN[dateStr]
      ? MOROCCO_HOLIDAYS_2026_EN[dateStr]
      : holiday?.name

  const sessionsMap = lang === 'en' ? MOCK_SESSIONS_MAP_EN : MOCK_SESSIONS_MAP
  const sessions = sessionsMap[dateStr] || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-primary" />
            <h3 className="font-bold text-sm text-foreground">
              {t.calendarModalDetails} {dateStr}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div>
          {holiday ? (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              {t.calendarModalOfficialNeutralized} {holidayName}
            </div>
          ) : dateStr === todayStr ? (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              {t.calendarModalToday}
            </div>
          ) : dateStr < todayStr ? (
            <div className="p-3 rounded-xl bg-secondary/80 border border-border text-muted-foreground text-xs font-medium">
              {t.calendarModalPast}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              {t.calendarModalFavorable}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
            <User className="size-3.5 text-purple-600" />
            {t.calendarModalTrainersHeader}
          </h4>
          {sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-secondary/30 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>{s.trainerName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                      {s.trainerDomain}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">{s.courseTitle}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3 text-rose-500" /> {s.center}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-amber-500" /> {t.calendarSessionConfirmed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-3 text-center border border-dashed border-border rounded-xl">
              {t.calendarModalNoSessions}
            </p>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            {t.calendarModalClose}
          </button>
        </div>
      </div>
    </div>
  )
}
