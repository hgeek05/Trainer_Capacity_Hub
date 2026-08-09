'use client'

import { useLanguage } from '@/lib/i18n'

interface AdvancedDomainFilterProps {
  show: boolean
  selectedDomain: string
  onSelectDomain: (domain: string) => void
}

export function AdvancedDomainFilter({ show, selectedDomain, onSelectDomain }: AdvancedDomainFilterProps) {
  const { t } = useLanguage()

  if (!show) return null

  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-secondary/40 border-y border-border/80 animate-in fade-in duration-150">
      <span className="text-xs font-bold text-foreground">{t.advancedDomainFilterTitle}</span>
      <select
        value={selectedDomain}
        onChange={(e) => onSelectDomain(e.target.value)}
        className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium cursor-pointer"
      >
        <option value="ALL">{t.allDomains}</option>
        <option value="Digital">Digital</option>
        <option value="HSE">HSE (Sécurité / Environnement)</option>
        <option value="Maintenance industrielle">Maintenance industrielle</option>
        <option value="Chimie et procédés">Chimie et procédés</option>
        <option value="Industrie minière">Industrie minière</option>
        <option value="Énergies renouvelables">Énergies renouvelables</option>
        <option value="Agriculture">Agriculture</option>
        <option value="Soft Skills">Soft Skills</option>
      </select>
      {selectedDomain !== 'ALL' && (
        <button
          onClick={() => onSelectDomain('ALL')}
          className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
        >
          {t.resetDomain}
        </button>
      )}
    </div>
  )
}
