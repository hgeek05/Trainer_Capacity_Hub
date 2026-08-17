'use client'

import React from 'react'
import { Trash2 } from 'lucide-react'
import { LoadCell } from '@/components/dashboard/trainer-table/load-cell'
import type { TrainerRow } from '@/components/dashboard/trainer-table/types'
import { cn } from '@/lib/utils'

interface TrainerRowItemProps {
  trainer: TrainerRow
  t: any
  onDeleteTrainer?: (trainer: TrainerRow) => void
}

export function TrainerRowItem({ trainer, t, onDeleteTrainer }: TrainerRowItemProps) {
  const isOverloaded = trainer.animUsed > 107

  return (
    <tr className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-secondary/40">
      <td className="px-4 py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-[10px] font-bold text-foreground shadow-2xs">
            {trainer.initials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold whitespace-nowrap text-foreground">{trainer.name}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{trainer.email}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-2 text-xs whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-foreground">{trainer.center}</span>
            {trainer.domain && (
              <span className="text-[9px] font-bold bg-[#d6492a]/10 text-[#d6492a] border border-[#d6492a]/20 px-1.5 py-0.5 rounded-md">
                {trainer.domain}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">{trainer.roleLabel}</span>
        </div>
      </td>
      <td className="px-3 py-2">
        <LoadCell used={trainer.globalUsed} total={trainer.globalTotal} />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-col gap-1 w-36">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-foreground">{trainer.animUsed} {t.days}</span>
            <span className="text-muted-foreground text-[9px]">{t.target} : 107{t.days}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden border border-border/40">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isOverloaded ? 'bg-[#1e1b4b]' : 'bg-emerald-500',
              )}
              style={{ width: `${Math.min((trainer.animUsed / 107) * 100, 100)}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-3 py-2 text-xs font-bold tabular-nums text-foreground">{trainer.rate}%</td>
      <td className="px-4 py-2 whitespace-nowrap">
        {isOverloaded ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#1e1b4b] text-amber-300 border border-indigo-900 shadow-2xs">
            ⚠️ {t.overload} (+{trainer.animUsed - 107}{t.days})
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            ✅ {t.balanced}
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-right">
        {onDeleteTrainer && (
          <button
            type="button"
            onClick={() => onDeleteTrainer(trainer)}
            title="Supprimer le formateur"
            aria-label={`Supprimer ${trainer.name}`}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-500/10 p-1.5 text-rose-500 hover:bg-rose-500/20 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </td>
    </tr>
  )
}
