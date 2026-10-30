import { TDatetime } from '@/types/elma365'

/** Три уровня приоритета: Низкий (0–49), Средний (50–99), Высокий (100) — см. Priority.tsx */
export type PriorityFilterValue = 'low' | 'medium' | 'high'

/** Вариант выпадающего списка (значение + подпись) */
export interface SelectOption<T extends string = string> {
    value: T
    label: string
}

/**
 * Наборы вариантов для полей модалки фильтров,
 * вычисленные из массива задач (см. extractFilterOptions).
 */
export interface FilterOptions {
    senders: SelectOption[]
    participants: SelectOption[]
    initiators: SelectOption[]
    statuses: SelectOption[]
    actionTypes: SelectOption[]
}

/** Итоговый набор фильтров, отдаваемый наружу по кнопке «Поиск» */
export interface SearchFilters {
    /** Наименование из строки поиска */
    query: string
    priority: PriorityFilterValue | null
    sender: string | null
    /** id участников (множественный выбор) */
    participants: string[]
    /** id инициаторов (множественный выбор) */
    initiators: string[]
    /** коды статусов (множественный выбор) */
    statuses: string[]
    /** action_type.code из itemStatus (одиночный выбор) */
    actionType: string | null
    /** маршруты (множественный выбор): первый / второй / третий */
    routes: string[]
    /** Диапазон дат создания документооборота (item.data.__createdAt как TDatetime) */
    createdAtFrom: TDatetime | null
    createdAtTo: TDatetime | null
    readed: boolean
    important: boolean
}
