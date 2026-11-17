const fs = require('fs');
const code = fs.readFileSync('dist/my-widget.umd.js', 'utf8');

console.log('first char:', JSON.stringify(code[0]));
try { new Function(code); console.log('JS parse: OK'); } catch (e) { console.log('JS parse FAIL:', e.message); }

// Извлекаем инжектированный CSS из преамбулы бандла
const m = code.match(/createTextNode\(("(?:[^"\\]|\\.)*")\)/);
if (!m) { console.log('CSS literal NOT FOUND'); process.exit(1); }
const css = eval(m[1]); // расэкранируем JS-строку
console.log('css length:', css.length);
console.log('css contains .task-widget:', css.includes('.task-widget'));
console.log('css contains search-modal:', css.includes('search-modal'));

// Эмуляция DOM: проверяем, что style инжектируется корректно
const injected = [];
global.document = {
  querySelector: () => null,
  createElement: (t) => ({ tag: t, setAttribute() {}, appendChild(n) { this.text = n; } }),
  createTextNode: (s) => ({ text: s }),
  head: { appendChild: (el) => injected.push(el) },
  currentScript: null,
};
global.window = { addEventListener() {}, removeEventListener() {} };
global.React = {}; global.ReactDOM = {};
try { new Function(code)(); } catch (e) { /* рендер упадёт без полного DOM — ок */ }
const styleEl = injected.find(x => x.tag === 'style');
console.log('style injected:', !!styleEl, 'injected css length:', styleEl ? String(styleEl.text).length : 0);
