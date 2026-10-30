import './CreatedAt.css'

import { TDatetime } from "@/types/elma365";
import { escapeHtml } from "../../utils/escapeHtml";
import { formatDateTime } from "../../utils/formatDateTime";

export function CreatedAt(props: {date: TDatetime}) {
    const formatted = formatDateTime(props.date)
    return (
        <div className="task-table-cell created-at">
            <span
                className="created-at-title"
                dangerouslySetInnerHTML={{ __html: escapeHtml(formatted) }}
            />
        </div>
    )
}
