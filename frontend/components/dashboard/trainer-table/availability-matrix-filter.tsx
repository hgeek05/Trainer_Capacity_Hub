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
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1">
        {t.availabilityMatrix}
      </label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onSelectStatusFilter('ALL')}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
            statusFilter === 'ALL'
              ? 'bg-[#d6492a] text-white shadow-xs'
              : 'bg-card border border-border text-muted-foreground hover:bg-secondary',
          )}
        >
          {t.all}
        </button>
        <button
          type="button"
          onClick={() => onSelectStatusFilter('AVAILABLE')}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
            statusFilter === 'AVAILABLE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-card border border-border text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10',
          )}
        >
          🟢 {t.available}
        </button>
        <button
          type="button"
          onClick={() => onSelectStatusFilter('WATCH')}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
            statusFilter === 'WATCH'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-card border border-border text-amber-600 dark:text-amber-400 hover:bg-amber-500/10',
          )}
        >
          🟡 {t.watch}
        </button>
        <button
          type="button"
          onClick={() => onSelectStatusFilter('CRITICAL')}
          className={cn(
            'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
            statusFilter === 'CRITICAL'
              ? 'bg-[#1e1b4b] text-amber-300 border border-indigo-900 shadow-2xs font-bold'
              : 'bg-card border border-border text-muted-foreground hover:bg-secondary',
          )}
        >
          ⚠️ {t.critical}
        </button>
      </div>
    </div>
  )
}
