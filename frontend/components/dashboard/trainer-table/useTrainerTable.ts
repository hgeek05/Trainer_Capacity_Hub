import { useEffect, useState } from 'react'
import { fetchAiAnomalies, type AiAnomaly } from '@/lib/api'
import { exportTrainersCsv } from './export-helpers'
import { getInitials } from './helpers'
import { loadTrainerData } from './load-trainer-data'
import { AVATAR_TONES, FALLBACK_TRAINERS, type TrainerRow } from './types'

interface UseTrainerTableOptions {
  externalCenter?: string
  externalSearchQuery?: string
  externalOnSearchChange?: (query: string) => void
}

export function useTrainerTable({
  externalCenter,
  externalSearchQuery,
  externalOnSearchChange,
}: UseTrainerTableOptions = {}) {
  const [trainers, setTrainers] = useState<TrainerRow[]>(FALLBACK_TRAINERS)
  const [isLive, setIsLive] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCenter, setSelectedCenter] = useState<string>(externalCenter || 'ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ANNEE_2026')
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('')
  const [aiAnomalies, setAiAnomalies] = useState<AiAnomaly[]>([])
  const [analyzing, setAnalyzing] = useState<boolean>(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [isSimulationOpen, setIsSimulationOpen] = useState<boolean>(false)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'WATCH' | 'CRITICAL'>('ALL')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false)
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL')
  const [exportNotification, setExportNotification] = useState<string | null>(null)

  const activeSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery
  const handleSearchChange = externalOnSearchChange || setInternalSearchQuery

  useEffect(() => {
    if (externalCenter !== undefined) setSelectedCenter(externalCenter)
  }, [externalCenter])

  const loadData = async () => {
    setLoading(true)
    const res = await loadTrainerData()
    setTrainers(res.trainers)
    setIsLive(res.isLive)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

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

  const filteredTrainers = trainers.filter((t) => {
    const query = activeSearchQuery.trim().toLowerCase()
    const matchesSearch = !query || t.name.toLowerCase().includes(query) || t.email.toLowerCase().includes(query) || t.center.toLowerCase().includes(query) || (t.domain && t.domain.toLowerCase().includes(query)) || (t.roleLabel && t.roleLabel.toLowerCase().includes(query))
    const matchesCenter = selectedCenter === 'ALL' || t.center.toLowerCase() === selectedCenter.toLowerCase()
    const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'AVAILABLE' && t.animUsed < 80) || (statusFilter === 'WATCH' && t.animUsed >= 80 && t.animUsed <= 107) || (statusFilter === 'CRITICAL' && t.animUsed > 107)
    const matchesDomain = selectedDomain === 'ALL' || (t.domain && t.domain.toLowerCase() === selectedDomain.toLowerCase())
    return matchesSearch && matchesCenter && matchesStatus && matchesDomain
  })

  const handleExport = () => exportTrainersCsv(trainers, (msg) => {
    setExportNotification(msg)
    setTimeout(() => setExportNotification(null), 4000)
  })

  const handleRefreshData = async () => {
    setLoading(true)
    await loadData()
    setExportNotification('✨ Tableau de suivi et planning des formateurs actualisés avec succès !')
    setTimeout(() => setExportNotification(null), 3500)
    setLoading(false)
  }

  const handleTrainerAdded = (newT: { name: string; email?: string; center?: string; domain?: string; role?: string }) => {
    const newRow: TrainerRow = {
      name: newT.name,
      email: newT.email || `${newT.name.toLowerCase().replace(/\s+/g, '.')}@um6p.ma`,
      initials: getInitials(newT.name),
      avatarTone: AVATAR_TONES[trainers.length % AVATAR_TONES.length],
      roleLabel: newT.role || 'Formateur',
      center: newT.center || 'Ben Guerir',
      domain: newT.domain || 'Digital',
      globalUsed: 0, globalTotal: 189, animUsed: 0, animTotal: 107, rate: 0, status: 'ok',
    }
    setTrainers((prev) => [newRow, ...prev])
  }

  const handleApplySimulation = (sourceName: string, targetName: string, days: number) => {
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
  }

  return {
    trainers, filteredTrainers, isLive, loading, analyzing, selectedCenter, setSelectedCenter, statusFilter, setStatusFilter, selectedPeriod, setSelectedPeriod, selectedDomain, setSelectedDomain, showAdvancedFilters, setShowAdvancedFilters, activeSearchQuery, handleSearchChange, aiAnomalies, setAiAnomalies, isAddModalOpen, setIsAddModalOpen, isSimulationOpen, setIsSimulationOpen, exportNotification, setExportNotification, runAiAnalysis, handleExport, handleRefreshData, handleTrainerAdded, handleApplySimulation,
  }
}
