/**
 * Référentiel partagé du réseau TechniX / UM6P.
 * Source unique pour les sélecteurs du planning et la vue Paramètres
 * (gestion des sites, des salles et des domaines).
 */

export interface TechnixSite {
  /** Identifiant court utilisé pour les filtres (minuscule, sans espace). */
  id: string
  /** Libellé officiel du centre, tel qu'affiché et stocké dans les sessions. */
  name: string
  /** Positionnement du site dans le réseau. */
  role: string
  /** Salles d'animation disponibles sur le site. */
  rooms: string[]
}

export const TECHNIX_SITES: TechnixSite[] = [
  {
    id: 'benguerir',
    name: 'Ben Guerir',
    role: 'Site Central / UM6P',
    rooms: ['Amphi Al Khwarizmi', 'Salle Innovation A1', 'Salle Innovation A2', 'Atelier Digital Lab'],
  },
  {
    id: 'safi',
    name: 'Safi',
    role: 'Pôle Industriel',
    rooms: ['Salle Procédés 1', 'Salle Procédés 2', 'Atelier Pilote Chimie'],
  },
  {
    id: 'jorf',
    name: 'Jorf Lasfar',
    role: 'Pôle Chimique',
    rooms: ['Salle Maintenance Nord', 'Atelier Mécanique JL1', 'Salle HSE Jorf'],
  },
  {
    id: 'khouribga',
    name: 'Khouribga',
    role: 'Pôle Minier',
    rooms: ['Salle Extraction 1', 'Atelier Mines KH2', 'Salle Polyvalente Khouribga'],
  },
]

/** Libellés des centres, dans l'ordre officiel du réseau. */
export const CENTER_NAMES: string[] = TECHNIX_SITES.map((site) => site.name)

/** Domaines d'expertise couverts par le catalogue de formation. */
export const TRAINING_DOMAINS: string[] = [
  'HSE',
  'Digital',
  'Maintenance industrielle',
  'Chimie et procédés',
  'Industrie minière',
  'Soft Skills',
]

/** Vivier des formateurs mobilisables sur les sessions. */
export const TRAINER_POOL: string[] = [
  'Fatima Ait Zzi',
  'Nadia Amrani',
  'Omar Chraibi',
  'Karim Tazi',
  'Fatima Zahra El Idrissi',
  'Youssef Benali',
]

/** Salles disponibles pour un centre donné, toutes salles si le centre est inconnu. */
export function getRoomsForCenter(centerName: string): string[] {
  const site = TECHNIX_SITES.find((s) => s.name.toLowerCase() === centerName.toLowerCase())
  return site ? site.rooms : TECHNIX_SITES.flatMap((s) => s.rooms)
}
