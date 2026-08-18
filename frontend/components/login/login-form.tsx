'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogIn,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { loginApi, verify2faApi, resend2faApi, forgotPasswordApi } from '@/lib/api'
import type { LoginCopy } from './login-content'

interface LoginFormProps {
  copy: LoginCopy
}

const MANAGER_ROUTE = '/dashboard'
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
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // États pour la 2FA (Code OTP)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // États pour la modale "Mot de passe oublié"
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'loading' | 'sent'>('idle')

  // Compte à rebours 2FA
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === '2fa' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, countdown])

  const handlePrefillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
    setErrorMsg(null)
  }

  // Étape 1 : Vérification Identifiants & Déclenchement 2FA
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await loginApi({ email: email.trim(), password })
      if (res && res.status === '2fa_required') {
        setStep('2fa')
        setCountdown(300)
        setOtpCode(['', '', '', '', '', ''])
        setTimeout(() => inputRefs.current[0]?.focus(), 150)
        return
      }

      // Si le backend répond directement avec un token (fallback)
      if (res && res.access_token) {
        completeLogin(res.access_token, res.user)
        return
      }
    } catch (err: any) {
      console.warn('Authentication error:', err)
      setErrorMsg(err?.message || "Accès refusé. Cet identifiant n'est pas autorisé sur la plateforme.")
    } finally {
      setLoading(false)
    }
  }

  // Étape 2 : Vérification Code 2FA
  const handleVerify2fa = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const fullCode = otpCode.join('')
    if (fullCode.length !== 6) {
      setErrorMsg('Veuillez saisir les 6 chiffres du code de vérification.')
      return
    }

    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await verify2faApi({ email: email.trim(), code: fullCode })
      if (res && res.access_token) {
        completeLogin(res.access_token, res.user)
      }
    } catch (err: any) {
      console.warn('2FA verification error:', err)
      setErrorMsg(err?.message || 'Code de vérification invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  const completeLogin = (token: string, user: any) => {
    localStorage.setItem('access_token', token)
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user))
    }
    const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
    document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax${isSecure ? '; Secure' : ''}`
    
    // Si l'utilisateur est un Formateur
    if (user && (user.role === 'Formateur' || user.role_id === 1)) {
      router.push('/dashboard?view=trainer')
    } else {
      router.push(MANAGER_ROUTE)
    }
  }

  // Gestion des 6 cases d'OTP
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Gestion du coller (paste)
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const newOtp = [...otpCode]
      digits.forEach((d, i) => {
        if (index + i < 6) newOtp[index + i] = d
      })
      setOtpCode(newOtp)
      const nextIndex = Math.min(index + digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    const digit = value.replace(/\D/g, '')
    const newOtp = [...otpCode]
    newOtp[index] = digit
    setOtpCode(newOtp)

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendOtp = async () => {
    setResending(true)
    setResendSuccess(null)
    setErrorMsg(null)
    try {
      await resend2faApi(email.trim())
      setCountdown(300)
      setResendSuccess('Nouveau code envoyé par email.')
      setTimeout(() => setResendSuccess(null), 4000)
    } catch (err: any) {
      setErrorMsg(err?.message || "Impossible d'envoyer un nouveau code.")
    } finally {
      setResending(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotStatus('loading')
    try {
      await forgotPasswordApi(forgotEmail)
    } catch (err) {
      console.error('Error requesting password reset:', err)
    } finally {
      setForgotStatus('sent')
    }
  }

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <section className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-sm">
        {/* 1. Conteneur Logo Agrandie et Épuré */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-center min-w-[280px]">
            <img
              src="/um6p-technix-logo.png"
              alt="UM6P TechniX Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/logo-um6p-technix.png'
              }}
            />
          </div>
        </div>

        {step === 'credentials' ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{copy.formTitle}</h1>
            <p className="mt-1.5 text-xs text-muted-foreground">{copy.formSubtitle}</p>

            {errorMsg && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
                <AlertCircle className="size-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Formulaire de Connexion (Étape 1) */}
            <form onSubmit={handleCredentialsSubmit} className="mt-7 space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-semibold text-foreground">
                    {copy.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(true)
                      setForgotStatus('idle')
                      setForgotEmail('')
                    }}
                    className="text-[#E04F26] hover:underline font-medium text-[11px]"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder={copy.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${FIELD_CLASS} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4 text-slate-500 hover:text-slate-700" />
                    ) : (
                      <Eye className="size-4 text-slate-500 hover:text-slate-700" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E04F26] hover:bg-[#CC3B14] text-white font-semibold py-2.5 px-4 text-xs shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" />
                    <span>Continuer</span>
                  </>
                )}
              </button>
            </form>

            {/* Message de conformité / sécurité */}
            <div className="mt-5 p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2.5 text-emerald-800 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Double Authentification 2FA activée pour tous les comptes.</span>
            </div>

            {process.env.NODE_ENV !== 'production' && (
              <>
                <div className="my-7 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    {copy.demoDivider}
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <div className="grid gap-2.5">
                  <DemoButton
                    icon={<Users className="size-4" />}
                    label="Espace Formateur (Hiba)"
                    hint="hiba.aitbelmoumene-ext@um6p.ma"
                    onClick={() => handlePrefillDemo('hiba.aitbelmoumene-ext@um6p.ma')}
                  />
                  <DemoButton
                    icon={<LayoutDashboard className="size-4" />}
                    label="Admin Test (Hiba)"
                    hint="hibabelmoumene05@gmail.com"
                    onClick={() => handlePrefillDemo('hibabelmoumene05@gmail.com')}
                  />
                  <DemoButton
                    icon={<CalendarDays className="size-4" />}
                    label={copy.demoManager}
                    hint={copy.demoManagerHint}
                    onClick={() => handlePrefillDemo('manager@um6p.ma')}
                  />
                </div>
              </>
            )}

            <div className="mt-6">
              <Link
                href="/"
                className="inline-block text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {copy.backToHome}
              </Link>
            </div>
          </>
        ) : (
          /* Écran Étape 2 : Saisie du code 2FA OTP */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="size-8 rounded-xl bg-[#E04F26]/10 flex items-center justify-center text-[#E04F26]">
                <ShieldCheck className="size-5" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Double Authentification</h1>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Un code de sécurité à 6 chiffres a été envoyé à l'adresse <strong className="text-foreground font-semibold">{email}</strong>.
            </p>

            {errorMsg && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <AlertCircle className="size-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {resendSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>{resendSuccess}</span>
              </div>
            )}

            <form onSubmit={handleVerify2fa} className="mt-6 space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-2 text-center">
                  Saisissez le code à 6 chiffres
                </label>
                <div className="flex justify-between gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="size-11 sm:size-12 text-center text-lg font-bold bg-secondary/40 border border-border rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#E04F26] focus:ring-2 focus:ring-[#E04F26]/20 focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>
                  ⏱️ Expire dans : <strong className="text-foreground">{formatCountdown(countdown)}</strong>
                </span>
                <button
                  type="button"
                  disabled={resending || countdown > 240}
                  onClick={handleResendOtp}
                  className="text-[#E04F26] hover:underline font-semibold flex items-center gap-1 disabled:opacity-40"
                >
                  <RefreshCw className={`size-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>Renvoyer le code</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.join('').length !== 6}
                className="w-full bg-[#E04F26] hover:bg-[#CC3B14] text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Validation en cours...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    <span>Valider et se connecter</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials')
                    setErrorMsg(null)
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>Changer de compte / Retour</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODALE : Mot de passe oublié */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 text-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">Mot de passe oublié</h3>
              <p className="text-slate-500 mb-4 text-[11px]">
                Saisissez votre e-mail institutionnel pour recevoir un lien de réinitialisation.
              </p>

              {forgotStatus === 'sent' ? (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Un e-mail de réinitialisation vous a été envoyé.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="votre.email@um6p.ma"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E04F26]/20"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={forgotStatus === 'loading'}
                      className="px-4 py-2 bg-[#E04F26] text-white font-semibold rounded-xl hover:bg-[#CC3B14] disabled:opacity-50"
                    >
                      {forgotStatus === 'loading' ? 'Envoi...' : 'Envoyer le lien'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}