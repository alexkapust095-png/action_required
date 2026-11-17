import { WidgetParams } from '../types/types'

/**
 * Глобальное хранилище параметров виджета.
 *
 * Параметры приходят в initWidget(params) из elma365 и складываются сюда
 * (один раз, при инициализации). Дальше любой модуль проекта может просто
 * импортировать этот объект и читать нужные поля — «протаскивать» params
 * через пропсы или React-контекст больше не нужно.
 *
 * Экспортируется геттер, а не сам объект, чтобы нельзя было заменить
 * содержимое извне; запись выполняет только initWidget.
 */
let widgetParams: WidgetParams = {}

/** Сохраняет параметры, переданные в initWidget. Вызывается один раз из main.tsx. */
export function setWidgetParams(params: WidgetParams): void {
    widgetParams = params ?? {}
}

/** Возвращает сохранённые параметры виджета (до инициализации — пустой объект). */
export function getWidgetParams(): WidgetParams {
    return widgetParams
}
