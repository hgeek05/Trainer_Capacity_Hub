'use client'

import { Search } from 'lucide-react'
import { AvailabilityMatrixFilter } from '@/components/dashboard/trainer-table/availability-matrix-filter'
import { useLanguage } from '@/lib/i18n'

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
          <label className="block text-xs font-semibold text-muted-foreground mb-1">{t.center}</label>
          <select
            value={selectedCenter}
            onChange={(e) => onSelectCenter(e.target.value)}
            className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#d6492a]/20 cursor-pointer font-semibold"
          >
            <option value="ALL">{t.allCenters}</option>
            <option value="Ben Guerir">Ben Guerir</option>
            <option value="Safi">Safi</option>
            <option value="Jorf Lasfar">Jorf Lasfar</option>
            <option value="Khouribga">Khouribga</option>
          </select>
        </div>

        {/* Matrice de Disponibilité */}
        <AvailabilityMatrixFilter
          statusFilter={statusFilter}
          onSelectStatusFilter={onSelectStatusFilter}
          t={t}
        />

        {/* Filtre par Période */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">{t.period}</label>
          <select
            value={selectedPeriod}
            onChange={(e) => onSelectPeriod(e.target.value)}
            className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-[#d6492a]/20 cursor-pointer font-semibold"
          >
            <option value="ANNEE_2026">{t.periodAll2026}</option>
            <option value="S1">{t.periodS1}</option>
            <option value="S2">{t.periodS2}</option>
            <option value="MOIS_COURANT">{t.periodCurrentMonth}</option>
          </select>
        </div>
      </div>

      {/* Recherche textuelle élargie */}
      <div className="w-full sm:w-72 md:w-80">
        <label className="block text-xs font-semibold text-muted-foreground mb-1">{t.searchTrainer}</label>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={t.searchPlaceholderName}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 rounded-lg border border-border bg-card px-3 py-1 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#d6492a]/20 font-medium"
          />
          <Search className="absolute right-2.5 size-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
