import './ReadedMark.css'

/**
 * Признак «Прочитано» — второй слот колонки «Метки» (см. Marks.tsx):
 * вторая внутренняя колонка той же сетки, что и у заголовка «*”.
 * Клик по лампе вызывает setReaded(id) или setUnreaded(id) (функции из elma365),
 * после чего состояние readed инвертируется родителем:
 * - readed === true  → жёлтая лампа;
 * - readed === false → серая лампа.
 */
export function ReadedMark(props: { readed: boolean, onToggle?: () => void }) {
    return (
        <span className="task-mark-readed-slot">
            <button
                type="button"
                className="task-mark-button"
                title={props.readed ? 'Отметить непрочитанной' : 'Отметить прочитанной'}
                aria-label={props.readed ? 'Отметить непрочитанной' : 'Отметить прочитанной'}
                onClick={props.onToggle}
            >
                <i className={`elma-icons md-15_featured task-mark-readed ${ props.readed == false ? 'task-mark-unread' : 'task-mark-read'}`}>lightbulb_on</i>
            </button>
        </span>
    )
}
