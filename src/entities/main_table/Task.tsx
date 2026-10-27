
import { TaskInfo } from '../../types/types'
import { Duedate } from './Duedate'
import { ImportantMark } from './ImportantMark'
import { Initiator } from './Initiator'
import { Participants } from './Participants'
import { Priority } from './Priority'
import { ReadedMark } from './ReadedMark'
import { TaskName } from './TaskName'

export function Task(props: {task: TaskInfo}) {
    let task = props.task
    return (
        <>
            <div className='task-item'>
                <ImportantMark important={task.important}/>
                <ReadedMark readed={task.readed} />
                <TaskName taskName={task.task.data.__name} />
                <Initiator createdBy={task.createdBy} />
                <Participants sender={task.sender} participants={task.participants} />
                <Priority priority={task.task.data.priority} />
                <Duedate date={task.task.data.dueDate} />
            </div>
        </>
    )
}