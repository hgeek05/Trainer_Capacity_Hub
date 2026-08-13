'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AvailabilityMatrixFilterProps {
  statusFilter: 'ALL' | 'AVAILABLE' | 'WATCH' | 'CRITICAL'
  onSelectStatusFilter: (status: 'ALL' | 'AVAILABLE' | 'WATCH' | 'CRITICAL') => void
  t: any
}

export function AvailabilityMatrixFilter({
  statusFilter,
  onSelectStatusFilter,
  t,
}: AvailabilityMatrixFilterProps) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 bg-card p-0.5 rounded-lg border border-border">
      <button
        type="button"
        onClick={() => onSelectStatusFilter('ALL')}
        className={cn(
          'px-2 py-0.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap',
          statusFilter === 'ALL'
            ? 'bg-[#d6492a] text-white font-semibold shadow-xs'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
        )}
      >
        {t.all}
      </button>

      <button
        type="button"
        onClick={() => onSelectStatusFilter('AVAILABLE')}
        className={cn(
          'px-2 py-0.5 text-xs font-medium rounded-md flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap',
          statusFilter === 'AVAILABLE'
            ? 'bg-emerald-600 text-white font-semibold shadow-xs'
            : 'text-muted-foreground hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-500/10',
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
        <span>{t.available}</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectStatusFilter('WATCH')}
        className={cn(
          'px-2 py-0.5 text-xs font-medium rounded-md flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap',
          statusFilter === 'WATCH'
            ? 'bg-amber-500 text-white font-semibold shadow-xs'
            : 'text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-500/10',
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
        <span>{t.watch}</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectStatusFilter('CRITICAL')}
        className={cn(
          'px-2 py-0.5 text-xs font-medium rounded-md flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap',
          statusFilter === 'CRITICAL'
            ? 'bg-rose-600 text-white font-semibold shadow-xs'
            : 'text-muted-foreground hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-500/10',
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shrink-0" />
        <span>{t.critical}</span>
      </button>
    </div>
  )
}
