/**
 * Phase 2: idea and line pairs, versions, the day's time budget.
 *
 *   node tests/personalization-pairs.test.js
 *   node tests/personalization-pairs.test.js --show    also print the five audit people's days
 *
 * The bar is the audit's "after" examples: the activity itself adapts to the person,
 * and the second line shapes why it fits without repeating their answers back.
 */
const assert = require('assert');
const path = require('path');
const H = require('./sim/harness');

const sys = H.load(path.join(__dirname, '..', 'www'), 'android');
const W = sys.W, E = W.PFDRecommendationEngine, C = W.PFDRecommendationComposer, CO = W.PFDPlanCoherence;
const IDEAS = W.PFDStarterIdeas.IDEAS;

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (e) { console.error('FAIL', name); throw e; }
}

const ALL = [];
Object.keys(IDEAS).forEach((cat) => Object.keys(IDEAS[cat]).forEach((pref) => IDEAS[cat][pref].forEach((row) => ALL.push({ cat, pref, row }))));

/* ---------- the pairs themselves ---------- */

test('every pair has versions and a line, and follows the copy rules', () => {
  const lines = new Set(), texts = new Set();
  ALL.forEach(({ cat, pref, row }) => {
    const [minutes, text, , modes, line] = row;
    const where = cat + ':' + pref + ': ' + text;
    assert.ok(typeof minutes === 'number' && minutes >= 5 && minutes <= 40, 'length: ' + where);
    assert.ok(/^[ECDUWNS]+$/.test(modes || ''), 'versions: ' + where);
    assert.ok(line && line.length <= 90, 'line missing or over 90 characters: ' + where);
    assert.ok(!/[–—]| - /.test(text + line), 'dash: ' + where);
    assert.ok(!/\b(overthink|tired|low energy|repetitive|switch off|scroll|because you|since you)/i.test(line), 'line repeats their answers back: ' + line);
    assert.ok(!/\b(this week|this month|every day)\b/i.test(text), 'not a today idea: ' + text);
    assert.ok(!lines.has(line), 'two pairs share a line: ' + line);
    assert.ok(!texts.has(text), 'duplicate idea: ' + text);
    lines.add(line); texts.add(text);
  });
});

test('every area pick has a 5 minute version and a calm or easy version', () => {
  Object.keys(IDEAS).forEach((cat) => Object.keys(IDEAS[cat]).forEach((pref) => {
    const rows = IDEAS[cat][pref];
    assert.ok(rows.some((r) => r[0] <= 5), 'no 5 minute version: ' + pref);
    assert.ok(rows.some((r) => /[EC]/.test(r[3])), 'no easy or calm version: ' + pref);
  }));
});

test('names go inside the sentence, never as a raw {who}', () => {
  const p = H.mkProfile(W, { partnerName: 'Josh', friendNames: ['Ana'], familyNames: ['Maya'], connectTargets: ['partner', 'friends', 'family'] });
  W.pfdIdeaIndex.filter((i) => i.starter && /\{who\}/.test(i.text)).forEach((i) => {
    const t = C.compose(i, p, 'connect', {}).title;
    assert.ok(!/\{who\}/.test(t) && /Josh|Ana|Maya/.test(t) && !/^Do this with/.test(t), t);
  });
  const anon = H.mkProfile(W, { connectTargets: ['partner'] });
  const hug = W.pfdIdeaIndex.find((i) => /long hug/.test(i.text));
  assert.strictEqual(C.compose(hug, anon, 'connect', {}).title, 'Give your partner a long hug and tell them one thing you love about them.');
});

/* ---------- the engine picks the right version ---------- */

