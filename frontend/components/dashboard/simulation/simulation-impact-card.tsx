'use client'

import React from 'react'
import { ArrowRight } from 'lucide-react'

interface SimulationImpactCardProps {
  name: string
  center: string
  currentDays: number
  newDays: number
  currentDelta: number
  newDelta: number
  labelBefore: string
  isSource?: boolean
}

export function SimulationImpactCard({
  name,
  center,
  currentDays,
  newDays,
  currentDelta,
  newDelta,
  labelBefore,
  isSource = false,
}: SimulationImpactCardProps) {
  return (
    <div className="p-3.5 rounded-xl border border-border bg-card text-xs space-y-2">
      <p className="font-bold text-foreground flex items-center gap-1.5">
        <span>{name}</span>
        <span className="text-[10px] text-muted-foreground">({center})</span>
      </p>
      <div className="flex items-center justify-between text-muted-foreground">
        <span>
          {labelBefore} :{' '}
          <strong className={isSource ? 'text-rose-600' : 'text-emerald-600'}>
            {currentDays}j
          </strong>{' '}
          ({currentDelta >= 0 ? `+${currentDelta}j` : `${currentDelta}j`})
        </span>
        <ArrowRight className="size-3.5 text-muted-foreground" />
        <span>
          Après :{' '}
          <strong className={isSource ? 'text-emerald-600' : 'text-primary font-bold'}>
            {newDays}j
          </strong>{' '}
          ({newDelta >= 0 ? `+${newDelta}j` : `${newDelta}j`})
        </span>
      </div>
    </div>
  )
}
