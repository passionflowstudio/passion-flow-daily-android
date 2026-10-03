/**
 * The focus pack library: how every idea reads, and that rewording never breaks
 * anything a person already saved, added, finished or deleted.
 *
 *   node tests/idea-library.test.js
 */
const assert = require('assert');
const path = require('path');
const H = require('./sim/harness');

const sys = H.load(path.join(__dirname, '..', 'www'), 'android');
const W = sys.W, M = W.PFDIdeaMetadata, TABLE = W.PFDIdeaOverrides;
const LIB = W.pfdIdeaIndex.filter((i) => !i.starter && !i.styleId);

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (e) { console.error('FAIL', name); throw e; }
}

test('every pack idea reads cleanly: full sentence, no dashes, no filler', () => {
  LIB.forEach((i) => {
    assert.ok(/[.!?]$/.test(i.text), 'no end punctuation: ' + i.text);
    assert.ok(!/[–—]| - /.test(i.text), 'dash: ' + i.text);
    assert.ok(!/\b(actually|genuinely|absolutely|literally|every single)\b/i.test(i.text), 'filler: ' + i.text);
    assert.ok(!/ {2}|\.\./.test(i.text), 'spacing: ' + i.text);
  });
});

test('a reworded idea keeps the id of its original sentence', () => {
  const reworded = LIB.filter((i) => i.originalText);
  assert.ok(reworded.length > 400, 'expected the library pass, found ' + reworded.length);
  reworded.forEach((i) => {
    const original = M.getIdeaMetadata({ text: i.originalText }, i.categoryId, i.packId);
    assert.strictEqual(i.id, original.id, 'id changed for: ' + i.text);
  });
});

test('every rewording in the table is what people see', () => {
  Object.keys(TABLE).filter((k) => TABLE[k].text).forEach((k) => {
    const sentence = k.indexOf('::') > 0 ? k.slice(k.indexOf('::') + 2) : k;
    assert.ok(LIB.some((i) => i.originalText === sentence && i.text === TABLE[k].text), 'not shown: ' + TABLE[k].text);
  });
});

test('saved, added, done and deleted ideas follow their new wording', () => {
  const a = LIB.find((i) => i.originalText && TABLE[i.originalText] && TABLE[i.originalText].text && !TABLE[i.originalText].replaces);
  const b = LIB.find((i) => i.originalText && !(TABLE[i.originalText] || {}).text && i.categoryId !== a.categoryId);
  const stored = { [a.categoryId]: [a.originalText, 'my own custom idea', a.text], [b.categoryId]: [b.originalText] };
  // JSON round trip: the app runs in its own sandbox, and strict compare checks which one a list came from.
  const out = JSON.parse(JSON.stringify(M.updateRewordedIdeas(stored)));
  assert.deepStrictEqual(out[a.categoryId], [a.text, 'my own custom idea'], 'reworded + custom + no duplicate');
  assert.deepStrictEqual(out[b.categoryId], [b.text], 'period only change follows too');
  assert.strictEqual(M.updateRewordedIdeas(null), null);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(M.updateRewordedIdeas({ create: "not a list" }))), { create: "not a list" });
});

test('a replaced idea is never carried into saved or finished lists', () => {
  const r = LIB.find((i) => i.originalText && (TABLE[i.originalText] || {}).replaces);
  assert.ok(r, 'expected the quality pass replacements');
  const out = JSON.parse(JSON.stringify(M.updateRewordedIdeas({ [r.categoryId]: [r.originalText] })));
  assert.deepStrictEqual(out[r.categoryId], [r.originalText], 'a saved old idea must stay as it was saved');
});

test('a sentence in two packs changes only in the pack it was meant for', () => {
  Object.keys(TABLE).filter((k) => k.indexOf('::') > 0).forEach((k) => {
    const pack = k.slice(0, k.indexOf('::')), sentence = k.slice(k.indexOf('::') + 2);
    const copies = LIB.filter((i) => (i.originalText || i.text) === sentence);
    assert.ok(copies.length >= 2, 'not actually in two packs: ' + sentence);
    copies.forEach((i) => {
      if (i.packId === pack) assert.strictEqual(i.text, TABLE[k].text, 'the ' + pack + ' copy should change');
      else assert.notStrictEqual(i.text, TABLE[k].text, 'the ' + i.packId + ' copy should not change');
    });
  });
});

test('no safety or diet ideas left that the quality pass replaced', () => {
  LIB.forEach((i) => assert.ok(!/cliff jump|all.?nighter|leave out one food|gut health week|burnout|swim as far as|personal record|new PR/i.test(i.text), i.text));
});

test('every pack idea gets a fitting emoji, never the same sparkle fallback', () => {
  const seen = {};
  LIB.forEach((i) => {
    const e = M.ideaEmoji(i.text, i.categoryId);
    assert.ok(e && e !== '✨', 'sparkle on: ' + i.text);
    assert.strictEqual(M.ideaEmoji(i.text, i.categoryId), e, 'emoji must not change between renders');
    seen[e] = (seen[e] || 0) + 1;
  });
  assert.ok(Object.keys(seen).length >= 40, 'only ' + Object.keys(seen).length + ' different emojis');
  assert.ok(Math.max.apply(null, Object.values(seen)) / LIB.length < 0.15, 'one emoji is on too many ideas');
});

test('rewording twice changes nothing', () => {
  const before = LIB.map((i) => i.text).join('|');
  const html = require('fs').readFileSync(path.join(__dirname, '..', 'www', 'index.html'), 'utf8');
  assert.ok(/applyRewrites\(FOCUS_PACKS\)/.test(html), 'index.html must apply the rewordings at load');
  assert.ok((html.match(/pfdReworded\(/g) || []).length >= 8, 'index.html must update stored ideas at both load points');
  const again = M.buildIdeaIndex(sys.packs || {});
  assert.strictEqual(LIB.map((i) => i.text).join('|'), before);
  assert.ok(Array.isArray(again));
});

console.log('idea-library: ' + passed + ' passed');
