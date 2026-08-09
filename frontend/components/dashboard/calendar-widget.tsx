'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

// Liste officielle des jours fériés au Maroc (2026)
const MOROCCO_HOLIDAYS_2026: Record<string, { name: string; type: 'legal' | 'religious' | 'closure' }> = {
  "2026-01-01": { name: "Nouvel An", type: 'legal' },
  "2026-01-11": { name: "Manifeste de l'Indépendance", type: 'legal' },
  "2026-01-14": { name: "Nouvel An Amazigh", type: 'legal' },
  "2026-03-20": { name: "Aïd al-Fitr (Jour 1)", type: 'religious' },
  "2026-03-21": { name: "Aïd al-Fitr (Jour 2)", type: 'religious' },
  "2026-03-22": { name: "Aïd al-Fitr (Jour 3)", type: 'religious' },
  "2026-05-01": { name: "Fête du Travail", type: 'legal' },
  "2026-05-27": { name: "Aïd al-Adha (Jour 1)", type: 'religious' },
  "2026-05-28": { name: "Aïd al-Adha (Jour 2)", type: 'religious' },
  "2026-07-30": { name: "Fête du Trône", type: 'legal' },
  "2026-08-14": { name: "Allégeance Oued Eddahab", type: 'legal' },
  "2026-08-20": { name: "Révolution du Roi et du Peuple", type: 'legal' },
  "2026-08-21": { name: "Fête de la Jeunesse", type: 'legal' },
  "2026-11-06": { name: "Marche Verte", type: 'legal' },
  "2026-11-18": { name: "Fête de l'Indépendance", type: 'legal' },
}

export function CalendarWidget() {
  // Mois initial : Août 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]

  // Calcul dynamique des jours
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Premier jour du mois (0 = Lundi, 6 = Dimanche)
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  return (
    <div className="bg-card p-5 rounded-2xl border border-border shadow-xs">
      {/* En-tête avec Navigation */}
      <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="size-4 text-primary" />
          <h4 className="font-bold text-sm text-foreground">
            {monthNames[month]} {year}
          </h4>
        </div>
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={prevMonth}
            className="p-1 px-2 text-xs font-bold border border-border rounded-lg hover:bg-secondary text-foreground transition-all cursor-pointer"
            title="Mois précédent"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button 
            type="button"
            onClick={nextMonth}
            className="p-1 px-2 text-xs font-bold border border-border rounded-lg hover:bg-secondary text-foreground transition-all cursor-pointer"
            title="Mois suivant"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground mb-2">
        <span>Lu</span><span>Ma</span><span>Me</span><span>Je</span><span>Ve</span><span>Sa</span><span>Di</span>
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Cases vides avant le 1er du mois */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7 w-7" />
        ))}

        {/* Jours du mois */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const holiday = MOROCCO_HOLIDAYS_2026[dateStr]
          const isSummerClosure = (month === 6 || month === 7) && !holiday // Juillet/Août

          let bgStyle = "hover:bg-primary/10 text-foreground font-medium"
          let tooltip = "Jour ouvré d'animation"

          if (holiday) {
            if (holiday.type === 'religious') {
              bgStyle = "bg-amber-500/20 text-amber-900 dark:text-amber-200 font-bold border border-amber-500/30"
              tooltip = `Fête Religieuse : ${holiday.name}`
            } else {
              bgStyle = "bg-rose-500/20 text-rose-900 dark:text-rose-200 font-bold border border-rose-500/30"
              tooltip = `Jour Férié : ${holiday.name}`
            }
          } else if (isSummerClosure) {
            bgStyle = "bg-secondary text-muted-foreground/60 line-through"
            tooltip = "Période d'été / Neutralisée"
          }

          return (
            <div
              key={day}
              title={tooltip}
              className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs transition-all cursor-pointer mx-auto ${bgStyle}`}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Légende officielle */}
      <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary border border-border" /> Jour Ouvré Standard
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Jour Férié Officiel (Maroc)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Fête Religieuse (Aïd, etc.)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" /> Période de Fermeture Estivale
        </div>
      </div>
    </div>
  )
}
