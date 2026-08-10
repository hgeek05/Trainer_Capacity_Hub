'use client'

import React from 'react'

interface Shortcut {
  idx: number
  label: string
  color: string
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
      <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">{label}</span>
      {shortcuts.map((s) => (
        <button
          key={s.idx}
          type="button"
          onClick={() => onJumpToMonth(s.idx)}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer transition-all ${
            currentMonth === s.idx
              ? s.color === 'amber'
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-rose-500 text-white border-rose-600 shadow-xs'
              : s.color === 'amber'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
