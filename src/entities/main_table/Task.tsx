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
    // stopPropagation гасит всплытие (сами кнопки onClick работают штатно,
    // т.к. React слушает события на корне виджета).
    const stopRowClick = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation() }
    // Чекбокс: обёртка гасит ТОЛЬКО переход по <a> — preventDefault БЕЗ
    // stopPropagation. React 19 слушает события на корне виджета, а
    // stopPropagation прямо на DOM-узле обрывает всплытие до корня: из-за
    // этого синтетический onChange чекбокса не срабатывал вовсе, выбор не
    // записывался в selectedTaskIds (App) и визуально не менялся.
    // preventDefault отменяет браузерный toggle input'а, поэтому чекбокс
    // полностью управляемый (checked={selected}): галочку рисует React по
    // состоянию выбора после того, как onSelectChange обновит selectedTaskIds.
    const preventRowNavigation = (e: MouseEvent) => { e.preventDefault() }
    // Строка списка: все ячейки — прямые дети grid-контейнера,
    // поэтому колонки шапки и строк совпадают.
    // Признаки «Важно» и «Прочитано» — одна колонка Marks под заголовком «*».
    return (
        <a
            className='task-item task-table-row'
            {...rowProps}
            title={taskLink ? 'Открыть задачу' : undefined}
        >
            <div className='task-table-cell checkbox' onClick={preventRowNavigation}>
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
        </a>
    )
}
