import './ImportantMark.css'

export function ImportantMark(props: { important: boolean }) {
    // Признак «Важно» — первый слот колонки «Метки» (см. Marks.tsx):
    // стоит ровно под заголовком «*” и слева от признака «Прочитано».
    return (
        <span className="task-mark-important-slot">
            {props.important === true ? (
                <i className="elma-icons grey-icons md-18 task-mark-important"> star_filled </i>
            ) :
                (
                    <i className="elma-icons md-15_featured task-mark-important">star</i>
                )
            }
        </span>
    )
}