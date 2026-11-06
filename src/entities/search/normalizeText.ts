/**
 * Нормализация текста для поиска по опциям фильтров:
 * приводит к нижнему регистру как латиницу, так и кириллицу
 * (ОПЦИЯ -> опция, ОпЦиЯ -> опция), убирает лишние пробелы.
 */
const UPPER_CYR = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
const LOWER_CYR = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'

export function normalizeForSearch(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/[А-ЯЁ]/g, ch => LOWER_CYR[UPPER_CYR.indexOf(ch)])
}

/** Проверка: содержит ли текст подстроку без учёта регистра (lat + cyr). */
export function fuzzyContains(text: string, query: string): boolean {
    return normalizeForSearch(text).includes(normalizeForSearch(query))
}
