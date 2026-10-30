import './Duedate.css'

import { TDatetime } from "@/types/elma365";
import { escapeHtml } from "../../utils/escapeHtml";
import { formatDateTime } from "../../utils/formatDateTime";

export function Duedate(props: {date: TDatetime | undefined}) {
    const formatted = props.date ? formatDateTime(props.date) : ''
    return (
        <div className="task-table-cell due-date">
            <span
                className="duedate-title"
                dangerouslySetInnerHTML={{ __html: escapeHtml(formatted) }}
            />
        </div>
    )
}
