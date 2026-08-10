import type { Lang } from '@/lib/i18n'

export function getBotResponse(userText: string, lang: Lang): string {
  const query = userText.toLowerCase()

  if (query.includes('surchargé') || query.includes('surcharge') || query.includes('alerte') || query.includes('overload') || query.includes('critical')) {
    return lang === 'en'
      ? "⚠️ **Workload Overload Audit**: 2 trainers currently exceed the 107d target:\n• **Nadia Amrani** (135d / +28d in Khouribga)\n• **Fatima Zahra El Idrissi** (120d / +13d in Safi).\n👉 Use the *⚡ What-If Simulation* module to rebalance their load."
      : "⚠️ **Audit de Surcharge** : 2 formateurs dépassent actuellement la cible de 107j :\n• **Nadia Amrani** (135j / +28j à Khouribga)\n• **Fatima Zahra El Idrissi** (120j / +13j à Safi).\n👉 Vous pouvez utiliser le module *⚡ Simulation What-If* pour rééquilibrer leur charge."
  } else if (query.includes('disponible') || query.includes('libre') || query.includes('affectation') || query.includes('available') || query.includes('free')) {
    return lang === 'en'
      ? "🟢 **Available Trainers**:\n• **Omar Chraibi** (51d / Ben Guerir)\n• **Karim Tazi** (64d / Jorf Lasfar)\n• **Youssef Benali** (82d / Ben Guerir).\nTheir workload is balanced and ready for new training sessions."
      : "🟢 **Formateurs Disponibles** :\n• **Omar Chraibi** (51j / Ben Guerir)\n• **Karim Tazi** (64j / Jorf Lasfar)\n• **Youssef Benali** (82j / Ben Guerir).\nLeur charge est conforme et prête pour de nouvelles sessions."
  } else if (query.includes('centre') || query.includes('périmètre') || query.includes('location')) {
    return lang === 'en'
      ? "📍 **Active Network Centers**:\n1. Ben Guerir (Headquarters / UM6P)\n2. Safi\n3. Jorf Lasfar\n4. Khouribga."
      : "📍 **Centres Réseau Actifs** :\n1. Ben Guerir (Siège / UM6P)\n2. Safi\n3. Jorf Lasfar\n4. Khouribga."
  } else if (query.includes('cible') || query.includes('107') || query.includes('règle') || query.includes('target') || query.includes('rule')) {
    return lang === 'en'
      ? "🎯 **Tutor Business Rule**: The optimal training target is **107 days / year** per trainer. The net global capacity is **189 days** after neutralizing 83 blocked window days."
      : "🎯 **Règle Métier Tuteur** : La cible optimale d'animation est de **107 jours / an** par formateur. La capacité globale nette s'élève à **189 jours** après neutralisation de 83 jours de fenêtres bloquées."
  } else if (query.includes('férié') || query.includes('fete') || query.includes('congé') || query.includes('aid') || query.includes('holiday')) {
    return lang === 'en'
      ? "📅 **Official Neutralized Days (Morocco 2026)**:\n• Amazigh New Year (Jan 14)\n• Eid al-Fitr (Mar 20-22)\n• Labor Day (May 01)\n• Eid al-Adha (May 27-28)\n• Throne Day (Jul 30)\n• Summer Closure (Jul 01 — Aug 31)."
      : "📅 **Jours Neutralisés Officiels (Maroc 2026)** :\n• Nouvel An Amazigh (14 Jan)\n• Aïd al-Fitr (20-22 Mar)\n• Fête du Travail (01 Mai)\n• Aïd al-Adha (27-28 Mai)\n• Fête du Trône (30 Jul)\n• Fermeture Estivale (01 Jul — 31 Août)."
  }

  return lang === 'en'
    ? "I did not understand your request. You can ask about 'overloaded', 'available', 'center', or 'target'."
    : "Je n'ai pas bien compris votre demande. Vous pouvez demander 'surchargé', 'disponible', 'centre' ou 'cible'."
}
