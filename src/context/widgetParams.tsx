import { createContext, useContext } from 'react'
import { WidgetParams } from '../types/types'

/**
 * Параметры виджета, переданные в initWidget из elma365.
 * Context нужен потому, что модалка подписания рендерится через createPortal
 * (вне DOM-дерева корня виджета), но React-дерево при этом сохраняется —
 * контекст «протекает» в портал.
 */
export const WidgetParamsContext = createContext<WidgetParams>({})

export function useWidgetParams(): WidgetParams {
    return useContext(WidgetParamsContext)
}
