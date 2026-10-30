import './TaskName.css'

import { escapeHtml } from '../../utils/escapeHtml'

export function TaskName(props: {taskName: string}) {
    return (
        <div className="task-table-cell name">
            <span className="task-title">
                <span
                    className="task-title-span"
                    dangerouslySetInnerHTML={{ __html: escapeHtml(props.taskName ?? '') }}
                />
            </span>
        </div>
    )
}
