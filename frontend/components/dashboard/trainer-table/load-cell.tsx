'use client'

import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LoadCell({ used, total }: { used: number; total: number }) {
  const { t } = useLanguage()
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  const barTone =
    pct >= 95 ? 'bg-pastel-red-foreground' : pct >= 85 ? 'bg-pastel-amber-foreground' : 'bg-pastel-green-foreground'

  return (
    <div className="flex min-w-28 flex-col gap-1.5">
      <span className="text-sm tabular-nums">
        {used}/{total}
        {t.days}
      </span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary" aria-hidden="true">
        <div className={cn('h-full rounded-full', barTone)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}
