'use client'

import React from 'react'
import { Building2, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TabType } from '../sidebar'

interface SidebarCentersProps {
  centersTitle: string
  allCentersLabel: string
  selectedCenter: string
  onSelectCenter?: (center: string) => void
  onSelectTab?: (tab: TabType) => void
}

export function SidebarCenters({
  centersTitle,
  allCentersLabel,
  selectedCenter,
  onSelectCenter,
  onSelectTab,
}: SidebarCentersProps) {
  const centers = [
    { id: 'benguerir', name: 'Ben Guerir' },
    { id: 'safi', name: 'Safi' },
    { id: 'jorf', name: 'Jorf Lasfar' },
    { id: 'khouribga', name: 'Khouribga' },
  ]

  return (
    <div>
      <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70">
        {centersTitle}
      </p>
      <ul className="flex flex-col gap-1">
        <li>
          <button
            type="button"
            onClick={() => {
              if (onSelectCenter) onSelectCenter('ALL')
              if (onSelectTab) onSelectTab('dashboard')
            }}
            className={cn(
              'flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer',
              selectedCenter === 'ALL'
                ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm dark:bg-sidebar-primary dark:text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground',
            )}
          >
            <span className="flex items-center gap-2.5">
              <Building2 className="size-3.5" />
              {allCentersLabel}
            </span>
            <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md">
              4
            </span>
          </button>
        </li>
        {centers.map((c) => {
          const isSelected = selectedCenter.toLowerCase() === c.name.toLowerCase()
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  if (onSelectCenter) onSelectCenter(c.name)
                  if (onSelectTab) onSelectTab('dashboard')
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm dark:bg-sidebar-primary dark:text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground',
                )}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="size-3.5" />
                  {c.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
