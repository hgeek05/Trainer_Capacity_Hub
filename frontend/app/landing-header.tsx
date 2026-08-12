'use client'

import React from 'react'

interface LandingHeaderProps {
  lang: 'FR' | 'EN'
  setLang: (lang: 'FR' | 'EN') => void
}

export function LandingHeader({ lang, setLang }: LandingHeaderProps) {
  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-end">
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/20 p-1 rounded-xl flex gap-1 shadow-lg">
        <button
          type="button"
          onClick={() => setLang('FR')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            lang === 'FR' ? 'bg-[#d6492a] text-white shadow-md' : 'text-slate-300 hover:text-white'
          }`}
        >
          FR
        </button>
        <button
          type="button"
          onClick={() => setLang('EN')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            lang === 'EN' ? 'bg-[#d6492a] text-white shadow-md' : 'text-slate-300 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>
    </header>
  )
}
