import type { Plugin } from 'vite'

/**
 * Плагин для сборки UMD-виджета: вместо отдельного файла dist/*.css
 * все стили, импортируемые из компонентов (import './Some.css'),
 * инлайнятся прямо в JS-бандл. При загрузке скрипта виджета стили
 * вставляются в <head> одним тегом <style data-widget="action-required">.
 *
 * Работает только при `vite build`; dev-сервер не затрагивается.
 */
export function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',

    config() {
      return {
        build: {
          // Весь CSS собирается в один чанк, который мы перехватим
          cssCodeSplit: false,
        },
      }
    },

    generateBundle(_options, bundle) {
      // Собираем весь CSS из .css-ассетов и удаляем их из выхода
      const parts: string[] = []
      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type === 'asset' && fileName.endsWith('.css')) {
          parts.push(
            typeof item.source === 'string'
              ? item.source
              : Buffer.from(item.source).toString('utf-8'),
          )
          delete bundle[fileName]
        }
      }
      const css = parts.join('\n')
      if (!css) return

      // Инжектируем стили в начало каждого JS-чанка
      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type !== 'chunk' || !fileName.endsWith('.js')) continue
        const injected =
          `(function(){if(typeof document==="undefined")return;` +
          `var d=document.querySelector('[data-widget="action-required"]');` +
          `if(d)return;` +
          `var s=document.createElement("style");` +
          `s.setAttribute("data-widget","action-required");` +
          `s.appendChild(document.createTextNode(${JSON.stringify(css)}));` +
          `document.head.appendChild(s);})();\n`
        item.code = injected + item.code
      }
    },
  }
}
