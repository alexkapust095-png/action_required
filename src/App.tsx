import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { testTaskInfoArray } from './types/testData'
import { TaskTableContainer } from './entities/main_table/TaskTableContainer'

function App() {
  // Состояние выбора живёт в корне приложения: храним только ID выбранных задач
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())

  const handleSelectChange = useCallback((taskId: string, selected: boolean) => {
    setSelectedTaskIds(prev => {
      const next = new Set(prev)
      if (selected) {
        next.add(taskId)
      } else {
        next.delete(taskId)
      }
      return next
    })
  }, [])

  // Готовый доступ ко всем выбранным задачам прямо из App
  const selectedTasks = useMemo(
    () => testTaskInfoArray.filter(task => selectedTaskIds.has(task.task.id)),
    [selectedTaskIds],
  )

  console.log('Выбранные задачи:', selectedTasks)

  return (
    <>
      <TaskTableContainer
        tasks={testTaskInfoArray}
        selectedIds={selectedTaskIds}
        onSelectChange={handleSelectChange}
      />
      <p>Выбрано задач: {selectedTasks.length}</p>
    </>
  )
}

export default App
