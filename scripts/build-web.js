#!/usr/bin/env node
/**
 * Builds the app that ships to the phone: www/ -> www-dist/.
 *
 * www/index.html stays the file you edit. Its React code is written in JSX, which a phone can't
 * run directly, so until now the app downloaded Babel and converted ~740 KB of code on every launch
 * (about 4-5 seconds on an average Android phone, all of it with the splash on screen). This does
 * that conversion once, here, with the exact same Babel version and settings, and ships the result
 * as www-dist/app.js.
 *
 * Runs automatically before `npx cap copy` and `npx cap sync` (the "capacitor:copy:before" script in
 * package.json), so the usual commands keep working. To run it on its own: npm run build:web
 */
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');

const root = path.join(__dirname, '..');
const src = path.join(root, 'www');
const out = path.join(root, 'www-dist');
// Not part of the app.
const SKIP = new Set(['.DS_Store', 'Clone Astra Flash Orchestrator']);

const BABEL_TAG = '<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>';
const JSX_OPEN = '<script type="text/babel">';

function fail(msg) {
  console.error('build-web: ' + msg);
  process.exit(1);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const name of fs.readdirSync(from)) {
    if (SKIP.has(name)) continue;
    const a = path.join(from, name);
    const b = path.join(to, name);
    if (fs.statSync(a).isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

const html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');

if (html.split(BABEL_TAG).length !== 2) fail('expected exactly one Babel <script> tag in www/index.html');
if (html.split(JSX_OPEN).length !== 2) fail('expected exactly one <script type="text/babel"> in www/index.html');
const start = html.indexOf(JSX_OPEN);
const end = html.indexOf('</script>', start);
const jsx = html.slice(start + JSX_OPEN.length, end);

// The same presets and plugins Babel uses for a <script type="text/babel"> in the browser,
// so the app behaves exactly as before.
let code;
try {
  code = Babel.transform(jsx, {
    filename: 'app.jsx',
    presets: ['react', 'env'],
    plugins: ['transform-class-properties', 'transform-object-rest-spread', 'transform-flow-strip-types'],
    compact: true,
  }).code;
} catch (e) {
  fail('the app code in www/index.html has an error:\n' + e.message);
}

fs.rmSync(out, { recursive: true, force: true });
copyDir(src, out);

// The app code is the last script on the page, so a plain <script> there runs at the same point,
// after everything above it has loaded.
const built = html.slice(0, start) + '<script src="app.js"></script>' + html.slice(end + '</script>'.length);
fs.writeFileSync(path.join(out, 'index.html'), built.replace(BABEL_TAG + '\n', '').replace(BABEL_TAG, ''));
fs.writeFileSync(path.join(out, 'app.js'), code);

console.log('build-web: www-dist ready (app.js ' + Math.round(code.length / 1024) + ' KB, no Babel on the phone)');
