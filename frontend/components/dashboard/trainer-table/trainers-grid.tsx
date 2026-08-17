'use client'

import { TrainerRowItem } from '@/components/dashboard/trainer-table/trainer-row-item'
import type { TrainerRow } from '@/components/dashboard/trainer-table/types'
import { useLanguage } from '@/lib/i18n'

interface TrainersGridProps {
  trainers: TrainerRow[]
  onDeleteTrainer?: (trainer: TrainerRow) => void
}

export function TrainersGrid({ trainers, onDeleteTrainer }: TrainersGridProps) {
  const { t } = useLanguage()

  return (
    <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
      <table className="w-full text-left">
        <thead className="sticky top-0 bg-card z-10 border-b border-border shadow-xs">
          <tr className="text-xs font-semibold text-muted-foreground">
            <th scope="col" className="px-4 py-2.5 font-medium">{t.trainer}</th>
            <th scope="col" className="px-3 py-2.5 font-medium">{t.centerAndRole}</th>
            <th scope="col" className="px-3 py-2.5 font-medium">{t.global}</th>
            <th scope="col" className="px-3 py-2.5 font-medium">{t.animation}</th>
            <th scope="col" className="px-3 py-2.5 font-medium">{t.rate}</th>
            <th scope="col" className="px-4 py-2.5 font-medium">{t.status}</th>
            <th scope="col" className="px-3 py-2.5 font-medium text-right">{t.actions || 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {trainers.length > 0 ? (
            trainers.map((trainer) => (
              <TrainerRowItem key={trainer.name} trainer={trainer} t={t} onDeleteTrainer={onDeleteTrainer} />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-5 py-8 text-center text-xs text-muted-foreground font-medium">
                {t.noTrainersFound}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
