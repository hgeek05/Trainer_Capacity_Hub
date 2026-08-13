'use client'

import type { AiAnomaly } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface AiAuditReportProps {
  anomalies: AiAnomaly[]
  onClose: () => void
}

export function AiAuditReport({ anomalies, onClose }: AiAuditReportProps) {
  const { t } = useLanguage()

  if (!anomalies || anomalies.length === 0) return null

  return (
    <div className="mx-5 my-4 rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-foreground font-bold text-sm">
            {t.aiReportTitle}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20">
            {anomalies.length} {t.anomaliesIdentified}
          </span>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {anomalies.map((anomaly, idx) => {
          const animDays = anomaly.anim_days ?? 120
          const isOver = animDays > 107
          const delta = animDays - 107
          const pct = Math.min(Math.round((animDays / 107) * 100), 100)

          return (
            <div
              key={idx}
              className="bg-secondary/40 p-4 rounded-xl border border-border/80 flex flex-col justify-between hover:border-border transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-semibold text-foreground text-sm">{anomaly.name}</span>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2.5 py-0.5 rounded-full border',
                      isOver
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
                    )}
                  >
                    {isOver ? `⚠️ ${t.overload} (+${delta}${t.days})` : `✅ ${t.compliant} (${delta}${t.days})`}
                  </span>
                </div>
                {anomaly.email && <p className="text-xs text-muted-foreground mb-3">{anomaly.email}</p>}

                <div className="bg-card p-3 rounded-xl border border-border/60 mb-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground">{animDays} / 107 {t.days}</span>
                    <span className="text-muted-foreground font-medium text-[11px]">{t.targetMax}</span>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        isOver ? 'bg-rose-500' : 'bg-emerald-500',
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
                    <span>{t.targetDelta} {delta > 0 ? `+${delta} ${t.days}` : `${delta} ${t.days}`}</span>
                    <span className="font-mono">{anomaly.metrics}</span>
                  </div>
                </div>

                <div className="bg-card/70 p-3 rounded-lg border border-border/40 mb-2">
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    💡 {anomaly.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground font-mono">
                <span>{t.aiStatus} {anomaly.level}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
