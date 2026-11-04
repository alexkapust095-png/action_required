import './Marks.css'

import { MouseEvent } from 'react'
import { ImportantMark } from './ImportantMark'
import { ReadedMark } from './ReadedMark'

// Клик по метке НЕ должен открывать задачу (метки стоят «поверх» строки-ссылки <a>).
// stopPropagation не помогает: в React 17+ события обрабатываются на корне
// контейнера, а не через естественное всплытие до document, поэтому дефолт
// ссылки (<a href>) всё равно отрабатывает. Надёжный способ — вызвать
// preventDefault на самом событии клика: браузер не перейдёт по href.
const markClickGuard = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation() }

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
        <div className="task-table-cell marks" onClick={markClickGuard}>
            <ImportantMark important={props.important} onToggle={props.onToggleImportant} />
            <ReadedMark readed={props.readed} onToggle={props.onToggleReaded} />
        </div>
    )
}
