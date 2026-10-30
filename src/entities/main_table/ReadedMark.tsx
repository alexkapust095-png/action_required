import './ReadedMark.css'

export function ReadedMark(props: {readed: boolean}) {
    // Признак «Прочитано» — второй слот колонки «Метки» (см. Marks.tsx):
    // в той же ячейке под одним заголовком «*”, на одной границе с «Важно».
    return (
        <span className={`task-mark-readed ${ props.readed == false ? 'task-mark-unread' : 'task-mark-read'}`}>lightbulb_on</span>
    )
}