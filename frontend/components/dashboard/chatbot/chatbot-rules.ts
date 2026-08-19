import type { Lang } from '@/lib/i18n'

interface TrainerInfo {
  name: string
  email: string
  role: string
  center: string
  domain: string
  globalDays: string
  animDays: string
  rate: number
  status: 'ok' | 'watch' | 'blocked'
}

const TRAINERS_DB: TrainerInfo[] = [
  { name: 'Youssef Benali', email: 'youssef.benali@um6p.ma', role: 'Lead Formateur', center: 'Ben Guerir', domain: 'Digital', globalDays: '142/189j', animDays: '82/107j', rate: 75, status: 'ok' },
  { name: 'Fatima Zahra El Idrissi', email: 'fatimazahra.elidrissi@um6p.ma', role: 'Formateur Expert', center: 'Safi', domain: 'HSE', globalDays: '168/189j', animDays: '120/107j', rate: 89, status: 'watch' },
  { name: 'Karim Tazi', email: 'karim.tazi@um6p.ma', role: 'Formateur Senior', center: 'Jorf Lasfar', domain: 'Maintenance industrielle', globalDays: '121/189j', animDays: '64/107j', rate: 64, status: 'ok' },
  { name: 'Nadia Amrani', email: 'nadia.amrani@um6p.ma', role: 'Formateur Senior', center: 'Khouribga', domain: 'Chimie et procédés', globalDays: '185/189j', animDays: '135/107j', rate: 98, status: 'blocked' },
  { name: 'Omar Chraibi', email: 'omar.chraibi@um6p.ma', role: 'Formateur Junior', center: 'Ben Guerir', domain: 'Industrie minière', globalDays: '96/189j', animDays: '51/107j', rate: 51, status: 'ok' },
  { name: 'Salma Bennis', email: 'salma.bennis@um6p.ma', role: 'Formateur Expert', center: 'Ben Guerir', domain: 'Soft Skills', globalDays: '157/189j', animDays: '112/107j', rate: 83, status: 'watch' },
]

