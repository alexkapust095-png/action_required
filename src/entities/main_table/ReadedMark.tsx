import './ReadedMark.css'

export function ReadedMark(props: {readed: boolean}) {
    return (
        <div className="task-table-cell readed">
            <i className={`elma-icons md-18 task-mark-readed ${ props.readed == false ? 'task-mark-unread' : 'task-mark-read'}`}>lightbulb_on</i>
        </div>
    )
}