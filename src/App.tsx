import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { testTaskInfoArray } from './types/testData'
import { TaskTableContainer } from './entities/main_table/TaskTableContainer'
import { SearchBar } from './entities/search/SearchBar'
import { applySearch, EMPTY_FILTERS } from './entities/search/filterLogic'
import { SearchFilters } from './entities/search/types'

function App() {
  // Состояние выбора живёт в корне приложения: храним только ID выбранных задач
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  // Применённые фильтры поиска (строка + модалка фильтров)
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)

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

  // Список задач с учётом строки поиска и фильтров из модалки
  const filteredTasks = useMemo(() => applySearch(testTaskInfoArray, filters), [filters])

  // Готовый доступ ко всем выбранным задачам прямо из App
  const selectedTasks = useMemo(
    () => filteredTasks.filter(task => selectedTaskIds.has(task.task.id)),
    [filteredTasks, selectedTaskIds],
  )

  return (
    <>
      <SearchBar tasks={testTaskInfoArray} onSearch={setFilters} />
      <TaskTableContainer
        tasks={filteredTasks}
        selectedIds={selectedTaskIds}
        onSelectChange={handleSelectChange}
      />
      <p>Выбрано: {selectedTasks.length}</p>
    </>
  )
}

export default App
