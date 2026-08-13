import type { TrainerStatus } from './types'

export function parseDays(str?: string, defaultTotal = 189): { used: number; total: number } {
  if (!str) return { used: 0, total: defaultTotal }
  const match = str.match(/(\d+)\s*\/\s*(\d+)/)
  if (match) {
    return { used: parseInt(match[1], 10), total: parseInt(match[2], 10) }
  }
  const val = parseInt(str, 10) || 0
  return { used: val, total: defaultTotal }
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export function mapAlertToStatus(alertStr?: string): TrainerStatus {
  if (!alertStr) return 'ok'
  const lower = alertStr.toLowerCase()
  if (lower.includes('blocked') || lower.includes('critique') || lower.includes('bloqué')) return 'blocked'
  if (lower.includes('watch') || lower.includes('attention')) return 'watch'
  return 'ok'
}
