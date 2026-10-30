

export function Priority(props: {priority: number}) {
    const priority = props.priority ?? 0
    return (
        <>
            <div className="task-item task-priority">
                {(priority >= 0 && priority < 50) && <div className="priority-low">Низкий</div>}
                {(priority >= 50 && priority < 100) && <div className="priority-medium">Средний</div>}
                {priority === 100 && <div className="priority-high">Высокий</div>}
            </div>
        </>
    )
}