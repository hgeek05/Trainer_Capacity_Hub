import type { TrainerRow } from './types'

export function exportTrainersCsv(trainers: TrainerRow[], onNotify: (msg: string) => void) {
  const csvHeader = 'ID,Nom,Email,Centre,Domaine,Role,GlobalUsed,GlobalTotal,AnimUsed,AnimTotal,Taux,Statut\n'
  const csvRows = trainers
    .map((t) => `"${t.initials}","${t.name}","${t.email}","${t.center}","${t.domain || 'Digital'}","${t.roleLabel}",${t.globalUsed},${t.globalTotal},${t.animUsed},${t.animTotal},${t.rate}%,${t.status}`)
    .join('\n')
  const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `Livrable_Planning_Capacite_2026_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  onNotify('📊 Planning et Rapport de Capacité 2026 exportés avec succès !')
}
