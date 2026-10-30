import '../../TaskWidget.css'
import './TaskTableContainer.css'

import { TaskInfo } from "@/types/types";
import { TaskTableContent } from "./TaskTableContent";
import { TaskTableHeader } from "./TaskTableHeader";
import { Actions } from "../actons/Actions";

export function TaskTableContainer(props: {
    tasks: TaskInfo[],
    selectedIds: Set<string>,
    onSelectChange: (taskId: string, selected: boolean) => void,
}) {
    return (
        <div className="task-widget task-table-container">
            <Actions selectedIds={props.selectedIds}/>
            {/* Шапка колонок стоит НАД областью прокрутки и в 70vh не входит.
                Ограничение по высоте (70vh) и прокрутка заданы на .task-table-body
                (см. TaskTableContent.css) — только тело списка. */}
            <TaskTableHeader />
            <TaskTableContent
                onSelectChange={props.onSelectChange}
                selectedIds={props.selectedIds}
                tasks={props.tasks}
            />
        </div>
    )
}
