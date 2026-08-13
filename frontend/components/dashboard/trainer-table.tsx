'use client'

import { AddTrainerModal } from '@/components/dashboard/add-trainer-modal'
import { SimulationModal } from '@/components/dashboard/simulation-modal'
import { ActionBar } from '@/components/dashboard/trainer-table/action-bar'
import { AdvancedDomainFilter } from '@/components/dashboard/trainer-table/advanced-domain-filter'
import { AiAuditReport } from '@/components/dashboard/trainer-table/ai-audit-report'
import { TableFilters } from '@/components/dashboard/trainer-table/table-filters'
import { TrainersGrid } from '@/components/dashboard/trainer-table/trainers-grid'
import { useTrainerTable } from '@/components/dashboard/trainer-table/useTrainerTable'

interface TrainerTableProps {
  selectedCenter?: string
  onSelectCenter?: (center: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function TrainerTable({
  selectedCenter: externalCenter,
  onSelectCenter,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}: TrainerTableProps = {}) {
  const table = useTrainerTable({ externalCenter, externalSearchQuery, externalOnSearchChange })

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-card">
      <ActionBar
        isLive={table.isLive}
        loading={table.loading}
        analyzing={table.analyzing}
        showAdvancedFilters={table.showAdvancedFilters}
        onOpenSimulation={() => table.setIsSimulationOpen(true)}
        onOpenAddModal={() => table.setIsAddModalOpen(true)}
        onRunAiAnalysis={table.runAiAnalysis}
        onRefresh={table.handleRefreshData}
        onToggleAdvancedFilters={() => table.setShowAdvancedFilters(!table.showAdvancedFilters)}
        onExport={table.handleExport}
      />

      {table.exportNotification && (
        <div className="mx-5 my-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-150">
          <span>{table.exportNotification}</span>
          <button onClick={() => table.setExportNotification(null)} className="text-xs font-bold hover:underline cursor-pointer">
            ✕
          </button>
        </div>
      )}

      <AdvancedDomainFilter
        show={table.showAdvancedFilters}
        selectedDomain={table.selectedDomain}
        onSelectDomain={table.setSelectedDomain}
      />

      <TableFilters
        selectedCenter={table.selectedCenter}
        onSelectCenter={(val) => {
          table.setSelectedCenter(val)
          if (onSelectCenter) onSelectCenter(val)
        }}
        statusFilter={table.statusFilter}
        onSelectStatusFilter={table.setStatusFilter}
        selectedPeriod={table.selectedPeriod}
        onSelectPeriod={table.setSelectedPeriod}
        searchQuery={table.activeSearchQuery}
        onSearchChange={table.handleSearchChange}
      />

      <AiAuditReport anomalies={table.aiAnomalies} onClose={() => table.setAiAnomalies([])} />

      <TrainersGrid trainers={table.filteredTrainers} />

      <AddTrainerModal
        isOpen={table.isAddModalOpen}
        onClose={() => table.setIsAddModalOpen(false)}
        onTrainerAdded={table.handleTrainerAdded}
      />

      <SimulationModal
        isOpen={table.isSimulationOpen}
        onClose={() => table.setIsSimulationOpen(false)}
        trainers={table.trainers.map((t) => ({ name: t.name, center: t.center, animUsed: t.animUsed, animTotal: t.animTotal }))}
        onApplySimulation={table.handleApplySimulation}
      />
    </section>
  )
}
