'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, Plus, Search } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { createSessionApi, deleteSessionApi, fetchSessions, updateSessionApi } from '@/lib/api'
import { EditSessionModal } from '@/components/dashboard/planning/edit-session-modal'
import { PlanningKpis } from '@/components/dashboard/planning/planning-kpis'
import { PlanningSessionModal } from '@/components/dashboard/planning/planning-session-modal'
import { PlanningTable } from '@/components/dashboard/planning/planning-table'
import { INITIAL_SESSIONS, type PlanningSession } from '@/components/dashboard/planning/planning-data'
import { CENTER_NAMES, TRAINING_DOMAINS } from '@/components/dashboard/planning/planning-reference'

export type { PlanningSession }

export function PlanningView() {
  const { t } = useLanguage()
  const [sessions, setSessions] = useState<PlanningSession[]>(INITIAL_SESSIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCenter, setSelectedCenter] = useState('ALL')
  const [selectedDomain, setSelectedDomain] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<PlanningSession | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{ role?: string } | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('current_user')
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Failed to parse current_user:', e)
    }

    fetchSessions().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setSessions(data)
      }
    })
  }, [])

  const isTrainer = currentUser?.role === 'Formateur'

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trainerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCenter = selectedCenter === 'ALL' || s.center.toLowerCase() === selectedCenter.toLowerCase()
    const matchesDomain = selectedDomain === 'ALL' || s.trainerDomain.toLowerCase() === selectedDomain.toLowerCase()
    return matchesSearch && matchesCenter && matchesDomain
  })

  const handleAddSession = async (newSession: PlanningSession) => {
    try {
      const created = await createSessionApi(newSession)
      setSessions((prev) => [created || newSession, ...prev])
    } catch {
      setSessions((prev) => [newSession, ...prev])
    }
    setNotification(`✅ Session "${newSession.title}" ${t.scheduledSuccessfully} ${newSession.trainerName} !`)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleUpdateSession = async (updated: PlanningSession) => {
    try {
      await updateSessionApi(updated.id, updated)
    } catch (err) {
      console.error('API update session error:', err)
    }
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setNotification(`✅ Session "${updated.title}" ${t.sessionUpdatedSuccessfully} — ${updated.trainerName}`)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleDeleteSession = async (sessionToDelete: PlanningSession) => {
    if (!window.confirm(`${t.confirmDeleteSession || 'Voulez-vous vraiment supprimer cette session ?'}\n"${sessionToDelete.title}"`)) {
      return
    }
    try {
      await deleteSessionApi(sessionToDelete.id)
    } catch (err) {
      console.error('API delete session error:', err)
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id))
    setNotification(`🗑️ Session "${sessionToDelete.title}" ${t.sessionDeletedSuccessfully || 'supprimée avec succès'} !`)
    setTimeout(() => setNotification(null), 4000)
  }

  const nextSessionId = `SES-2026-${String(sessions.length + 1).padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              {isTrainer ? "Planning Général des Sessions" : t.planningViewTitle}
            </h2>
            {isTrainer && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                Lecture seule
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isTrainer 
              ? "Consultation du calendrier et de la programmation des sessions du réseau TechniX / UM6P."
              : t.planningViewSubtitle}
          </p>
        </div>
        {!isTrainer && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-purple-700 cursor-pointer"
          >
            <Plus className="size-4" />
            {t.scheduleSession}
          </button>
        )}
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
            <option value="ALL">
              {t.allCenters} ({CENTER_NAMES.length})
            </option>
            {CENTER_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="h-8.5 rounded-lg border border-border bg-card px-3 text-xs text-foreground font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.allDomains}</option>
            {TRAINING_DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
      </div>

      <PlanningTable
        sessions={filteredSessions}
        onEditSession={!isTrainer ? setEditingSession : undefined}
        onDeleteSession={!isTrainer ? handleDeleteSession : undefined}
      />

      <PlanningSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSession={handleAddSession}
        nextId={nextSessionId}
      />

      <EditSessionModal
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onSave={handleUpdateSession}
      />
    </div>
  )
}
