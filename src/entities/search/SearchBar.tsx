import { useMemo, useState } from 'react'
import './SearchBar.css'
import './FilterModal.css'
import './MultiSelect.css'
import { TaskInfo } from '@/types/types'
import { SearchFilters } from './types'
import { EMPTY_FILTERS, extractFilterOptions } from './filterLogic'
import { FilterModal } from './FilterModal'

/**
 * Строка поиска + кнопка открытия модалки фильтров.
 * Варианты полей фильтров вычленяются из переданного массива задач.
 */
export function SearchBar(props: {
    tasks: TaskInfo[]
    onSearch: (filters: SearchFilters) => void
}) {
    const [query, setQuery] = useState(EMPTY_FILTERS.query)
    const [appliedFilters, setAppliedFilters] = useState<SearchFilters>(EMPTY_FILTERS)
    const [modalOpen, setModalOpen] = useState(false)

    // Все наборы вариантов для модалки — из массива задач
    const filterOptions = useMemo(() => extractFilterOptions(props.tasks), [props.tasks])

    // «Поиск» из строки и Enter в строке: применяем введённое наименование
    // вместе с уже применёнными фильтрами модалки
    const handleSearchClick = () => {
        const next: SearchFilters = { ...appliedFilters, query }
        setAppliedFilters(next)
        props.onSearch(next)
    }

    // «Поиск» в модалке фильтров: применяем черновик фильтров + текущую строку
    const handleModalSearch = (draft: Omit<SearchFilters, 'query'>) => {
        const next: SearchFilters = { ...draft, query }
        setAppliedFilters(next)
        setModalOpen(false)
        props.onSearch(next)
    }

    // «Сбросить» в модалке: очищаем строку поиска и все применённые фильтры —
    // список задач возвращается к исходному виду, выбор в первой колонке сбрасывает App.
    // Окно фильтров остаётся открытым (его поля очищает сам FilterModal).
    const handleModalReset = () => {
        setQuery('')
        setAppliedFilters(EMPTY_FILTERS)
        props.onSearch(EMPTY_FILTERS)
    }

    return (
        <div className="task-widget search-bar">
            {/* Форма: Enter по кнопке «Поиск» срабатывает как обычный submit */}
            <form
                className="search-bar-form"
                onSubmit={e => { e.preventDefault(); handleSearchClick() }}
            >
                <input
                    type="text"
                    className="search-input"
                    placeholder="Введите наименование"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearchClick() }}
                />
                <button
                    type="submit"
                    id="searchButton"
                    className="search-submit-button"
                    aria-label="Поиск"
                >
                    {/* Иконка поиска (elma-icons, как в панели действий) */}
                    <i className="elma-icons md-18" aria-hidden="true">search</i>
                </button>
                <button
                    type="button"
                    id="filterButton"
                    className={`search-filter-button${modalOpen ? ' active' : ''}`}
                    aria-label="Открыть фильтры"
                    onClick={() => setModalOpen(true)}
                >
                    {/* Иконка фильтра (elma-icons, как в панели действий) */}
                    <i className="elma-icons md-18" aria-hidden="true">filter_list</i>
                </button>
            </form>

            <FilterModal
                open={modalOpen}
                options={filterOptions}
                initialFilters={appliedFilters}
                onClose={() => setModalOpen(false)}
                onSearch={handleModalSearch}
                onReset={handleModalReset}
            />
        </div>
    )
}
