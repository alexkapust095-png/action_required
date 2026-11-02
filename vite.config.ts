import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { inlineCss } from './vite.inlineCssPlugin'
import { singleFileWidget } from './vite.singleFileWidgetPlugin'

export default defineConfig({
  // Явно задаём NODE_ENV для определения окружения сборки: в некоторых CI
  // (например, GitHub Actions) NODE_ENV не выставлен, и Vite собрал бы
  // development-версию React с обращениями к process.env прямо в браузере.
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  plugins: [react(), inlineCss(), singleFileWidget()],
  build: {
    lib: {
      entry: './src/main.tsx',
      name: 'ActionRequired',
      // Формат выхода задаёт плагин singleFileWidget (iife): чистый IIFE
      // безопаснее для вставки в чужие страницы (elma365 Script-in-Script),
      // чем UMD с секциями module.exports/AMD.
      formats: ['umd'],
      fileName: () => 'my-widget.umd.js'
    },
    rollupOptions: {
      // React и ReactDOM БУНДЛЯТСЯ внутрь файла виджета (не external):
      // в elma365 нет глобальных window.React/window.ReactDOM, и при
      // external-сборке бандл обращался к ним напрямую →
      // «ReferenceError: React is not defined».
      // Инкапсуляция от стилей/скриптов хост-страницы обеспечивается
      // Shadow DOM в src/main.tsx.
    }
  }
})
