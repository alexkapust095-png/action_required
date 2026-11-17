/**
 * Нормализация текста для поиска по опциям фильтров:
 * приводит к нижнему регистру как латиницу, так и кириллицу
 * (ОПЦИЯ -> опция, ОпЦиЯ -> опция), убирает лишние пробелы
 * и считает «е» и «ё» одной и той же буквой (Семья -> семья, Ёлка -> елка).
 */
export function normalizeForSearch(text: string): string {
    return text
        .trim()
        .toLowerCase()
        // «ё» считаем той же буквой, что и «е» — в любом регистре
        .replace(/ё/g, 'е')
}

/** Проверка: содержит ли текст подстроку без учёта регистра (lat + cyr) и с учётом е/ё. */
export function fuzzyContains(text: string, query: string): boolean {
    return normalizeForSearch(text).includes(normalizeForSearch(query))
}
