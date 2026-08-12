'use client'

import { useLanguage } from '@/lib/i18n'
import { loginContent } from '@/components/login/login-content'
import { LoginBrandPanel } from '@/components/login/login-brand-panel'
import { LoginForm } from '@/components/login/login-form'

export default function LoginPage() {
  const { lang } = useLanguage()
  const copy = loginContent[lang]

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <LoginForm copy={copy} />
      <LoginBrandPanel copy={copy} />
    </div>
  )
}
