'use client'

import React, { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Calendar, LayoutDashboard, LogOut, Settings, User, Users, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { SidebarLogo } from '@/components/dashboard/sidebar/sidebar-logo'
import { SidebarCenters } from '@/components/dashboard/sidebar/sidebar-centers'
export type TabType = 'dashboard' | 'trainers' | 'planning' | 'settings' | 'trainer'

interface MainNavItem {
  id: TabType
  label: string
  hint: string
  icon: LucideIcon
}

interface SidebarProps {
  activeTab?: TabType
  onSelectTab?: (tab: TabType) => void
  selectedCenter?: string
  onSelectCenter?: (center: string) => void
}

interface UserProfile {
  name: string
  email: string
  role: string
  center: string
}

export function Sidebar({
  activeTab = 'dashboard',
  onSelectTab,
  selectedCenter = 'ALL',
  onSelectCenter,
}: SidebarProps) {
  const { t } = useLanguage()
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('current_user')
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Failed to parse current user:', e)
    }
  }, [])

  const isTrainer = currentUser?.role === 'Formateur'

  const mainItems: MainNavItem[] = isTrainer
    ? [
        { id: 'trainer', label: "Mon Espace", hint: "Activité & Charge", icon: UserCheck },
        { id: 'planning', label: "Planning Général", hint: "Calendrier des sessions", icon: Calendar },
        { id: 'settings', label: t.settings, hint: t.tabHintSettings, icon: Settings },
      ]
    : [
        { id: 'dashboard', label: t.dashboard, hint: t.tabHintDashboard, icon: LayoutDashboard },
        { id: 'trainers', label: t.trainers, hint: t.tabHintTrainers, icon: Users },
        { id: 'planning', label: t.planning, hint: t.tabHintPlanning, icon: Calendar },
        { id: 'trainer', label: "Espace Formateur", hint: "Vue intervenant", icon: UserCheck },
        { id: 'settings', label: t.settings, hint: t.tabHintSettings, icon: Settings },
      ]

  const displayName = currentUser?.name || t.superAdmin || 'Super Admin'
  const displayRole = currentUser?.role || 'Formateur'
  const displayCenter = currentUser?.center || (selectedCenter !== 'ALL' ? selectedCenter : 'Ben Guerir')
  const displaySubtext = `${displayRole} • ${displayCenter}`
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarLogo />

      <nav className="flex flex-1 flex-col px-2.5 gap-4 justify-between pb-3" aria-label={t.mainMenu}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70">
              {t.mainMenu}
            </p>
            <ul className="flex flex-col gap-1">
              {mainItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectTab && onSelectTab(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex w-full items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer',
                        isActive
                          ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm dark:bg-sidebar-primary dark:text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground',
                      )}
                    >
                      <Icon className="mt-0.5 size-4 shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{item.label}</span>
                        <span
                          className={cn(
                            'mt-0.5 block truncate text-[10px] font-normal',
                            isActive ? 'opacity-70' : 'opacity-60',
                          )}
                        >
                          {item.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <SidebarCenters
            centersTitle={t.centers}
            allCentersLabel={t.allCenters}
            selectedCenter={selectedCenter}
            onSelectCenter={onSelectCenter}
            onSelectTab={onSelectTab}
          />
        </div>

        {/* Profil de l'utilisateur connecté en bas de la Sidebar */}
        <div className="pt-2 border-t border-sidebar-border/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/40">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-7.5 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary border border-primary/20 shrink-0">
                {initials || <User className="size-3.5" />}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-xs font-bold text-sidebar-foreground">{displayName}</p>
                <p className="truncate text-[10px] font-semibold text-primary">{displaySubtext}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('current_user')
                document.cookie = 'access_token=; path=/; max-age=0; SameSite=Lax'
                window.location.href = '/login'
              }}
              title="Se Déconnecter"
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  )
}