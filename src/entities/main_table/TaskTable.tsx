import { TaskInfo } from "@/types/types";
import { Task } from "./Task";


export function TaskTable(props: { tasks: TaskInfo[] }) {
    
    if (props.tasks.length === 0) {
        return <p>Задач пока нет</p>;
    }
    return (
        <>
            {
                props.tasks.map(task => {
                    return <Task key={task.task.id} task={task} />
                })
            }
        </>
    )
}