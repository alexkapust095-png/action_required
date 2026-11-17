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

      // Инжектируем стили в начало каждого JS-чанка.
      // CSS сериализуется как обычная JS-строка с полным экранированием:
      // «<» -> \x3C, «>» -> \x3E, кавычки/слеши/переводы строк тоже
      // экранируются, поэтому внутри бандла НЕТ никакой HTML-разметки
      // (ни <!doctype>, ни </style>) — файл остаётся чистым JavaScript
      // и не может сломать парсер при inline-вставке в elma365.
      const cssLiteral = JSON.stringify(css)
        .replace(/</g, '\\x3C')
        .replace(/>/g, '\\x3E')

      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type !== 'chunk' || !fileName.endsWith('.js')) continue
        // Вставка стилей отложена до DOMContentLoaded: скрипт виджета
        // может подключаться синхронно в <head> (elma365), когда
        // document.head ещё не существует.
        const injected =
          `(function(){var ins=function(){try{` +
          `if(typeof document==="undefined"||!document.head)return;` +
          `var d=document.querySelector("[data-widget=action-required]");` +
          `if(d)return;` +
          `var s=document.createElement("style");` +
          `s.setAttribute("data-widget","action-required");` +
          `s.appendChild(document.createTextNode(${cssLiteral}));` +
          `document.head.appendChild(s);}catch(e){}};` +
          `if(typeof document!=="undefined"&&document.readyState==="loading")` +
          `{document.addEventListener("DOMContentLoaded",ins)}else{ins()}})();\n`
        item.code = injected + item.code
      }
    },
  }
}
