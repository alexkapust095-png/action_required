import { useCallback, useMemo, useState } from 'react'
import './App.css'
import { testTaskInfoArray } from './types/testData'
import { TaskInfo, WidgetParams } from './types/types'
import { WidgetParamsContext } from './context/widgetParams'
import { TaskTableContainer } from './entities/main_table/TaskTableContainer'
import { SearchBar } from './entities/search/SearchBar'
import { applySearch, EMPTY_FILTERS, isFiltersEmpty } from './entities/search/filterLogic'
import { SearchFilters } from './entities/search/types'
import { SignModal } from './features/signing/SignModal'

/** Тип действия задачи (itemStatus.data.action_type.code) */
function actionTypeCode(task: TaskInfo): string | undefined {
    return task.itemStatus?.data?.action_type?.code
}

function App(props: { params?: WidgetParams }) {
  const params = props.params ?? {}
  // Список задач живёт в состоянии App: стартовый массив приходит из initWidget
  // (или тестовые данные в dev-режиме), дальше обновляется функцией update.
  const [tasks, setTasks] = useState<TaskInfo[]>(params.tasks ?? testTaskInfoArray)
  // Состояние выбора живёт в корне приложения: храним только ID выбранных задач
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  // Применённые фильтры поиска (строка + модалка фильтров)
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  // Ключ для пересоздания SearchBar при сбросе фильтров из панели действий
  const [resetKey, setResetKey] = useState(0)
  // Модальное окно подписания выбранного
  const [signModalOpen, setSignModalOpen] = useState(false)

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

  // П.2: функция обновления — кнопка «Обновить». Вызываем переданную из elma365
  // функцию update; если она вернула массив задач — обновляем состояние,
  // иначе список останется таким, каким его обновила внешняя сторона.
  const handleUpdate = useCallback(async () => {
    if (!params.update) return
    try {
      const result = await (params.update as () => unknown)()
      if (Array.isArray(result)) {
        setTasks(result as TaskInfo[])
      }
    } catch (error) {
      console.error('[action-required] Ошибка обновления задач:', error)
    }
  }, [params])

  // П.3: клик по звезде — сначала вызываем setImportant(id), затем инвертируем
  // локальное состояние important (звезда: красная при important === true,
  // иначе пустая с чёрным контуром).
  const handleToggleImportant = useCallback((taskId: string) => {
    params.setImportant?.(taskId)
    setTasks(prev => prev.map(task =>
      task.task.id === taskId ? { ...task, important: !task.important } : task,
    ))
  }, [params])

  // П.4: клик по лампе — сначала вызываем setReaded(id), затем инвертируем
  // локальное состояние readed (лампа: жёлтая при readed === true, иначе серая).
  const handleToggleReaded = useCallback((taskId: string) => {
    params.setReaded?.(taskId)
    setTasks(prev => prev.map(task =>
      task.task.id === taskId ? { ...task, readed: !task.readed } : task,
    ))
  }, [params])

  // Список задач с учётом строки поиска и фильтров из модалки
  const filteredTasks = useMemo(() => applySearch(tasks, filters), [tasks, filters])

  // Готовый доступ ко всем выбранным задачам прямо из App
  const selectedTasks = useMemo(
    () => filteredTasks.filter(task => selectedTaskIds.has(task.task.id)),
    [filteredTasks, selectedTaskIds],
  )

  // Условие показа кнопки «Подписать выбранные»: выбрано больше 0 элементов
  // и у всех выбранных тип действия -> code === 'signing'
  const canSignSelected = useMemo(
    () => selectedTasks.length > 0 && selectedTasks.every(task => actionTypeCode(task) === 'signing'),
    [selectedTasks],
  )

  const closeSignModal = useCallback(() => setSignModalOpen(false), [])

  return (
    <WidgetParamsContext.Provider value={params}>
      <SearchBar key={`search-${resetKey}`} tasks={tasks} onSearch={handleSearch} />
      <TaskTableContainer
        tasks={filteredTasks}
        selectedIds={selectedTaskIds}
        onSelectChange={handleSelectChange}
        onClearSelection={handleClearSelection}
        onResetFilters={handleResetFilters}
        onUpdate={handleUpdate}
        onToggleImportant={handleToggleImportant}
        onToggleReaded={handleToggleReaded}
        canSignSelected={canSignSelected}
        onSignSelected={() => setSignModalOpen(true)}
      />
      <p>Выбрано: {selectedTasks.length}</p>
      {signModalOpen && params.loadCertificates && params.signDocuments && (
        <SignModal
          tasks={selectedTasks}
          loadCertificates={params.loadCertificates}
          signDocuments={params.signDocuments}
          onClose={closeSignModal}
          onSigned={handleUpdate}
        />
      )}
    </WidgetParamsContext.Provider>
  )
}

export default App
