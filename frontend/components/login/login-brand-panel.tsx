'use client'

import { CheckCircle2 } from 'lucide-react'
import type { LoginCopy } from './login-content'

interface LoginBrandPanelProps {
  copy: LoginCopy
}

/** Panneau d'accueil institutionnel (colonne de droite, masqué en mobile). */
export function LoginBrandPanel({ copy }: LoginBrandPanelProps) {
  return (
    <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[1.1]"
        style={{ backgroundImage: "url('/images/benguerir-UM6P-1.jpg')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-slate-950/85"
      />

      <div className="relative z-10 flex h-full flex-col justify-center gap-7 px-12 py-16">
        <span className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
          {copy.brandTag}
        </span>

        <h2 className="max-w-md text-3xl font-bold tracking-tight text-white drop-shadow-lg">
          {copy.welcomeTitle}
        </h2>

        <p className="max-w-md text-sm leading-relaxed text-slate-200 drop-shadow">
          {copy.welcomeBody}
        </p>

        <ul className="mt-2 flex max-w-md flex-col gap-3">
          {copy.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] text-slate-100">
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-orange-400"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
