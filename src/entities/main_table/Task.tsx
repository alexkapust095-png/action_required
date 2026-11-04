import './Task.css'

import { AnchorHTMLAttributes, MouseEvent } from 'react'
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
    /** Переключение «Важно»: setImportant/clearImportant(id) по состоянию, затем инверсия */
    onToggleImportant?: () => void,
    /** Переключение «Прочитано»: setReaded/setUnreaded(id) по состоянию, затем инверсия */
    onToggleReaded?: () => void,
}) {
    let task = props.task
    // Базовый URL портала приходит из initWidget (WidgetParams.url).
    const { url } = useWidgetParams()
    // Клик по любому месту строки открывает задачу: url + p/task/<id задачи>.
    // Ссылка формируется только если url передан — без него клик ничего не делает.
    const taskLink = url ? `${url}(p:task/${task.task.id})` : undefined
    // Строка — обычная ссылка <a href="...">. Клик по ней обрабатывает
    // роутер портала elma365: страница НЕ перезагружается, открывается
    // карточка задачи. stopPropagation на чекбоксе/метках защищает их
    // от «клика по ссылке».
    const rowProps: AnchorHTMLAttributes<HTMLAnchorElement> = taskLink
        ? { href: taskLink }
        : {}
    // «Прочитано» и «Важно» — как бы поверх строки: клики по этим элементам
    // не должны открывать задачу. preventDefault отменяет навигацию по <a>,
    // stopPropagation гасит всплытие (сами кнопки onClick работают штатно).
    const stopRowClick = (e: MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); e.stopPropagation() }
    // Чекбокс: обёртка гасит клик так же, как метки (preventDefault + stopPropagation),
    // иначе браузер перейдёт по href строки-ссылки. Но preventDefault на событии
    // click отменяет и нативный toggle input'а — поэтому сам чекбокс сделан
    // неконтролируемым (defaultChecked) и переключается вручную в onChange
    // (см. div.task-table-cell.checkbox ниже). Выбор при этом живёт в состоянии
    // App (selectedTaskIds) как и раньше.
    const stopCheckboxClick = (e: MouseEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation() }
    // Строка списка: все ячейки — прямые дети grid-контейнера,
    // поэтому колонки шапки и строк совпадают.
    // Признаки «Важно» и «Прочитано» — одна колонка Marks под заголовком «*».
    return (
        <a
            className='task-item task-table-row'
            {...rowProps}
            title={taskLink ? 'Открыть задачу' : undefined}
        >
            <div className='task-table-cell checkbox' onClick={stopCheckboxClick}>
                <input
                    ref={el => { el && (el.checked = props.selected) }}
                    className='task-checkbox'
                    type='checkbox'
                    defaultChecked={props.selected}
                    onChange={e => {
                        // preventDefault на обёртке отменил нативный toggle,
                        // поэтому переключаем DOM-состояние вручную — галочка
                        // появляется сразу при клике. Выбор синхронно живёт
                        // в selectedTaskIds (App), ref выше держит его в порядке
                        // и при внешних сбросах выбора.
                        const checked = !e.target.checked
                        e.target.checked = checked
                        props.onSelectChange(task.task.id, checked)
                    }}
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
        </a>
    )
}
