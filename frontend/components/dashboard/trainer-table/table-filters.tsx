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
    <div className="flex flex-nowrap items-center justify-between gap-2 bg-secondary/20 px-3 py-1.5 rounded-lg border border-border mb-2 text-xs overflow-x-auto no-scrollbar">
      {/* Groupe Filtres : Selects & Disponibilité */}
      <div className="flex shrink-0 items-center gap-2">
        {/* 1. Sélection du Centre */}
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-muted-foreground font-medium whitespace-nowrap text-xs">{t.center} :</span>
          <select
            value={selectedCenter}
            onChange={(e) => onSelectCenter(e.target.value)}
            className="bg-card border border-border text-foreground font-medium rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#d6492a]/30 focus:outline-none cursor-pointer shrink-0"
          >
            <option value="ALL">{t.allCenters}</option>
            <option value="Ben Guerir">Ben Guerir</option>
            <option value="Safi">Safi</option>
            <option value="Jorf Lasfar">Jorf Lasfar</option>
            <option value="Khouribga">Khouribga</option>
          </select>
        </div>

        <div className="h-3.5 w-px bg-border shrink-0" />

        {/* 2. Matrice de Disponibilité */}
        <AvailabilityMatrixFilter
          statusFilter={statusFilter}
          onSelectStatusFilter={onSelectStatusFilter}
          t={t}
        />

        <div className="h-3.5 w-px bg-border shrink-0" />

        {/* 3. Sélection de la Période */}
        <select
          value={selectedPeriod}
          onChange={(e) => onSelectPeriod(e.target.value)}
          className="bg-card border border-border text-foreground font-medium rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-[#d6492a]/30 focus:outline-none cursor-pointer shrink-0"
        >
          <option value="ANNEE_2026">{t.periodAll2026}</option>
          <option value="S1">{t.periodS1}</option>
          <option value="S2">{t.periodS2}</option>
          <option value="MOIS_COURANT">{t.periodCurrentMonth}</option>
        </select>
      </div>

      {/* 4. Champ de Recherche (Aligné à droite sans retour à la ligne) */}
      <div className="relative shrink-0 w-44 sm:w-52">
        <input
          type="text"
          placeholder={t.searchPlaceholderName || 'Rechercher nom ou email...'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground text-xs rounded-md pl-7 pr-2.5 py-1 focus:ring-1 focus:ring-[#d6492a]/30 focus:outline-none font-medium"
        />
        <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}
