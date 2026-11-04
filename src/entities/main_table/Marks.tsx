import './Marks.css'

import { MouseEvent } from 'react'
import { ImportantMark } from './ImportantMark'
import { ReadedMark } from './ReadedMark'

// Колонка «Метки» — один заголовок «*”, под которым признаки стоят
// друг под другом: первая строка — «Важно», вторая — «Прочитано».
// onToggleImportant/onToggleReaded поднимаются к Task (см. Task.tsx).
// onStopRowClick нужен, чтобы клики по меткам не открывали задачу:
// метки стоят «поверх» строки и не дают событию клика всплыть до Task.
export function Marks(props: {
    important: boolean,
    readed: boolean,
    onToggleImportant?: () => void,
    onToggleReaded?: () => void,
    onStopRowClick?: (e: MouseEvent<HTMLDivElement>) => void,
}) {
    return (
        <div className="task-table-cell marks" onClick={props.onStopRowClick}>
            <ImportantMark important={props.important} onToggle={props.onToggleImportant} />
            <ReadedMark readed={props.readed} onToggle={props.onToggleReaded} />
        </div>
    )
}
