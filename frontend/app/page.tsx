'use client'

import React, { useState } from 'react'
import { landingContent } from '@/app/landing-content'
import { LandingFooter } from '@/app/landing-footer'
import { LandingHeader } from '@/app/landing-header'
import { LandingHeroCards } from '@/app/landing-hero-cards'

export default function LandingPage() {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR')
  const t = landingContent[lang]

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden font-sans text-white">
      {/* 1. CAMPUS BACKDROP WITH BALANCED DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/benguerir-UM6P-1.jpg"
          alt="UM6P Ben Guerir Campus"
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/85 backdrop-blur-[1px]" />
      </div>

      {/* 2. REAL THIN HEADER BAR */}
      <LandingHeader lang={lang} setLang={setLang} />

      {/* 3. HERO CONTENT */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center my-auto py-6">
        <div className="block mb-5">
          <div className="inline-block bg-white/95 backdrop-blur-md px-7 py-3 rounded-2xl shadow-2xl border border-white/40 transition-transform hover:scale-105">
            <img
              src="/images/um6p-technix-logo.png"
              alt="UM6P TechniX Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
        </div>

        <h1 className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-md">
          Trainer Capacity Hub
        </h1>

        <p className="text-slate-200 text-xs sm:text-sm max-w-2xl mx-auto mb-10 font-normal leading-relaxed opacity-90">
          {t.subtitle}
        </p>

        {/* 4. HERO ACCESS CARDS */}
        <LandingHeroCards t={t} />
      </main>

      {/* 5. NOS CENTRES DE FORMATION FOOTER ROW */}
      <LandingFooter sitesHeader={t.sitesHeader} sites={t.sites} />
    </div>
  )
}
