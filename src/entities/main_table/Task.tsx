import './Task.css'

import { AnchorHTMLAttributes, MouseEvent, useEffect, useRef, useState } from 'react'
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
    //
    // Визуальное состояние галочки — локальный стейт `checked`, который:
    // 1) ставится СИНХРОННО в обработчике клика (input.checked = true/false),
    //    поэтому галочка появляется мгновенно, не дожидаясь перерисовки;
    // 2) синхронизируется с пропсом `selected` в useEffect — когда родитель
    //    (App) обновит selectedTaskIds, состояние гарантированно совпадёт
    //    с реальным списком выбранных (в т.ч. при «Очистить выбор», сбросе
    //    фильтров и т.п.).
    // Раньше чекбокс был полностью управляемым (checked={props.selected}),
    // и на elma365-странице обновление родителя не всегда приводило к
    // перерисовке строки — галочка «догоняла» только со следующим выбором.
    const inputRef = useRef<HTMLInputElement>(null)
    const [checked, setChecked] = useState(props.selected)
    useEffect(() => { setChecked(props.selected) }, [props.selected])
    // Смена состояния (клик мышью/пробелом или программный .click()) приходит
    // через onChange — единственный надёжный способ поймать и нативный toggle,
    // и изменение DOM-свойства из кода. preventDefault здесь НЕ вызываем:
    // навигацию по <a> гасит onClick на обёртке ячейки (см. ниже).
    const syncFromDom = () => {
        const next = inputRef.current?.checked ?? !checked
        if (next !== checked) {
            setChecked(next)
            props.onSelectChange(task.task.id, next)
        }
    }
    // Обёртка ячейки: гасит ТОЛЬКО переход по <a>. stopPropagation тут ставить
    // нельзя — React слушает события на корне виджета и иначе не получил бы ни
    // click, ни change чекбокса.
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
                    ref={inputRef}
                    className='task-checkbox'
                    type='checkbox'
                    checked={checked}
                    onChange={syncFromDom}
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
