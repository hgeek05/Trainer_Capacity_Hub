'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fr } from './locales/fr'
import { en } from './locales/en'

export type Lang = 'fr' | 'en'
export type Dictionary = typeof fr

const dictionaries: Record<Lang, Dictionary> = { fr, en }

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
