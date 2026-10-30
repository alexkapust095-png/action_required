import './Task.css'

import { TaskInfo } from '../../types/types'
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
}) {
    let task = props.task
    // Строка списка: все ячейки — прямые дети grid-контейнера,
    // поэтому колонки шапки и строк совпадают.
    // Признаки «Важно» и «Прочитано» — одна колонка Marks под заголовком «*».
    return (
        <div className='task-item task-table-row'>
            <input
                className='task-checkbox'
                type='checkbox'
                checked={props.selected}
                onChange={e => props.onSelectChange(task.task.id, e.target.checked)}
                aria-label='Выбрать задачу'
            />
            <Marks important={task.important} readed={task.readed} />
            <TaskName taskName={task.task.data.__name} />
            <CreatedAt date={task.task.data.__createdAt} />
            <Initiator createdBy={task.createdBy} />
            <Participants sender={task.sender} participants={task.participants} />
            <Priority priority={task.task.data.priority} />
            <Duedate date={task.task.data.dueDate} />
        </div>
    )
}