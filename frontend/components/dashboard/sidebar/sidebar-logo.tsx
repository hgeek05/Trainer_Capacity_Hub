'use client'

import React from 'react'

export function SidebarLogo() {
  return (
    <div className="flex flex-col gap-2.5 px-4 pt-5 pb-5 border-b border-sidebar-border/60 mb-2">
      <div className="flex items-center justify-start bg-white p-2 rounded-xl border border-sidebar-border/50 shadow-xs">
        <img
          src="/images/um6p-technix-logo.png"
          alt="UM6P TECHNIX"
          className="h-8 w-auto object-contain"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = '/um6p-technix-logo.png'
          }}
        />
      </div>
      <div className="leading-tight px-1 pt-1">
        <p className="text-[11px] font-bold text-sidebar-accent-foreground tracking-tight">Trainer Capacity Hub</p>
        <p className="text-[10px] text-sidebar-foreground/80 font-medium">Super Admin Cockpit</p>
      </div>
    </div>
  )
}
