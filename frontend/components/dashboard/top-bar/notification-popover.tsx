'use client'

import { useState } from 'react'
import { Bell, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export interface DynamicAlert {
  id: string
  type: 'danger' | 'warning' | 'success'
  title: string
  message: string
}

const SEARCH_DATABASE = [
  { id: 1, name: 'Youssef Benali', center: 'Ben Guerir', animDays: 82 },
  { id: 2, name: 'Fatima Zahra El Idrissi', center: 'Safi', animDays: 120 },
  { id: 3, name: 'Karim Tazi', center: 'Jorf Lasfar', animDays: 64 },
  { id: 4, name: 'Nadia Amrani', center: 'Khouribga', animDays: 135 },
  { id: 5, name: 'Omar Chraibi', center: 'Ben Guerir', animDays: 51 },
  { id: 6, name: 'Salma Bennis', center: 'Ben Guerir', animDays: 112 },
]

export function generateDynamicNotifications(centerFilter = 'ALL', lang: 'fr' | 'en' = 'fr'): DynamicAlert[] {
  const filtered = centerFilter === 'ALL'
    ? SEARCH_DATABASE
    : SEARCH_DATABASE.filter((t) => t.center.toLowerCase() === centerFilter.toLowerCase())

  const notifs: DynamicAlert[] = []
  const targetDays = 107

  filtered.forEach((t) => {
    if (t.animDays > targetDays) {
      notifs.push({
        id: `overload-${t.id}`,
        type: 'danger',
        title: lang === 'en' ? '⚠️ Critical Overload' : '⚠️ Surcharge Critique',
        message: lang === 'en'
          ? `${t.name} (${t.center}) exceeds target (${t.animDays}/${targetDays}d). Reassignment recommended.`
          : `${t.name} (${t.center}) dépasse la cible (${t.animDays}/${targetDays}j). Réaffectation conseillée.`,
      })
    } else if (t.animDays >= 95 && t.animDays <= targetDays) {
      notifs.push({
        id: `warning-${t.id}`,
        type: 'warning',
        title: lang === 'en' ? '⚡ Warning, Threshold Nearby' : '⚡ Attention, Seuil Proche',
        message: lang === 'en'
          ? `${t.name} (${t.center}) is nearing the limit (${t.animDays}/${targetDays}d).`
          : `${t.name} (${t.center}) approche de la limite (${t.animDays}/${targetDays}j).`,
      })
    } else if (t.animDays < 80) {
      notifs.push({
        id: `available-${t.id}`,
        type: 'success',
        title: lang === 'en' ? '🟢 Trainer Available' : '🟢 Formateur Disponible',
        message: lang === 'en'
          ? `${t.name} (${t.center}) has low workload (${t.animDays}d) and is available for new sessions.`
          : `${t.name} (${t.center}) a une charge faible (${t.animDays}j) et est disponible pour de nouvelles sessions.`,
      })
    }
  })

  return notifs
}

interface NotificationPopoverProps {
  selectedCenter?: string
}

export function NotificationPopover({ selectedCenter = 'ALL' }: NotificationPopoverProps) {
  const { t, lang } = useLanguage()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number | null>(null)

  const dynamicAlerts = generateDynamicNotifications(selectedCenter, lang)
  const activeUnreadCount = unreadCount ?? dynamicAlerts.length

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => {
          setShowNotifications(!showNotifications)
          setUnreadCount(0)
        }}
        className="relative flex size-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
        title={t.alertsCenter}
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
            <h4 className="font-bold text-xs text-foreground">{t.alertsCenter}</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20">
                {dynamicAlerts.length} {t.anomaliesIdentified}
              </span>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-left">
            {dynamicAlerts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                {t.noNotifications}
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
  )
}
