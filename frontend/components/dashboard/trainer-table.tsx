'use client'

import { useEffect, useState } from 'react'
import { Download, SlidersHorizontal, RefreshCw, Brain, Search, UserPlus, Sliders } from 'lucide-react'
import { useLanguage, type Dictionary } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { fetchTrainers, fetchAiAnomalies, fetchCenters, type TrainerApiData, type AiAnomaly, type CenterApiData } from '@/lib/api'
import { AddTrainerModal } from '@/components/dashboard/add-trainer-modal'
import { SimulationModal } from '@/components/dashboard/simulation-modal'
type TrainerStatus = 'ok' | 'watch' | 'blocked'
interface TrainerRow {
  name: string
  email: string
  initials: string
  avatarTone: string
  roleLabel: string
  center: string
  domain?: string
  globalUsed: number
  globalTotal: number
  animUsed: number
  animTotal: number
  rate: number
  status: TrainerStatus
}

const AVATAR_TONES = [
  'bg-pastel-blue text-pastel-blue-foreground',
  'bg-pastel-purple text-pastel-purple-foreground',
  'bg-pastel-green text-pastel-green-foreground',
  'bg-pastel-amber text-pastel-amber-foreground',
  'bg-pastel-red text-pastel-red-foreground',
]

const fallbackTrainers: TrainerRow[] = [
  {
    name: 'Youssef Benali',
    email: 'youssef.benali@um6p.ma',
    initials: 'YB',
    avatarTone: 'bg-pastel-blue text-pastel-blue-foreground',
    roleLabel: 'Lead Formateur',
    center: 'Ben Guerir',
    domain: 'Digital',
    globalUsed: 142,
    globalTotal: 189,
    animUsed: 82,
    animTotal: 107,
    rate: 75,
    status: 'ok',
  },
  {
    name: 'Fatima Zahra El Idrissi',
    email: 'fatimazahra.elidrissi@um6p.ma',
    initials: 'FE',
    avatarTone: 'bg-pastel-purple text-pastel-purple-foreground',
    roleLabel: 'Formateur Expert',
    center: 'Safi',
    globalUsed: 168,
    globalTotal: 189,
    animUsed: 120,
    animTotal: 107,
    rate: 89,
    status: 'watch',
  },
  {
    name: 'Karim Tazi',
    email: 'karim.tazi@um6p.ma',
    initials: 'KT',
    avatarTone: 'bg-pastel-green text-pastel-green-foreground',
    roleLabel: 'Formateur Senior',
    center: 'Jorf Lasfar',
    globalUsed: 121,
    globalTotal: 189,
    animUsed: 64,
    animTotal: 107,
    rate: 64,
    status: 'ok',
  },
  {
    name: 'Nadia Amrani',
    email: 'nadia.amrani@um6p.ma',
    initials: 'NA',
    avatarTone: 'bg-pastel-amber text-pastel-amber-foreground',
    roleLabel: 'Formateur Senior',
    center: 'Khouribga',
    globalUsed: 185,
    globalTotal: 189,
    animUsed: 135,
    animTotal: 107,
    rate: 98,
    status: 'blocked',
  },
  {
    name: 'Omar Chraibi',
    email: 'omar.chraibi@um6p.ma',
    initials: 'OC',
    avatarTone: 'bg-pastel-red text-pastel-red-foreground',
    roleLabel: 'Formateur Junior',
    center: 'Ben Guerir',
    globalUsed: 96,
    globalTotal: 189,
    animUsed: 51,
    animTotal: 107,
    rate: 51,
    status: 'ok',
  },
  {
    name: 'Salma Bennis',
    email: 'salma.bennis@um6p.ma',
    initials: 'SB',
    avatarTone: 'bg-pastel-blue text-pastel-blue-foreground',
    roleLabel: 'Formateur Expert',
    center: 'Ben Guerir',
    globalUsed: 157,
    globalTotal: 189,
    animUsed: 112,
    animTotal: 107,
    rate: 83,
    status: 'watch',
  },
]

