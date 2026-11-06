import './Actions.css'



export function Actions(props: {
    selectedIds: Set<string>,
    onClearSelection?: () => void,
    onResetFilters?: () => void,
    /** Функция обновления из elma365 — привязана к кнопке «Обновить» */
    onUpdate?: (hideSpinner?: boolean) => void,
    /** Кнопка «Подписать выбранные»: выбрано >0 и у всех action_type.code === 'signing' */
    canSignSelected: boolean,
    onSignSelected?: () => void,
}) {
    function updateFromElma() {
        if (props.onUpdate)
            props.onUpdate()
    }
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
            {/* Подписание выбранных документов: показываем только когда
                выбрано больше 0 элементов и у всех тип действия -> signing */}
            {props.canSignSelected && (
                <button
                    id="signButton"
                    className="action-button"
                    onClick={props.onSignSelected}
                >
                    <i className="elma-icons md-18">pencil</i>Подписать выбранные
                </button>
            )}
            <button id="refreshButton" className="action-button" onClick={updateFromElma}><i className="elma-icons md-18">sync</i>Обновить</button>
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
