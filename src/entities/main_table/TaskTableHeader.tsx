export function TaskTableHeader() {
    return (
        <div className="task-table-head">
            <div className="column-name important"> *</div>
            <div className="column-name name">Наименование</div>
            <div className="column-name created-at">Дата создания</div>
            <div className="column-name created-by">Инициатор</div>
            <div className="column-name participants">
                <span className="column-name-accent">Отправитель</span>
                <span>Участники</span>
            </div>
            <div className="column-name priority">Приоритет</div>
            <div className="column-name due-date">Сделать до</div>
        </div>
    )
}