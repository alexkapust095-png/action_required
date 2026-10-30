

export function Actions(props: { selectedIds: Set<string> }) {
    return (
        <>
            <div className="task-table-headers">
                <div className="task-table-container-name">
                    Задачи
                </div>
                {props.selectedIds.size > 0 && (
                    <>
                        <div className="selected-info">
                            Выбрано задач: {props.selectedIds.size}
                        </div>
                        <button id="deleteButton">Очистить выбор</button>
                    </>
                )}
                <button id="refreshButton"><i className="elma-icons md-18">sync</i>Обновить</button>
                <button id="resetButton">Сбросить фильтры</button>
            </div>
        </>
    )
}