'use client'

import { useState } from 'react'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { RightPanel } from '@/components/dashboard/right-panel'
import { Sidebar } from '@/components/dashboard/sidebar'
import { TopBar } from '@/components/dashboard/top-bar'
import { TrainerTable } from '@/components/dashboard/trainer-table'

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  return (
    <div className="flex min-h-svh bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex flex-1 flex-col gap-4 p-6 xl:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <KpiCards />
            <div id="trainer-table-section">
              <TrainerTable searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>
          </div>
          <RightPanel />
        </main>
      </div>
    </div>
  )
}
