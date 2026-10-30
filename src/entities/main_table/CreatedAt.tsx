import './CreatedAt.css'

import { TDatetime } from "@/types/elma365";

export function CreatedAt(props: {date: TDatetime}) {
    let date = props.date
    return (
        <div className="task-table-cell created-at">
            <span className="created-at-title">
                `${date.day}.${date.month}.${date.year}, ${date.hours}:${date.minutes}`
            </span>
        </div>
    )
}