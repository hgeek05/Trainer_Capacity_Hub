'use client'

import { TrainerRowItem } from '@/components/dashboard/trainer-table/trainer-row-item'
import type { TrainerRow } from '@/components/dashboard/trainer-table/types'
import { useLanguage } from '@/lib/i18n'

interface TrainersGridProps {
  trainers: TrainerRow[]
}

export function TrainersGrid({ trainers }: TrainersGridProps) {
  const { t } = useLanguage()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
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
              <TrainerRowItem key={trainer.name} trainer={trainer} t={t} />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground font-medium">
                {t.noTrainersFound}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
