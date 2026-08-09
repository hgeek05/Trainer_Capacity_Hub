'use client'

import { Search } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface TableFiltersProps {
  selectedCenter: string
  onSelectCenter: (center: string) => void
  statusFilter: 'ALL' | 'AVAILABLE' | 'WATCH' | 'CRITICAL'
  onSelectStatusFilter: (status: 'ALL' | 'AVAILABLE' | 'WATCH' | 'CRITICAL') => void
  selectedPeriod: string
  onSelectPeriod: (period: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TableFilters({
  selectedCenter,
  onSelectCenter,
  statusFilter,
  onSelectStatusFilter,
  selectedPeriod,
  onSelectPeriod,
  searchQuery,
  onSearchChange,
}: TableFiltersProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border px-5 py-3 bg-secondary/30">
      <div className="flex flex-wrap items-center gap-3">
        {/* Filtre par Centre */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">{t.center}</label>
          <select
            value={selectedCenter}
            onChange={(e) => onSelectCenter(e.target.value)}
            className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="ALL">{t.allCenters}</option>
            <option value="Ben Guerir">Ben Guerir</option>
            <option value="Safi">Safi</option>
            <option value="Jorf Lasfar">Jorf Lasfar</option>
            <option value="Khouribga">Khouribga</option>
          </select>
        </div>

        {/* Matrice de Disponibilité (Filtres Rapides) */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">{t.availabilityMatrix}</label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectStatusFilter('ALL')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                statusFilter === 'ALL'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:bg-secondary',
              )}
            >
              {t.all}
            </button>
            <button
              type="button"
              onClick={() => onSelectStatusFilter('AVAILABLE')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                statusFilter === 'AVAILABLE'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-card border border-border text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10',
              )}
            >
              🟢 {t.available}
            </button>
            <button
              type="button"
              onClick={() => onSelectStatusFilter('WATCH')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                statusFilter === 'WATCH'
                  ? 'bg-amber-500 text-white'
                  : 'bg-card border border-border text-amber-600 dark:text-amber-400 hover:bg-amber-500/10',
              )}
            >
              🟡 {t.watch}
            </button>
            <button
              type="button"
              onClick={() => onSelectStatusFilter('CRITICAL')}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                statusFilter === 'CRITICAL'
                  ? 'bg-rose-500 text-white'
                  : 'bg-card border border-border text-rose-600 dark:text-rose-400 hover:bg-rose-500/10',
              )}
            >
              🔴 {t.critical}
            </button>
          </div>
        </div>

        {/* Filtre par Période */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">{t.period}</label>
          <select
            value={selectedPeriod}
            onChange={(e) => onSelectPeriod(e.target.value)}
            className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="ANNEE_2026">{t.periodAll2026}</option>
            <option value="S1">{t.periodS1}</option>
            <option value="S2">{t.periodS2}</option>
            <option value="MOIS_COURANT">{t.periodCurrentMonth}</option>
          </select>
        </div>
      </div>

      {/* Recherche textuelle par nom ou email */}
      <div className="w-full sm:w-64">
        <label className="block text-xs font-medium text-muted-foreground mb-1">{t.searchTrainer}</label>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={t.searchPlaceholderName}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 rounded-lg border border-border bg-card px-3 py-1 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="absolute right-2.5 size-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
