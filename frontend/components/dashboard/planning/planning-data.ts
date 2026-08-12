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
  /** Salle d'animation affectée sur le site. Optionnel : une session peut être planifiée avant réservation. */
  room?: string
  /** Co-formateur en binôme sur la session. Optionnel : la plupart des modules sont animés seuls. */
  coTrainerName?: string
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
    room: 'Amphi Al Khwarizmi',
    coTrainerName: 'Youssef Benali',
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
    room: 'Atelier Pilote Chimie',
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
    room: 'Atelier Mécanique JL1',
    coTrainerName: 'Omar Chraibi',
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
    room: 'Atelier Digital Lab',
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
    room: 'Salle Innovation A1',
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
    room: 'Salle Extraction 1',
    coTrainerName: 'Karim Tazi',
  },
]
