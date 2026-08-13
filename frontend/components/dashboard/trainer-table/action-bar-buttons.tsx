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
    <div className="flex flex-nowrap items-center justify-between gap-1.5 w-full overflow-x-auto no-scrollbar">
      {/* Actions Principales (Gauche) */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* Action Primaire : Orange UM6P compact */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#d6492a] hover:bg-[#c23e20] px-2.5 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          <UserPlus className="size-3.5" />
          <span>{t.newTrainer}</span>
        </button>

        {/* Action Secondaire 1 : Simulation What-If */}
        <button
          type="button"
          onClick={onOpenSimulation}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-2.5 text-xs font-medium text-foreground transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Sliders className="size-3.5 text-amber-500" />
          <span>{t.simulationWhatIf}</span>
        </button>

        {/* Action Secondaire 2 : Audit IA Raccourci */}
        <button
          type="button"
          onClick={onRunAiAnalysis}
          disabled={analyzing}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-2.5 text-xs font-medium text-foreground transition-all shadow-xs disabled:opacity-50 cursor-pointer whitespace-nowrap"
        >
          <Brain className={cn('size-3.5 text-purple-600 dark:text-purple-400', analyzing && 'animate-spin')} />
          <span>{analyzing ? t.analyzingProgress : (t.auditProactive || 'Audit Proactif')}</span>
        </button>
      </div>

      {/* Outils & Utilitaires (Droite) */}
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onRefresh}
          title={t.refreshDataTooltip}
          className="flex h-8 shrink-0 items-center gap-1 rounded-lg border border-border bg-card hover:bg-secondary px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          <RefreshCw className={cn('size-3.5 text-muted-foreground/70', loading && 'animate-spin')} />
          <span>{t.refresh}</span>
        </button>

        <button
          type="button"
          onClick={onToggleAdvancedFilters}
          className={cn(
            'flex h-8 shrink-0 items-center gap-1 rounded-lg border px-2 text-xs font-medium transition-all cursor-pointer shadow-xs whitespace-nowrap',
            showAdvancedFilters
              ? 'bg-[#d6492a]/10 text-[#d6492a] border-[#d6492a]/40 font-bold'
              : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
        >
          <SlidersHorizontal className="size-3.5 text-muted-foreground/70" />
          <span>{t.filter}</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex h-8 shrink-0 items-center gap-1 rounded-lg border border-border bg-card hover:bg-secondary px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Download className="size-3.5 text-muted-foreground/70" />
          <span>{t.export}</span>
        </button>
      </div>
    </div>
  )
}
