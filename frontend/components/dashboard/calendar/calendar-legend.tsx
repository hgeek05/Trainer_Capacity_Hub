'use client'

import React from 'react'

interface CalendarLegendProps {
  legendReligious: string
  legendLegal: string
  legendPast: string
}

export function CalendarLegend({ legendReligious, legendLegal, legendPast }: CalendarLegendProps) {
  return (
    <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-[11px] text-muted-foreground font-medium">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-[#d6492a]" />
        <span>{legendReligious}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-[#1e1b4b] dark:bg-slate-300" />
        <span>{legendLegal}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center size-3 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">✓</span>
        <span>{legendPast}</span>
      </div>
    </div>
  )
}
