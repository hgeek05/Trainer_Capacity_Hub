'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Calendar, Clock, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export interface DynamicAlert {
  id: string
  type: 'danger' | 'warning' | 'success' | 'info'
  title: string
  message: string
  time?: string
}

const SEARCH_DATABASE = [
  { id: 1, name: 'Youssef Benali', center: 'Ben Guerir', animDays: 82 },
  { id: 2, name: 'Fatima Zahra El Idrissi', center: 'Safi', animDays: 120 },
  { id: 3, name: 'Karim Tazi', center: 'Jorf Lasfar', animDays: 64 },
  { id: 4, name: 'Nadia Amrani', center: 'Khouribga', animDays: 135 },
  { id: 5, name: 'Omar Chraibi', center: 'Ben Guerir', animDays: 51 },
  { id: 6, name: 'Salma Bennis', center: 'Ben Guerir', animDays: 112 },
]

export function generateTrainerNotifications(lang: 'fr' | 'en' = 'fr'): DynamicAlert[] {
  if (lang === 'en') {
    return [
      {
        id: 'trainer-assign-1',
        type: 'info',
        title: '📅 New Session Assigned',
        message: 'Session "Risk Prevention & Industrial Safety" scheduled from 10/08 to 14/08/2026 at Ben Guerir (Amphi Al Khwarizmi).',
        time: 'Today',
      },
      {
        id: 'trainer-reminder-1',
        type: 'warning',
        title: '⏰ Upcoming Session Reminder',
        message: 'Your training session "Risk Prevention" starts in 3 days. Please check course materials and attendance sheets.',
        time: '2h ago',
      },
      {
        id: 'trainer-pending-1',
        type: 'info',
        title: '⏳ Pending Manager Validation',
        message: 'Your activity declaration "Field Audit & HSE Compliance" (Safi) was submitted to Soufiane ARROUB (N+1).',
        time: 'Yesterday',
      },
      {
        id: 'trainer-progress-1',
        type: 'success',
        title: '🎯 Annual Target Progress (77%)',
        message: '82 days completed and validated out of your 107d yearly target. 25 days remaining to complete 2026.',
        time: '3d ago',
      },
    ]
  }

  return [
    {
      id: 'trainer-assign-1',
      type: 'info',
      title: '📅 Nouvelle Session Affectée',
      message: 'Session "Prévention des Risques & Sécurité Industrielle" planifiée du 10/08 au 14/08/2026 à Ben Guerir (Amphi Al Khwarizmi).',
      time: "Aujourd'hui",
    },
    {
      id: 'trainer-reminder-1',
      type: 'warning',
      title: '⏰ Rappel Session Imminente',
      message: 'Votre session "Prévention des Risques" démarre dans 3 jours. Pensez à vérifier vos supports pédagogiques et feuilles d\'émargement.',
      time: 'Il y a 2h',
    },
    {
      id: 'trainer-pending-1',
      type: 'info',
      title: '⏳ En Attente de Validation N+1',
      message: 'Votre déclaration pour la session "Audit Terrain & Conformité HSE" (Safi) a été transmise à votre manager Soufiane ARROUB.',
      time: 'Hier',
    },
    {
      id: 'trainer-progress-1',
      type: 'success',
      title: '🎯 Progression Capacité Annuelle (77%)',
      message: '82 jours validés sur votre cible de 107 jours. Il vous reste 25 jours favorables d\'animation pour clôturer 2026.',
      time: 'Il y a 3j',
    },
  ]
}

export function generateManagerNotifications(centerFilter = 'ALL', lang: 'fr' | 'en' = 'fr'): DynamicAlert[] {
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
        time: 'Alerte IA',
      })
    } else if (t.animDays >= 95 && t.animDays <= targetDays) {
      notifs.push({
        id: `warning-${t.id}`,
        type: 'warning',
        title: lang === 'en' ? '⚡ Warning, Threshold Nearby' : '⚡ Attention, Seuil Proche',
        message: lang === 'en'
          ? `${t.name} (${t.center}) is nearing the limit (${t.animDays}/${targetDays}d).`
          : `${t.name} (${t.center}) approche de la limite (${t.animDays}/${targetDays}j).`,
        time: 'Alerte IA',
      })
    } else if (t.animDays < 80) {
      notifs.push({
        id: `available-${t.id}`,
        type: 'success',
        title: lang === 'en' ? '🟢 Trainer Available' : '🟢 Formateur Disponible',
        message: lang === 'en'
          ? `${t.name} (${t.center}) has low workload (${t.animDays}d) and is available for new sessions.`
          : `${t.name} (${t.center}) a une charge faible (${t.animDays}j) et est disponible pour de nouvelles sessions.`,
        time: 'Suggestion IA',
      })
    }
  })

  return notifs
}

interface NotificationPopoverProps {
  selectedCenter?: string
  isTrainer?: boolean
}

export function NotificationPopover({ selectedCenter = 'ALL', isTrainer: explicitTrainer }: NotificationPopoverProps) {
  const { t, lang } = useLanguage()
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number | null>(null)
  const [isTrainerUser, setIsTrainerUser] = useState(false)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('current_user') || '{}')
      if (u.role === 'Formateur' || u.role_id === 1) {
        setIsTrainerUser(true)
      }
    } catch (e) {
      console.warn(e)
    }
  }, [])

  const isTrainer = explicitTrainer ?? isTrainerUser

  const dynamicAlerts = isTrainer
    ? generateTrainerNotifications(lang)
    : generateManagerNotifications(selectedCenter, lang)

  const activeUnreadCount = unreadCount ?? dynamicAlerts.length

  const popoverTitle = isTrainer
    ? (lang === 'en' ? 'My Schedule & Session Notifications' : 'Mes Affectations & Rappels Sessions')
    : t.alertsCenter

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
        title={popoverTitle}
      >
        <Bell className="size-4" />
        {activeUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-xs animate-bounce">
            {activeUnreadCount}
          </span>
        )}
      </button>

      {/* Panneau déroulant (Popover) de notifications */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 rounded-xl border border-border bg-card shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex justify-between items-center mb-3 border-b border-border pb-2.5">
            <div>
              <h4 className="font-bold text-xs text-foreground">{popoverTitle}</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {isTrainer 
                  ? (lang === 'en' ? 'Personal session alerts & reminders' : 'Notifications d\'affectations et rappels personnels')
                  : (lang === 'en' ? 'Team capacity & workload audit' : 'Audit de charge et répartition d\'équipe')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20 shrink-0">
                {dynamicAlerts.length} {isTrainer ? (lang === 'en' ? 'Alerts' : 'Rappels') : t.anomaliesIdentified}
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

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-left">
            {dynamicAlerts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                {t.noNotifications}
              </p>
            ) : (
              dynamicAlerts.map((alert) => {
                const cardStyle =
                  alert.type === 'danger'
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    : alert.type === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : alert.type === 'info'
                    ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'

                return (
                  <div key={alert.id} className={cn('p-2.5 border rounded-xl transition-all', cardStyle)}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] font-bold text-foreground">{alert.title}</p>
                      {alert.time && <span className="text-[9px] text-muted-foreground font-medium">{alert.time}</span>}
                    </div>
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
