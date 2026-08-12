'use client'

import { MapPin } from 'lucide-react'
import type { LandingCopy } from './landing-content'

interface LandingFooterProps {
  sitesLabel: LandingCopy['sitesLabel']
  sites: LandingCopy['sites']
}

export function LandingFooter({ sitesLabel, sites }: LandingFooterProps) {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-8 sm:px-8 sm:pb-10">
      <p className="text-center text-[10px] font-semibold tracking-[0.18em] text-slate-300/90 uppercase drop-shadow">
        {sitesLabel}
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {sites.map((site) => (
          <li key={site.name}>
            <div className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 backdrop-blur-md transition-all duration-300 hover:border-rose-500/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-rose-500/10">
              <MapPin
                className="h-3.5 w-3.5 shrink-0 text-slate-500 transition-colors duration-300 group-hover:text-rose-400"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">{site.name}</p>
                <p className="truncate text-[10px] text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                  {site.role}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </footer>
  )
}
