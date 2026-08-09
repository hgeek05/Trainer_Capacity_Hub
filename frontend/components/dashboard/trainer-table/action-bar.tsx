'use client'

import { Brain, Download, RefreshCw, Sliders, SlidersHorizontal, UserPlus } from 'lucide-react'
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
        <h2 className="text-base font-semibold">{t.trainerLoad}</h2>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            isLive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          )}
        >
          <span className={cn('size-1.5 rounded-full', isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
          {isLive ? t.apiDirect : t.demoMode}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenSimulation}
          className="flex h-8 items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 text-xs font-semibold text-purple-700 dark:text-purple-300 transition-all hover:bg-purple-500/20 cursor-pointer shadow-xs"
        >
          <Sliders className="size-3.5" />
          {t.simulationWhatIf}
        </button>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-sm cursor-pointer"
        >
          <UserPlus className="size-3.5" />
          {t.newTrainer}
        </button>

        <button
          type="button"
          onClick={onRunAiAnalysis}
          disabled={analyzing}
          className="flex h-8 items-center gap-1.5 rounded-full bg-purple-600 px-3 text-xs font-medium text-white transition-all hover:bg-purple-700 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Brain className={cn('size-3.5', analyzing && 'animate-spin')} />
          {analyzing ? t.analyzingProgress : t.launchAiAudit}
        </button>

        <button
          type="button"
          onClick={onRefresh}
          title={t.refreshDataTooltip}
          className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-secondary px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
        >
          <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
          {t.refresh}
        </button>

        <button
          type="button"
          onClick={onToggleAdvancedFilters}
          className={cn(
            'flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors cursor-pointer',
            showAdvancedFilters
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground',
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          {t.filter}
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex h-8 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer shadow-xs"
        >
          <Download className="size-3.5" />
          {t.export}
        </button>
      </div>
    </div>
  )
}
