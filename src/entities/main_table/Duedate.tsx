import './Duedate.css'

import { TDatetime } from "@/types/elma365";

export function Duedate(props: {date: TDatetime | undefined}) {
    let date = props.date
    return (
        <div className="task-table-cell due-date">
            <span className="duedate-title">
                {date ? `${date.day}.${date.month}.${date.year}, ${date.hours}:${date.minutes}` : ' '}
            </span>
        </div>
    )
}