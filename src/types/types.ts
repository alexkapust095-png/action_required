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
    /** Базовый URL портала elma365 — используется для открытия задачи по клику */
    url?: string
    /** 1) Список задач (массив аналогично testData.ts) */
    tasks?: TaskInfo[]
    /** 2) Функция обновления — привязана к кнопке «Обновить» */
    update?: () => Promise<TaskInfo[]>
    /** 3) Пометка важной: принимает id задачи */
    setImportant?: (taskId: string) => Promise<void>
    /** 3a) Снятие пометки важности: принимает id задачи */
    clearImportant?: (taskId: string) => Promise<void>
    /** 4) Пометка прочитанной: принимает id задачи */
    setReaded?: (taskId: string) => Promise<void>
    /** 4a) Снятие пометки прочитанности: принимает id задачи */
    setUnreaded?: (taskId: string) => Promise<void>
    /** 5) Подписание нескольких документов: принимает массив id задач */
    signDocuments?: (taskIds: string[]) => Promise<void>
    /** 6) Загрузка доступных сертификатов: без параметров */
    loadCertificates?: () => Promise<CertificateData[]>
}
