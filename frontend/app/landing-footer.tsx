'use client'

import React from 'react'

interface SiteItem {
  name: string
  role: string
}

interface LandingFooterProps {
  sitesHeader: string
  sites: SiteItem[]
}

export function LandingFooter({ sitesHeader, sites }: LandingFooterProps) {
  return (
    <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-6">
      <p className="text-center text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
        {sitesHeader}
      </p>
      <div className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center">
        {sites.map((site) => (
          <div
            key={site.name}
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#d6492a]/50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-center min-h-[72px]"
          >
            <p className="text-white font-bold text-xs group-hover:text-[#d6492a] transition-colors">
              {site.name}
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5 opacity-90 line-clamp-2">{site.role}</p>
          </div>
        ))}
      </div>
    </footer>
  )
}
