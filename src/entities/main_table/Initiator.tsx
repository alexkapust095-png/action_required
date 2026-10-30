import './Initiator.css'

import { Employee, ProjectedAppItem } from "@/types/types";
import { escapeHtml } from "../../utils/escapeHtml";

export function Initiator(props: {createdBy: ProjectedAppItem<Employee> | undefined}) {
    const name = props.createdBy?.data.__name ?? ''
    return (
        <div className="task-table-cell created-by">
            <span
                className="created-by-title"
                dangerouslySetInnerHTML={{ __html: escapeHtml(name) }}
            />
        </div>
    )
}
