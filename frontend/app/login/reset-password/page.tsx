'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import { resetPasswordApi } from '@/lib/api'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (newPassword !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    setLoading(true)
    try {
      await resetPasswordApi(token, newPassword)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Impossible de réinitialiser le mot de passe. Jeton invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="font-bold text-rose-900">Lien invalide</h2>
        <p className="text-xs text-rose-700">Aucun jeton de réinitialisation n'a été fourni.</p>
        <Link href="/login" className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl">
          Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-center min-w-[240px]">
          <img src="/um6p-technix-logo.png" alt="UM6P TechniX Logo" className="h-10 w-auto object-contain" />
        </div>
      </div>

      <h1 className="text-xl font-bold text-slate-900 text-center">Réinitialisation du mot de passe</h1>
      <p className="text-xs text-slate-500 text-center mt-1 mb-6">Saisissez votre nouveau mot de passe sécurisé.</p>

      {success ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Votre mot de passe a été réinitialisé avec succès !</span>
          </div>
          <p className="text-[11px]">Redirection vers la page de connexion...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 pr-10 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:border-[#E04F26] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 pr-10 py-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#E04F26]/20 focus:border-[#E04F26] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E04F26] hover:bg-[#CC3B14] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Réinitialisation...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Valider le nouveau mot de passe</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-slate-500">Chargement...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
