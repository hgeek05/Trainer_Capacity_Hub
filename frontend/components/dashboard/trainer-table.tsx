'use client'

import { useEffect, useState } from 'react'
import { AddTrainerModal } from '@/components/dashboard/add-trainer-modal'
import { SimulationModal } from '@/components/dashboard/simulation-modal'
import { ActionBar } from '@/components/dashboard/trainer-table/action-bar'
import { AdvancedDomainFilter } from '@/components/dashboard/trainer-table/advanced-domain-filter'
import { AiAuditReport } from '@/components/dashboard/trainer-table/ai-audit-report'
import { getInitials, mapAlertToStatus, parseDays } from '@/components/dashboard/trainer-table/helpers'
import { TableFilters } from '@/components/dashboard/trainer-table/table-filters'
import { TrainersGrid } from '@/components/dashboard/trainer-table/trainers-grid'
import { AVATAR_TONES, FALLBACK_TRAINERS, type TrainerRow } from '@/components/dashboard/trainer-table/types'
import { fetchAiAnomalies, fetchTrainers, type AiAnomaly } from '@/lib/api'

interface TrainerTableProps {
  selectedCenter?: string
  onSelectCenter?: (center: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function TrainerTable({
  selectedCenter: externalCenter,
  onSelectCenter,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
}: TrainerTableProps = {}) {
  const [trainers, setTrainers] = useState<TrainerRow[]>(FALLBACK_TRAINERS)
  const [isLive, setIsLive] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCenter, setSelectedCenter] = useState<string>(externalCenter || 'ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ANNEE_2026')
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('')

  const activeSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery
  const handleSearchChange = externalOnSearchChange || setInternalSearchQuery

  useEffect(() => {
    if (externalCenter !== undefined) setSelectedCenter(externalCenter)
  }, [externalCenter])
  const [aiAnomalies, setAiAnomalies] = useState<AiAnomaly[]>([])
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'WATCH' | 'CRITICAL'>('ALL')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false)
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL')
  const [exportNotification, setExportNotification] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    const apiData = await fetchTrainers()
    if (apiData && apiData.length > 0) {
      const sampleCenters = ['Ben Guerir', 'Safi', 'Jorf Lasfar', 'Khouribga']
      const mapped: TrainerRow[] = apiData.map((item, idx) => {
        const name = item.name || item.employee_id || `Trainer #${item.id}`
        const email = item.email || `${name.toLowerCase().replace(/\s+/g, '.')}@um6p.ma`
        const globalInfo = parseDays(item.global_days, item.global_total || 189)
        const animInfo = parseDays(item.animation_days, item.anim_total || 107)
        const rate = item.taux ?? (globalInfo.total > 0 ? Math.round((globalInfo.used / globalInfo.total) * 100) : 0)

        const rawCenter = (item as any).center || (item as any).nom_centre
        let center = sampleCenters[idx % sampleCenters.length]
        if (rawCenter && sampleCenters.some((sc) => sc.toLowerCase() === String(rawCenter).toLowerCase())) {
          center = rawCenter
        }
        const DOMAINS = ['Digital', 'HSE', 'Maintenance industrielle', 'Chimie et procédés', 'Industrie minière', 'Énergies renouvelables', 'Agriculture', 'Soft Skills']
        const domain = item.domain || DOMAINS[idx % DOMAINS.length]

        return {
          name,
          email,
          initials: getInitials(name),
          avatarTone: AVATAR_TONES[idx % AVATAR_TONES.length],
          roleLabel: item.role || 'Formateur',
          center,
          domain,
          globalUsed: item.global_used ?? globalInfo.used,
          globalTotal: item.global_total ?? globalInfo.total,
          animUsed: item.anim_used ?? animInfo.used,
          animTotal: item.anim_total ?? animInfo.total,
          rate,
          status: item.status || mapAlertToStatus(item.alerte),
        }
      })
      setTrainers(mapped)
      setIsLive(true)
    } else {
      setIsLive(false)
      setTrainers(FALLBACK_TRAINERS)
    }
    setLoading(false)
  }
  const runAiAnalysis = async () => {
    setAnalyzing(true)
    try {
      const data = await fetchAiAnomalies()
      if (data && data.anomalies && data.anomalies.length > 0) {
        setAiAnomalies(data.anomalies)
      } else {
        setAiAnomalies([
          { trainer_id: 2, name: 'Fatima Zahra El Idrissi', email: 'fatimazahra.elidrissi@um6p.ma', level: 'Critique (Surcharge)', reason: "Surcharge critique : 120 jours d'animation déclarés (dépasse la cible de 107j de +13j).", anim_days: 120, target_days: 107, delta: 13, metrics: 'Animation : 120j | Absences : 12j' },
          { trainer_id: 4, name: 'Nadia Amrani', email: 'nadia.amrani@um6p.ma', level: 'Critique (Surcharge)', reason: "Surcharge critique : 135 jours d'animation déclarés (dépasse la cible de 107j de +28j).", anim_days: 135, target_days: 107, delta: 28, metrics: 'Animation : 135j | Absences : 14j' },
        ])
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse IA", err)
    } finally {
      setAnalyzing(false)
    }
  }
  useEffect(() => {
    loadData()
  }, [])
  const filteredTrainers = trainers.filter((t) => {
    const query = activeSearchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query) ||
      t.center.toLowerCase().includes(query) ||
      (t.domain && t.domain.toLowerCase().includes(query)) ||
      (t.roleLabel && t.roleLabel.toLowerCase().includes(query))
    const matchesCenter = selectedCenter === 'ALL' || t.center.toLowerCase() === selectedCenter.toLowerCase()
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'AVAILABLE' && t.animUsed < 80) || (statusFilter === 'WATCH' && t.animUsed >= 80 && t.animUsed <= 107) || (statusFilter === 'CRITICAL' && t.animUsed > 107)
    const matchesDomain = selectedDomain === 'ALL' || (t.domain && t.domain.toLowerCase() === selectedDomain.toLowerCase())
    return matchesSearch && matchesCenter && matchesStatus && matchesDomain
  })
  const handleExport = () => {
    const csvHeader = 'ID,Nom,Email,Centre,Domaine,Role,GlobalUsed,GlobalTotal,AnimUsed,AnimTotal,Taux,Statut\n'
    const csvRows = trainers
      .map((t) => `"${t.initials}","${t.name}","${t.email}","${t.center}","${t.domain || 'Digital'}","${t.roleLabel}",${t.globalUsed},${t.globalTotal},${t.animUsed},${t.animTotal},${t.rate}%,${t.status}`)
      .join('\n')
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Livrable_Planning_Capacite_2026_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setExportNotification('📊 Planning et Rapport de Capacité 2026 exportés avec succès !')
    setTimeout(() => setExportNotification(null), 4000)
  }
  const handleRefreshData = async () => {
    setLoading(true)
    await loadData()
    setExportNotification('✨ Tableau de suivi et planning des formateurs actualisés avec succès !')
    setTimeout(() => setExportNotification(null), 3500)
    setLoading(false)
  }

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-card">
      <ActionBar
        isLive={isLive}
        loading={loading}
        analyzing={analyzing}
        showAdvancedFilters={showAdvancedFilters}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onRunAiAnalysis={runAiAnalysis}
        onRefresh={handleRefreshData}
        onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
        onExport={handleExport}
      />

      {exportNotification && (
        <div className="mx-5 my-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-150">
          <span>{exportNotification}</span>
          <button onClick={() => setExportNotification(null)} className="text-xs font-bold hover:underline cursor-pointer">
            ✕
          </button>
        </div>
      )}

      <AdvancedDomainFilter
        show={showAdvancedFilters}
        selectedDomain={selectedDomain}
        onSelectDomain={setSelectedDomain}
      />

      <TableFilters
        selectedCenter={selectedCenter}
        onSelectCenter={(val) => {
          setSelectedCenter(val)
          if (onSelectCenter) onSelectCenter(val)
        }}
        statusFilter={statusFilter}
        onSelectStatusFilter={setStatusFilter}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        searchQuery={activeSearchQuery}
        onSearchChange={handleSearchChange}
      />

      <AiAuditReport anomalies={aiAnomalies} onClose={() => setAiAnomalies([])} />

      <TrainersGrid trainers={filteredTrainers} />

      <AddTrainerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTrainerAdded={(newT) => {
          const newRow: TrainerRow = {
            name: newT.name,
            email: newT.email || `${newT.name.toLowerCase().replace(/\s+/g, '.')}@um6p.ma`,
            initials: getInitials(newT.name),
            avatarTone: AVATAR_TONES[trainers.length % AVATAR_TONES.length],
            roleLabel: newT.role || 'Formateur',
            center: newT.center || 'Ben Guerir',
            domain: newT.domain || 'Digital',
            globalUsed: 0,
            globalTotal: 189,
            animUsed: 0,
            animTotal: 107,
            rate: 0,
            status: 'ok',
          }
          setTrainers((prev) => [newRow, ...prev])
        }}
      />

      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        trainers={trainers.map((t) => ({ name: t.name, center: t.center, animUsed: t.animUsed, animTotal: t.animTotal }))}
        onApplySimulation={(sourceName, targetName, days) => {
          setTrainers((prev) =>
            prev.map((t) => {
              if (t.name === sourceName) {
                const newUsed = Math.max(0, t.animUsed - days)
                return { ...t, animUsed: newUsed, rate: Math.round((newUsed / t.animTotal) * 100), status: newUsed > 107 ? 'blocked' : newUsed > 80 ? 'watch' : 'ok' }
              }
              if (t.name === targetName) {
                const newUsed = t.animUsed + days
                return { ...t, animUsed: newUsed, rate: Math.round((newUsed / t.animTotal) * 100), status: newUsed > 107 ? 'blocked' : newUsed > 80 ? 'watch' : 'ok' }
              }
              return t
            }),
          )
        }}
      />
    </section>
  )
}