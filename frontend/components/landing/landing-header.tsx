'use client'

import type { LandingLang } from './landing-content'

const LANGS: LandingLang[] = ['FR', 'EN']

interface LandingHeaderProps {
  lang: LandingLang
  onSelectLang: (lang: LandingLang) => void
}

/**
 * Barre supérieure de la landing : uniquement le sélecteur de langue.
 * Le logo institutionnel reste unique et centré dans le Hero.
 */
export function LandingHeader({ lang, onSelectLang }: LandingHeaderProps) {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-end px-5 pt-5 sm:px-8 sm:pt-7">
      <div
        role="group"
        aria-label={lang === 'FR' ? 'Choix de la langue' : 'Language selection'}
        className="flex items-center gap-0.5 rounded-full border border-white/15 bg-slate-900/60 p-1 shadow-lg backdrop-blur-md"
      >
        {LANGS.map((code) => {
          const isActive = lang === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => onSelectLang(code)}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:outline-none ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {code}
            </button>
          )
        })}
      </div>
    </header>
  )
}
