import './ImportantMark.css'

/**
 * Признак «Важно» — первый слот колонки «Метки» (см. Marks.tsx):
 * стоит ровно под заголовком «*” и слева от признака «Прочитано».
 * Клик по звезде сначала вызывает setImportant(id) (функция из elma365),
 * после чего состояние important инвертируется родителем:
 * - important === true  → залитая красная звезда;
 * - important === false → пустая звезда с чёрным контуром.
 */
export function ImportantMark(props: { important: boolean, onToggle?: () => void }) {
    return (
        <span className="task-mark-important-slot">
            {props.important === true ? (
                <button
                    type="button"
                    className="task-mark-button"
                    title="Сделать неважной"
                    aria-label="Сделать неважной"
                    onClick={props.onToggle}
                >
                    <i className="elma-icons grey-icons md-18 task-mark-important task-mark-important-active"> star_filled </i>
                </button>
            ) :
                (
                    <button
                        type="button"
                        className="task-mark-button"
                        title="Сделать важной"
                        aria-label="Сделать важной"
                        onClick={props.onToggle}
                    >
                        <i className="elma-icons md-15_featured task-mark-important">star</i>
                    </button>
                )
            }
        </span>
    )
}