test('the same Cardio pick becomes a different activity for different people', () => {
  const base = { movePreferences: ['running'], deepPersonalizationCompleted: true, defaultTimeBucket: 'short' };
  const tired = H.mkProfile(W, Object.assign({}, base, { coreFrictions: ['low_energy'], dayBandwidth: 'very_full' }));
  const confident = H.mkProfile(W, Object.assign({}, base, { overallGoals: ['confidence'], dayBandwidth: 'balanced' }));
  const top = (p) => W.pfdIdeaIndex.filter((i) => i.starter && i.categoryId === 'move' && (i.moveTypeTags || []).includes('running'))
    .map((i) => [E.scoreIdea(i, p, { categoryId: 'move' }), i]).sort((a, b) => b[0] - a[0])[0][1];
  assert.ok(top(tired).modes.includes('E'), 'tired runner should get an easy version: ' + top(tired).text);
  assert.ok(top(confident).modes.includes('S'), 'runner who wants confidence should get a stretch version: ' + top(confident).text);
});

test('people who picked a specific style still get that style (specific beats broad)', () => {
  const groups = W.PFDConstants.CREATE_STYLE_GROUPS;
  let n = 0, hit = 0;
  for (let k = 0; k < 300; k++) {
    const g = groups[k % groups.length];
    const opt = g.options[k % g.options.length].id;
    const f = { deepPersonalizationCompleted: true, createInterests: [g.interest], defaultTimeBucket: ['short', 'medium', 'flexible'][k % 3], overallGoals: ['more_creativity'] };
    f[g.field] = [opt];
    const d = H.dailyFlow(sys, f, 40 + k);
    if (!d.cards.create) continue;
    n++;
    if (d.cards.create.idea.styleId === opt) hit++;
  }
  assert.ok(hit / n >= 0.85, 'only ' + hit + ' / ' + n + ' Create cards used the style they picked');
});

/* ---------- the day as a whole ---------- */

const MANY = H.randomProfiles(800, 23).map((f, i) => Object.assign({ deepPersonalizationCompleted: i % 2 === 0 }, f));
const DAYS = MANY.map((f, i) => H.dailyFlow(sys, f, 900 + i));

test('most cards carry a second line', () => {
  let cards = 0, lined = 0;
  DAYS.forEach((d) => H.CATS.forEach((c) => {
    if (!d.cards[c]) return;
    cards++;
    if (C.compose(d.cards[c].idea, d.profile, c, {}).line) lined++;
  }));
  assert.ok(lined / cards >= 0.85, 'only ' + (100 * lined / cards).toFixed(0) + '% of cards have a line');
});

test('no line appears twice in one day', () => {
  DAYS.forEach((d) => {
    const seen = new Set();
    H.CATS.forEach((c) => {
      if (!d.cards[c]) return;
      const l = C.compose(d.cards[c].idea, d.profile, c, {}).line;
      if (!l) return;
      assert.ok(!seen.has(l), 'repeated line in one day: ' + l);
      seen.add(l);
    });
  });
});

test('days fit the time the person has (5 to 10 minute days stay near 40 minutes)', () => {
  let capped = 0, over = 0;
  DAYS.forEach((d) => {
    const cap = CO.dayMinutesCap(d.profile, E);
    if (!cap) return;
    capped++;
    const total = H.CATS.reduce((s, c) => s + (d.cards[c] ? E.ideaMinutes(d.cards[c].idea) : 0), 0);
    if (total > cap) over++;
  });
  assert.ok(over / capped <= 0.06, (100 * over / capped).toFixed(1) + '% of days are over their time budget');
});

/* ---------- the five audit people ---------- */

