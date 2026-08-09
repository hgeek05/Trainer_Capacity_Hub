'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t.toggleTheme}
      title={isDark ? t.lightMode : t.darkMode}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative flex h-9 w-16 shrink-0 items-center rounded-full border border-border bg-secondary px-1 transition-colors',
        'hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2',
      )}
    >
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-transform duration-200',
          isDark ? 'translate-x-7' : 'translate-x-0',
        )}
      >
        {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </span>
      <span className="sr-only">{t.toggleTheme}</span>
    </button>
  )
}
