import { useCallback, useEffect, useRef, useState } from 'react'
import './MultiSelect.css'
import { SelectOption } from './types'

/**
 * Выпадающий список с возможностью выбрать несколько элементов.
 * Закрывается по клику вне своей области.
 */
export function MultiSelect(props: {
    options: SelectOption[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
}) {
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

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

    const toggleOption = useCallback((optionValue: string) => {
        props.onChange(
            props.value.includes(optionValue)
                ? props.value.filter(v => v !== optionValue)
                : [...props.value, optionValue],
        )
    }, [props.onChange, props.value])

    const selectedLabels = props.value
        .map(v => props.options.find(o => o.value === v)?.label ?? v)

    return (
        <div className="task-widget search-multi-select" ref={rootRef}>
            <button
                type="button"
                className={`ms-control${open ? ' open' : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                {selectedLabels.length > 0 ? (
                    <span className="ms-summary">
                        <span className="ms-summary-text">{selectedLabels.join(', ')}</span>
                        <span className="ms-count">{selectedLabels.length}</span>
                    </span>
                ) : (
                    <span className="ms-placeholder">{props.placeholder ?? 'Не выбрано'}</span>
                )}
                <span className={`ms-caret${open ? ' up' : ''}`} aria-hidden="true" />
            </button>

            {open && (
                <div className="ms-dropdown" role="listbox" aria-multiselectable="true">
                    {props.options.length === 0 && (
                        <div className="ms-empty">Нет доступных вариантов</div>
                    )}
                    {props.options.map(option => {
                        const checked = props.value.includes(option.value)
                        return (
                            <label key={option.value} className={`ms-option${checked ? ' checked' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleOption(option.value)}
                                />
                                <span className="ms-option-label">{option.label}</span>
                            </label>
                        )
                    })}
                    {props.value.length > 0 && (
                        <button
                            type="button"
                            className="ms-clear"
                            onClick={() => props.onChange([])}
                        >
                            Сбросить
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
