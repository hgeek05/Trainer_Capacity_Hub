'use client'

import { useEffect, useRef, useState } from 'react'
import { Award, MapPin, Search, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const SEARCH_DATABASE = [
  { id: 1, name: 'Youssef Benali', email: 'youssef.benali@um6p.ma', center: 'Ben Guerir', domain: 'Digital', role: 'Lead Formateur', animDays: 82, status: 'ok' },
  { id: 2, name: 'Fatima Zahra El Idrissi', email: 'fatimazahra.elidrissi@um6p.ma', center: 'Safi', domain: 'HSE', role: 'Formateur Expert', animDays: 120, status: 'critical' },
  { id: 3, name: 'Karim Tazi', email: 'karim.tazi@um6p.ma', center: 'Jorf Lasfar', domain: 'Maintenance industrielle', role: 'Formateur Senior', animDays: 64, status: 'ok' },
  { id: 4, name: 'Nadia Amrani', email: 'nadia.amrani@um6p.ma', center: 'Khouribga', domain: 'Chimie et procédés', role: 'Formateur Senior', animDays: 135, status: 'critical' },
  { id: 5, name: 'Omar Chraibi', email: 'omar.chraibi@um6p.ma', center: 'Ben Guerir', domain: 'Industrie minière', role: 'Formateur Junior', animDays: 51, status: 'ok' },
  { id: 6, name: 'Salma Bennis', email: 'salma.bennis@um6p.ma', center: 'Ben Guerir', domain: 'Soft Skills', role: 'Formateur Expert', animDays: 112, status: 'watch' },
]

interface TopBarSearchProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function TopBarSearch({ searchQuery: externalQuery, onSearchChange: externalOnSearchChange }: TopBarSearchProps) {
  const { t, lang } = useLanguage()
  const [internalQuery, setInternalQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const currentQuery = externalQuery !== undefined ? externalQuery : internalQuery
  const handleQueryChange = (val: string) => {
    setInternalQuery(val)
    if (externalOnSearchChange) externalOnSearchChange(val)
    setIsDropdownOpen(val.trim().length > 0)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const trimmed = currentQuery.trim().toLowerCase()
  const matchingResults = trimmed
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.name.toLowerCase().includes(trimmed) ||
          item.email.toLowerCase().includes(trimmed) ||
          item.center.toLowerCase().includes(trimmed) ||
          item.domain.toLowerCase().includes(trimmed) ||
          item.role.toLowerCase().includes(trimmed)
      )
    : []

  const handleSelectTrainer = (name: string) => {
    handleQueryChange(name)
    setIsDropdownOpen(false)
    const tableEl = document.getElementById('trainer-table-section')
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={currentQuery}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => {
          if (currentQuery.trim().length > 0) setIsDropdownOpen(true)
        }}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchPlaceholder}
        className="h-9 w-52 rounded-full border border-border bg-secondary pr-8 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 md:w-64"
      />
      {currentQuery && (
        <button
          type="button"
          onClick={() => handleQueryChange('')}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full p-0.5 transition-colors cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      )}

      {/* Live Search Results Dropdown */}
      {isDropdownOpen && currentQuery.trim().length > 0 && (
        <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between text-[11px] font-bold text-muted-foreground">
            <span>
              {lang === 'en' ? 'Search Results' : 'Résultats de Recherche'} ({matchingResults.length})
            </span>
            <span className="text-[10px] font-mono text-primary">TechniX Engine</span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1 p-1">
            {matchingResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                {lang === 'en'
                  ? `No trainers or centers match "${currentQuery}"`
                  : `Aucun formateur ni centre ne correspond à "${currentQuery}"`}
              </div>
            ) : (
              matchingResults.map((item) => {
                const statusBadge =
                  item.status === 'critical'
                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    : item.status === 'watch'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'

                const statusLabel =
                  item.status === 'critical'
                    ? lang === 'en' ? '🔴 Overloaded' : '🔴 Surchargé'
                    : item.status === 'watch'
                    ? lang === 'en' ? '🟡 Watch' : '🟡 Vigilance'
                    : lang === 'en' ? '🟢 Available' : '🟢 Conforme'

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTrainer(item.name)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-secondary transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {item.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5 truncate">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3 text-muted-foreground" />
                            {item.center}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 truncate">
                            <Award className="size-3 text-muted-foreground" />
                            {item.domain}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', statusBadge)}>
                        {statusLabel}
                      </span>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">
                        {item.animDays}/107 {lang === 'en' ? 'd' : 'j'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
