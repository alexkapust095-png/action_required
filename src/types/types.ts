import { ApplicationItemRef, ProcessTaskData } from "./elma365";

export interface TaskInfo {
    task: TaskItem,
    sender: ProjectedAppItem<OrgInfo> | undefined,
    participants: ProjectedAppItem<OrgInfo>[] | undefined,
    createdBy: ProjectedAppItem<Employee> | undefined,
    item: any | undefined,
    itemStatus: ProjectedAppItem<StatusInfo> | undefined,
    readed: boolean,
    important: boolean
}

export interface TaskItem {
    data: ProcessTaskData,
    id: string,
}

export interface ProjectedAppItem<T> {
    namespace: string,
    code: string,
    id: string,
    data: T
}

export interface OrgInfo {
    __name: string
}

export interface StatusInfo {
    __name: string;
    action_type: {
        code: string,
        name: string
    };
}

export interface Employee {
    organisation: ApplicationItemRef;
    __name: string;
    user: ApplicationItemRef
}
