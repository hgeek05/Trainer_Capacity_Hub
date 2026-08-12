'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarDays, Info, LayoutDashboard, LogIn } from 'lucide-react'
import type { LoginCopy } from './login-content'

interface LoginFormProps {
  copy: LoginCopy
}

const MANAGER_ROUTE = '/dashboard'
const PLANNER_ROUTE = '/dashboard?tab=planning'

const FIELD_CLASS =
  'w-full h-10 rounded-xl border border-border bg-secondary/40 px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20'

interface DemoButtonProps {
  icon: React.ReactNode
  label: string
  hint: string
  onClick: () => void
}

function DemoButton({ icon, label, hint, onClick }: DemoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left transition-all hover:border-primary/40 hover:bg-secondary/50"
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-bold text-foreground">{label}</span>
        <span className="block truncate text-[10px] text-muted-foreground">{hint}</span>
      </span>
    </button>
  )
}

export function LoginForm({ copy }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Démonstration : aucune vérification d'identifiants, la soumission ouvre le cockpit.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(MANAGER_ROUTE)
  }

  return (
    <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 inline-flex w-fit items-center justify-center rounded-2xl border border-border bg-white px-5 py-3 shadow-sm">
          <img
            src="/images/um6p-technix-logo.png"
            alt="UM6P TECHNIX"
            className="h-9 w-auto object-contain"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = '/um6p-technix-logo.png'
            }}
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">{copy.formTitle}</h1>
        <p className="mt-1.5 text-xs text-muted-foreground">{copy.formSubtitle}</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-foreground">
              {copy.emailLabel}
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="username"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-xs font-semibold text-foreground"
            >
              {copy.passwordLabel}
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              placeholder={copy.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition-all hover:opacity-90"
          >
            <LogIn className="size-4" />
            {copy.submit}
          </button>
        </form>

        <div className="my-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            {copy.demoDivider}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-2.5">
          <DemoButton
            icon={<LayoutDashboard className="size-4" />}
            label={copy.demoManager}
            hint={copy.demoManagerHint}
            onClick={() => router.push(MANAGER_ROUTE)}
          />
          <DemoButton
            icon={<CalendarDays className="size-4" />}
            label={copy.demoPlanner}
            hint={copy.demoPlannerHint}
            onClick={() => router.push(PLANNER_ROUTE)}
          />
        </div>

        <p className="mt-6 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-[10px] leading-relaxed font-medium text-amber-700 dark:text-amber-300">
          <Info className="mt-px size-3 shrink-0" aria-hidden="true" />
          {copy.demoNotice}
        </p>

        <Link
          href="/"
          className="mt-6 inline-block text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          {copy.backToHome}
        </Link>
      </div>
    </section>
  )
}