export function getBotResponse(userText: string, lang: Lang, isTrainer: boolean = false, trainerName: string = 'Formateur'): string {
  const query = userText.toLowerCase().trim()

  // ==========================================
  // MODE 1 : COPILOTE FORMATEUR (Espace Personnel)
  // ==========================================
  if (isTrainer) {
    // 1. Planning / Prochaines sessions / À venir
    if (query.includes('planning') || query.includes('prochaine') || query.includes('session') || query.includes('cours') || query.includes('prévue') || query.includes('programme') || query.includes('calendrier')) {
      return lang === 'en'
        ? `📅 **Your Upcoming Training Schedule (2026)**:\n• **10/08/2026 → 14/08/2026** : Risk Prevention & Industrial Safety (5 days • Ben Guerir - Amphi Al Khwarizmi • Status: Validated ✓)\n• **25/08/2026 → 28/08/2026** : Site Audit & HSE Compliance (4 days • Safi - Pilot Workshop • Status: Pending N+1 ⏳)\n👉 You can consult the full schedule in the *General Planning* tab.`
        : `📅 **Votre Planning de Formations à Venir (2026)** :\n• **10/08/2026 → 14/08/2026** : Prévention des Risques & Sécurité Industrielle (5 jours • Ben Guerir - Amphi Al Khwarizmi • Statut : Validé ✓)\n• **25/08/2026 → 28/08/2026** : Audit Terrain & Conformité HSE (4 jours • Safi - Atelier Pilote • Statut : En attente N+1 ⏳)\n👉 Vous pouvez consulter l'ensemble du calendrier dans l'onglet *Planning Général*.`
    }

    // 2. Formations passées / Réalisées / Historique
    if (query.includes('passée') || query.includes('passe') || query.includes('historique') || query.includes('réalisée') || query.includes('realise') || query.includes('terminée')) {
      return lang === 'en'
        ? `📚 **Your Completed Trainings History**:\n• **02/02/2026 → 06/02/2026** : Electrical Risk Training (5 days • Ben Guerir Campus • Status: Validated ✓)\n👉 Total validated days so far in 2026: **82 animation days**.`
        : `📚 **Vos Formations Déjà Réalisées & Validées** :\n• **02/02/2026 → 06/02/2026** : Formation Risques Électriques (5 jours • Ben Guerir Campus • Statut : Validé ✓)\n👉 Total cumulé d'animation validé en 2026 : **82 jours d'animation**.`
    }

    // 3. Jauge de charge / Quota / Jours restants / Capacité
    if (query.includes('charge') || query.includes('jauge') || query.includes('jour') || query.includes('quota') || query.includes('cible') || query.includes('reste') || query.includes('capacité') || query.includes('capacite')) {
      return lang === 'en'
        ? `📊 **Your 2026 Activity & Capacity Status**:\n• **Days Delivered / Validated**: 82 animation days\n• **Annual Target**: 107 days / year\n• **Progress**: 77%\n• **Remaining Days**: 25 favorable animation days to reach your 2026 target.`
        : `📊 **Votre Bilan d'Activité & Jauge 2026** :\n• **Jours réalisés / validés** : 82 jours d'animation\n• **Cible annuelle** : 107 jours / an\n• **Progression** : 77%\n• **Reste à animer** : 25 jours favorables d'animation pour atteindre votre cible 2026.`
    }

    // 4. Manager N+1 / Circuit de validation
    if (query.includes('manager') || query.includes('validation') || query.includes('n+1') || query.includes('approbation') || query.includes('responsable')) {
      return lang === 'en'
        ? `👤 **Your Validation Workflow (N+1)**:\n• **Manager**: Soufiane ARROUB (Planning & Capacity Manager)\n• **Status**: Active validation flow. Your declared sessions and leaves are directly routed to him for approval.`
        : `👤 **Votre Circuit de Validation Hiérarchique (N+1)** :\n• **Manager référent** : Soufiane ARROUB (Planning & Capacity Manager)\n• **Statut** : Flux de validation actif. Vos déclarations de sessions ou d'indisponibilités lui sont transmises directement pour arbitrage.`
    }

    // 5. Disponibilité & Déclaration
    if (query.includes('disponible') || query.includes('indisponible') || query.includes('statut') || query.includes('déclarer') || query.includes('declarer') || query.includes('congé') || query.includes('conge') || query.includes('activité') || query.includes('activite')) {
      return lang === 'en'
        ? `🟢 **Availability & Activity Declaration**:\n• Use the **Status toggle** in your header to switch between Available and Unavailable.\n• Click **\`+ Declare an activity\`** to submit a session, preparation, or leave to your manager.`
        : `🟢 **Gestion de Disponibilité & Déclaration d'Activité** :\n• Utilisez l'interrupteur **Statut** en haut de *Mon Espace* pour basculer entre Disponible et Indisponible.\n• Cliquez sur **\`+ Déclarer une activité\`** pour soumettre une animation, de l'ingénierie ou un congé à votre manager.`
    }

    // 6. Réponse par défaut Formateur
    return lang === 'en'
      ? `💡 **Trainer Assistant**: Hello ${trainerName}! You can ask me:\n• *"What is my schedule?"*\n• *"My completed trainings"*\n• *"How many days left to reach my target?"*\n• *"Who is my N+1 manager?"*\n• *"How to declare an activity?"*`
      : `💡 **Assistant Formateur** : Bonjour ${trainerName} ! Vous pouvez me demander :\n• *« Quel est mon planning ? »*\n• *« Mes formations passées »*\n• *« Combien de jours me reste-t-il ? »*\n• *« Qui est mon manager N+1 ? »*\n• *« Comment déclarer une activité ? »*`
  }

  // ==========================================
  // MODE 2 : ASSISTANT MANAGER (Pilotage Central)
  // ==========================================

  // 1. Trainer Name Lookup
  const matchedTrainer = TRAINERS_DB.find((t) => {
    const parts = t.name.toLowerCase().split(' ')
    return query.includes(t.name.toLowerCase()) || parts.some((p) => p.length > 3 && query.includes(p))
  })

  if (matchedTrainer) {
    const statusText = matchedTrainer.status === 'blocked' ? '⚠️ Surchargé' : matchedTrainer.status === 'watch' ? '🟡 Vigilance' : '🟢 Équilibré'
    return lang === 'en'
      ? `👤 **${matchedTrainer.name}** (${matchedTrainer.role})\n📍 **Center**: ${matchedTrainer.center}\n💡 **Domain**: ${matchedTrainer.domain}\n📧 **Email**: ${matchedTrainer.email}\n📊 **Workload**: ${matchedTrainer.animDays} (Target: 107d)\n📈 **Rate**: ${matchedTrainer.rate}%\nSTATUS: ${statusText}`
      : `👤 **${matchedTrainer.name}** (${matchedTrainer.role})\n📍 **Centre**: ${matchedTrainer.center}\n💡 **Domaine**: ${matchedTrainer.domain}\n📧 **Email**: ${matchedTrainer.email}\n📊 **Charge**: ${matchedTrainer.animDays} (Cible : 107j)\n📈 **Taux**: ${matchedTrainer.rate}%\nSTATUT: ${statusText}`
  }

  // 2. Domain / Activity Lookup
  const DOMAINS_MAP: Record<string, string> = {
    hse: 'HSE',
    digital: 'Digital',
    maintenance: 'Maintenance industrielle',
    chimie: 'Chimie et procédés',
    minière: 'Industrie minière',
    mines: 'Industrie minière',
    'soft skills': 'Soft Skills',
    énergies: 'Énergies renouvelables',
    agriculture: 'Agriculture',
  }

  const matchedDomainKey = Object.keys(DOMAINS_MAP).find((key) => query.includes(key))
  if (matchedDomainKey) {
    const domainName = DOMAINS_MAP[matchedDomainKey]
    const trainersInDomain = TRAINERS_DB.filter((t) => t.domain.toLowerCase().includes(matchedDomainKey) || matchedDomainKey.includes(t.domain.toLowerCase()))
    if (trainersInDomain.length > 0) {
      const list = trainersInDomain.map((t) => `• **${t.name}** (${t.center} — ${t.animDays})`).join('\n')
      return lang === 'en'
        ? `💡 **Trainers in ${domainName}**:\n${list}`
        : `💡 **Formateurs spécialisés en ${domainName}** :\n${list}`
    }
  }

  // 3. Center Specific Roster Lookup
  const CENTERS_LIST = ['ben guerir', 'safi', 'jorf lasfar', 'khouribga']
  const matchedCenter = CENTERS_LIST.find((c) => query.includes(c))
  if (matchedCenter) {
    const centerFormatted = matchedCenter === 'ben guerir' ? 'Ben Guerir' : matchedCenter === 'safi' ? 'Safi' : matchedCenter === 'jorf lasfar' ? 'Jorf Lasfar' : 'Khouribga'
    const trainersInCenter = TRAINERS_DB.filter((t) => t.center.toLowerCase() === matchedCenter)
    if (trainersInCenter.length > 0) {
      const list = trainersInCenter.map((t) => `• **${t.name}** (${t.domain} — ${t.animDays})`).join('\n')
      return lang === 'en'
        ? `📍 **Trainers at Center ${centerFormatted}**:\n${list}`
        : `📍 **Formateurs au Centre ${centerFormatted}** :\n${list}`
    }
  }

  // 4. Overload & Capacity Audits
  if (query.includes('surchargé') || query.includes('surcharge') || query.includes('alerte') || query.includes('overload') || query.includes('critical')) {
    return lang === 'en'
      ? '⚠️ **Workload Overload Audit**: 2 trainers currently exceed the 107d target:\n• **Nadia Amrani** (135d / +28d in Khouribga)\n• **Fatima Zahra El Idrissi** (120d / +13d in Safi).\n👉 Use *⚡ What-If Simulation* to rebalance.'
      : '⚠️ **Audit de Surcharge** : 2 formateurs dépassent actuellement la cible de 107j :\n• **Nadia Amrani** (135j / +28j à Khouribga)\n• **Fatima Zahra El Idrissi** (120j / +13j à Safi).\n👉 Vous pouvez utiliser le module *⚡ Simulation What-If* pour rééquilibrer leur charge.'
  }

  if (query.includes('disponible') || query.includes('libre') || query.includes('available') || query.includes('free')) {
    return lang === 'en'
      ? '🟢 **Available Trainers**:\n• **Omar Chraibi** (51d / Ben Guerir)\n• **Karim Tazi** (64d / Jorf Lasfar)\n• **Youssef Benali** (82d / Ben Guerir).'
      : '🟢 **Formateurs Disponibles** :\n• **Omar Chraibi** (51j / Ben Guerir)\n• **Karim Tazi** (64j / Jorf Lasfar)\n• **Youssef Benali** (82j / Ben Guerir).'
  }

  if (query.includes('centre') || query.includes('location')) {
    return lang === 'en'
      ? '📍 **Active Network Centers**: Ben Guerir, Safi, Jorf Lasfar, Khouribga.'
      : '📍 **Centres Réseau Actifs** : Ben Guerir, Safi, Jorf Lasfar, Khouribga.'
  }

  return lang === 'en'
    ? "💡 **Assistant Manager**: Ask me about a trainer (e.g. 'Youssef Benali'), a domain ('HSE', 'Digital'), a center ('Safi'), or 'overloaded' / 'available' trainers."
    : "💡 **Assistant Manager** : Posez-moi des questions sur un formateur (ex: 'Youssef Benali'), un domaine ('HSE', 'Digital'), un centre ('Safi'), ou les formateurs 'surchargés' / 'disponibles'."
}
