export type TrainerStatus = 'ok' | 'watch' | 'blocked'

export interface TrainerRow {
  id?: string | number
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

export const AVATAR_TONES = [
  'bg-secondary text-foreground border border-border',
  'bg-[#d6492a]/10 text-[#d6492a] border border-[#d6492a]/20',
  'bg-[#5b0dbc]/10 text-[#5b0dbc] dark:text-[#a87bf0] border border-[#5b0dbc]/20',
]

export const FALLBACK_TRAINERS: TrainerRow[] = [
  {
    name: 'Youssef Benali',
    email: 'youssef.benali@um6p.ma',
    initials: 'YB',
    avatarTone: 'bg-secondary text-foreground border border-border',
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
    avatarTone: 'bg-[#5b0dbc]/10 text-[#5b0dbc] dark:text-[#a87bf0] border border-[#5b0dbc]/20',
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
    avatarTone: 'bg-[#d6492a]/10 text-[#d6492a] border border-[#d6492a]/20',
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
    avatarTone: 'bg-secondary text-foreground border border-border',
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
    avatarTone: 'bg-[#d6492a]/10 text-[#d6492a] border border-[#d6492a]/20',
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
    avatarTone: 'bg-[#5b0dbc]/10 text-[#5b0dbc] dark:text-[#a87bf0] border border-[#5b0dbc]/20',
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
