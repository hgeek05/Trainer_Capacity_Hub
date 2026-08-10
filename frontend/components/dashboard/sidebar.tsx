'use client'

import { Activity, Calendar, LayoutDashboard, Settings, Users } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { SidebarLogo } from '@/components/dashboard/sidebar/sidebar-logo'
import { SidebarCenters } from '@/components/dashboard/sidebar/sidebar-centers'

export type TabType = 'dashboard' | 'trainers' | 'planning' | 'activities' | 'settings'

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

  const mainItems: { id: TabType; label: string; icon: any }[] = [
    { id: 'dashboard', label: t.dashboard || 'Dashboard Global', icon: LayoutDashboard },
    { id: 'trainers', label: t.trainers || 'Formateurs', icon: Users },
    { id: 'planning', label: t.planning || 'Planning & Sessions', icon: Calendar },
    { id: 'activities', label: t.activities || 'Activités & Charges', icon: Activity },
    { id: 'settings', label: t.settings || 'Réglages System', icon: Settings },
  ]

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarLogo />

      <nav className="flex flex-1 flex-col px-3 gap-6" aria-label={t.mainMenu}>
        <div>
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70">
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
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors cursor-pointer',
                      isActive
                        ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm dark:bg-sidebar-primary dark:text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground dark:hover:bg-sidebar-accent dark:hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
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
