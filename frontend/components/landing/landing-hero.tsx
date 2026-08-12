'use client'

import Link from 'next/link'
import { CalendarDays, LayoutDashboard } from 'lucide-react'
import type { LandingCopy } from './landing-content'

interface AccessCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  action: string
}

/** Carte d'accès translucide avec lueur rose UM6P et micro-flèche animée au survol. */
function AccessCard({ href, icon, title, description, action }: AccessCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-white/15 bg-slate-900/80 p-6 text-left shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/50 hover:bg-slate-900/95 hover:shadow-2xl hover:shadow-rose-500/10 focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:outline-none sm:p-7"
    >
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-rose-400 transition-all duration-300 group-hover:border-rose-500/40 group-hover:bg-rose-500/10 group-hover:text-rose-300">
        {icon}
      </span>

      <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">{title}</h2>

      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
        {description}
      </p>

      <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-rose-400 transition-colors duration-300 group-hover:text-rose-300">
        {action}
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  )
}

interface LandingHeroProps {
  copy: LandingCopy
}

export function LandingHero({ copy }: LandingHeroProps) {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 py-12 text-center sm:px-8 sm:py-16">
      {/* Logo institutionnel unique — conteneur glassmorphism */}
      <div className="group inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/95 px-7 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-rose-500/10">
        <img
          src="/images/um6p-technix-logo.png"
          alt="UM6P TECHNIX"
          className="h-11 w-auto object-contain sm:h-14"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/um6p-technix-logo.png'
          }}
        />
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl">
        {copy.title}
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 drop-shadow sm:text-base">
        {copy.subtitle}
      </p>

      <div className="mt-10 grid w-full gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
        <AccessCard
          href="/dashboard"
          icon={<LayoutDashboard className="h-5 w-5" aria-hidden="true" />}
          title={copy.managerTitle}
          description={copy.managerDesc}
          action={copy.managerBtn}
        />
        <AccessCard
          href="/dashboard?tab=planning"
          icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
          title={copy.plannerTitle}
          description={copy.plannerDesc}
          action={copy.plannerBtn}
        />
      </div>
    </main>
  )
}
