import './TaskTableHeader.css'

export function TaskTableHeader() {
    // Заголовки колонок используют ту же сетку, что и строки списка (--tt-grid-columns),
    // поэтому границы колонок совпадают. Колонки выбора / важности / прочитанности
    // в шапке ЭДО не подписаны — остаются пустыми ячейками той же сетки.
    return (
        <div className="task-table-head task-table-row">
            <div className="task-table-cell checkbox" aria-hidden="true" />
            <div className="task-table-cell important"><div className="column-name important">*</div></div>
            <div className="task-table-cell readed" aria-hidden="true" />
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