export type LandingLang = 'FR' | 'EN'

export interface LandingSite {
  name: string
  role: string
}

export interface LandingCopy {
  title: string
  subtitle: string
  managerTitle: string
  managerDesc: string
  managerBtn: string
  plannerTitle: string
  plannerDesc: string
  plannerBtn: string
  sitesLabel: string
  sites: LandingSite[]
}

export const landingContent: Record<LandingLang, LandingCopy> = {
  FR: {
    title: 'Trainer Capacity Hub',
    subtitle:
      "Plateforme de gestion et d'optimisation de la capacité d'animation des formateurs.",
    managerTitle: 'Espace Direction & Management',
    managerDesc:
      "Visualisation de la charge globale, suivi des indicateurs de capacité et rééquilibrage de l'activité.",
    managerBtn: 'Accéder au Tableau de Bord',
    plannerTitle: 'Espace Planification',
    plannerDesc:
      'Programmation des sessions de formation, gestion du calendrier annuel et affectation par centre.',
    plannerBtn: 'Consulter le Planning',
    sitesLabel: 'Nos centres de formation',
    sites: [
      { name: 'Ben Guerir', role: 'Site Central / UM6P' },
      { name: 'Safi', role: 'Pôle Industriel' },
      { name: 'Jorf Lasfar', role: 'Pôle Chimique' },
      { name: 'Khouribga', role: 'Pôle Minier' },
    ],
  },
  EN: {
    title: 'Trainer Capacity Hub',
    subtitle: 'Trainer animation capacity management and optimization platform.',
    managerTitle: 'Direction & Management Space',
    managerDesc:
      'Global workload visualization, capacity KPI tracking, and activity rebalancing.',
    managerBtn: 'Access Dashboard',
    plannerTitle: 'Planning Space',
    plannerDesc:
      'Training session scheduling, annual calendar management, and site assignments.',
    plannerBtn: 'View Schedule',
    sitesLabel: 'Our training centers',
    sites: [
      { name: 'Ben Guerir', role: 'Central Site / UM6P' },
      { name: 'Safi', role: 'Industrial Hub' },
      { name: 'Jorf Lasfar', role: 'Chemical Hub' },
      { name: 'Khouribga', role: 'Mining Hub' },
    ],
  },
}
