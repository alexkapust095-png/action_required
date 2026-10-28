import { TaskInfo } from "@/types/types";
import { TaskTableContent } from "./TaskTableContent";
import { TaskTableHeader } from "./TaskTableHeader";

export function TaskTableContainer(props: {
    tasks: TaskInfo[],
    selectedIds: Set<string>,
    onSelectChange: (taskId: string, selected: boolean) => void,
}) {
    return (
        <>
            <TaskTableHeader />
            <TaskTableContent 
                onSelectChange={props.onSelectChange}
                selectedIds={props.selectedIds}
                tasks={props.tasks}
            />
        </>
    )
}