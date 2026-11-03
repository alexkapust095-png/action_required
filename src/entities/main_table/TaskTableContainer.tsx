import '../../TaskWidget.css'
import './TaskTableContainer.css'

import { TaskInfo } from "../../types/types";
import { TaskTableContent } from "./TaskTableContent";
import { TaskTableHeader } from "./TaskTableHeader";
import { Actions } from "../actons/Actions";

export function TaskTableContainer(props: {
    tasks: TaskInfo[],
    selectedIds: Set<string>,
    onSelectChange: (taskId: string, selected: boolean) => void,
    onClearSelection?: () => void,
    onResetFilters?: () => void,
    /** Кнопка «Обновить» — функция обновления из elma365 */
    onUpdate?: () => void,
    /** Пометка «Важно»: сначала setImportant(id), затем инверсия состояния */
    onToggleImportant?: (taskId: string) => void,
    /** Пометка «Прочитано»: сначала setReaded(id), затем инверсия состояния */
    onToggleReaded?: (taskId: string) => void,
    /** Показывать кнопку «Подписать выбранные» (выбрано >0 и у всех action_type.code === 'signing') */
    canSignSelected: boolean,
    /** Открытие модалки подписания по кнопке «Подписать выбранные» */
    onSignSelected?: () => void,
}) {
    return (
        <div className="task-widget task-table-container">
            <Actions
                selectedIds={props.selectedIds}
                onClearSelection={props.onClearSelection}
                onResetFilters={props.onResetFilters}
                onUpdate={props.onUpdate}
                canSignSelected={props.canSignSelected}
                onSignSelected={props.onSignSelected}
            />
            {/* Шапка колонок стоит НАД областью прокрутки и в 70vh не входит.
                Ограничение по высоте (70vh) и прокрутка заданы на .task-table-body
                (см. TaskTableContent.css) — только тело списка. */}
            <TaskTableHeader />
            <TaskTableContent
                onSelectChange={props.onSelectChange}
                selectedIds={props.selectedIds}
                tasks={props.tasks}
                onToggleImportant={props.onToggleImportant}
                onToggleReaded={props.onToggleReaded}
            />
        </div>
    )
}
