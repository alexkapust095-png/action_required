import { ChangeEvent } from 'react'
import './TaskTableHeader.css'

export function TaskTableHeader(props: {
    /** Есть ли задачи в текущем (отфильтрованном) списке */
    hasTasks: boolean,
    /** Все видимые задачи выбраны */
    allSelected: boolean,
    /** Часть видимых задач выбрана (индетерминированное состояние чекбокса) */
    someSelected: boolean,
    /** Переключение «Выбрать всё» */
    onSelectAllChange: (selectAll: boolean) => void,
}) {
    // Заголовки колонок используют ту же сетку, что и строки списка (--tt-grid-columns),
    // поэтому границы колонок совпадают. Колонки выбора / важности / прочитанности
    // в шапке ЭДО не подписаны — остаются пустыми ячейками той же сетки.
    // Класс task-table-row обязателен: строка заголовков и строки задач должны
    // использовать ОДИН CSS-правило сетки (grid-template-columns: --tt-grid-columns),
    // иначе ширины заголовков и колонок значений могут разойтись.
    const { hasTasks, allSelected, someSelected, onSelectAllChange } = props
    // Чекбокс «Выбрать всё» отражает состояние выбора среди ВИДИМЫХ (отфильтрованных)
    // задач: все выбраны — отмечен; выбраны частично — индетерминированное состояние.
    // Клик по индетерминированному чекбоксу браузер приводит к checked=true,
    // но на всякий случай обрабатываем и этот случай: выделяем всё видимое.
    const handleSelectAllClick = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        const selectAll = e.target.checked || (!allSelected && someSelected)
        onSelectAllChange(selectAll)
    }
    return (
        <div className="task-table-head task-table-row">
            {/* Служебная колонка выбора — та же ширина, что у чекбокса в строках */}
            <div className="task-table-cell checkbox">
                <input
                    className="task-checkbox select-all-checkbox"
                    type="checkbox"
                    checked={hasTasks && allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected }}
                    onChange={handleSelectAllClick}
                    disabled={!hasTasks}
                    title="Выбрать все отфильтрованные задачи"
                    aria-label="Выбрать все"
                />
            </div>
            {/* Один заголовок «*” над колонкой признаков: в строках задач
                под ним стоят «Важно» и «Прочитано» (см. Marks.tsx) */}
            <div className="task-table-cell marks"><div className="column-name marks">*</div></div>
            <div className="task-table-cell name"><div className="column-name name">Наименование</div></div>
            <div className="task-table-cell created-at"><div className="column-name created-at">Дата создания</div></div>
            <div className="task-table-cell created-by"><div className="column-name created-by">Инициатор</div></div>
            <div className="task-table-cell participants">
                <div className="column-name participants">
                    <span className="column-name-accent">Отправитель</span>
                    <span>Участники</span>
                </div>
            </div>
            <div className="task-table-cell priority"><div className="column-name priority">Приоритет</div></div>
            <div className="task-table-cell due-date"><div className="column-name due-date">Сделать до</div></div>
        </div>
    )
}