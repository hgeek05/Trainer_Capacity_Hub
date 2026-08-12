'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, LineChart } from 'lucide-react'
import { landingContent } from '@/app/landing-content'
import { LandingFooter } from '@/app/landing-footer'
import { LandingHeader } from '@/app/landing-header'

export default function LandingPage() {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR')
  const t = landingContent[lang]

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden font-sans text-white">
      {/* 1. CAMPUS BACKDROP WITH BALANCED DARK GRADIENT OVERLAY MATCHING REFERENCE IMAGE */}
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

      {/* 3. HERO CONTENT MATCHING REFERENCE SCREENSHOT EXACTLY */}
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

        {/* 4. HERO ACCESS CARDS MATCHING REFERENCE DESIGN EXACTLY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          {/* CARD 1: ESPACE DIRECTION & MANAGEMENT */}
          <Link
            href="/dashboard"
            className="group relative p-7 bg-slate-900/90 border border-slate-700/80 hover:border-[#d6492a] rounded-2xl backdrop-blur-md transition-all duration-300 shadow-2xl hover:-translate-y-1 hover:shadow-[#d6492a]/20 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-[#d6492a]/15 border border-[#d6492a]/30 flex items-center justify-center text-[#d6492a] mb-5 transition-transform group-hover:scale-110">
                <LineChart className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#d6492a] transition-colors">
                {t.managerTitle}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal mb-8">
                {t.managerDesc}
              </p>
            </div>
            <div className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-[#d6492a] hover:bg-[#c23e20] text-white text-xs font-bold transition-all shadow-md">
              <span>{t.managerCta}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* CARD 2: ESPACE PLANIFICATION */}
          <Link
            href="/dashboard?tab=planning"
            className="group relative p-7 bg-slate-900/90 border border-slate-700/80 hover:border-[#5b0dbc] rounded-2xl backdrop-blur-md transition-all duration-300 shadow-2xl hover:-translate-y-1 hover:shadow-[#5b0dbc]/20 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-full bg-[#5b0dbc]/15 border border-[#5b0dbc]/30 flex items-center justify-center text-[#5b0dbc] dark:text-[#a87bf0] mb-5 transition-transform group-hover:scale-110">
                <Calendar className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#a87bf0] transition-colors">
                {t.plannerTitle}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal mb-8">
                {t.plannerDesc}
              </p>
            </div>
            <div className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-[#5b0dbc] hover:bg-[#4a0a9c] text-white text-xs font-bold transition-all shadow-md">
              <span>{t.plannerCta}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </main>

      {/* 5. NOS CENTRES DE FORMATION FOOTER ROW */}
      <LandingFooter sitesHeader={t.sitesHeader} sites={t.sites} />
    </div>
  )
}
