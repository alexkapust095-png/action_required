import './Actions.css'



export function Actions(props: { selectedIds: Set<string> }) {
    // Панель действий — самостоятельный корень виджета (.task-widget),
    // поэтому её геометрия не зависит от того, смонтирована ли таблица
    return (
        <div className="task-widget task-table-headers">
            <div className="task-table-container-name">
                Задачи
            </div>
            {props.selectedIds.size > 0 && (
                <>
                    <div className="selected-info">
                        Выбрано задач: {props.selectedIds.size}
                    </div>
                    <button id="deleteButton" className="action-button">Очистить выбор</button>
                </>
            )}
            <button id="refreshButton" className="action-button"><i className="elma-icons md-18">sync</i>Обновить</button>
            <button id="resetButton" className="action-button">Сбросить фильтры</button>
        </div>
    )
}