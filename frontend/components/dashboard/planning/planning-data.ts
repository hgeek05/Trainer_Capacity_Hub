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

export const INITIAL_SESSIONS: PlanningSession[] = [
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
