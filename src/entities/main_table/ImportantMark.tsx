import './ImportantMark.css'

export function ImportantMark(props: { important: boolean }) {
    return (
        <div className="task-table-cell important">
            {props.important === true ? (
                <i className="elma-icons grey-icons md-18 task-mark-important"> star_filled </i>
            ) :
                (
                    <i className="elma-icons md-15_featured">star</i>
                )
            }
        </div>
    )
}