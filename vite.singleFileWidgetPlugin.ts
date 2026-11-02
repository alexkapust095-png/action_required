import type { Plugin } from 'vite'

/**
 * Единый файл виджета + защита от «Unexpected token '<'» при подключении в elma365.
 *
 * Причина ошибки: сервер по URL скрипта отдаёт HTML (страница 404, index.html
 * вместо файла или редирект на авторизацию) вместо JavaScript. Браузер пытается
 * распарсить `<!doctype html>` как код и падает ЕЩЁ ДО выполнения скрипта —
 * изнутри бандла это не лечится, лечится только способом подключения/размещения
 * файла.
 *
 * Что делает плагин при сборке:
 *  1. Оборачивает весь бандл в try/catch с понятным логом — любая ошибка
 *     инициализации видна в консоли как сообщение с префиксом.
 *  2. Инжектирует self-test: запоминает URL, по которому загрузился скрипт
 *     (document.currentScript), и ставит ловушку на window.error. Если браузер
 *     получил HTML по этому URL, печатается ДИАГНОЗ с причиной и инструкцией,
 *     а не голая SyntaxError.
 *
 * ВАЖНО: плагин работает в хуке generateBundle (после формирования кода),
 * поэтому его нужно объявлять ПОСЛЕДНИМ в массиве plugins.
 */
export function singleFileWidget(): Plugin {
  return {
    name: 'single-file-widget',
    apply: 'build',
    enforce: 'post',

    generateBundle(_options, bundle) {
      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type !== 'chunk' || !fileName.endsWith('.js')) continue

        const banner =
          ';(function(){\n' +
          'try{\n' +
          'var s=document.currentScript;\n' +
          'if(s&&s.src){\n' +
          'var onError=function(ev){\n' +
          'if(ev&&ev.filename===s.src&&/Unexpected token/i.test(String(ev.message))){\n' +
          'console.error("[action-required] По адресу "+s.src+" сервер вернул HTML вместо JavaScript (страница 404 или редирект на авторизацию). Синтаксическая ошибка вызвана НЕ кодом виджета, а неверной ссылкой. Решение: опубликуйте my-widget.umd.js как статический файл, доступный по прямой ссылке (файловое хранилище/CDN, content-type application/javascript), и укажите этот URL в настройке виджета.");\n' +
          '}\n' +
          '};\n' +
          'window.addEventListener("error",onError);\n' +
          'setTimeout(function(){window.removeEventListener("error",onError)},5000);\n' +
          '}\n' +
          '}catch(e){}\n' +
          '})();\n'

        item.code =
          ';(function(){\n' +
          'try{\n' +
          banner +
          item.code +
          '\n}catch(e){\n' +
          'console.error("[action-required] Ошибка инициализации виджета:",e);\n' +
          'throw e;\n' +
          '}\n' +
          '})();\n'
      }
    },
  }
}
