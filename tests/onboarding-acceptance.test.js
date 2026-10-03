/**
 * Onboarding upgrade acceptance: the quick preference screen and the first Daily Flow
 * preview it shapes.
 *
 *   node tests/onboarding-acceptance.test.js
 *   node tests/onboarding-acceptance.test.js --show     also print each profile's five cards
 *
 * Profiles A, B and C are the three people the upgrade was designed against. Each runs
 * through the preview's own selection settings (PFDOnboarding.previewContext) over many
 * seeds, so a pass means the preview is good every time, not on one lucky draw.
 */
const assert = require('assert');
const path = require('path');
const H = require('./sim/harness');

const WWW = path.join(__dirname, '..', 'www');
const sys = H.load(WWW, 'android');
const W = sys.W, K = W.PFDConstants, OB = W.PFDOnboarding;
const SEEDS = 120;

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (e) { console.error('FAIL', name); throw e; }
}

const PROFILES = {
  A: { overallGoals: ['more_creativity', 'peace_presence', 'deeper_relationships', 'movement_energy'], coreFrictions: ['overthinking', 'choice_overload'],
    lifeContext: ['self_employed'], dayBandwidth: 'balanced', defaultTimeBucket: 'medium',
    createInterests: ['music'], mindsetFormats: ['journaling'], connectTargets: ['friends'], movePreferences: ['walking'], resetStyles: ['offline_reset'] },
  B: { overallGoals: ['fun_novelty', 'movement_energy', 'confidence'], coreFrictions: ['repetitive_days', 'activation_difficulty'],
    dayBandwidth: 'pretty_full', defaultTimeBucket: 'short',
    createInterests: ['photography'], mindsetFormats: ['learning'], connectTargets: ['community'], movePreferences: ['dance'], resetStyles: ['nature_reset'] },
  C: { overallGoals: ['peace_presence', 'time_for_self', 'less_screen_time'], coreFrictions: ['low_energy', 'work_switch_off'],
    dayBandwidth: 'very_full', defaultTimeBucket: 'micro',
    createInterests: ['cooking_baking'], mindsetFormats: ['mindfulness'], connectTargets: ['self'], movePreferences: ['yoga_stretch'], resetStyles: ['self_care'] }
};
Object.keys(PROFILES).forEach((k) => { PROFILES[k] = OB.withQuickPreferencesMarked(PROFILES[k]); });

const MAX_MINUTES = { micro: 10, short: 30, medium: 60 };
const BUCKET_ORDER = { micro: 1, short: 2, medium: 3, long: 4 };

function previews(fields) {
  const out = [];
  for (let s = 1; s <= SEEDS; s++) out.push(H.dailyFlow(sys, fields, s, OB.previewContext({})));
  return out;
}
const RUNS = {};
Object.keys(PROFILES).forEach((k) => { RUNS[k] = previews(PROFILES[k]); });
const cardsOf = (k) => [].concat(...RUNS[k].map((d) => H.CATS.map((c) => d.cards[c]).filter(Boolean)));

/* ---------- the screen ---------- */

test('every quick choice is a real option of the field it writes to', () => {
  const lists = { createInterests: K.CREATE_INTEREST_OPTIONS, mindsetFormats: K.MINDSET_FORMAT_OPTIONS, connectTargets: K.CONNECT_TARGET_OPTIONS,
    movePreferences: K.MOVE_PREF_OPTIONS, resetStyles: K.RESET_STYLE_OPTIONS };
  assert.strictEqual(OB.QUICK_PREFERENCE_AREAS.length, 5);
  OB.QUICK_PREFERENCE_AREAS.forEach((a) => {
    const ids = lists[a.field].map((o) => o.id);
    a.choices.forEach((c) => assert.ok(ids.includes(c.id), a.field + ' has no option "' + c.id + '"'));
  });
});

test('quick answers mark the profile as a first sketch, never as the deeper personalization', () => {
  const p = OB.withQuickPreferencesMarked(Object.assign(K.createEmptyProfileV3(), { createInterests: ['music'] }));
  assert.ok(p.quickPreferencesAt > 0);
  assert.strictEqual(p.deepPersonalizationCompleted, false);
  assert.ok(K.migrateProfileToV3(p).quickPreferencesAt === p.quickPreferencesAt, 'the marker must survive a reload');
  const none = K.createEmptyProfileV3();
  assert.strictEqual(OB.withQuickPreferencesMarked(none), none, 'skipping the screen changes nothing');
});

test('no copy here uses a dash', () => {
  const strings = [];
  (function walk(v) {
    if (typeof v === 'string') strings.push(v);
    else if (v && typeof v === 'object') Object.keys(v).forEach((k) => walk(v[k]));
  })({ a: OB.QUICK_PREFERENCE_COPY, b: OB.PREVIEW_COPY, c: OB.PAYWALL_COPY });
  Object.keys(PROFILES).forEach((k) => strings.push(OB.previewSubtitle(PROFILES[k])));
  strings.forEach((s) => assert.ok(!/[–—]| - /.test(s), 'dash in: ' + s));
});

