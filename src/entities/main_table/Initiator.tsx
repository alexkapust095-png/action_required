import './Initiator.css'

import { Employee, ProjectedAppItem } from "@/types/types";

export function Initiator(props: {createdBy: ProjectedAppItem<Employee> | undefined}) {
    return (
        <div className="task-table-cell created-by">
            <span className="created-by-title">`${props.createdBy?.data.__name || ' '}`</span>
        </div>
    )
}