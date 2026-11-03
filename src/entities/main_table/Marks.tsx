import './Marks.css'

import { ImportantMark } from './ImportantMark'
import { ReadedMark } from './ReadedMark'

// Колонка «Метки» — один заголовок «*», под которым признаки стоят
// друг под другом: первая строка — «Важно», вторая — «Прочитано».
// onToggleImportant/onToggleReaded поднимаются к Task (см. Task.tsx).
export function Marks(props: {
    important: boolean,
    readed: boolean,
    onToggleImportant?: () => void,
    onToggleReaded?: () => void,
}) {
    return (
        <div className="task-table-cell marks">
            <ImportantMark important={props.important} onToggle={props.onToggleImportant} />
            <ReadedMark readed={props.readed} onToggle={props.onToggleReaded} />
        </div>
    )
}
