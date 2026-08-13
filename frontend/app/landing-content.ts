export interface LandingContent {
  subtitle: string
  managerTitle: string
  managerDesc: string
  managerCta: string
  plannerTitle: string
  plannerDesc: string
  plannerCta: string
  sitesHeader: string
  sites: { name: string; role: string }[]
}

export const landingContent: Record<'FR' | 'EN', LandingContent> = {
  FR: {
    subtitle:
      'Système de pilotage exécutif et d’optimisation de la capacité d’animation des formateurs à travers le réseau des centres UM6P.',
    managerTitle: 'Espace Direction & Management',
    managerDesc: 'Suivi de capacité globale & indicateurs stratégiques de charge.',
    managerCta: "Accéder à l'Espace Direction",
    plannerTitle: 'Espace Planification',
    plannerDesc: 'Planning annuel & gestion des fenêtres de formation.',
    plannerCta: 'Accéder au Planning',
    sitesHeader: 'NOS CENTRES DE FORMATION',
    sites: [
      { name: 'Ben Guerir', role: 'Campus Principal & Hub Innovation' },
      { name: 'Safi', role: 'Pôle Procédés & Chimie Industrielle' },
      { name: 'Jorf Lasfar', role: 'Pôle Excellence Industrielle & Énergie' },
      { name: 'Khouribga', role: 'Pôle Industrie Minière & Digitalisation' },
    ],
  },
  EN: {
    subtitle:
      'Executive dashboard and trainer capacity optimization system across UM6P training centers network.',
    managerTitle: 'Management & Steering Space',
    managerDesc: 'Capacity monitoring & strategic performance metrics.',
    managerCta: 'Access Direction Space',
    plannerTitle: 'Planning Space',
    plannerDesc: 'Annual schedule & training window management.',
    plannerCta: 'Access Planning',
    sitesHeader: 'OUR TRAINING CENTERS',
    sites: [
      { name: 'Ben Guerir', role: 'Main Campus & Innovation Hub' },
      { name: 'Safi', role: 'Process & Industrial Chemistry Center' },
      { name: 'Jorf Lasfar', role: 'Industrial Excellence & Energy Center' },
      { name: 'Khouribga', role: 'Mining Industry & Digitalization Center' },
    ],
  },
}
