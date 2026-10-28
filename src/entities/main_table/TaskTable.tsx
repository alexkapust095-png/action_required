import { TaskInfo } from "@/types/types";
import { Task } from "./Task";


export function TaskTable(props: {
    tasks: TaskInfo[],
    selectedIds: Set<string>,
    onSelectChange: (taskId: string, selected: boolean) => void,
}) {
    
    if (props.tasks.length === 0) {
        return <p>Задач пока нет</p>;
    }
    return (
        <>
            {
                props.tasks.map(task => {
                    return <Task
                        key={task.task.id}
                        task={task}
                        selected={props.selectedIds.has(task.task.id)}
                        onSelectChange={props.onSelectChange}
                    />
                })
            }
        </>
    )
}