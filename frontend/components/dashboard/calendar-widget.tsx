'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { MOROCCO_HOLIDAYS_2026, MOROCCO_HOLIDAYS_2026_EN } from '@/lib/calendar-data'
import { CalendarDetailModal } from '@/components/dashboard/calendar-detail-modal'

export function CalendarWidget() {
  const { t, lang } = useLanguage()
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 7, 1))
  const [selectedDayDetails, setSelectedDayDetails] = useState<{ dateStr: string; dayNum: number } | null>(null)

  const year = currentDate.getFullYear(), month = currentDate.getMonth()
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month])
  const firstDayOfWeek = useMemo(() => (new Date(year, month, 1).getDay() + 6) % 7, [year, month])
  const emptyDaysArray = useMemo(() => Array.from({ length: firstDayOfWeek }), [firstDayOfWeek])
  const monthDaysArray = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth])

  const changeMonth = useCallback((d: number) => setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() + d, 1)), [])
  const jumpToMonth = useCallback((m: number) => setCurrentDate((p) => new Date(p.getFullYear(), m, 1)), [])
  const getHolidayName = useCallback((d: string, def: string) => (lang === 'en' && MOROCCO_HOLIDAYS_2026_EN[d] ? MOROCCO_HOLIDAYS_2026_EN[d] : def), [lang])

  const currentMonthHolidays = useMemo(() => Object.entries(MOROCCO_HOLIDAYS_2026).filter(([d]) => Number(d.split('-')[0]) === year && Number(d.split('-')[1]) === month + 1), [year, month])
  const shortcuts = [
    { idx: 2, label: t.calendarShortcutAidFitr || (lang === 'en' ? '🌙 Eid al-Fitr (March)' : '🌙 Aïd al-Fitr (Mars)'), color: 'amber' },
    { idx: 4, label: t.calendarShortcutAidAdha || (lang === 'en' ? '🐏 Eid al-Adha (May)' : '🐏 Aïd al-Adha (Mai)'), color: 'amber' },
    { idx: 6, label: t.calendarShortcutThrone || (lang === 'en' ? '👑 Throne Day (July)' : '👑 Fête du Trône (Juillet)'), color: 'rose' },
    { idx: 10, label: t.calendarShortcutGreenMarch || (lang === 'en' ? '🇲🇦 Green March (Nov)' : '🇲🇦 Marche Verte (Novembre)'), color: 'rose' },
  ]

  return (
    <div className="bg-card p-4 sm:p-5 rounded-2xl border border-border shadow-xs relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100"><span>📅</span> {t.months[month]} {year}</div>
        <div className="flex gap-1">
          <button type="button" onClick={() => changeMonth(-1)} className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer" title={t.calendarPrevMonth}>&lt;</button>
          <button type="button" onClick={() => changeMonth(1)} className="w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-bold shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer" title={t.calendarNextMonth}>&gt;</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">{t.calendarShortcuts}</span>
        {shortcuts.map((s) => (<button key={s.idx} type="button" onClick={() => jumpToMonth(s.idx)} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${month === s.idx ? (s.color === 'amber' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-rose-500 text-white border-rose-600 shadow-xs') : (s.color === 'amber' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20' : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20')}`}>{s.label}</button>))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground mb-2">
        {t.weekdays.map((wd: string, i: number) => <span key={i}>{wd}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {emptyDaysArray.map((_, i) => <div key={`e-${i}`} className="h-8 w-8" />)}
        {monthDaysArray.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const holiday = MOROCCO_HOLIDAYS_2026[dateStr], isPast = dateStr < todayStr
          let style = 'hover:bg-primary/10 text-foreground font-medium border border-transparent', tooltip = t.calendarTooltipWorkday
          if (holiday) {
            style = holiday.type === 'religious' ? 'bg-amber-500/30 text-amber-950 dark:text-amber-100 font-extrabold border-2 border-amber-500 shadow-xs scale-105' : 'bg-rose-500/30 text-rose-950 dark:text-rose-100 font-extrabold border-2 border-rose-500 shadow-xs scale-105'
            tooltip = `${holiday.type === 'religious' ? t.calendarTooltipReligious : t.calendarTooltipLegal} ${getHolidayName(dateStr, holiday.name)}`
          } else if (dateStr === todayStr) { style = 'ring-2 ring-primary bg-primary/20 font-bold text-primary shadow-xs'; tooltip = t.calendarTooltipToday }
          else if (isPast) { style = 'bg-secondary/60 text-muted-foreground/70 font-normal hover:bg-secondary'; tooltip = `${t.calendarTooltipPast} (${dateStr})` }
          else if (month === 6 || month === 7) { style = 'bg-secondary text-muted-foreground/50 line-through'; tooltip = t.calendarTooltipSummer }

          return (
            <div key={day} title={tooltip} onClick={() => setSelectedDayDetails({ dateStr, dayNum: day })} className={`h-8 w-8 relative flex flex-col items-center justify-center rounded-lg text-xs cursor-pointer mx-auto transition-all ${style}`}>
              <span>{day}</span>
              {holiday && <span className="text-[7px] font-bold uppercase tracking-tight -mt-0.5">{holiday.type === 'religious' ? t.calendarHolidayAid : t.calendarHolidayLegal}</span>}
              {isPast && !holiday && <span className="absolute -top-0.5 -right-0.5 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">✓</span>}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-primary" /> {t.calendarEventsOf} {t.months[month]} {year} :</span>
          <span className="text-[10px] font-semibold text-muted-foreground">{currentMonthHolidays.length} {t.calendarNeutralizedDays}</span>
        </div>
        {currentMonthHolidays.length > 0 ? (
          <div className="space-y-1.5">
            {currentMonthHolidays.map(([dStr, h], idx) => (
              <div key={idx} onClick={() => setSelectedDayDetails({ dateStr: dStr, dayNum: Number(dStr.split('-')[2]) })} className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer border transition-all hover:scale-[1.01] ${h.type === 'religious' ? 'bg-amber-500/10 text-amber-800 dark:text-amber-200 border-amber-500/30' : 'bg-rose-500/10 text-rose-800 dark:text-rose-200 border-rose-500/30'}`}>
                <div className="flex items-center gap-2"><span>{h.type === 'religious' ? '🌙' : '🇲🇦'}</span><span>{getHolidayName(dStr, h.name)}</span></div>
                <span className="font-mono text-[10px] opacity-80">{dStr}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-[11px] text-muted-foreground py-2 text-center bg-secondary/40 rounded-lg border border-border/60">{t.calendarNoHolidays.replace('{month}', t.months[month])}</p>}
      </div>

      <div className="mt-3 pt-3 border-t border-border space-y-1 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-amber-500 border border-amber-600" /> {t.calendarLegendReligious}</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-rose-500 border border-rose-600" /> {t.calendarLegendLegal}</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-secondary border border-border" /> {t.calendarLegendPast}</div>
      </div>

      <CalendarDetailModal selectedDayDetails={selectedDayDetails} onClose={() => setSelectedDayDetails(null)} todayStr={todayStr} t={t} lang={lang} />
    </div>
  )
}
