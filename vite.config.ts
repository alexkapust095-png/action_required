import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { inlineCss } from './vite.inlineCssPlugin'

export default defineConfig({
  plugins: [react(), inlineCss()],
  build: {
    lib: {
      entry: './src/main.tsx',
      name: 'ActionRequired',
      formats: ['umd'],
      fileName: (format) => `my-widget.${format}.js`
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