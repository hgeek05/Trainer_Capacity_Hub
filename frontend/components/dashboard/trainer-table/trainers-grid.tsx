'use client'

import { LoadCell } from '@/components/dashboard/trainer-table/load-cell'
import type { TrainerRow } from '@/components/dashboard/trainer-table/types'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface TrainersGridProps {
  trainers: TrainerRow[]
}

export function TrainersGrid({ trainers }: TrainersGridProps) {
  const { t } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th scope="col" className="px-5 py-3 font-medium">{t.trainer}</th>
            <th scope="col" className="px-4 py-3 font-medium">{t.centerAndRole}</th>
            <th scope="col" className="px-4 py-3 font-medium">{t.global}</th>
            <th scope="col" className="px-4 py-3 font-medium">{t.animation}</th>
            <th scope="col" className="px-4 py-3 font-medium">{t.rate}</th>
            <th scope="col" className="px-5 py-3 font-medium">{t.status}</th>
          </tr>
        </thead>
        <tbody>
          {trainers.length > 0 ? (
            trainers.map((trainer) => (
              <tr
                key={trainer.name}
                className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-secondary/50"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                        trainer.avatarTone,
                      )}
                    >
                      {trainer.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium whitespace-nowrap">{trainer.name}</span>
                      <span className="text-xs text-muted-foreground">{trainer.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">{trainer.center}</span>
                      {trainer.domain && (
                        <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                          {trainer.domain}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{trainer.roleLabel}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <LoadCell used={trainer.globalUsed} total={trainer.globalTotal} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col gap-1.5 w-44">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground">{trainer.animUsed} {t.days}</span>
                      <span className="text-muted-foreground text-[11px]">{t.target} : 107{t.days}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          trainer.animUsed > 107 ? 'bg-rose-500' : 'bg-emerald-500',
                        )}
                        style={{ width: `${Math.min((trainer.animUsed / 107) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm font-medium tabular-nums">{trainer.rate}%</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {trainer.animUsed > 107 ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                      ⚠️ {t.overload} (+{trainer.animUsed - 107}{t.days})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      ✅ {t.balanced}
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                {t.noTrainersFound}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
