import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { WidgetParams } from './types/types'

// Точка монтирования виджета.
// В elma365 обычно нет элемента с id="root", поэтому ищем его, а если не
// нашли — создаём собственную контейнер-ноду в конце <body>. Благодаря этому
// сборка работает и как приложение (dev), и как автономный виджет (prod).
function getMountNode(): HTMLElement {
  const existing = document.getElementById('root')
  if (existing) return existing
  const node = document.createElement('div')
  node.id = 'root'
  node.className = 'task-widget'
  document.body.appendChild(node)
  return node
}

function mount(params: WidgetParams) {
  // Защита от двойного монтирования (повторная вставка скрипта на странице)
  const host = getMountNode()
  if (host.dataset.widgetMounted === '1') return
  host.dataset.widgetMounted = '1'
  createRoot(host).render(
    <StrictMode>
      <App params={params} />
    </StrictMode>,
  )
}

/**
 * Инициализация виджета из elma365. Принимает параметры:
 * 0) url — базовый URL портала (строка), используется для открытия задачи по клику;
 * 1) tasks — список задач (массив аналогично testData.ts);
 * 2) update — функция обновления, привязана к кнопке «Обновить»;
 * 3) setImportant(taskId) — пометка важной/неважной (клик по звезде);
 * 4) setReaded(taskId) — пометка прочитанной/непрочитанной (клик по лампе);
 * 5) signDocuments(taskIds[]) — подписание нескольких документов;
 * 6) loadCertificates() — загрузка доступных сертификатов (CertificateData[]).
 */
export function initWidget(params: WidgetParams = {}) {
  mount(params)
}
