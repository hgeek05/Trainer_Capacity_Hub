import React from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, LineChart } from 'lucide-react'
import type { LandingContent } from '@/app/landing-content'

interface LandingHeroCardsProps {
  t: LandingContent
}

export function LandingHeroCards({ t }: LandingHeroCardsProps) {
  return (
    <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto text-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* CARD 1: ESPACE DIRECTION & MANAGEMENT */}
        <Link
          href="/dashboard"
          className="group relative p-6 bg-slate-900/90 border border-slate-700/80 hover:border-[#d6492a] rounded-2xl backdrop-blur-md transition-all duration-300 shadow-2xl hover:-translate-y-1 hover:shadow-[#d6492a]/20 flex flex-col justify-between min-h-[230px] text-center cursor-pointer"
        >
          <div className="flex flex-col items-center w-full">
            <div className="w-12 h-12 rounded-full bg-[#d6492a]/15 border border-[#d6492a]/30 flex items-center justify-center text-[#d6492a] mb-3 transition-transform group-hover:scale-110">
              <LineChart className="size-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#d6492a] transition-colors min-h-[28px] flex items-center justify-center">
              {t.managerTitle}
            </h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed min-h-[44px] flex items-center justify-center text-center">
              {t.managerDesc}
            </p>
          </div>
          <div className="inline-flex items-center justify-between w-full px-5 py-2.5 rounded-xl bg-[#d6492a] hover:bg-[#c23e20] text-white text-xs font-bold transition-all shadow-md mt-4">
            <span>{t.managerCta}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* CARD 2: ESPACE PLANIFICATION */}
        <Link
          href="/dashboard?tab=planning"
          className="group relative p-6 bg-slate-900/90 border border-slate-700/80 hover:border-[#5b0dbc] rounded-2xl backdrop-blur-md transition-all duration-300 shadow-2xl hover:-translate-y-1 hover:shadow-[#5b0dbc]/20 flex flex-col justify-between min-h-[230px] text-center cursor-pointer"
        >
          <div className="flex flex-col items-center w-full">
            <div className="w-12 h-12 rounded-full bg-[#5b0dbc]/15 border border-[#5b0dbc]/30 flex items-center justify-center text-[#5b0dbc] dark:text-[#a87bf0] mb-3 transition-transform group-hover:scale-110">
              <Calendar className="size-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#a87bf0] transition-colors min-h-[28px] flex items-center justify-center">
              {t.plannerTitle}
            </h3>
            <p className="text-xs text-slate-300 font-normal leading-relaxed min-h-[44px] flex items-center justify-center text-center">
              {t.plannerDesc}
            </p>
          </div>
          <div className="inline-flex items-center justify-between w-full px-5 py-2.5 rounded-xl bg-[#5b0dbc] hover:bg-[#4a0a9c] text-white text-xs font-bold transition-all shadow-md mt-4">
            <span>{t.plannerCta}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  )
}