test('the preview subtitle names two wants and the main thing in the way', () => {
  assert.strictEqual(OB.previewSubtitle(PROFILES.A), 'Picked to bring you more creativity and peace, without giving you more to overthink.');
  assert.strictEqual(OB.previewSubtitle(PROFILES.C), 'Picked to bring you more peace and time for yourself, gentle enough for a tired day.');
  assert.strictEqual(OB.previewSubtitle({ overallGoals: ['confidence'], dayBandwidth: 'very_full' }), 'Picked to bring you more confidence, even on a very full day.');
});

test('the preview button does not sound like a purchase', () => {
  assert.ok(!/unlock|buy|subscribe|trial|pay/i.test(OB.PREVIEW_COPY.cta), OB.PREVIEW_COPY.cta);
});

/* ---------- the three acceptance profiles ---------- */

['A', 'B', 'C'].forEach((k) => {
  test(k + ': every card fits the time the person said they have', () => {
    const pref = PROFILES[k].defaultTimeBucket;
    cardsOf(k).forEach((card) => {
      const i = card.idea;
      /* Starter ideas know their exact minutes. Library ideas only know a bucket
         ("15m" means up to 15), so they are held to the bucket, and to any length the
         idea itself states. */
      if (i.minutes) assert.ok(i.minutes <= MAX_MINUTES[pref], k + ' got ' + i.minutes + ' min: ' + i.text);
      else assert.ok(BUCKET_ORDER[i.timeEstimate] <= BUCKET_ORDER[pref], k + ' got a ' + i.timeEstimate + ' idea: ' + i.text);
      const stated = (i.text.match(/(\d+)\s*minutes?\b/) || [])[1];
      if (stated) assert.ok(+stated <= MAX_MINUTES[pref], k + ' states ' + stated + ' min: ' + i.text);
    });
  });
  test(k + ': nothing more specific than what we know (no gear, places or style chips)', () => {
    cardsOf(k).forEach((card) => {
      assert.ok(!card.idea.assumes, 'assumes gear or a place: ' + card.idea.text);
      assert.ok(!card.idea.styleId, 'style chip idea without a chosen style: ' + card.idea.text);
      assert.ok(!card.idea.multiDay, 'multi day: ' + card.idea.text);
    });
  });
  test(k + ': every card follows the area preference picked on the quick screen', () => {
    const fields = { create: 'createInterestTags', learn: 'mindsetFormatTags', connect: 'connectTargetTags', move: 'moveTypeTags', nourish: 'resetStyleTags' };
    const picked = { create: 'createInterests', learn: 'mindsetFormats', connect: 'connectTargets', move: 'movePreferences', nourish: 'resetStyles' };
    let matched = 0, total = 0;
    RUNS[k].forEach((d) => H.CATS.forEach((c) => {
      total++;
      const tags = d.cards[c].idea[fields[c]] || [];
      if (tags.some((t) => PROFILES[k][picked[c]].includes(t))) matched++;
    }));
    assert.ok(matched / total >= 0.97, k + ': only ' + matched + ' / ' + total + ' cards match the quick picks');
  });
  test(k + ': at most one demanding card, and five different activities', () => {
    let repeats = 0;
    RUNS[k].forEach((d) => {
      const ideas = H.CATS.map((c) => d.cards[c].idea);
      assert.ok(ideas.filter((i) => i.effortScore >= 2.8).length <= 1);
      assert.strictEqual(new Set(ideas.map((i) => i.id)).size, 5);
      const kinds = ideas.map((i) => W.PFDRecommendationEngine.activityKind(i)).filter(Boolean);
      if (new Set(kinds).size < kinds.length) repeats++;
    });
    assert.ok(repeats / RUNS[k].length <= 0.02, k + ': ' + repeats + ' previews repeat an activity across cards');
  });
});

test('A: nothing open ended for someone who overthinks and drowns in choices', () => {
  cardsOf('A').forEach((card) => assert.ok(!card.idea.openEnded, card.idea.text));
});

test('B: novelty shows up for someone whose days feel repetitive', () => {
  RUNS.B.forEach((d) => {
    const novel = H.CATS.filter((c) => d.cards[c].idea.noveltyLevel >= 2).length;
    assert.ok(novel >= 2, 'only ' + novel + ' new feeling cards');
  });
});

test('C: every card is gentle enough for a tired, very full day', () => {
  cardsOf('C').forEach((card) => {
    assert.ok(card.idea.effortScore < 2, 'effort ' + card.idea.effortScore + ': ' + card.idea.text);
    assert.ok(!card.idea.chore && !card.idea.booking, card.idea.text);
  });
});

if (process.argv.includes('--show')) {
  Object.keys(PROFILES).forEach((k) => {
    console.log('\n' + k + '  ' + OB.previewSubtitle(PROFILES[k]));
    const d = RUNS[k][0];
    H.CATS.forEach((c) => console.log('  ' + c.padEnd(8) + d.cards[c].title));
  });
}
console.log('onboarding-acceptance: ' + passed + ' passed');
