'use client'

import { useState } from 'react'
import { Bell, Search, X } from 'lucide-react'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface TopBarProps {
  period?: 'week' | 'month' | 'year'
  onSelectPeriod?: (period: 'week' | 'month' | 'year') => void
  selectedCenter?: string
}

export interface DynamicAlert {
  id: string
  type: 'danger' | 'warning' | 'success'
  title: string
  message: string
}

const sampleTrainers = [
  { id: 1, name: 'Youssef Benali', center: 'Ben Guerir', animDays: 82 },
  { id: 2, name: 'Fatima Zahra El Idrissi', center: 'Safi', animDays: 120 },
  { id: 3, name: 'Karim Tazi', center: 'Jorf Lasfar', animDays: 64 },
  { id: 4, name: 'Nadia Amrani', center: 'Khouribga', animDays: 135 },
  { id: 5, name: 'Omar Chraibi', center: 'Ben Guerir', animDays: 51 },
  { id: 6, name: 'Salma Bennis', center: 'Ben Guerir', animDays: 112 },
]

export function generateDynamicNotifications(centerFilter = 'ALL'): DynamicAlert[] {
  const filtered = centerFilter === 'ALL'
    ? sampleTrainers
    : sampleTrainers.filter((t) => t.center.toLowerCase() === centerFilter.toLowerCase())

  const notifs: DynamicAlert[] = []
  const targetDays = 107

  filtered.forEach((t) => {
    if (t.animDays > targetDays) {
      notifs.push({
        id: `overload-${t.id}`,
        type: 'danger',
        title: '⚠️ Surcharge Critique',
        message: `${t.name} (${t.center}) dépasse la cible (${t.animDays}/${targetDays}j). Réaffectation conseillée.`,
      })
    } else if (t.animDays >= 95 && t.animDays <= targetDays) {
      notifs.push({
        id: `warning-${t.id}`,
        type: 'warning',
        title: '⚡ Attention, Seuil Proche',
        message: `${t.name} (${t.center}) approche de la limite (${t.animDays}/${targetDays}j).`,
      })
    } else if (t.animDays < 80) {
      notifs.push({
        id: `available-${t.id}`,
        type: 'success',
        title: '🟢 Formateur Disponible',
        message: `${t.name} (${t.center}) a une charge faible (${t.animDays}j) et est disponible pour de nouvelles sessions.`,
      })
    }
  })

  return notifs
}

export function TopBar({ period = 'year', onSelectPeriod, selectedCenter = 'ALL' }: TopBarProps) {
  const { t } = useLanguage()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number | null>(null)

  const dynamicAlerts = generateDynamicNotifications(selectedCenter)
  const activeUnreadCount = unreadCount ?? dynamicAlerts.length

  const periods = [
    { value: 'week' as const, label: t.week || 'Semaine' },
    { value: 'month' as const, label: t.month || 'Mois' },
    { value: 'year' as const, label: t.year || 'Année' },
  ]

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
                'flex h-7 items-center rounded-full px-3 text-xs font-medium transition-all',
                period === p.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="h-9 w-52 rounded-full border border-border bg-secondary pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 md:w-64"
          />
        </div>

        <LanguageToggle />
        <ThemeToggle />

        {/* Bouton de notification avec Popover d'Alertes IA dynamiques */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setUnreadCount(0)
            }}
            className="relative flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="Centre d'Alertes & Suggestions IA"
          >
            <Bell className="size-4" />
            {activeUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs animate-bounce">
                {activeUnreadCount}
              </span>
            )}
          </button>

          {/* Panneau déroulant (Popover) de notifications */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl border border-border bg-card shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center mb-3 border-b border-border pb-2">
                <h4 className="font-bold text-xs text-foreground">Centre d'Alertes & Suggestions IA</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20">
                    {dynamicAlerts.length} alertes actives
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-md transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-left">
                {dynamicAlerts.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    Aucune anomalie détectée pour ce filtre.
                  </p>
                ) : (
                  dynamicAlerts.map((alert) => {
                    const cardStyle =
                      alert.type === 'danger'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-200'
                        : alert.type === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200'

                    return (
                      <div key={alert.id} className={cn('p-3 border rounded-lg transition-all', cardStyle)}>
                        <p className="text-[11px] font-bold mb-0.5">{alert.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{alert.message}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
