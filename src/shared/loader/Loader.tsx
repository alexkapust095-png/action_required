import './Loader.css'

/**
 * Общий лоадер (колесо загрузки) по образцу old_styles/loader.css.
 * Используется как оверлей поверх области задач при загрузке списка
 * (нажатие кнопки «Обновить», обновление после подписания).
 */
export function Loader(props: { label?: string }) {
    return (
        <div className="tasks-loader-overlay" role="status" aria-live="polite">
            <div className="tasks-loader-spinner" aria-hidden="true" />
            {props.label && <span className="tasks-loader-label">{props.label}</span>}
        </div>
    )
}
