'use client'

import type { LucideIcon } from 'lucide-react'
import { Calendar, LayoutDashboard, Settings, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { SidebarLogo } from '@/components/dashboard/sidebar/sidebar-logo'
import { SidebarCenters } from '@/components/dashboard/sidebar/sidebar-centers'
export type TabType = 'dashboard' | 'trainers' | 'planning' | 'settings'

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

export function Sidebar({
  activeTab = 'dashboard',
  onSelectTab,
  selectedCenter = 'ALL',
  onSelectCenter,
}: SidebarProps) {
  const { t } = useLanguage()

  const mainItems: MainNavItem[] = [
    { id: 'dashboard', label: t.dashboard, hint: t.tabHintDashboard, icon: LayoutDashboard },
    { id: 'trainers', label: t.trainers, hint: t.tabHintTrainers, icon: Users },
    { id: 'planning', label: t.planning, hint: t.tabHintPlanning, icon: Calendar },
    { id: 'settings', label: t.settings, hint: t.tabHintSettings, icon: Settings },
  ]

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarLogo />

      <nav className="flex flex-1 flex-col px-2.5 gap-4" aria-label={t.mainMenu}>
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
      </nav>
    </aside>
  )
}