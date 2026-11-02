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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                            xmlns="http://www.w3.org/2000/svg" 
                            style={{stroke:"none", fillRule:"evenodd", fillOpacity:1 }}
                            d="M 13.058594 3.320312 C 12.898438 3.488281 12.671875 3.585938 12.441406 3.582031 L 3.535156 3.582031 C 3.308594 3.578125 3.082031 3.476562 2.925781 3.300781 C 2.785156 3.148438 2.699219 2.945312 2.6875 2.730469 L 13.3125 2.730469 C 13.300781 2.949219 13.210938 3.164062 13.058594 3.320312 Z M 13.691406 2.328125 C 13.488281 2.125 13.199219 2.003906 12.90625 2 L 3.125 2 C 2.980469 2 2.832031 2.023438 2.695312 2.078125 C 2.558594 2.128906 2.433594 2.207031 2.332031 2.304688 C 2.121094 2.503906 2 2.78125 2 3.058594 C 1.996094 3.195312 2.023438 3.339844 2.074219 3.46875 C 2.128906 3.597656 2.207031 3.71875 2.308594 3.820312 C 2.511719 4.023438 2.800781 4.144531 3.097656 4.144531 L 3.402344 4.144531 L 6.960938 9.308594 L 6.960938 13.925781 L 7.917969 13.925781 L 9.039062 12.335938 L 9.039062 9.308594 L 12.597656 4.144531 L 12.875 4.144531 C 13.019531 4.148438 13.167969 4.121094 13.304688 4.070312 C 13.441406 4.015625 13.566406 3.9375 13.667969 3.839844 C 13.878906 3.644531 14 3.367188 14 3.085938 C 14.003906 2.949219 13.976562 2.808594 13.925781 2.679688 C 13.871094 2.546875 13.792969 2.425781 13.691406 2.328125 Z M 13.691406 2.328125 "></path>
                    </svg>
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