const AUDIT = {
  'Megan': { overallGoals: ['more_creativity', 'deeper_relationships'], coreFrictions: ['choice_overload'], dayBandwidth: 'balanced', defaultTimeBucket: 'short',
    createInterests: ['music'], mindsetFormats: ['books'], connectTargets: ['partner'], partnerName: 'Josh', movePreferences: ['fitness_classes', 'dance'], resetStyles: ['nourishing_reset', 'self_care'], deepPersonalizationCompleted: true },
  'Runner who overthinks': { overallGoals: ['peace_presence'], coreFrictions: ['overthinking', 'work_switch_off'], dayBandwidth: 'pretty_full', defaultTimeBucket: 'short',
    createInterests: ['writing'], mindsetFormats: ['journaling', 'books'], connectTargets: ['partner'], partnerName: 'Josh', movePreferences: ['running', 'walking'], resetStyles: ['nature_reset', 'offline_reset'], deepPersonalizationCompleted: true },
  'Runner who wants confidence': { overallGoals: ['confidence', 'movement_energy'], coreFrictions: ['activation_difficulty'], dayBandwidth: 'balanced', defaultTimeBucket: 'short',
    createInterests: ['content_creation'], mindsetFormats: ['podcasts'], connectTargets: ['friends'], movePreferences: ['running', 'strength'], resetStyles: ['rest_reset'], deepPersonalizationCompleted: true },
  'Tired parent': { overallGoals: ['time_for_self'], coreFrictions: ['low_energy', 'self_neglect', 'others_first'], dayBandwidth: 'very_full', defaultTimeBucket: 'micro',
    createInterests: ['cooking_baking'], connectTargets: ['family'], familyNames: ['Maya'], movePreferences: ['walking', 'yoga_stretch'], resetStyles: ['rest_reset', 'self_care'], deepPersonalizationCompleted: true },
  'Phone heavy student': { overallGoals: ['less_screen_time', 'fun_novelty'], coreFrictions: ['phone_overuse', 'repetitive_days'], dayBandwidth: 'balanced', defaultTimeBucket: 'short',
    createInterests: ['photography'], mindsetFormats: ['learning'], connectTargets: ['friends'], friendNames: ['Lena'], movePreferences: ['dance', 'walking'], resetStyles: ['offline_reset'], deepPersonalizationCompleted: true }
};

Object.keys(AUDIT).forEach((name) => {
  test(name + ': a day that sounds like them, over many days', () => {
    let cards = 0, lined = 0, over = 0, days = 0;
    for (let s = 1; s <= 60; s++) {
      const d = H.dailyFlow(sys, AUDIT[name], s);
      days++;
      const cap = CO.dayMinutesCap(d.profile, E);
      let total = 0;
      H.CATS.forEach((c) => {
        const i = d.cards[c] && d.cards[c].idea;
        if (!i) return;
        cards++;
        total += E.ideaMinutes(i);
        if (C.compose(i, d.profile, c, {}).line) lined++;
        assert.ok(!i.multiDay && !(i.booking && d.profile.dayBandwidth === 'very_full'), name + ' got: ' + i.text);
      });
      if (cap && total > cap) over++;
    }
    assert.ok(lined / cards >= 0.8, name + ': only ' + lined + ' / ' + cards + ' cards have a line');
    assert.ok(over / days <= 0.1, name + ': ' + over + ' of ' + days + ' days over their time budget');
  });
});

test('the header reflects the kind of day', () => {
  assert.strictEqual(C.dayHeader(H.mkProfile(W, AUDIT['Tired parent'])).title, 'A gentle flow today ✨');
  assert.strictEqual(C.dayHeader(H.mkProfile(W, AUDIT['Phone heavy student'])).title.indexOf('✨') > 0, true);
  assert.strictEqual(C.dayHeader(H.mkProfile(W, {})).title, 'Your Daily Flow ✨');
});

if (process.argv.includes('--show')) {
  Object.keys(AUDIT).forEach((name) => {
    const d = H.dailyFlow(sys, AUDIT[name], 7);
    const h = C.dayHeader(d.profile);
    console.log('\n' + name + '\n  ' + h.title + '  ' + h.subtitle);
    H.CATS.forEach((c) => {
      const x = C.compose(d.cards[c].idea, d.profile, c, {});
      console.log('  ' + c.padEnd(8) + x.title + (x.line ? '\n           ' + x.line : ''));
    });
  });
}
console.log('personalization-pairs: ' + passed + ' passed');
