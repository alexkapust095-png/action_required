import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { inlineCss } from './vite.inlineCssPlugin'
import { singleFileWidget } from './vite.singleFileWidgetPlugin'

export default defineConfig({
  plugins: [react(), inlineCss(), singleFileWidget()],
  build: {
    lib: {
      entry: './src/main.tsx',
      name: 'ActionRequired',
      // Формат выхода задаёт плагин singleFileWidget (iife): чистый IIFE
      // безопаснее для вставки в чужие страницы (elma365 Script-in-Script),
      // чем UMD с секциями module.exports/AMD.
      formats: ['iife'],
      fileName: () => 'my-widget.umd.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
