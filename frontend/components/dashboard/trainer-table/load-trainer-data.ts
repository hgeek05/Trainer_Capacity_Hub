import { fetchTrainers } from '@/lib/api'
import { getInitials, mapAlertToStatus, parseDays } from './helpers'
import { AVATAR_TONES, FALLBACK_TRAINERS, type TrainerRow } from './types'

export async function loadTrainerData(): Promise<{ trainers: TrainerRow[]; isLive: boolean }> {
  const apiData = await fetchTrainers()
  if (apiData && apiData.length > 0) {
    const sampleCenters = ['Ben Guerir', 'Safi', 'Jorf Lasfar', 'Khouribga']
    const mapped: TrainerRow[] = apiData.map((item, idx) => {
      const name = item.name || item.employee_id || `Trainer #${item.id}`
      let rawEmail = item.email || `${name.toLowerCase().replace(/\s+/g, '.')}@um6p.ma`
      const email = rawEmail.endsWith('@um6p.ma') ? rawEmail : `${rawEmail.split('@')[0]}@um6p.ma`
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
        id: item.id,
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
    return { trainers: mapped, isLive: true }
  }
  return { trainers: FALLBACK_TRAINERS, isLive: false }
}
