import './Task.css'

import { MouseEvent } from 'react'
import { TaskInfo } from '../../types/types'
import { useWidgetParams } from '../../context/widgetParams'
import { CreatedAt } from './CreatedAt'
import { Duedate } from './Duedate'
import { Initiator } from './Initiator'
import { Marks } from './Marks'
import { Participants } from './Participants'
import { Priority } from './Priority'
import { TaskName } from './TaskName'

export function Task(props: {
    task: TaskInfo,
    selected: boolean,
    onSelectChange: (taskId: string, selected: boolean) => void,
    /** Переключение «Важно»: сначала setImportant(id), затем инверсия состояния */
    onToggleImportant?: () => void,
    /** Переключение «Прочитано»: сначала setReaded(id), затем инверсия состояния */
    onToggleReaded?: () => void,
}) {
    let task = props.task
    // Базовый URL портала приходит из initWidget (WidgetParams.url).
    const { url } = useWidgetParams()
    // Клик по любому месту строки открывает задачу: url + p/task/<id задачи>.
    // Ссылка формируется только если url передан — без него клик ничего не делает.
    const taskLink = url ? `${url}(p/task/${task.task.id})` : undefined
    const handleRowClick = () => {
        if (!taskLink) return
        // Открываем задачу без перезагрузки страницы: elma365 — SPA, поэтому
        // переход делаем через pushState (url менялся бы только в адресной
        // строке). Если по какой-то причине pushState недоступен —
        // открываем задачу в новой вкладке, но текущую страницу НЕ
        // перезагружаем.
        try {
            history.pushState({ taskId: task.task.id }, '', taskLink)
            // Сообщаем порталу о смене адреса — так SPA-роутер elma365
            // подхватит переход и отрисует карточку задачи.
            window.dispatchEvent(new PopStateEvent('popstate', { state: { taskId: task.task.id } }))
        } catch {
            window.open(taskLink, '_blank', 'noopener')
        }
    }
    // «Выбор», «Прочитано» и «Важно» — как бы поверх строки: клики по этим
    // элементам не должны открывать задачу. Останавливаем всплытие события
    // на ячейках-обёртках, не трогая сами чекбокс/кнопки (их onChange/onClick
    // продолжают работать штатно).
    const stopRowClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation()
    // Строка списка: все ячейки — прямые дети grid-контейнера,
    // поэтому колонки шапки и строк совпадают.
    // Признаки «Важно» и «Прочитано» — одна колонка Marks под заголовком «*».
    return (
        <div
            className='task-item task-table-row'
            onClick={handleRowClick}
            role='link'
            tabIndex={0}
            title={taskLink ? 'Открыть задачу' : undefined}
            onKeyDown={e => {
                // Доступность: Enter/Пробел открывают задачу с клавиатуры
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleRowClick()
                }
            }}
        >
            <div className='task-table-cell checkbox' onClick={stopRowClick}>
                <input
                    className='task-checkbox'
                    type='checkbox'
                    checked={props.selected}
                    onChange={e => props.onSelectChange(task.task.id, e.target.checked)}
                    aria-label='Выбрать задачу'
                />
            </div>
            <Marks
                important={task.important}
                readed={task.readed}
                onToggleImportant={props.onToggleImportant}
                onToggleReaded={props.onToggleReaded}
                onStopRowClick={stopRowClick}
            />
            <TaskName taskName={task.task.data.__name} />
            <CreatedAt date={task.task.data.__createdAt} />
            <Initiator createdBy={task.createdBy} />
            <Participants sender={task.sender} participants={task.participants} />
            <Priority priority={task.task.data.priority} />
            <Duedate date={task.task.data.dueDate} />
        </div>
    )
}
