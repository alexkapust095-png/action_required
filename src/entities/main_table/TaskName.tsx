import './TaskName.css'

import { escapeHtml } from '../../utils/escapeHtml'

export function TaskName(props: {taskName: string, readed?: boolean}) {
    return (
        <div className="task-table-cell name">
            <span className="task-title">
                <span
                    // className="task-title-span"
                    className={props.readed ? 'task-title-span readed' : 'task-title-span unreaded'}
                    dangerouslySetInnerHTML={{ __html: escapeHtml(props.taskName ?? '') }}
                />
            </span>
        </div>
    )
}
