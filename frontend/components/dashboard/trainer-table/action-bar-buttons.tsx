'use client'

import { Brain, Download, RefreshCw, Sliders, SlidersHorizontal, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionBarButtonsProps {
  analyzing: boolean
  loading: boolean
  showAdvancedFilters: boolean
  t: any
  onOpenSimulation: () => void
  onOpenAddModal: () => void
  onRunAiAnalysis: () => void
  onRefresh: () => void
  onToggleAdvancedFilters: () => void
  onExport: () => void
}

export function ActionBarButtons({
  analyzing,
  loading,
  showAdvancedFilters,
  t,
  onOpenSimulation,
  onOpenAddModal,
  onRunAiAnalysis,
  onRefresh,
  onToggleAdvancedFilters,
  onExport,
}: ActionBarButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 1. PRIMARY ACTION (BRAND ORANGE FILLED) */}
      <button
        type="button"
        onClick={onOpenAddModal}
        className="flex h-9 items-center gap-1.5 rounded-xl bg-[#d6492a] hover:bg-[#c23e20] px-4 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
      >
        <UserPlus className="size-3.5" />
        {t.newTrainer}
      </button>

      {/* 2. SECONDARY ACTIONS (BRAND PURPLE OUTLINED) */}
      <button
        type="button"
        onClick={onOpenSimulation}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-[#5b0dbc] bg-[#5b0dbc]/5 hover:bg-[#5b0dbc]/15 px-3.5 text-xs font-semibold text-[#5b0dbc] dark:text-[#a87bf0] transition-all shadow-2xs cursor-pointer"
      >
        <Sliders className="size-3.5" />
        {t.simulationWhatIf}
      </button>

      <button
        type="button"
        onClick={onRunAiAnalysis}
        disabled={analyzing}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-[#5b0dbc] bg-[#5b0dbc]/5 hover:bg-[#5b0dbc]/15 px-3.5 text-xs font-semibold text-[#5b0dbc] dark:text-[#a87bf0] transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
      >
        <Brain className={cn('size-3.5', analyzing && 'animate-spin')} />
        {analyzing ? t.analyzingProgress : t.launchAiAudit}
      </button>

      {/* 3. TERTIARY ACTIONS (NEUTRAL GRAY) */}
      <div className="flex items-center gap-1.5 border-l border-border pl-2">
        <button
          type="button"
          onClick={onRefresh}
          title={t.refreshDataTooltip}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary px-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all shadow-2xs cursor-pointer"
        >
          <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
          {t.refresh}
        </button>

        <button
          type="button"
          onClick={onToggleAdvancedFilters}
          className={cn(
            'flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs',
            showAdvancedFilters
              ? 'bg-[#d6492a]/10 text-[#d6492a] border-[#d6492a]/40 font-bold'
              : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          {t.filter}
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary px-3.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all shadow-2xs cursor-pointer"
        >
          <Download className="size-3.5" />
          {t.export}
        </button>
      </div>
    </div>
  )
}
