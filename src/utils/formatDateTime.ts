import { TDatetime } from '@/types/elma365'

/**
 * Форматирует TDatetime ЭДО в строку «дд.мм.гггг, чч:мм»
 * с дополнением нулями до двух знаков.
 */
export function formatDateTime(date: TDatetime): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(date.day)}.${pad(date.month)}.${date.year}, ${pad(date.hours)}:${pad(date.minutes)}`
}
