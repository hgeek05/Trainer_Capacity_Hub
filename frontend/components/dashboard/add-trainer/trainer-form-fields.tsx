'use client'

import React from 'react'
import { useLanguage } from '@/lib/i18n'

export interface TrainerFormData {
  name: string
  email: string
  center: string
  domain: string
  role: string
}

interface TrainerFormFieldsProps {
  formData: TrainerFormData
  onChange: (data: TrainerFormData) => void
}

export function TrainerFormFields({ formData, onChange }: TrainerFormFieldsProps) {
  const { t } = useLanguage()

  return (
    <>
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1">{t.fullNameRequired}</label>
        <input
          type="text"
          required
          placeholder="Ex: Fatima Ait Zzi"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          className="w-full h-9 px-3 rounded-lg border border-border bg-secondary/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1">{t.emailRequired}</label>
        <input
          type="email"
          required
          placeholder="f.aitzzi@um6p.ma"
          value={formData.email}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          className="w-full h-9 px-3 rounded-lg border border-border bg-secondary/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">{t.assignedCenter}</label>
          <select
            value={formData.center}
            onChange={(e) => onChange({ ...formData, center: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="Ben Guerir">Ben Guerir</option>
            <option value="Safi">Safi</option>
            <option value="Jorf Lasfar">Jorf Lasfar</option>
            <option value="Khouribga">Khouribga</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">{t.domainPole}</label>
          <select
            value={formData.domain}
            onChange={(e) => onChange({ ...formData, domain: e.target.value })}
            className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <option value="Digital">Digital</option>
            <option value="HSE">HSE (Sécurité / Environnement)</option>
            <option value="Maintenance industrielle">Maintenance industrielle</option>
            <option value="Chimie et procédés">Chimie et procédés</option>
            <option value="Industrie minière">Industrie minière</option>
            <option value="Énergies renouvelables">Énergies renouvelables</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Soft Skills">Soft Skills</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-foreground mb-1">{t.roleLabelText}</label>
        <select
          value={formData.role}
          onChange={(e) => onChange({ ...formData, role: e.target.value })}
          className="w-full h-9 px-3 rounded-lg border border-border bg-card text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="Formateur">{t.trainer}</option>
          <option value="Lead Formateur">{t.roleLead}</option>
          <option value="Formateur Senior">{t.roleSenior}</option>
          <option value="Formateur Expert">{t.roleExpert}</option>
        </select>
      </div>
    </>
  )
}
