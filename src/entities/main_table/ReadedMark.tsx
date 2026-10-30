
export function ReadedMark(props: {readed: boolean}) {
    return (
        <>
            <div>
                <i className={`elma-icons md-18 task-mark-readed ${ props.readed == false ? 'task-mark-unread' : 'task-mark-read'}`}>lightbulb_on</i>
            </div>
        </>
    )
}