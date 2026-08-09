export interface HolidayInfo {
  name: string
  type: 'legal' | 'religious' | 'closure'
}

export interface ScheduledSession {
  date: string
  trainerName: string
  trainerDomain: string
  center: string
  courseTitle: string
}

export const MOROCCO_HOLIDAYS_2026: Record<string, HolidayInfo> = {
  '2026-01-01': { name: 'Nouvel An', type: 'legal' },
  '2026-01-11': { name: "Manifeste de l'Indépendance", type: 'legal' },
  '2026-01-14': { name: 'Nouvel An Amazigh', type: 'legal' },
  '2026-03-20': { name: 'Aïd al-Fitr (Jour 1)', type: 'religious' },
  '2026-03-21': { name: 'Aïd al-Fitr (Jour 2)', type: 'religious' },
  '2026-03-22': { name: 'Aïd al-Fitr (Jour 3)', type: 'religious' },
  '2026-05-01': { name: 'Fête du Travail', type: 'legal' },
  '2026-05-27': { name: 'Aïd al-Adha (Jour 1)', type: 'religious' },
  '2026-05-28': { name: 'Aïd al-Adha (Jour 2)', type: 'religious' },
  '2026-07-30': { name: 'Fête du Trône', type: 'legal' },
  '2026-08-14': { name: 'Allégeance Oued Eddahab', type: 'legal' },
  '2026-08-20': { name: 'Révolution du Roi et du Peuple', type: 'legal' },
  '2026-08-21': { name: 'Fête de la Jeunesse', type: 'legal' },
  '2026-11-06': { name: 'Marche Verte', type: 'legal' },
  '2026-11-18': { name: "Fête de l'Indépendance", type: 'legal' },
}

export const MOROCCO_HOLIDAYS_2026_EN: Record<string, string> = {
  '2026-01-01': "New Year's Day",
  '2026-01-11': 'Proclamation of Independence Day',
  '2026-01-14': 'Amazigh New Year',
  '2026-03-20': 'Eid al-Fitr (Day 1)',
  '2026-03-21': 'Eid al-Fitr (Day 2)',
  '2026-03-22': 'Eid al-Fitr (Day 3)',
  '2026-05-01': 'Labor Day',
  '2026-05-27': 'Eid al-Adha (Day 1)',
  '2026-05-28': 'Eid al-Adha (Day 2)',
  '2026-07-30': 'Throne Day',
  '2026-08-14': 'Allegiance of Oued Eddahab',
  '2026-08-20': 'Revolution of the King and the People',
  '2026-08-21': 'Youth Day',
  '2026-11-06': 'Green March',
  '2026-11-18': 'Independence Day',
}

export const MOCK_SESSIONS_MAP: Record<string, ScheduledSession[]> = {
  '2026-08-10': [
    { date: '2026-08-10', trainerName: 'Fatima Ait Zzi', trainerDomain: 'HSE', center: 'Ben Guerir', courseTitle: 'Prévention des Risques & Sécurité Industrielle' },
    { date: '2026-08-10', trainerName: 'Omar Chraibi', trainerDomain: 'Digital', center: 'Ben Guerir', courseTitle: 'Transformation Digitale & IoT Usines' },
  ],
  '2026-08-12': [
    { date: '2026-08-12', trainerName: 'Nadia Amrani', trainerDomain: 'Chimie et procédés', center: 'Safi', courseTitle: 'Procédés Chimiques de Valorisation' },
  ],
  '2026-08-15': [
    { date: '2026-08-15', trainerName: 'Karim Tazi', trainerDomain: 'Maintenance industrielle', center: 'Jorf Lasfar', courseTitle: 'Maintenance Prédictive & Capteurs' },
  ],
  '2026-08-18': [
    { date: '2026-08-18', trainerName: 'Fatima Zahra El Idrissi', trainerDomain: 'Industrie minière', center: 'Khouribga', courseTitle: 'Extraction & Valorisation Minière' },
  ],
  '2026-08-25': [
    { date: '2026-08-25', trainerName: 'Youssef Benali', trainerDomain: 'Soft Skills', center: 'Ben Guerir', courseTitle: 'Leadership & Management d\'Équipe' },
  ],
}

export const MOCK_SESSIONS_MAP_EN: Record<string, ScheduledSession[]> = {
  '2026-08-10': [
    { date: '2026-08-10', trainerName: 'Fatima Ait Zzi', trainerDomain: 'HSE', center: 'Ben Guerir', courseTitle: 'Risk Prevention & Industrial Safety' },
    { date: '2026-08-10', trainerName: 'Omar Chraibi', trainerDomain: 'Digital', center: 'Ben Guerir', courseTitle: 'Digital Transformation & Factory IoT' },
  ],
  '2026-08-12': [
    { date: '2026-08-12', trainerName: 'Nadia Amrani', trainerDomain: 'Chemical Processes', center: 'Safi', courseTitle: 'Chemical Valorization Processes' },
  ],
  '2026-08-15': [
    { date: '2026-08-15', trainerName: 'Karim Tazi', trainerDomain: 'Industrial Maintenance', center: 'Jorf Lasfar', courseTitle: 'Predictive Maintenance & Sensors' },
  ],
  '2026-08-18': [
    { date: '2026-08-18', trainerName: 'Fatima Zahra El Idrissi', trainerDomain: 'Mining Industry', center: 'Khouribga', courseTitle: 'Mining Extraction & Valorization' },
  ],
  '2026-08-25': [
    { date: '2026-08-25', trainerName: 'Youssef Benali', trainerDomain: 'Soft Skills', center: 'Ben Guerir', courseTitle: 'Leadership & Team Management' },
  ],
}
