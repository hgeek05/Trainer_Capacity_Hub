'use client'

import { useState } from 'react'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { ManagerChatbot } from '@/components/dashboard/manager-chatbot'
import { RightPanel } from '@/components/dashboard/right-panel'
import { Sidebar, type TabType } from '@/components/dashboard/sidebar'
import { ActivitiesView, SettingsView, TrainersView } from '@/components/dashboard/sub-views'
import { TopBar } from '@/components/dashboard/top-bar'
import { TrainerTable } from '@/components/dashboard/trainer-table'

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [selectedCenter, setSelectedCenter] = useState<string>('ALL')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('year')

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedCenter={selectedCenter}
        onSelectCenter={setSelectedCenter}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar period={selectedTimeframe} onSelectPeriod={setSelectedTimeframe} selectedCenter={selectedCenter} />
        <main className="flex flex-1 flex-col gap-4 p-6 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {activeTab === 'dashboard' && (
              <>
                <KpiCards timeframe={selectedTimeframe} />
                <TrainerTable selectedCenter={selectedCenter} onSelectCenter={setSelectedCenter} />
              </>
            )}
            {activeTab === 'trainers' && <TrainersView />}
            {activeTab === 'activities' && <ActivitiesView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
          <RightPanel />
        </main>
      </div>

      {/* Assistant Manager Chatbot Flottant */}
      <ManagerChatbot />
    </div>
  )
}
