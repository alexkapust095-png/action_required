import { Employee, ProjectedAppItem } from "@/types/types";

export function Initiator(props: {createdBy: ProjectedAppItem<Employee> | undefined}) {
    return (
        <>
            <div>
                <span className="created-by-title">`${props.createdBy?.data.__name || ' '}`</span>
            </div>
        </>
    )
}