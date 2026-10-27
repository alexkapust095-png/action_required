

export function TaskName(props: {taskName: string}) {
    return (
        <>
            <div>
                <b>
                    <span className="task-title-span">
                        `${props.taskName}`
                    </span>
                </b>
            </div>
        </>
    )
}