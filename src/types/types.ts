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

/** Сертификат для подписания, возвращается функцией загрузки сертификатов */
export interface CertificateData {
    code: string;
    name: string;
}

/**
 * Параметры виджета, передаваемые в initWidget из elma365.
 * Все поля необязательны: без них виджет работает на тестовых данных (dev-режим).
 */
export interface WidgetParams {
    /** 1) Список задач (массив аналогично testData.ts) */
    tasks?: TaskInfo[]
    /** 2) Функция обновления — привязана к кнопке «Обновить» */
    update?: () => void | Promise<void>
    /** 3) Пометка важной/неважной: принимает id задачи, возвращает void */
    setImportant?: (taskId: string) => void
    /** 4) Пометка прочитанной/непрочитанной: принимает id задачи, возвращает void */
    setReaded?: (taskId: string) => void
    /** 5) Подписание нескольких документов: принимает массив id задач */
    signDocuments?: (taskIds: string[]) => void | Promise<void>
    /** 6) Загрузка доступных сертификатов: без параметров */
    loadCertificates?: () => CertificateData[] | Promise<CertificateData[]>
}
