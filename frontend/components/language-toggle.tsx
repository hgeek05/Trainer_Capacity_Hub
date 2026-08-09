'use client'

import { useLanguage, type Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const options: { value: Lang; label: string }[] = [
  { value: 'fr', label: 'FR' },
  { value: 'en', label: 'EN' },
]

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      role="radiogroup"
      aria-label={t.language}
      className="flex h-9 items-center gap-1 rounded-full border border-border bg-secondary p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={lang === option.value}
          onClick={() => setLang(option.value)}
          className={cn(
            'flex h-7 items-center rounded-full px-2.5 text-xs font-medium transition-colors',
            lang === option.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
