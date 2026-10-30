import { TDatetime } from '@/types/elma365'

/** Перевод TDatetime ЭДО в строку input[type=date] (yyyy-mm-dd) */
export function tdatetimeToInputValue(dt: TDatetime | null | undefined): string {
    if (!dt) return ''
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${dt.year}-${pad(dt.month)}-${pad(dt.day)}`
}

/** Перевод строки input[type=date] в TDatetime; при пустом значении — null.
 *  endOfDay=true выставляет 23:59:59.999 — для правой границы диапазона «по». */
export function inputValueToTdatetime(value: string, endOfDay = false): TDatetime | null {
    if (!value) return null
    const [y, m, d] = value.split('-').map(Number)
    if (!y || !m || !d) return null
    return {
        year: y,
        month: m,
        day: d,
        hours: endOfDay ? 23 : 0,
        minutes: endOfDay ? 59 : 0,
        seconds: endOfDay ? 59 : 0,
        milliseconds: endOfDay ? 999 : 0,
    }
}

/** Сравнение двух TDatetime покомпонентно: <0, 0 или >0 */
export function compareTdatetime(a: TDatetime, b: TDatetime): number {
    const keys: (keyof TDatetime)[] = ['year', 'month', 'day', 'hours', 'minutes', 'seconds', 'milliseconds']
    for (const key of keys) {
        if (a[key] !== b[key]) return a[key] < b[key] ? -1 : 1
    }
    return 0
}
