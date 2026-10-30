import './TaskName.css'

export function TaskName(props: {taskName: string}) {
    return (
        <div className="task-table-cell name">
            <span className="task-title">
                <span className="task-title-span">
                    `${props.taskName}`
                </span>
            </span>
        </div>
    )
}