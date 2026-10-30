import { TaskInfo } from '@/types/types'
import { compareTdatetime, inputValueToTdatetime, tdatetimeToInputValue } from '@/utils/tdatetime'
import { FilterOptions, PriorityFilterValue, SearchFilters, SelectOption } from './types'

/** Варианты поля «Маршрут» (фиксированный список) */
export const ROUTE_OPTIONS: SelectOption[] = [
    { value: 'first', label: 'Первый' },
    { value: 'second', label: 'Второй' },
    { value: 'third', label: 'Третий' },
]

/** Варианты поля «Приоритет» */
export const PRIORITY_OPTIONS: SelectOption<PriorityFilterValue>[] = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
]

/** Значение приоритета задачи -> уровень (0–49 низкий, 50–99 средний, 100 высокий) */
export function priorityLevel(priority: number | undefined): PriorityFilterValue | null {
    if (priority === undefined || priority === null) return null
    if (priority >= 0 && priority < 50) return 'low'
    if (priority >= 50 && priority < 100) return 'medium'
    if (priority === 100) return 'high'
    return null
}

function uniqueOptions(items: { id: string; label: string }[]): SelectOption[] {
    const map = new Map<string, SelectOption>()
    for (const item of items) {
        if (!item.id || map.has(item.id)) continue
        map.set(item.id, { value: item.id, label: item.label })
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, 'ru'))
}

/**
 * Вычленяет из массива задач наборы вариантов для полей модалки:
 * отправители (sender), участники (participants), инициаторы (createdBy),
 * статусы (itemStatus.data.__name) и требуемые действия (itemStatus.data.action_type).
 */
export function extractFilterOptions(tasks: TaskInfo[]): FilterOptions {
    const senders: { id: string; label: string }[] = []
    const participants: { id: string; label: string }[] = []
    const initiators: { id: string; label: string }[] = []
    const statuses: { id: string; label: string }[] = []
    const actionTypes: { id: string; label: string }[] = []

    for (const task of tasks) {
        if (task.sender) {
            senders.push({ id: task.sender.id, label: task.sender.data?.__name ?? task.sender.id })
        }
        task.participants?.forEach(p => {
            participants.push({ id: p.id, label: p.data?.__name ?? p.id })
        })
        if (task.createdBy) {
            initiators.push({ id: task.createdBy.id, label: task.createdBy.data?.__name ?? task.createdBy.id })
        }
        if (task.itemStatus) {
            const st = task.itemStatus
            statuses.push({ id: st.data?.__name ?? st.id, label: st.data?.__name ?? st.id })
            const at = st.data?.action_type
            if (at) actionTypes.push({ id: at.code, label: at.name ?? at.code })
        }
    }

    return {
        senders: uniqueOptions(senders),
        participants: uniqueOptions(participants),
        initiators: uniqueOptions(initiators),
        statuses: uniqueOptions(statuses),
        actionTypes: uniqueOptions(actionTypes),
    }
}

export const EMPTY_FILTERS: SearchFilters = {
    query: '',
    priority: null,
    sender: null,
    participants: [],
    initiators: [],
    statuses: [],
    actionType: null,
    routes: [],
    createdAtFrom: null,
    createdAtTo: null,
    readed: false,
    important: false,
}

function matchesText(haystack: string | undefined, needle: string): boolean {
    if (!needle.trim()) return true
    return (haystack ?? '').toLowerCase().includes(needle.trim().toLowerCase())
}

/** Проверка одной задачи на соответствие набору фильтров */
export function taskMatchesFilters(task: TaskInfo, filters: SearchFilters): boolean {
    // Наименование: задача или документ
    if (!matchesText(task.task.data.__name, filters.query) &&
        !matchesText(task.item?.title, filters.query)) {
        return false
    }

    if (filters.priority && priorityLevel(task.task.data.priority) !== filters.priority) {
        return false
    }

    if (filters.sender && task.sender?.id !== filters.sender) {
        return false
    }

    if (filters.participants.length > 0) {
        const ids = task.participants?.map(p => p.id) ?? []
        if (!filters.participants.some(id => ids.includes(id))) return false
    }

    if (filters.initiators.length > 0) {
        if (!task.createdBy || !filters.initiators.includes(task.createdBy.id)) return false
    }

    if (filters.statuses.length > 0) {
        const statusName = task.itemStatus?.data?.__name
        if (!statusName || !filters.statuses.includes(statusName)) return false
    }

    if (filters.actionType && task.itemStatus?.data?.action_type?.code !== filters.actionType) {
        return false
    }

    // Маршрут: в данных задачи пока нет поля route — фильтр применяется,
    // только когда выбран хотя бы один маршрут (сверяется с item.route, если поле появится)
    if (filters.routes.length > 0) {
        const route = task.item?.route
        if (!route || !filters.routes.includes(route)) return false
    }

    // Диапазон даты создания документооборота (item.data.__createdAt как TDatetime)
    const createdAt = task.task.data.__createdAt
    if (filters.createdAtFrom && compareTdatetime(createdAt, filters.createdAtFrom) < 0) return false
    if (filters.createdAtTo && compareTdatetime(createdAt, filters.createdAtTo) > 0) return false

    // Чекбоксы: активный фильтр требует точного совпадения
    if (filters.readed && !task.readed) return false
    if (filters.important && !task.important) return false

    return true
}

/** Фильтрация массива задач по строке поиска и набору фильтров */
export function applySearch(tasks: TaskInfo[], filters: SearchFilters): TaskInfo[] {
    return tasks.filter(task => taskMatchesFilters(task, filters))
}
