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
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-extrabold tracking-tight text-foreground">{t.trainerLoad}</h2>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold',
            isLive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          )}
        >
          <span className={cn('size-1.5 rounded-full', isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
          {isLive ? t.apiDirect : t.demoMode}
        </span>
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
