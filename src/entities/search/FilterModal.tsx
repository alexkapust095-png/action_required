import { useEffect, useRef, useState } from 'react'
import './FilterModal.css'
import { FilterOptions, PriorityFilterValue, SearchFilters } from './types'
import { PRIORITY_OPTIONS, ROUTE_OPTIONS } from './filterLogic'
import { inputValueToTdatetime, tdatetimeToInputValue } from '@/utils/tdatetime'
import { MultiSelect } from './MultiSelect'
import { SingleSelect } from './SingleSelect'

/**
 * Модальное окно фильтров.
 * - открывается по кнопке фильтра (родитель рендерит компонент при open=true);
 * - закрывается по клику вне области окна (по затемнённому фону) и по Esc;
 * - внизу — кнопка «Поиск», применяющая собранные фильтры.
 */
export function FilterModal(props: {
    open: boolean
    options: FilterOptions
    initialFilters: SearchFilters
    onClose: () => void
    onSearch: (filters: Omit<SearchFilters, 'query'>) => void
}) {
    // Локальное состояние черновика фильтров: «Поиск» применяет его целиком
    const [draft, setDraft] = useState<Omit<SearchFilters, 'query'>>(props.initialFilters)
    const modalRef = useRef<HTMLDivElement>(null)

    // Синхронизация черновика при каждом открытии модалки
    useEffect(() => {
        if (props.open) setDraft(props.initialFilters)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open])

    // Esc закрывает модалку
    useEffect(() => {
        if (!props.open) return
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') props.onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [props.open, props.onClose])

    if (!props.open) return null

    const patch = (partial: Partial<Omit<SearchFilters, 'query'>>) =>
        setDraft(prev => ({ ...prev, ...partial }))

    // Клик по затемняющему подложке фону (вне области самого окна) — закрыть
    const handleBackdropMouseDown = (event: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            props.onClose()
        }
    }

    return (
        <div className="task-widget search-modal-backdrop" onMouseDown={handleBackdropMouseDown}>
            <div className="search-modal" ref={modalRef} role="dialog" aria-modal="true" aria-label="Фильтры">
                <div className="search-modal-header">
                    <span className="search-modal-title">Фильтры</span>
                    <button type="button" className="search-modal-close" aria-label="Закрыть" onClick={props.onClose}>
                        ×
                    </button>
                </div>

                <div className="search-modal-body">
                    {/* Приоритет — выпадающий список, одиночный выбор */}
                    <div className="filter-field">
                        <label className="filter-label">Приоритет</label>
                        <SingleSelect
                            options={PRIORITY_OPTIONS}
                            value={draft.priority}
                            onChange={value => patch({ priority: value as PriorityFilterValue | null })}
                            placeholder="Любой"
                        />
                    </div>

                    {/* Отправитель — вычленён из sender задач, одиночный выбор */}
                    <div className="filter-field">
                        <label className="filter-label">Отправитель</label>
                        <SingleSelect
                            options={props.options.senders}
                            value={draft.sender}
                            onChange={value => patch({ sender: value })}
                            placeholder="Любой"
                        />
                    </div>

                    {/* Участники — вычленены из participants задач, множественный выбор */}
                    <div className="filter-field">
                        <label className="filter-label">Участники</label>
                        <MultiSelect
                            options={props.options.participants}
                            value={draft.participants}
                            onChange={value => patch({ participants: value })}
                            placeholder="Все участники"
                        />
                    </div>

                    {/* Инициатор — вычленён из createdBy задач, множественный выбор */}
                    <div className="filter-field">
                        <label className="filter-label">Инициатор</label>
                        <MultiSelect
                            options={props.options.initiators}
                            value={draft.initiators}
                            onChange={value => patch({ initiators: value })}
                            placeholder="Все инициаторы"
                        />
                    </div>

                    {/* Статус — вычленён из itemStatus задач, множественный выбор */}
                    <div className="filter-field">
                        <label className="filter-label">Статус</label>
                        <MultiSelect
                            options={props.options.statuses}
                            value={draft.statuses}
                            onChange={value => patch({ statuses: value })}
                            placeholder="Любой статус"
                        />
                    </div>

                    {/* Требуемое действие — action_type из itemStatus, одиночный выбор */}
                    <div className="filter-field">
                        <label className="filter-label">Требуемое действие</label>
                        <SingleSelect
                            options={props.options.actionTypes}
                            value={draft.actionType}
                            onChange={value => patch({ actionType: value })}
                            placeholder="Любое действие"
                        />
                    </div>

                    {/* Маршрут — фиксированный список, множественный выбор */}
                    <div className="filter-field">
                        <label className="filter-label">Маршрут</label>
                        <MultiSelect
                            options={ROUTE_OPTIONS}
                            value={draft.routes}
                            onChange={value => patch({ routes: value })}
                            placeholder="Любой маршрут"
                        />
                    </div>

                    {/* Дата создания документооборота — с/по по item.data.__createdAt (TDatetime) */}
                    <div className="filter-field">
                        <label className="filter-label">Дата создания документооборота</label>
                        <div className="filter-date-range">
                            <label className="filter-subfield">
                                <span className="filter-subfield-caption">С</span>
                                <input
                                    type="date"
                                    value={tdatetimeToInputValue(draft.createdAtFrom)}
                                    onChange={e => patch({ createdAtFrom: inputValueToTdatetime(e.target.value) })}
                                />
                            </label>
                            <label className="filter-subfield">
                                <span className="filter-subfield-caption">По</span>
                                <input
                                    type="date"
                                    value={tdatetimeToInputValue(draft.createdAtTo)}
                                    onChange={e => patch({ createdAtTo: inputValueToTdatetime(e.target.value, true) })}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Прочитано — чекбокс (фильтр по readed) */}
                    <label className="filter-checkbox-row">
                        <input
                            type="checkbox"
                            checked={draft.readed}
                            onChange={e => patch({ readed: e.target.checked })}
                        />
                        <span>Прочитано</span>
                    </label>

                    {/* Важно — чекбокс (фильтр по important) */}
                    <label className="filter-checkbox-row">
                        <input
                            type="checkbox"
                            checked={draft.important}
                            onChange={e => patch({ important: e.target.checked })}
                        />
                        <span>Важно</span>
                    </label>
                </div>

                <div className="search-modal-footer">
                    <button type="button" className="search-modal-reset" onClick={() => setDraft(EMPTY_DRAFT)}>
                        Сбросить
                    </button>
                    <button
                        type="button"
                        id="searchButton"
                        className="search-modal-submit"
                        onClick={() => props.onSearch(draft)}
                    >
                        Поиск
                    </button>
                </div>
            </div>
        </div>
    )
}

const EMPTY_DRAFT: Omit<SearchFilters, 'query'> = {
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
