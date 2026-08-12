'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { MOROCCO_HOLIDAYS_2026, MOROCCO_HOLIDAYS_2026_EN } from '@/lib/calendar-data'
import { CalendarDetailModal } from '@/components/dashboard/calendar-detail-modal'
import { CalendarShortcuts } from '@/components/dashboard/calendar/calendar-shortcuts'
import { CalendarLegend } from '@/components/dashboard/calendar/calendar-legend'

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
      <div className="flex justify-between items-center mb-4 bg-secondary/50 p-2 rounded-xl border border-border">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground"><span>📅</span> {t.months[month]} {year}</div>
        <div className="flex gap-1">
          <button type="button" onClick={() => changeMonth(-1)} className="w-7 h-7 flex items-center justify-center bg-card border border-border rounded-lg text-xs font-bold shadow-2xs hover:bg-secondary cursor-pointer">&lt;</button>
          <button type="button" onClick={() => changeMonth(1)} className="w-7 h-7 flex items-center justify-center bg-card border border-border rounded-lg text-xs font-bold shadow-2xs hover:bg-secondary cursor-pointer">&gt;</button>
        </div>
      </div>

      <CalendarShortcuts label={t.calendarShortcuts} shortcuts={shortcuts} currentMonth={month} onJumpToMonth={jumpToMonth} />

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground mb-2">
        {t.weekdays.map((wd: string, i: number) => <span key={i}>{wd}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {emptyDaysArray.map((_, i) => <div key={`e-${i}`} className="h-8 w-8" />)}
        {monthDaysArray.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const holiday = MOROCCO_HOLIDAYS_2026[dateStr], isPast = dateStr < todayStr
          const isToday = dateStr === todayStr

          let cellStyle = 'hover:bg-secondary text-foreground font-medium border border-transparent'
          let tooltip = t.calendarTooltipWorkday

          if (isToday) {
            cellStyle = 'border-2 border-[#d6492a] font-bold text-[#d6492a] bg-[#d6492a]/10 shadow-2xs'
            tooltip = t.calendarTooltipToday
          } else if (holiday) {
            cellStyle = 'hover:bg-secondary font-semibold text-foreground'
            tooltip = `${holiday.type === 'religious' ? t.calendarTooltipReligious : t.calendarTooltipLegal} ${getHolidayName(dateStr, holiday.name)}`
          } else if (isPast) {
            cellStyle = 'bg-secondary/40 text-muted-foreground/60 font-normal hover:bg-secondary'
            tooltip = `${t.calendarTooltipPast} (${dateStr})`
          } else if (month === 6 || month === 7) {
            cellStyle = 'bg-secondary/30 text-muted-foreground/40 line-through'
            tooltip = t.calendarTooltipSummer
          }

          return (
            <div key={day} title={tooltip} onClick={() => setSelectedDayDetails({ dateStr, dayNum: day })} className={`h-8 w-8 relative flex flex-col items-center justify-center rounded-lg text-xs cursor-pointer mx-auto transition-all ${cellStyle}`}>
              <span>{day}</span>
              {holiday && (
                <span className={`size-1.5 rounded-full -mt-0.5 ${holiday.type === 'religious' ? 'bg-[#d6492a]' : 'bg-[#1e1b4b] dark:bg-slate-300'}`} />
              )}
              {isPast && !holiday && (
                <span className="absolute -top-0.5 -right-0.5 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">✓</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#d6492a]" /> {t.calendarEventsOf} {t.months[month]} {year} :</span>
          <span className="text-[10px] font-semibold text-muted-foreground">{currentMonthHolidays.length} {t.calendarNeutralizedDays}</span>
        </div>
        {currentMonthHolidays.length > 0 ? (
          <div className="space-y-1.5">
            {currentMonthHolidays.map(([dStr, h], idx) => (
              <div key={idx} onClick={() => setSelectedDayDetails({ dateStr: dStr, dayNum: Number(dStr.split('-')[2]) })} className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer border bg-card hover:bg-secondary transition-all ${h.type === 'religious' ? 'border-l-4 border-l-[#d6492a] border-border' : 'border-l-4 border-l-[#1e1b4b] border-border'}`}>
                <div className="flex items-center gap-2"><span>{h.type === 'religious' ? '🌙' : '🇲🇦'}</span><span>{getHolidayName(dStr, h.name)}</span></div>
                <span className="font-mono text-[10px] text-muted-foreground">{dStr}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-[11px] text-muted-foreground py-2 text-center bg-secondary/40 rounded-lg border border-border/60">{t.calendarNoHolidays.replace('{month}', t.months[month])}</p>}
      </div>

      <CalendarLegend legendReligious={t.calendarLegendReligious} legendLegal={t.calendarLegendLegal} legendPast={t.calendarLegendPast} />
      <CalendarDetailModal selectedDayDetails={selectedDayDetails} onClose={() => setSelectedDayDetails(null)} todayStr={todayStr} t={t} lang={lang} />
    </div>
  )
}