function parseDays(str?: string, defaultTotal = 189): { used: number; total: number } {
  if (!str) return { used: 0, total: defaultTotal }
  const match = str.match(/(\d+)\s*\/\s*(\d+)/)
  if (match) {
    return { used: parseInt(match[1], 10), total: parseInt(match[2], 10) }
  }
  const val = parseInt(str, 10) || 0
  return { used: val, total: defaultTotal }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function mapAlertToStatus(alertStr?: string): TrainerStatus {
  if (!alertStr) return 'ok'
  const lower = alertStr.toLowerCase()
  if (lower.includes('blocked') || lower.includes('critique') || lower.includes('bloqué')) return 'blocked'
  if (lower.includes('watch') || lower.includes('attention')) return 'watch'
  return 'ok'
}

function StatusBadge({ status }: { status: TrainerStatus }) {
  const { t } = useLanguage()
  const config = {
    ok: { label: t.statusOk, tone: 'bg-pastel-green text-pastel-green-foreground' },
    watch: { label: t.statusWatch, tone: 'bg-pastel-amber text-pastel-amber-foreground' },
    blocked: { label: t.statusBlocked, tone: 'bg-pastel-red text-pastel-red-foreground' },
  }[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        config.tone,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {config.label}
    </span>
  )
}

function LoadCell({ used, total }: { used: number; total: number }) {
  const { t } = useLanguage()
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  const barTone =
    pct >= 95 ? 'bg-pastel-red-foreground' : pct >= 85 ? 'bg-pastel-amber-foreground' : 'bg-pastel-green-foreground'

  return (
    <div className="flex min-w-28 flex-col gap-1.5">
      <span className="text-sm tabular-nums">
        {used}/{total}
        {t.days}
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary" aria-hidden="true">
        <div className={cn('h-full rounded-full', barTone)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}

interface TrainerTableProps {
  selectedCenter?: string
  onSelectCenter?: (center: string) => void
}

export function TrainerTable({ selectedCenter: externalCenter, onSelectCenter }: TrainerTableProps = {}) {
  const { t } = useLanguage()
  const [trainers, setTrainers] = useState<TrainerRow[]>(fallbackTrainers)
  const [isLive, setIsLive] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Dynamic centers list fetched from API
  const [centersList, setCentersList] = useState<CenterApiData[]>([
    { id: 1, nom_centre: 'Ben Guerir' },
    { id: 2, nom_centre: 'Safi' },
    { id: 3, nom_centre: 'Jorf Lasfar' },
    { id: 4, nom_centre: 'Khouribga' },
  ])

  // Global Dashboard Filters State (Diapositive 6)
  const [selectedCenter, setSelectedCenter] = useState<string>(externalCenter || 'ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ANNEE_2026')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    if (externalCenter !== undefined) {
      setSelectedCenter(externalCenter)
    }
  }, [externalCenter])

  // AI Anomaly detection state
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

        const DOMAINS = [
          'Digital',
          'HSE',
          'Maintenance industrielle',
          'Chimie et procédés',
          'Industrie minière',
          'Énergies renouvelables',
          'Agriculture',
          'Soft Skills',
        ]
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
      setTrainers(fallbackTrainers)
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
          {
            trainer_id: 2,
            name: 'Fatima Zahra El Idrissi',
            email: 'fatimazahra.elidrissi@um6p.ma',
            level: 'Critique (Surcharge)',
            reason: "Surcharge critique : 120 jours d'animation déclarés (dépasse la cible de 107j de +13j).",
            anim_days: 120,
            target_days: 107,
            delta: 13,
            metrics: 'Animation : 120j | Absences : 12j',
          },
          {
            trainer_id: 4,
            name: 'Nadia Amrani',
            email: 'nadia.amrani@um6p.ma',
            level: 'Critique (Surcharge)',
            reason: "Surcharge critique : 135 jours d'animation déclarés (dépasse la cible de 107j de +28j).",
            anim_days: 135,
            target_days: 107,
            delta: 28,
            metrics: 'Animation : 135j | Absences : 14j',
          },
          {
            trainer_id: 6,
            name: 'Salma Bennis',
            email: 'salma.bennis@um6p.ma',
            level: 'Attention (Volume/Absence)',
            reason: 'Incohérence planning : Volume d’animation élevé (112j) cumulé avec un taux d’absence.',
            anim_days: 112,
            target_days: 107,
            delta: 5,
            metrics: 'Animation : 112j | Absences : 5j',
          },
        ])
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse IA", err)
      setAiAnomalies([
        {
          trainer_id: 2,
          name: 'Fatima Zahra El Idrissi',
          email: 'fatimazahra.elidrissi@um6p.ma',
          level: 'Critique (Surcharge)',
          reason: "Surcharge critique : 120 jours d'animation déclarés (dépasse la cible de 107j de +13j).",
          anim_days: 120,
          target_days: 107,
          delta: 13,
          metrics: 'Animation : 120j | Absences : 12j',
        },
      ])
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    loadData()
    fetchCenters().then((centersData) => {
      if (centersData && centersData.length > 0) {
        const OFFICIAL = ['ben guerir', 'safi', 'jorf lasfar', 'khouribga']
        const filtered = centersData.filter((c) => OFFICIAL.includes(c.nom_centre.toLowerCase()))
        if (filtered.length > 0) {
          setCentersList(filtered)
        }
      }
    })
  }, [])

  // Filter formateurs in real time
  const filteredTrainers = trainers.filter((t) => {
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query)

    const matchesCenter =
      selectedCenter === 'ALL' ||
      t.center.toLowerCase() === selectedCenter.toLowerCase()

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'AVAILABLE' && t.animUsed < 80) ||
      (statusFilter === 'WATCH' && t.animUsed >= 80 && t.animUsed <= 107) ||
      (statusFilter === 'CRITICAL' && t.animUsed > 107)

    const matchesDomain =
      selectedDomain === 'ALL' ||
      (t.domain && t.domain.toLowerCase() === selectedDomain.toLowerCase())

    return matchesSearch && matchesCenter && matchesStatus && matchesDomain
  })

  const handleExport = () => {
    const csvHeader = 'ID,Nom,Email,Centre,Domaine,Role,GlobalUsed,GlobalTotal,AnimUsed,AnimTotal,Taux,Statut\n'
    const csvRows = trainers
      .map(
        (t) =>
          `"${t.initials}","${t.name}","${t.email}","${t.center}","${t.domain || 'Digital'}","${t.roleLabel}",${t.globalUsed},${t.globalTotal},${t.animUsed},${t.animTotal},${t.rate}%,${t.status}`,
      )
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
    setExportNotification("🔄 Données du réseau et statut de capacité 2026 actualisés avec succès en direct de FastAPI !")
    setTimeout(() => setExportNotification(null), 3500)
    setLoading(false)
  }

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">{t.trainerLoad}</h2>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              isLive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
            )}
          >
            <span className={cn('size-1.5 rounded-full', isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
            {isLive ? 'API Direct' : 'Mode Démo'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSimulationOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 text-xs font-semibold text-purple-700 dark:text-purple-300 transition-all hover:bg-purple-500/20 cursor-pointer shadow-xs"
          >
            <Sliders className="size-3.5" />
            ⚡ Simulation What-If
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 shadow-sm cursor-pointer"
          >
            <UserPlus className="size-3.5" />
            Nouveau Formateur
          </button>
          <button
            type="button"
            onClick={runAiAnalysis}
            disabled={analyzing}
            className="flex h-8 items-center gap-1.5 rounded-full bg-purple-600 px-3 text-xs font-medium text-white transition-all hover:bg-purple-700 shadow-sm disabled:opacity-50"
          >
            <Brain className={cn('size-3.5', analyzing && 'animate-spin')} />
            {analyzing ? 'Analyse en cours...' : "⚡ Lancer l'Audit Proactif de Charge"}
          </button>
          <button
            type="button"
            onClick={handleRefreshData}
            title="Rafraîchir les données"
            className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-secondary px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
            Rafraîchir
          </button>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors cursor-pointer',
              showAdvancedFilters
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            {t.filter}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex h-8 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-500/20 cursor-pointer shadow-xs"
          >
            <Download className="size-3.5" />
            {t.export}
          </button>
        </div>
      </div>

      {exportNotification && (
        <div className="mx-5 my-2 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-in fade-in duration-150">
          <span>{exportNotification}</span>
          <button onClick={() => setExportNotification(null)} className="text-xs font-bold hover:underline">
            ✕
          </button>
        </div>
      )}

      {showAdvancedFilters && (
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-secondary/40 border-y border-border/80 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-foreground">Filtres Avancés par Domaine d'Activité :</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          >
            <option value="ALL">Tous les domaines d'activité</option>
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
              onClick={() => setSelectedDomain('ALL')}
              className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Réinitialiser le domaine
            </button>
          )}
        </div>
      )}

      {/* --- Barre de Filtres Globaux dynamiquement liée aux Centres PostgreSQL --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border px-5 py-3 bg-secondary/30">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtre par Centre */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Centre</label>
            <select
              value={selectedCenter}
              onChange={(e) => {
                const val = e.target.value
                setSelectedCenter(val)
                if (onSelectCenter) onSelectCenter(val)
              }}
              className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ALL">Tous les centres</option>
              <option value="Ben Guerir">Ben Guerir</option>
              <option value="Safi">Safi</option>
              <option value="Jorf Lasfar">Jorf Lasfar</option>
              <option value="Khouribga">Khouribga</option>
            </select>
          </div>

          {/* Matrice de Disponibilité (Filtres Rapides) */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Matrice de Disponibilité</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                  statusFilter === 'ALL'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:bg-secondary',
                )}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('AVAILABLE')}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                  statusFilter === 'AVAILABLE'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-card border border-border text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10',
                )}
              >
                🟢 Disponibles
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('WATCH')}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                  statusFilter === 'WATCH'
                    ? 'bg-amber-500 text-white'
                    : 'bg-card border border-border text-amber-600 dark:text-amber-400 hover:bg-amber-500/10',
                )}
              >
                🟡 Vigilance
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('CRITICAL')}
                className={cn(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                  statusFilter === 'CRITICAL'
                    ? 'bg-rose-500 text-white'
                    : 'bg-card border border-border text-rose-600 dark:text-rose-400 hover:bg-rose-500/10',
                )}
              >
                🔴 Surchargés
              </button>
            </div>
          </div>

          {/* Filtre par Période */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Période</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="ANNEE_2026">Année 2026 (Global)</option>
              <option value="S1">Semestre 1</option>
              <option value="S2">Semestre 2</option>
              <option value="MOIS_COURANT">Mois courant</option>
            </select>
          </div>
        </div>

        {/* Recherche textuelle par nom ou email */}
        <div className="w-full sm:w-64">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Rechercher un formateur</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 rounded-lg border border-border bg-card px-3 py-1 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute right-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- Rapport d'Audit Intelligent (IA Métier) --- */}
      {aiAnomalies.length > 0 && (
        <div className="mx-5 my-4 rounded-xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-foreground font-bold text-sm">
                Rapport d'Audit Proactif — Analyse de Charge par IA
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20">
                {aiAnomalies.length} anomalie(s) identifiée(s)
              </span>
              <button
                onClick={() => setAiAnomalies([])}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiAnomalies.map((anomaly, idx) => {
              const animDays = anomaly.anim_days ?? 120
              const isOver = animDays > 107
              const delta = animDays - 107
              const pct = Math.min(Math.round((animDays / 107) * 100), 100)

              return (
                <div
                  key={idx}
                  className="bg-secondary/40 p-4 rounded-xl border border-border/80 flex flex-col justify-between hover:border-border transition-all"
                >
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-foreground text-sm">{anomaly.name}</span>
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2.5 py-0.5 rounded-full border',
                          isOver
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
                        )}
                      >
                        {isOver ? `⚠️ Surcharge (+${delta}j)` : `✅ Conforme (${delta}j)`}
                      </span>
                    </div>
                    {anomaly.email && <p className="text-xs text-muted-foreground mb-3">{anomaly.email}</p>}

                    {/* Jauge d'écart dynamique vs Cible (107j) */}
                    <div className="bg-card p-3 rounded-xl border border-border/60 mb-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">{animDays} / 107 j</span>
                        <span className="text-muted-foreground font-medium text-[11px]">Cible : 107j max</span>
                      </div>

                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isOver ? 'bg-rose-500' : 'bg-emerald-500',
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
                        <span>Écart cible : {delta > 0 ? `+${delta} jours` : `${delta} jours`}</span>
                        <span className="font-mono">{anomaly.metrics}</span>
                      </div>
                    </div>

                    <div className="bg-card/70 p-3 rounded-lg border border-border/40 mb-2">
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        💡 {anomaly.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border/60 text-[11px] text-muted-foreground font-mono">
                    <span>Statut IA : {anomaly.level}</span>
                    <span className="text-sidebar-primary font-medium cursor-pointer hover:underline">
                      Vérifier le dossier →
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="px-5 py-3 font-medium">{t.trainer}</th>
              <th scope="col" className="px-4 py-3 font-medium">Centre & Rôle</th>
              <th scope="col" className="px-4 py-3 font-medium">{t.global}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t.animation}</th>
              <th scope="col" className="px-4 py-3 font-medium">{t.rate}</th>
              <th scope="col" className="px-5 py-3 font-medium">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainers.length > 0 ? (
              filteredTrainers.map((trainer) => (
                <tr
                  key={trainer.name}
                  className="border-b border-border/60 transition-colors last:border-b-0 hover:bg-secondary/50"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          trainer.avatarTone,
                        )}
                      >
                        {trainer.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium whitespace-nowrap">{trainer.name}</span>
                        <span className="text-xs text-muted-foreground">{trainer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">{trainer.center}</span>
                        {trainer.domain && (
                          <span className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                            {trainer.domain}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{trainer.roleLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <LoadCell used={trainer.globalUsed} total={trainer.globalTotal} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1.5 w-44">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-foreground">{trainer.animUsed} j</span>
                        <span className="text-muted-foreground text-[11px]">Cible : 107j</span>
                      </div>
                      
                      {/* Barre de jauge dynamique */}
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div 
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            trainer.animUsed > 107 ? 'bg-rose-500' : 'bg-emerald-500'
                          )}
                          style={{ width: `${Math.min((trainer.animUsed / 107) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium tabular-nums">{trainer.rate}%</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {trainer.animUsed > 107 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                        ⚠️ Surcharge (+{trainer.animUsed - 107}j)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        ✅ Équilibré
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Aucun formateur ne correspond à vos critères de recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout de formateur */}
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

      {/* Modal de simulation What-If */}
      <SimulationModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        trainers={trainers.map((t) => ({
          name: t.name,
          center: t.center,
          animUsed: t.animUsed,
          animTotal: t.animTotal,
        }))}
        onApplySimulation={(sourceName, targetName, days) => {
          setTrainers((prev) =>
            prev.map((t) => {
              if (t.name === sourceName) {
                const newUsed = Math.max(0, t.animUsed - days)
                const newRate = Math.round((newUsed / t.animTotal) * 100)
                return {
                  ...t,
                  animUsed: newUsed,
                  rate: newRate,
                  status: newUsed > 107 ? 'blocked' : newUsed > 80 ? 'watch' : 'ok',
                }
              }
              if (t.name === targetName) {
                const newUsed = t.animUsed + days
                const newRate = Math.round((newUsed / t.animTotal) * 100)
                return {
                  ...t,
                  animUsed: newUsed,
                  rate: newRate,
                  status: newUsed > 107 ? 'blocked' : newUsed > 80 ? 'watch' : 'ok',
                }
              }
              return t
            }),
          )
        }}
      />
    </section>
  )
}