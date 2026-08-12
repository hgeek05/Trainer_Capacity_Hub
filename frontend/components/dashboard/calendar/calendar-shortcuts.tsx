'use client'

import React from 'react'

interface Shortcut {
  idx: number
  label: string
  color?: 'amber' | 'rose' | string
}

interface CalendarShortcutsProps {
  label: string
  shortcuts: Shortcut[]
  currentMonth: number
  onJumpToMonth: (month: number) => void
}

export function CalendarShortcuts({
  label,
  shortcuts,
  currentMonth,
  onJumpToMonth,
}: CalendarShortcutsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">{label}</span>
      {shortcuts.map((s) => {
        const isSelected = currentMonth === s.idx
        const isReligious = s.color === 'amber'
        return (
          <button
            key={s.idx}
            type="button"
            onClick={() => onJumpToMonth(s.idx)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
              isSelected
                ? 'bg-secondary border-foreground/40 text-foreground font-bold shadow-xs'
                : 'bg-card border-border text-foreground hover:bg-secondary'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isReligious ? 'bg-[#d6492a]' : 'bg-[#1e1b4b] dark:bg-slate-300'
              }`}
            />
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
