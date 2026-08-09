'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type Lang = 'fr' | 'en'

const dictionaries = {
  fr: {
    // Sidebar
    mainMenu: 'Menu principal',
    dashboard: 'Tableau de bord',
    trainers: 'Formateurs',
    centers: 'Centres',
    activities: 'Activités',
    settings: 'Paramètres',
    account: 'Compte',
    superAdmin: 'Super Admin',
    // Top bar
    pageTitle: 'Suivi de charge des formateurs',
    breadcrumbHome: 'Trainer Capacity Hub',
    week: 'Semaine',
    month: 'Mois',
    year: 'Année',
    searchPlaceholder: 'Rechercher un formateur, un centre...',
    toggleTheme: 'Changer de thème',
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
    language: 'Langue',
    // KPIs
    netGlobalCapacity: 'Capacité Globale Nette',
    favorableDays: 'Jours Favorables Animation',
    animationTarget: 'Cible Animation',
    blockedWindows: 'Fenêtres Bloquées',
    daysPerYear: 'j/an',
    days: 'j',
    vsLastPeriod: 'vs période précédente',
    // Table
    trainerLoad: 'Suivi de charge des formateurs',
    trainer: 'Formateur',
    role: 'Rôle',
    global: 'Global',
    animation: 'Animation',
    rate: 'Taux',
    status: 'Statut',
    statusOk: 'OK',
    statusWatch: 'Surveille',
    statusBlocked: 'Bloqué',
    filter: 'Filtrer',
    export: 'Exporter',
    roleSenior: 'Formateur Senior',
    roleExpert: 'Formateur Expert',
    roleJunior: 'Formateur Junior',
    roleLead: 'Lead Formateur',
    // Right panel
    upcomingEvents: 'Périodes neutralisées / Événements',
    daysLeft: 'jours restants',
    dayLeft: 'jour restant',
    inProgress: 'En cours',
    eventAid: 'Aïd el-Fitr',
    eventAidDesc: 'Période neutralisée — jours fériés',
    eventLeave: 'Congés annuels',
    eventLeaveDesc: 'Fenêtre bloquée — congés équipe',
    eventSummer: 'Juillet / Août',
    eventSummerDesc: 'Période estivale neutralisée',
    present: 'Favorable',
    blocked: 'Bloqué',
    events: 'Événements',
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'] as string[],
    months: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ] as string[],
  },
  en: {
    mainMenu: 'Main menu',
    dashboard: 'Dashboard',
    trainers: 'Trainers',
    centers: 'Centers',
    activities: 'Activities',
    settings: 'Settings',
    account: 'Account',
    superAdmin: 'Super Admin',
    pageTitle: 'Trainer workload tracking',
    breadcrumbHome: 'Trainer Capacity Hub',
    week: 'Week',
    month: 'Month',
    year: 'Year',
    searchPlaceholder: 'Search a trainer, a center...',
    toggleTheme: 'Toggle theme',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    language: 'Language',
    netGlobalCapacity: 'Net Global Capacity',
    favorableDays: 'Favorable Training Days',
    animationTarget: 'Training Target',
    blockedWindows: 'Blocked Windows',
    daysPerYear: 'd/yr',
    days: 'd',
    vsLastPeriod: 'vs previous period',
    trainerLoad: 'Trainer workload tracking',
    trainer: 'Trainer',
    role: 'Role',
    global: 'Global',
    animation: 'Training',
    rate: 'Rate',
    status: 'Status',
    statusOk: 'OK',
    statusWatch: 'Watch',
    statusBlocked: 'Blocked',
    filter: 'Filter',
    export: 'Export',
    roleSenior: 'Senior Trainer',
    roleExpert: 'Expert Trainer',
    roleJunior: 'Junior Trainer',
    roleLead: 'Lead Trainer',
    upcomingEvents: 'Neutralized periods / Events',
    daysLeft: 'days left',
    dayLeft: 'day left',
    inProgress: 'Ongoing',
    eventAid: 'Eid al-Fitr',
    eventAidDesc: 'Neutralized period — public holidays',
    eventLeave: 'Annual leave',
    eventLeaveDesc: 'Blocked window — team leave',
    eventSummer: 'July / August',
    eventSummerDesc: 'Neutralized summer period',
    present: 'Favorable',
    blocked: 'Blocked',
    events: 'Events',
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as string[],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ] as string[],
  },
}

export type Dictionary = (typeof dictionaries)['fr']

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dictionary
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr')

  useEffect(() => {
    const stored = window.localStorage.getItem('tch-lang')
    if (stored === 'fr' || stored === 'en') setLangState(stored)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem('tch-lang', next)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
