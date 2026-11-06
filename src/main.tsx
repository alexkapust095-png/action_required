import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { WidgetParams } from './types/types'
import { setWidgetParams } from './shared/widgetParams'

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

function mount() {
  // Защита от двойного монтирования (повторная вставка скрипта на странице)
  const host = getMountNode()
  if (host.dataset.widgetMounted === '1') return
  host.dataset.widgetMounted = '1'
  // ВАЖНО: StrictMode НЕ используем. В dev-сборке React он намеренно вызывает
  // эффекты дважды; на странице elma365 это приводило к тому, что повторный
  // эффект синхронизации чекбоксов сбрасывал DOM-галочку обратно, и выбор
  // «догонял» визуал только со следующим кликом.
  createRoot(host).render(<App />)
}

/**
 * Инициализация виджета из elma365. Принимает параметры:
 * 0) url — базовый URL портала (строка), используется для открытия задачи по клику;
 * 1) tasks — список задач (массив аналогично testData.ts);
 * 2) update — функция обновления, привязана к кнопке «Обновить»;
 * 3) setImportant(taskId) — пометка важной (клик по звезде, important === false);
 *    clearImportant(taskId) — снятие важности (клик по звезде, important === true);
 * 4) setReaded(taskId) — пометка прочитанной (клик по лампе, readed === false);
 *    setUnreaded(taskId) — снятие прочитанности (клик по лампе, readed === true);
 * 5) signDocuments(taskIds[]) — подписание нескольких документов;
 * 6) loadCertificates() — загрузка доступных сертификатов (CertificateData[]).
 */
export function initWidget(params: WidgetParams = {}) {
  // Складываем все переданные параметры в общий объект (src/shared/widgetParams.ts),
  // дальше модули проекта получают их через getWidgetParams() — без пропсов и контекста.
  setWidgetParams(params)
  mount()
}
