import './TaskTableContent.css'

import { TaskInfo } from "../../types/types";
import { Task } from "./Task";


export function TaskTableContent(props: {
    tasks: TaskInfo[],
    selectedIds: Set<string>,
    onSelectChange: (taskId: string, selected: boolean) => void,
    onToggleImportant?: (taskId: string) => void,
    onToggleReaded?: (taskId: string) => void,
}) {

    const { tasks, selectedIds, onSelectChange, onToggleImportant, onToggleReaded } = props

    // Пустое состояние: этот блок становится корнем виджета (.task-widget),
    // чтобы токены геометрии наследовались и внутри него
    if (tasks.length === 0) {
        return (
            <div className="task-widget task-table-empty-cell">
                <p className="task-table-empty">Задач пока нет</p>
            </div>
        )
    }

    return (
        <div className="task-table-body">
            {
                tasks.map(task => {
                    return <Task
                        key={task.task.id}
                        task={task}
                        selected={selectedIds.has(task.task.id)}
                        onSelectChange={onSelectChange}
                        onToggleImportant={onToggleImportant ? () => onToggleImportant(task.task.id) : undefined}
                        onToggleReaded={onToggleReaded ? () => onToggleReaded(task.task.id) : undefined}
                    />
                })
            }
        </div>
    )
}
