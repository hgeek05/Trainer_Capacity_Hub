'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle, CalendarDays, DoorOpen, MapPin, Pencil, Users, X } from 'lucide-react'
import { fetchTrainers } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'
import type { PlanningSession } from './planning-data'
import {
  CENTER_NAMES,
  TRAINER_POOL,
  getRoomsForCenter,
} from './planning-reference'

interface EditSessionModalProps {
  /** Session en cours d'édition. `null` ferme le modal. */
  session: PlanningSession | null
  onClose: () => void
  onSave: (session: PlanningSession) => void
}

const FIELD_CLASS =
  'w-full h-9 rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-600/20'

const SELECT_CLASS = `${FIELD_CLASS} cursor-pointer`

/** Nombre de jours entre deux dates ISO, bornes incluses. Retourne 0 si l'intervalle est invalide. */
function inclusiveDayCount(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
  return days > 0 ? days : 0
}

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {icon}
      {children}
    </p>
  )
}

export function EditSessionModal({ session, onClose, onSave }: EditSessionModalProps) {
  const { t } = useLanguage()

  const [center, setCenter] = useState('')
  const [room, setRoom] = useState('')
  const [trainersList, setTrainersList] = useState<string[]>(TRAINER_POOL)
  const [mainTrainer, setMainTrainer] = useState('')
  const [coTrainer, setCoTrainer] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<PlanningSession['status']>('SCHEDULED')

  // Réhydrate le formulaire chaque fois qu'une autre session est ouverte.
  useEffect(() => {
    if (!session) return
    setCenter(session.center)
    setRoom(session.room ?? '')
    setMainTrainer(session.trainerName)
    setCoTrainer(session.coTrainerName ?? '')
    setStartDate(session.startDate)
    setEndDate(session.endDate)
    setStatus(session.status)

    fetchTrainers()
      .then((data) => {
        if (data && data.length > 0) {
          const dynamicNames = data.map((t: any) => t.name).filter(Boolean)
          const combined = Array.from(new Set([...dynamicNames, ...TRAINER_POOL, session.trainerName]))
          setTrainersList(combined)
        }
      })
      .catch((err) => console.warn('Failed to fetch dynamic trainers for edit modal:', err))
  }, [session])

  if (!session) return null

  const availableRooms = getRoomsForCenter(center)
  const durationDays = inclusiveDayCount(startDate, endDate)

  const dateError = durationDays === 0 ? t.endBeforeStartWarning : null
  const trainerError =
    coTrainer && coTrainer === mainTrainer ? t.sameTrainerWarning : null
  const error = dateError ?? trainerError

  const handleCenterChange = (nextCenter: string) => {
    setCenter(nextCenter)
    // La salle appartient au site : on la réinitialise si elle n'existe pas sur le nouveau centre.
    if (!getRoomsForCenter(nextCenter).includes(room)) setRoom('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (error) return

    onSave({
      ...session,
      center,
      room: room || undefined,
      trainerName: mainTrainer,
      coTrainerName: coTrainer || undefined,
      startDate,
      endDate,
      durationDays,
      status,
    })
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.editSessionTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl border border-border bg-card p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
              <Pencil className="size-4.5 text-purple-600" />
              {t.editSessionTitle}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{t.editSessionSubtitle}</p>
            <p className="mt-2 font-mono text-[11px] font-bold text-primary">
              {session.id} — {session.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancel}
            className="shrink-0 cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Lieu & salle */}
          <div className="space-y-2.5">
            <SectionLabel icon={<MapPin className="size-3" />}>{t.sessionLocationSection}</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-center" className="mb-1 block font-semibold text-foreground">
                  {t.center}
                </label>
                <select
                  id="edit-center"
                  value={center}
                  onChange={(e) => handleCenterChange(e.target.value)}
                  className={SELECT_CLASS}
                >
                  {CENTER_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-room" className="mb-1 block font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <DoorOpen className="size-3 text-muted-foreground" />
                    {t.roomLabel}
                  </span>
                </label>
                <select
                  id="edit-room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">{t.noRoomAssigned}</option>
                  {availableRooms.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Binôme d'animation */}
          <div className="space-y-2.5">
            <SectionLabel icon={<Users className="size-3" />}>{t.sessionAssignmentSection}</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-main-trainer" className="mb-1 block font-semibold text-foreground">
                  {t.mainTrainerLabel}
                </label>
                <select
                  id="edit-main-trainer"
                  value={mainTrainer}
                  onChange={(e) => setMainTrainer(e.target.value)}
                  className={SELECT_CLASS}
                >
                  {trainersList.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-co-trainer" className="mb-1 block font-semibold text-foreground">
                  {t.coTrainerLabel}
                </label>
                <select
                  id="edit-co-trainer"
                  value={coTrainer}
                  onChange={(e) => setCoTrainer(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">{t.noCoTrainer}</option>
                  {trainersList.filter((name) => name !== mainTrainer).map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dates & durée */}
          <div className="space-y-2.5">
            <SectionLabel icon={<CalendarDays className="size-3" />}>{t.sessionScheduleSection}</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label htmlFor="edit-start" className="mb-1 block font-semibold text-foreground">
                  {t.startDateLabel}
                </label>
                <input
                  id="edit-start"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label htmlFor="edit-end" className="mb-1 block font-semibold text-foreground">
                  {t.endDateLabel}
                </label>
                <input
                  id="edit-end"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="mb-1 block font-semibold text-foreground">
                  {t.statusLabel}
                </label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PlanningSession['status'])}
                  className={SELECT_CLASS}
                >
                  <option value="SCHEDULED">{t.statusScheduled}</option>
                  <option value="CONFIRMED">{t.statusConfirmed}</option>
                  <option value="IN_PROGRESS">{t.statusInProgress}</option>
                </select>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t.durationLabel.replace(' *', '')} :{' '}
              <span className="font-mono font-bold text-foreground">{durationDays}</span>
            </p>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              <AlertTriangle className="size-3.5 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={Boolean(error)}
              className="cursor-pointer rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
