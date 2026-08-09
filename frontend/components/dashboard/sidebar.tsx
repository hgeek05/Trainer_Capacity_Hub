'use client'

import {
  Activity,
  Building2,
  Calendar,
  LayoutDashboard,
  MapPin,
  Settings,
  Users,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
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

  const centers = [
    { id: 'benguerir', name: 'Ben Guerir' },
    { id: 'safi', name: 'Safi' },
    { id: 'jorf', name: 'Jorf Lasfar' },
    { id: 'khouribga', name: 'Khouribga' },
  ]

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* En-tête avec Logo Officiel UM6P | TECHNIX */}
      <div className="flex flex-col gap-2.5 px-4 pt-5 pb-5 border-b border-sidebar-border/60 mb-2">
        <div className="flex items-center justify-start bg-white p-2 rounded-xl border border-sidebar-border/50 shadow-xs">
          <img
            src="/images/um6p-technix-logo.png"
            alt="UM6P TECHNIX"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              ; (e.target as HTMLImageElement).src = '/um6p-technix-logo.png'
            }}
          />
        </div>
        <div className="leading-tight px-1 pt-1">
          <p className="text-[11px] font-bold text-sidebar-accent-foreground tracking-tight">Trainer Capacity Hub</p>
          <p className="text-[10px] text-sidebar-foreground/80 font-medium">Super Admin Cockpit</p>
        </div>
      </div>

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

        <div>
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70">
            {t.centers}
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
                  {t.allCenters}
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
      </nav>
    </aside>
  )
}
