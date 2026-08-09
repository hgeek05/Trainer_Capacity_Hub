'use client'

import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import type { PlanningSession } from '@/components/dashboard/planning-view'

interface PlanningSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSession: (session: PlanningSession) => void
  nextId: string
}

export function PlanningSessionModal({
  isOpen,
  onClose,
  onAddSession,
  nextId,
}: PlanningSessionModalProps) {
  const { t } = useLanguage()

  const [newTitle, setNewTitle] = useState('')
  const [newTrainer, setNewTrainer] = useState('Fatima Ait Zzi')
  const [newDomain, setNewDomain] = useState('HSE')
  const [newCenter, setNewCenter] = useState('Ben Guerir')
  const [newStartDate, setNewStartDate] = useState('2026-08-15')
  const [newEndDate, setNewEndDate] = useState('2026-08-20')
  const [newDuration, setNewDuration] = useState(5)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newSession: PlanningSession = {
      id: nextId,
      title: newTitle.trim(),
      trainerName: newTrainer,
      trainerDomain: newDomain,
      center: newCenter,
      startDate: newStartDate,
      endDate: newEndDate,
      durationDays: Number(newDuration),
      status: 'CONFIRMED',
    }

    onAddSession(newSession)
    setNewTitle('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Plus className="size-4.5 text-purple-600" />
            {t.sessionModalTitle}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1">{t.courseTitleLabel}</label>
            <input
              type="text"
              required
              placeholder="ex: Sécurité Procédés Industriels Haute Pression"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">{t.trainerNameLabel}</label>
              <select
                value={newTrainer}
                onChange={(e) => setNewTrainer(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="Fatima Ait Zzi">Fatima Ait Zzi</option>
                <option value="Nadia Amrani">Nadia Amrani</option>
                <option value="Omar Chraibi">Omar Chraibi</option>
                <option value="Karim Tazi">Karim Tazi</option>
                <option value="Fatima Zahra El Idrissi">Fatima Zahra El Idrissi</option>
                <option value="Youssef Benali">Youssef Benali</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">{t.domainLabel}</label>
              <select
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="HSE">HSE</option>
                <option value="Digital">Digital</option>
                <option value="Maintenance industrielle">Maintenance industrielle</option>
                <option value="Chimie et procédés">Chimie et procédés</option>
                <option value="Industrie minière">Industrie minière</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">{t.center}</label>
              <select
                value={newCenter}
                onChange={(e) => setNewCenter(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="Ben Guerir">Ben Guerir</option>
                <option value="Safi">Safi</option>
                <option value="Jorf Lasfar">Jorf Lasfar</option>
                <option value="Khouribga">Khouribga</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">{t.durationLabel}</label>
              <input
                type="number"
                min="1"
                max="30"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1">{t.startDateLabel}</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">{t.endDateLabel}</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700 cursor-pointer shadow-sm"
            >
              {t.confirmSchedule}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
