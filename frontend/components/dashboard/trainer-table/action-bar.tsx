'use client'

import { ActionBarButtons } from '@/components/dashboard/trainer-table/action-bar-buttons'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface ActionBarProps {
  isLive: boolean
  loading: boolean
  analyzing: boolean
  showAdvancedFilters: boolean
  onOpenSimulation: () => void
  onOpenAddModal: () => void
  onRunAiAnalysis: () => void
  onRefresh: () => void
  onToggleAdvancedFilters: () => void
  onExport: () => void
}

export function ActionBar({
  isLive,
  loading,
  analyzing,
  showAdvancedFilters,
  onOpenSimulation,
  onOpenAddModal,
  onRunAiAnalysis,
  onRefresh,
  onToggleAdvancedFilters,
  onExport,
}: ActionBarProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-nowrap items-center justify-between gap-3 px-4 py-2.5 overflow-x-auto no-scrollbar">
      <div className="flex shrink-0 items-center gap-3">
        <h2 className="text-sm font-extrabold tracking-tight text-foreground whitespace-nowrap">{t.trainerLoad}</h2>
      </div>

      <ActionBarButtons
        analyzing={analyzing}
        loading={loading}
        showAdvancedFilters={showAdvancedFilters}
        t={t}
        onOpenSimulation={onOpenSimulation}
        onOpenAddModal={onOpenAddModal}
        onRunAiAnalysis={onRunAiAnalysis}
        onRefresh={onRefresh}
        onToggleAdvancedFilters={onToggleAdvancedFilters}
        onExport={onExport}
      />
    </div>
  )
}
