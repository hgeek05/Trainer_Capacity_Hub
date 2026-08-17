'use client'

import React, { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { NotificationPopover } from '@/components/dashboard/top-bar/notification-popover'
import { TopBarSearch } from '@/components/dashboard/top-bar/top-bar-search'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface TopBarProps {
  period?: 'week' | 'month' | 'year'
  onSelectPeriod?: (period: 'week' | 'month' | 'year') => void
  selectedCenter?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

interface UserProfile {
  name: string
  email: string
  role: string
  center: string
}

export function TopBar({
  period = 'year',
  onSelectPeriod,
  selectedCenter = 'ALL',
  searchQuery,
  onSearchChange,
}: TopBarProps) {
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('current_user')
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Failed to parse current user from localStorage:', e)
    }
  }, [])

  const periods = [
    { value: 'week' as const, label: t.week || 'Semaine' },
    { value: 'month' as const, label: t.month || 'Mois' },
    { value: 'year' as const, label: t.year || 'Année' },
  ]

  const displayName = currentUser?.name || t.superAdmin || 'Super Admin'
  const displayRole = currentUser?.role || 'Manager TechniX'
  const displayCenter = currentUser?.center || (selectedCenter !== 'ALL' ? selectedCenter : 'Réseau UM6P')
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card px-6 py-4 xl:flex-row xl:items-center xl:justify-between relative z-40">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{t.breadcrumbHome}</p>
        <h1 className="truncate text-lg font-semibold text-balance">{t.pageTitle}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Sélecteur de période dynamique (Week / Month / Year) */}
        <div
          role="radiogroup"
          aria-label={t.filter}
          className="flex h-9 items-center gap-1 rounded-full border border-border bg-secondary p-1"
        >
          {periods.map((p) => (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={period === p.value}
              onClick={() => onSelectPeriod?.(p.value)}
              className={cn(
                'flex h-7 items-center rounded-full px-3 text-xs font-medium transition-all cursor-pointer',
                period === p.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Composant Recherche avec Popover Autocomplete */}
        <TopBarSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />

        <LanguageToggle />
        <ThemeToggle />

        {/* Popover des notifications et alertes dynamiques */}
        <NotificationPopover selectedCenter={selectedCenter} />

        {/* Profil compact (icône seule avec initiales) */}
        <div className="pl-2 border-l border-border">
          <div
            title={`${displayName} (${displayRole} • ${displayCenter})`}
            className="flex size-8.5 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary border border-primary/20 shadow-xs cursor-default shrink-0"
          >
            {initials || <User className="size-4" />}
          </div>
        </div>
      </div>
    </header>
  )
}
