import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

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
  createRoot(host).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Скрипт может подключаться синхронно в <head>, когда document.body ещё
// не существует — в этом случае ждём DOMContentLoaded.
if (document.body) {
  mount()
} else {
  document.addEventListener('DOMContentLoaded', mount)
}
