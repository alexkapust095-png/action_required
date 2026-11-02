import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { testTaskInfoArray } from './types/testData'
import { TaskTableContainer } from './entities/main_table/TaskTableContainer'
import { SearchBar } from './entities/search/SearchBar'
import { applySearch, EMPTY_FILTERS, isFiltersEmpty } from './entities/search/filterLogic'
import { SearchFilters } from './entities/search/types'

function App() {
  // Состояние выбора живёт в корне приложения: храним только ID выбранных задач
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  // Применённые фильтры поиска (строка + модалка фильтров)
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  // Ключ для пересоздания SearchBar при сбросе фильтров из панели действий
  const [resetKey, setResetKey] = useState(0)

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

  // Применение фильтров: при полном сбросе возвращаем исходный список
  // и очищаем выбор в первой колонке списка задач
  const handleSearch = useCallback((next: SearchFilters) => {
    setFilters(next)
    if (isFiltersEmpty(next)) {
      setSelectedTaskIds(new Set())
    }
  }, [])

  // Сброс выбора в первой колонке (кнопка «Очистить выбор» в панели действий)
  const handleClearSelection = useCallback(() => {
    setSelectedTaskIds(new Set())
  }, [])

  // Сброс фильтров из панели действий (кнопка «Сбросить фильтры» рядом с «Обновить»):
  // возвращаем исходный список задач и очищаем выбор в первой колонке.
  // Ключ сброса пересоздаёт SearchBar — его внутреннее состояние (строка поиска,
  // применённые фильтры) тоже возвращается к исходному.
  const handleResetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setSelectedTaskIds(new Set())
    setResetKey(prev => prev + 1)
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
      <SearchBar key={`search-${resetKey}`} tasks={testTaskInfoArray} onSearch={handleSearch} />
      <TaskTableContainer
        tasks={filteredTasks}
        selectedIds={selectedTaskIds}
        onSelectChange={handleSelectChange}
        onClearSelection={handleClearSelection}
        onResetFilters={handleResetFilters}
      />
      <p>Выбрано: {selectedTasks.length}</p>
    </>
  )
}

export default App
