'use client'

import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { PlanningKpis } from '@/components/dashboard/planning/planning-kpis'
import { PlanningSessionModal } from '@/components/dashboard/planning/planning-session-modal'

export interface PlanningSession {
  id: string
  title: string
  trainerName: string
  trainerDomain: string
  center: string
  startDate: string
  endDate: string
  durationDays: number
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'SCHEDULED'
}

const INITIAL_SESSIONS: PlanningSession[] = [
  {
    id: 'SES-2026-01',
    title: 'Prévention des Risques & Sécurité Industrielle',
    trainerName: 'Fatima Ait Zzi',
    trainerDomain: 'HSE',
    center: 'Ben Guerir',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    durationDays: 5,
    status: 'IN_PROGRESS',
  },
  {
    id: 'SES-2026-02',
    title: 'Procédés Chimiques de Valorisation des Phosphates',
    trainerName: 'Nadia Amrani',
    trainerDomain: 'Chimie et procédés',
    center: 'Safi',
    startDate: '2026-08-12',
    endDate: '2026-08-19',
    durationDays: 7,
    status: 'CONFIRMED',
  },
  {
    id: 'SES-2026-03',
    title: 'Maintenance Prédictive & Capteurs IoT',
    trainerName: 'Karim Tazi',
    trainerDomain: 'Maintenance industrielle',
    center: 'Jorf Lasfar',
    startDate: '2026-08-15',
    endDate: '2026-08-20',
    durationDays: 5,
    status: 'SCHEDULED',
  },
  {
    id: 'SES-2026-04',
    title: 'Transformation Digitale & Automates Usine',
    trainerName: 'Omar Chraibi',
    trainerDomain: 'Digital',
    center: 'Ben Guerir',
    startDate: '2026-08-22',
    endDate: '2026-08-28',
    durationDays: 6,
    status: 'SCHEDULED',
  },
  {
    id: 'SES-2026-05',
    title: 'Leadership & Management d\'Équipe Industrielle',
    trainerName: 'Youssef Benali',
    trainerDomain: 'Soft Skills',
    center: 'Ben Guerir',
    startDate: '2026-08-25',
    endDate: '2026-08-29',
    durationDays: 4,
    status: 'CONFIRMED',
  },
  {
    id: 'SES-2026-06',
    title: 'Techniques d\'Extraction & Valorisation Minière',
    trainerName: 'Fatima Zahra El Idrissi',
    trainerDomain: 'Industrie minière',
    center: 'Khouribga',
    startDate: '2026-09-02',
    endDate: '2026-09-10',
    durationDays: 8,
    status: 'CONFIRMED',
  },
]

export function PlanningView() {
  const { t, lang } = useLanguage()

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
      {/* En-tête avec bouton de création */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            {t.planningViewTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t.planningViewSubtitle}
          </p>
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
          <button onClick={() => setNotification(null)} className="text-xs font-bold hover:underline cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Cartes Métriques du Planning */}
      <PlanningKpis totalSessions={sessions.length} />

      {/* Barre de Filtres Interactifs */}
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

      {/* Tableau des Sessions de Formation */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-secondary/50 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">{t.courseTitleLabel.replace(' *', '')}</th>
              <th className="px-4 py-3">{t.trainer}</th>
              <th className="px-4 py-3">{t.domainPole}</th>
              <th className="px-4 py-3">{t.center}</th>
              <th className="px-4 py-3">{t.period}</th>
              <th className="px-4 py-3">{t.days}</th>
              <th className="px-4 py-3">{t.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-card">
            {filteredSessions.map((session) => (
              <tr key={session.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-primary">{session.id}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{session.title}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-purple-600" />
                    {session.trainerName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-600/10 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-300">
                    <Sparkles className="size-2.5" />
                    {session.trainerDomain}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3 text-rose-500" />
                    {session.center}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                  {session.startDate} ➔ {session.endDate}
                </td>
                <td className="px-4 py-3 font-bold text-foreground">{session.durationDays}{t.days}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                      session.status === 'IN_PROGRESS'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                        : session.status === 'CONFIRMED'
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20',
                    )}
                  >
                    <Clock className="size-2.5" />
                    {session.status === 'IN_PROGRESS' ? (lang === 'en' ? 'Ongoing' : 'En Cours') : session.status === 'CONFIRMED' ? (lang === 'en' ? 'Confirmed' : 'Confirmé') : (lang === 'en' ? 'Scheduled' : 'Planifié')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Planification d'une nouvelle session */}
      <PlanningSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSession={handleAddSession}
        nextId={nextSessionId}
      />
    </div>
  )
}
