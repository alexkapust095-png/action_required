import './Marks.css'

import { ImportantMark } from './ImportantMark'
import { ReadedMark } from './ReadedMark'

// Колонка «Метки» — один заголовок «*», под которым признаки стоят
// друг под другом: первая строка — «Важно», вторая — «Прочитано».
export function Marks(props: { important: boolean, readed: boolean }) {
    return (
        <div className="task-table-cell marks">
            <ImportantMark important={props.important} />
            <ReadedMark readed={props.readed} />
        </div>
    )
}
