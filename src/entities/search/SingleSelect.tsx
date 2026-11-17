import { useEffect, useMemo, useRef, useState } from 'react'
import './MultiSelect.css'
import { SelectOption } from './types'
import { fuzzyContains } from './normalizeText'

/**
 * Выпадающий список с одиночным выбором и поиском по опциям.
 * Закрывается по клику вне своей области; повторный клик по варианту снимает выбор.
 * Введённый текст фильтрует варианты без учёта регистра (в т.ч. кириллицы).
 */
export function SingleSelect(props: {
    options: SelectOption[]
    value: string | null
    onChange: (value: string | null) => void
    placeholder?: string
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const rootRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Закрытие по клику вне области компонента
    useEffect(() => {
        if (!open) return
        const handleOutsideClick = (event: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [open])

    // При открытии — очищаем поиск и фокусируем поле ввода
    useEffect(() => {
        if (open) {
            setSearch('')
            inputRef.current?.focus()
        }
    }, [open])

    const filteredOptions = useMemo(
        () => (search.trim() === ''
            ? props.options
            : props.options.filter(o => fuzzyContains(o.label, search))),
        [props.options, search],
    )

    // Если список остался открытым (например, выбор изменён извне), возвращаем курсор в строку поиска
    useEffect(() => {
        if (open) {
            inputRef.current?.focus()
        }
    }, [props.value, open])

    const selectedLabel = props.value
        ? props.options.find(o => o.value === props.value)?.label ?? props.value
        : null

    return (
        <div className="task-widget search-multi-select single" ref={rootRef}>
            <button
                type="button"
                className={`ms-control${open ? ' open' : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                {selectedLabel ? (
                    <span className="ms-summary-text">{selectedLabel}</span>
                ) : (
                    <span className="ms-placeholder">{props.placeholder ?? 'Не выбрано'}</span>
                )}
                <span className={`ms-caret${open ? ' up' : ''}`} aria-hidden="true" />
            </button>

            {open && (
                <div className="ms-dropdown" role="listbox">
                    <input
                        ref={inputRef}
                        type="text"
                        className="ms-search"
                        placeholder="Поиск..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onClick={e => e.stopPropagation()}
                    />
                    {props.options.length === 0 && (
                        <div className="ms-empty">Нет доступных вариантов</div>
                    )}
                    {props.options.length > 0 && filteredOptions.length === 0 && (
                        <div className="ms-empty">Ничего не найдено</div>
                    )}
                    {filteredOptions.map(option => {
                        const selected = option.value === props.value
                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="option"
                                aria-selected={selected}
                                className={`ms-option single${selected ? ' checked' : ''}`}
                                onClick={() => {
                                    // Повторный клик по выбранному — сброс фильтра
                                    props.onChange(selected ? null : option.value)
                                    setOpen(false)
                                }}
                            >
                                {option.label}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
