'use client'

import React, { useState } from 'react'
import { Calendar, Plus, Search } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { PlanningKpis } from '@/components/dashboard/planning/planning-kpis'
import { PlanningSessionModal } from '@/components/dashboard/planning/planning-session-modal'
import { PlanningTable } from '@/components/dashboard/planning/planning-table'
import { INITIAL_SESSIONS, type PlanningSession } from '@/components/dashboard/planning/planning-data'

export type { PlanningSession }

export function PlanningView() {
  const { t } = useLanguage()
  const [sessions, setSessions] = useState<PlanningSession[]>(INITIAL_SESSIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCenter, setSelectedCenter] = useState('ALL')
  const [selectedDomain, setSelectedDomain] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trainerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCenter = selectedCenter === 'ALL' || s.center.toLowerCase() === selectedCenter.toLowerCase()
    const matchesDomain = selectedDomain === 'ALL' || s.trainerDomain.toLowerCase() === selectedDomain.toLowerCase()
    return matchesSearch && matchesCenter && matchesDomain
  })

  const handleAddSession = (newSession: PlanningSession) => {
    setSessions((prev) => [newSession, ...prev])
    setNotification(`✅ Session "${newSession.title}" ${t.scheduledSuccessfully} ${newSession.trainerName} !`)
    setTimeout(() => setNotification(null), 4000)
  }

  const nextSessionId = `SES-2026-${String(sessions.length + 1).padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            {t.planningViewTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{t.planningViewSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-purple-700 cursor-pointer"
        >
          <Plus className="size-4" />
          {t.scheduleSession}
        </button>
      </div>

      {notification && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-150">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-xs font-bold hover:underline cursor-pointer">✕</button>
        </div>
      )}

      <PlanningKpis totalSessions={sessions.length} />

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-secondary/20">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.searchPlaceholderName}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="h-8.5 rounded-lg border border-border bg-card px-3 text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.allCenters} (4)</option>
            <option value="Ben Guerir">Ben Guerir</option>
            <option value="Safi">Safi</option>
            <option value="Jorf Lasfar">Jorf Lasfar</option>
            <option value="Khouribga">Khouribga</option>
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="h-8.5 rounded-lg border border-border bg-card px-3 text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.allDomains}</option>
            <option value="HSE">HSE</option>
            <option value="Digital">Digital</option>
            <option value="Maintenance industrielle">Maintenance industrielle</option>
            <option value="Chimie et procédés">Chimie et procédés</option>
            <option value="Industrie minière">Industrie minière</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>
        </div>
      </div>

      <PlanningTable sessions={filteredSessions} />

      <PlanningSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSession={handleAddSession}
        nextId={nextSessionId}
      />
    </div>
  )
}
