'use client'

import React from 'react'

interface CalendarLegendProps {
  legendReligious: string
  legendLegal: string
  legendPast: string
}

export function CalendarLegend({ legendReligious, legendLegal, legendPast }: CalendarLegendProps) {
  return (
    <div className="mt-3 pt-3 border-t border-border space-y-1 text-[11px] text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-md bg-amber-500 border border-amber-600" />
        {legendReligious}
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-md bg-rose-500 border border-rose-600" />
        {legendLegal}
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-md bg-secondary border border-border" />
        {legendPast}
      </div>
    </div>
  )
}
