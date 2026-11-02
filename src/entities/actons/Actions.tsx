import './Actions.css'



export function Actions(props: {
    selectedIds: Set<string>,
    onClearSelection?: () => void,
    onResetFilters?: () => void,
}) {
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
                    {/* Сброс выбора в первой колонке списка задач */}
                    <button
                        id="deleteButton"
                        className="action-button"
                        onClick={props.onClearSelection}
                    >
                        Очистить выбор
                    </button>
                </>
            )}
            <button id="refreshButton" className="action-button"><i className="elma-icons md-18">sync</i>Обновить</button>
            {/* Сброс фильтров + выбранных документов: обработчик поднимается в App */}
            <button
                id="resetButton"
                className="action-button"
                onClick={props.onResetFilters}
            >
                Сбросить фильтры
            </button>
        </div>
    )
}