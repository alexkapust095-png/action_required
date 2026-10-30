import './ReadedMark.css'

export function ReadedMark(props: {readed: boolean}) {
    // Признак «Прочитано» — второй слот колонки «Метки» (см. Marks.tsx):
    // вторая внутренняя колонка той же сетки, что и у заголовка «*”.
    return (
        <span className="task-mark-readed-slot">
            <span className={`task-mark-readed ${ props.readed == false ? 'task-mark-unread' : 'task-mark-read'}`}>lightbulb_on</span>
        </span>
    )
}