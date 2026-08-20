'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { ManagerChatbot } from '@/components/dashboard/manager-chatbot'
import { PlanningView } from '@/components/dashboard/planning-view'
import { RightPanel } from '@/components/dashboard/right-panel'
import { Sidebar, type TabType } from '@/components/dashboard/sidebar'
import { ActivitiesView, SettingsView, TrainersView } from '@/components/dashboard/sub-views'
import { TopBar } from '@/components/dashboard/top-bar'
import { TrainerTable } from '@/components/dashboard/trainer-table'
import { TrainerSpaceView } from '@/components/dashboard/trainer-space-view'

const VALID_TABS: TabType[] = ['dashboard', 'trainers', 'planning', 'settings', 'trainer']

function resolveTab(raw: string | null, view: string | null): TabType | null {
  if (view === 'trainer' || raw === 'trainer') return 'trainer'
  if (!raw) return null
  if (raw === 'activities') return 'planning'
  return VALID_TABS.includes(raw as TabType) ? (raw as TabType) : null
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const viewParam = searchParams.get('view')

  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [selectedCenter, setSelectedCenter] = useState<string>('ALL')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('year')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('current_user') || '{}')
      if (u.role) setUserRole(u.role)
    } catch (e) {
      console.warn(e)
    }
  }, [])

  useEffect(() => {
    const isTrainer = userRole === 'Formateur'
    const resolved = resolveTab(tabParam, viewParam)
    if (resolved) {
      if (isTrainer && (resolved === 'dashboard' || resolved === 'trainers')) {
        setActiveTab('trainer')
      } else if (!isTrainer && userRole && resolved === 'trainer') {
        setActiveTab('dashboard')
      } else {
        setActiveTab(resolved)
      }
    } else {
      setActiveTab(isTrainer ? 'trainer' : 'dashboard')
    }
  }, [tabParam, viewParam, userRole])

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === 'dashboard') {
      router.push('/dashboard', { scroll: false })
    } else {
      router.push(`/dashboard?tab=${tab}`, { scroll: false })
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground text-xs antialiased">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        selectedCenter={selectedCenter}
        onSelectCenter={setSelectedCenter}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          period={selectedTimeframe}
          onSelectPeriod={setSelectedTimeframe}
          selectedCenter={selectedCenter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
        />
        <main className="flex-1 overflow-y-auto p-3.5 md:p-5 space-y-4">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 xl:col-span-9 flex min-w-0 flex-col gap-4">
                <KpiCards timeframe={selectedTimeframe} />
                <div id="trainer-table-section">
                  <TrainerTable
                    selectedCenter={selectedCenter}
                    onSelectCenter={setSelectedCenter}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
              </div>
              <div className="col-span-12 xl:col-span-3">
                <RightPanel />
              </div>
            </div>
          ) : (
            <div className="flex min-w-0 flex-col gap-4 w-full">
              {activeTab === 'trainer' && <TrainerSpaceView />}
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
          )}
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
