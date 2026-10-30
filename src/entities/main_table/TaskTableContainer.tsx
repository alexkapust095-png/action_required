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
            {/* Шапка колонок и тело списка объединены в один прокручиваемый
                блок: скроллится только тело, шапка остаётся на месте (sticky).
                Ограничение по высоте (70vh) задано именно здесь — без шапки. */}
            <div className="task-table-scroll">
                <TaskTableHeader />
                <TaskTableContent
                    onSelectChange={props.onSelectChange}
                    selectedIds={props.selectedIds}
                    tasks={props.tasks}
                />
            </div>
        </div>
    )
}
