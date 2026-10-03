/**
 * "Remember this moment": the data rules, read straight out of www/index.html.
 *
 *   node tests/moments.test.js
 *
 * Covers the platform-neutral schema both apps must share: one moment per area,
 * removing a moment, old days without moments, and the photo path convention.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const src = fs.readFileSync(path.join(__dirname, '..', 'www', 'index.html'), 'utf8');
function grab(name) {
  const start = src.indexOf('function ' + name + '(');
  assert.ok(start >= 0, 'missing ' + name);
  let depth = 0, i = src.indexOf('{', start);
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) break;
  }
  return src.slice(start, i + 1);
}
const NAMES = ['momentHasContent', 'normalizeMoments', 'momentFor', 'withMoment', 'momentPaths', 'newMomentPhotoId', 'shareStripLayout', 'logAreaItems'];
const sandbox = { MOMENT_NOTE_MAX: 280, SHARE_CONTENT_W: 312, SHARE_TILE_GAP: 8, Date, Math, String, Array };
vm.createContext(sandbox);
vm.runInContext(NAMES.map(grab).join('\n'), sandbox);
const M = sandbox;
const plain = (x) => JSON.parse(JSON.stringify(x));

let passed = 0;
function test(name, fn) { fn(); passed++; console.log('  ok  ' + name); }

const photo = { area: 'create', photoStoragePath: 'users/u1/moments/2026-10-02/create/pA.jpg', thumbStoragePath: 'users/u1/moments/2026-10-02/create/pA_thumb.jpg', note: null, createdAt: 1, updatedAt: 1 };
const words = { area: 'move', photoStoragePath: null, thumbStoragePath: null, note: 'Felt so good to move.', createdAt: 2, updatedAt: 2 };

test('old days without moments read as an empty list', () => {
  assert.deepStrictEqual(plain(M.normalizeMoments(undefined)), []);
  assert.deepStrictEqual(plain(M.normalizeMoments(null)), []);
  assert.deepStrictEqual(plain(M.normalizeMoments({ create: photo })), []);
});

test('a moment needs a photo or words', () => {
  assert.strictEqual(M.momentHasContent(photo), true);
  assert.strictEqual(M.momentHasContent(words), true);
  assert.strictEqual(M.momentHasContent({ area: 'create', note: '   ' }), false);
  assert.strictEqual(M.normalizeMoments([{ area: 'create', note: '' }]).length, 0);
});

test('one moment per area: the first one wins', () => {
  const list = M.normalizeMoments([photo, Object.assign({}, photo, { note: 'dup' }), words]);
  assert.strictEqual(list.length, 2);
  assert.strictEqual(M.momentFor(list, 'create').note, null);
});

test('replacing a moment keeps every other area', () => {
  const list = [photo, words];
  const next = M.withMoment(list, 'create', Object.assign({}, photo, { photoStoragePath: 'x/pB.jpg', thumbStoragePath: 'x/pB_thumb.jpg' }));
  assert.strictEqual(next.length, 2);
  assert.strictEqual(M.momentFor(next, 'create').photoStoragePath, 'x/pB.jpg');
  assert.strictEqual(M.momentFor(next, 'move').note, words.note);
});

test('removing the photo keeps the words; removing both removes the moment', () => {
  const both = Object.assign({}, photo, { note: 'Felt so good to paint again.' });
  let list = M.withMoment([], 'create', both);
  list = M.withMoment(list, 'create', Object.assign({}, both, { photoStoragePath: null, thumbStoragePath: null }));
  assert.strictEqual(M.momentFor(list, 'create').note, 'Felt so good to paint again.');
  list = M.withMoment(list, 'create', Object.assign({}, M.momentFor(list, 'create'), { note: null }));
  assert.strictEqual(M.momentFor(list, 'create'), null);
  assert.strictEqual(list.length, 0);
});

test('a preview path is dropped when there is no photo', () => {
  const m = M.normalizeMoments([{ area: 'learn', photoStoragePath: null, thumbStoragePath: 'stale.jpg', note: 'hi' }])[0];
  assert.strictEqual(m.thumbStoragePath, null);
  assert.deepStrictEqual(plain(M.momentPaths(m)), []);
  assert.deepStrictEqual(plain(M.momentPaths(photo)), [photo.photoStoragePath, photo.thumbStoragePath]);
});

test('words are capped at 280 characters', () => {
  const m = M.normalizeMoments([{ area: 'connect', note: 'a'.repeat(400) }])[0];
  assert.strictEqual(m.note.length, 280);
});

test('stored as plain JSON: only the six shared fields', () => {
  const m = M.normalizeMoments([Object.assign({ extra: 'x', localUri: 'content://x' }, photo)])[0];
  assert.deepStrictEqual(Object.keys(m).sort(), ['area', 'createdAt', 'note', 'photoStoragePath', 'thumbStoragePath', 'updatedAt']);
});

test('photo ids are unique and safe in a path', () => {
  const seen = new Set();
  for (let i = 0; i < 500; i++) {
    const id = M.newMomentPhotoId();
    assert.ok(/^p[a-z0-9]+$/.test(id), id);
    seen.add(id);
  }
  assert.strictEqual(seen.size, 500);
});

test('Storage rules: owner only, JPEG under 3 MB', () => {
  const rules = fs.readFileSync(path.join(__dirname, '..', 'storage.rules'), 'utf8');
  assert.ok(/match \/users\/\{uid\}\/moments\/\{allPaths=\*\*\}/.test(rules));
  assert.strictEqual((rules.match(/request\.auth\.uid == uid/g) || []).length, 3);
  assert.ok(/allow read, write: if false/.test(rules));
  assert.ok(/request\.resource\.size < 3 \* 1024 \* 1024/.test(rules));
});

test('photo grid: always squares; 1 / 2 / 3 in a row / 2x2 / 2 over 3, centered, no overlap', () => {
  assert.strictEqual(M.shareStripLayout(0).height, 0);
  const rows = { 1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [2, 3] };
  for (let n = 1; n <= 5; n++) {
    const L = M.shareStripLayout(n);
    assert.strictEqual(L.tiles.length, n);
    L.tiles.forEach((t) => assert.ok(Math.abs(t.w - t.h) < 0.01, n + ' photos: not square'));
    L.tiles.forEach((t) => assert.ok(Math.abs(t.w - L.tiles[0].w) < 0.01, n + ' photos: uneven sizes'));
    const ys = [...new Set(L.tiles.map((t) => Math.round(t.y)))];
    assert.deepStrictEqual(ys.map((y) => L.tiles.filter((t) => Math.round(t.y) === y).length), rows[n], n + ' photos: wrong rows');
    ys.forEach((y) => {
      const r = L.tiles.filter((t) => Math.round(t.y) === y);
      const left = Math.min(...r.map((t) => t.x)), right = 312 - Math.max(...r.map((t) => t.x + t.w));
      assert.ok(left >= -0.01 && Math.abs(left - right) < 0.01, n + ' photos: a row is not centered');
    });
    L.tiles.forEach((t, i) => {
      assert.ok(t.w >= 70, n + ' photos: tile ' + i + ' too small');
      L.tiles.forEach((u, j) => {
        if (j <= i) return;
        const apart = t.x + t.w <= u.x + 0.001 || u.x + u.w <= t.x + 0.001 || t.y + t.h <= u.y + 0.001 || u.y + u.h <= t.y + 0.001;
        assert.ok(apart, n + ' photos: tiles ' + i + ' and ' + j + ' overlap');
      });
    });
  }
});

test('saved days: an area\'s ideas come back as a list; old days keep their single line', () => {
  const newDay = { activities: { create: 'A, with a comma, B' }, activityItems: { create: ['A, with a comma', 'B'] } };
  assert.deepStrictEqual(plain(M.logAreaItems(newDay, 'create')), ['A, with a comma', 'B']);
  const oldDay = { activities: { create: 'Played guitar, wrote a verse' } };
  assert.deepStrictEqual(plain(M.logAreaItems(oldDay, 'create')), ['Played guitar, wrote a verse']);
  assert.deepStrictEqual(plain(M.logAreaItems(oldDay, 'move')), []);
  assert.deepStrictEqual(plain(M.logAreaItems({ activities: { move: 'Run' }, activityItems: { move: [] } }, 'move')), ['Run']);
});

console.log('\n' + passed + ' passed');
