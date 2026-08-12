'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { ManagerChatbot } from '@/components/dashboard/manager-chatbot'
import { PlanningView } from '@/components/dashboard/planning-view'
import { RightPanel } from '@/components/dashboard/right-panel'
import { Sidebar, type TabType } from '@/components/dashboard/sidebar'
import { ActivitiesView, SettingsView, TrainersView } from '@/components/dashboard/sub-views'
import { TopBar } from '@/components/dashboard/top-bar'
import { TrainerTable } from '@/components/dashboard/trainer-table'

const VALID_TABS: TabType[] = ['dashboard', 'trainers', 'planning', 'settings']

/** Résout `?tab=` vers un des 4 onglets. `activities` est un alias historique de `planning`. */
function resolveTab(raw: string | null): TabType | null {
  if (!raw) return null
  if (raw === 'activities') return 'planning'
  return VALID_TABS.includes(raw as TabType) ? (raw as TabType) : null
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [selectedCenter, setSelectedCenter] = useState<string>('ALL')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('year')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    const resolved = resolveTab(tabParam)
    if (resolved) setActiveTab(resolved)
  }, [tabParam])

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedCenter={selectedCenter}
        onSelectCenter={setSelectedCenter}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          period={selectedTimeframe}
          onSelectPeriod={setSelectedTimeframe}
          selectedCenter={selectedCenter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex flex-1 flex-col gap-4 p-6 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {activeTab === 'dashboard' && (
              <>
                <KpiCards timeframe={selectedTimeframe} />
                <div id="trainer-table-section">
                  <TrainerTable
                    selectedCenter={selectedCenter}
                    onSelectCenter={setSelectedCenter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
              </>
            )}
            {activeTab === 'trainers' && <TrainersView />}
            {/* Planning & Sessions regroupe les affectations puis le calendrier officiel. */}
            {activeTab === 'planning' && (
              <>
                <PlanningView />
                <ActivitiesView />
              </>
            )}
            {activeTab === 'settings' && <SettingsView />}
          </div>
          <RightPanel />
        </main>
      </div>

      <ManagerChatbot />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Chargement du Cockpit...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
