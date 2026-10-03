/**
 * Daily Flow regression suite.
 *
 *   node tests/daily-flow-regression.test.js            measure, compare to baseline, assert
 *   node tests/daily-flow-regression.test.js --baseline record the current state as the baseline
 *   PFD_IOS_WWW=/path/to/ios/www node tests/...          also measure an iOS checkout
 *
 * 400 seeded days per platform. The same seeds give the same profiles everywhere,
 * which is what makes the iOS / Android parity check meaningful.
 */
const fs = require('fs');
const path = require('path');
const H = require('./sim/harness');

const WWW = path.join(__dirname, '..', 'www');
const BASELINE = path.join(__dirname, 'sim', 'baseline.json');
const DAYS = 400, PROFILE_SEED = 7, ENGINE_SEED = 1000;

function run(root, platform) {
  const sys = H.load(root, platform);
  const profiles = H.randomProfiles(DAYS, PROFILE_SEED);
  const { m, failures } = H.measure(sys, profiles, ENGINE_SEED);
  const shuffle = {};
  Object.keys(H.NAMED).forEach((name, i) => { shuffle[name] = H.shuffleDiversity(sys, H.NAMED[name], 500 + i * 10); });
  return { sys, m, failures, shuffle };
}

function rates(m) {
  const pct = (a, b) => +(100 * a / b).toFixed(1);
  return {
    'cards with a contradictory time prefix (%)': pct(m.contra, m.cards),
    'Daily Flow days with a multi-day idea (%)': pct(m.multiDayDays, m.days),
    'Pick for Me cards that are multi-day (%)': pct(m.pfmMultiDay, m.pfmCards),
    'days with 2+ heavy items (%)': pct(m.twoHeavyDays, m.days),
    'days repeating an activity across cards (%)': pct(m.repeatDays, m.days),
    'days where Reset is a chore or project (%)': pct(m.resetChoreDays, m.days),
    'cards longer than the user\'s time preference (%)': pct(m.overTimeCards, m.cards),
    'cards matching the user\'s stated preference (%)': pct(m.prefMatch, m.cards)
  };
}

function shuffleSummary(shuffle) {
  let keys = 0, repeats = 0, n = 0, rerolls = 0, same = 0;
  Object.values(shuffle).forEach((byCat) => Object.values(byCat).forEach((r) => {
    keys += r.themeKeys; repeats += r.repeats; rerolls += r.rerolls; same += r.sameAsReplaced; n++;
  }));
  return {
    'avg theme keys seen in 12 shuffles': +(keys / n).toFixed(1),
    'rerolls repeating the activity they replaced (%)': +(100 * same / rerolls).toFixed(1),
    'repeated ideas across all shuffles': repeats
  };
}

const androidNow = run(WWW, 'android');
const iosRoot = process.env.PFD_IOS_WWW;
const iosNow = iosRoot ? run(iosRoot, 'ios') : null;

if (process.argv.includes('--baseline')) {
  const out = { recordedAt: new Date().toISOString(), android: { rates: rates(androidNow.m), shuffle: shuffleSummary(androidNow.shuffle) } };
  if (iosNow) out.ios = { rates: rates(iosNow.m), shuffle: shuffleSummary(iosNow.shuffle), source: iosRoot };
  fs.writeFileSync(BASELINE, JSON.stringify(out, null, 2) + '\n');
  console.log('baseline written to', path.relative(process.cwd(), BASELINE));
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

/* ---------- report ---------- */
const base = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : null;
const sameFilesIos = run(WWW, 'ios');   // the SAME www files, down the iOS branch
const now = { android: rates(androidNow.m), iosBranch: rates(sameFilesIos.m) };
const cols = [];
if (base && base.ios) cols.push(['iOS before', base.ios.rates]);
if (base) cols.push(['Android before', base.android.rates]);
cols.push(['Android now', now.android], ['iOS branch now', now.iosBranch]);
if (iosNow) cols.push(['iOS checkout now', rates(iosNow.m)]);

console.log('\nDaily Flow regression, ' + DAYS + ' seeded days per column\n');
console.log(''.padEnd(52) + cols.map((c) => c[0].padStart(17)).join(''));
Object.keys(now.android).forEach((k) => console.log(k.padEnd(52) + cols.map((c) => String(c[1][k] != null ? c[1][k] : '-').padStart(17)).join('')));

const shufNow = shuffleSummary(androidNow.shuffle);
console.log('\nShuffle (5 named users x 5 categories x 12 rerolls)\n');
const shufCols = [];
if (base && base.ios) shufCols.push(['before (iOS snap)', base.ios.shuffle]);
if (base && base.android.shuffle) shufCols.push(['Android before', base.android.shuffle]);
shufCols.push(['Android now', shufNow]);
Object.keys(shufNow).forEach((k) => console.log(k.padEnd(52) + shufCols.map((c) => String(c[1][k]).padStart(17)).join('')));

/* ---------- parity: same files, same profiles, same seeds, both platform branches ---------- */
let samePick = 0, sameTitle = 0, cards = 0;
const titleDiffs = [];
const profiles = H.randomProfiles(DAYS, PROFILE_SEED);
const aSys = H.load(WWW, 'android'), iSys = H.load(WWW, 'ios');
profiles.forEach((fields, i) => {
  const a = H.dailyFlow(aSys, fields, ENGINE_SEED + i), b = H.dailyFlow(iSys, fields, ENGINE_SEED + i);
  H.CATS.forEach((c) => {
    if (!a.cards[c] || !b.cards[c]) return;
    cards++;
    if (a.cards[c].idea.id === b.cards[c].idea.id) samePick++;
    if (a.cards[c].title === b.cards[c].title) sameTitle++;
    else titleDiffs.push({ pack: a.cards[c].idea.packId, android: a.cards[c].title, ios: b.cards[c].title });
  });
});
const unexplained = titleDiffs.filter((d) => d.pack !== 'nature-connect');
console.log('\nParity: identical www files run down the Android and iOS branches\n');
console.log('  same idea picked      ' + samePick + ' / ' + cards);
console.log('  same card wording     ' + sameTitle + ' / ' + cards + '   (differences: ' + titleDiffs.length + ', of which nature-connect lead-ins: ' + (titleDiffs.length - unexplained.length) + ')');
unexplained.slice(0, 5).forEach((d) => console.log('    UNEXPLAINED  android: ' + d.android + '\n                 ios:     ' + d.ios));

/* ---------- remaining failures ---------- */
console.log('\nRemaining failure cases (Android now)\n');
Object.keys(androidNow.failures).forEach((k) => {
  const list = Array.from(new Set(androidNow.failures[k]));
  console.log('  ' + k + ': ' + list.length + ' unique');
  list.slice(0, 4).forEach((t) => console.log('     - ' + t.slice(0, 130)));
});

/* ---------- idea-overrides.js hygiene ---------- */
const fails = [];
function expect(ok, msg) { if (!ok) fails.push(msg); }
(function checkOverrides() {
  const W = H.load(WWW, 'android').W;
  const table = W.PFDIdeaOverrides;
  expect(!!table, 'idea-overrides.js must load (missing script tag?)');
  if (!table) return;
  // Keys are the ORIGINAL sentence, even for reworded ideas.
  const texts = new Set(W.pfdIdeaIndex.map((i) => i.originalText || i.text));
  const BOOL = [true, false];
  const VALID = { time: ['15m', '30m', '1h', '2h+'], effort: ['light', 'moderate', 'heavy'], multiDay: BOOL, booking: BOOL, chore: BOOL,
    assumes: BOOL, openEnded: BOOL, screen: BOOL, offline: BOOL, novel: [true] };
  const auto = {};
  W.PFDIdeaOverrides = {};                       // what the automatic rules say on their own
  // What the automatic rules say about the wording people actually see.
  // "packId::sentence" keys apply to one pack only; the sentence is after the ::.
  const sentence = (k) => (k.indexOf('::') > 0 ? k.slice(k.indexOf('::') + 2) : k);
  Object.keys(table).forEach((t) => { const o = sentence(t); auto[t] = W.PFDIdeaMetadata.getIdeaMetadata(table[t].text ? { text: table[t].text, originalText: o } : { text: o }, 'create', null); });
  W.PFDIdeaOverrides = table;
  let entries = 0;
  Object.keys(table).forEach((t) => {
    entries++;
    expect(texts.has(sentence(t)), 'override key matches no idea (reworded or removed?): "' + t + '"');
    if (t.indexOf('::') > 0) expect(W.pfdIdeaIndex.some((i) => i.packId === t.slice(0, t.indexOf('::')) && (i.originalText || i.text) === sentence(t)), 'pack-specific key names a pack without that idea: "' + t + '"');
    if ('text' in table[t]) {
      const nt = table[t].text;
      expect(typeof nt === 'string' && nt.length > 10 && nt !== t, 'override "' + t + '" has an unusable new wording');
      expect(!/[\u2013\u2014]/.test(nt), 'reworded idea uses a dash: ' + nt);
      expect(W.pfdIdeaIndex.some((i) => i.originalText === sentence(t) && i.text === nt), 'reworded idea is not shown with its new wording: ' + nt);
    }
    Object.keys(table[t]).forEach((field) => {
      if (field === 'text') return;
      if (field === 'replaces') { expect(table[t].replaces === true && typeof table[t].text === 'string', 'replaces needs a text: "' + t + '"'); return; }
      const v = table[t][field];
      expect(VALID[field] && VALID[field].includes(v), 'override "' + t + '" has an invalid ' + field + ': ' + JSON.stringify(v));
      const same = field === 'time' ? auto[t].rawTime === v : field === 'effort' ? false : field === 'novel' ? auto[t].noveltyLevel >= 2 : auto[t][field] === v;
      expect(!same, 'override "' + t + '" sets ' + field + ' to what the rules already give; remove it');
    });
  });
  console.log('\nidea-overrides.js: ' + entries + ' entries checked (real idea, valid fields, not redundant)');
})();

/* ---------- outings and classes only reach people with the time and energy ---------- */
(function checkOutings() {
  const MAX = { micro: 1, short: 2, medium: 3 }, ORDER = { micro: 1, short: 2, medium: 3, long: 4 };
  let outings = 0, tooLong = 0, tired = 0;
  H.randomProfiles(1500, 77).forEach((fields, n) => {
    const day = H.dailyFlow(androidNow.sys, fields, 300 + n), p = day.profile;
    Object.values(day.cards).forEach(({ idea }) => {
      if (!idea.booking) return;
      outings++;
      if (MAX[p.defaultTimeBucket] && ORDER[idea.timeEstimate] > MAX[p.defaultTimeBucket]) tooLong++;
      if (p.dayBandwidth === 'very_full' || p.dayBandwidth === 'pretty_full' || (p.coreFrictions || []).some((f) => f === 'low_energy' || f === 'time_pressure')) tired++;
    });
  });
  console.log('\nOutings and classes: ' + outings + ' shown, ' + tooLong + ' longer than the person has, ' + tired + ' on a full or low energy day');
  expect(tooLong === 0, 'an outing or class reached someone without the time for it');
  expect(tired === 0, 'an outing or class reached someone on a full or low energy day');
})();

/* ---------- assertions ---------- */
['android', 'iosBranch'].forEach((plat) => {
  const r = now[plat];
  expect(r['cards with a contradictory time prefix (%)'] < 1, plat + ': contradictory time prefixes must stay under 1%');
  expect(r['Daily Flow days with a multi-day idea (%)'] === 0, plat + ': multi-day ideas must never reach Daily Flow');
  expect(r['Pick for Me cards that are multi-day (%)'] === 0, plat + ': multi-day ideas must never reach Pick for Me');
  expect(r['days with 2+ heavy items (%)'] < 3, plat + ': at most one heavy item per day (under 3% of days)');
  expect(r['days repeating an activity across cards (%)'] < 6, plat + ': cross-card repeats must stay under 6%');
  expect(r['days where Reset is a chore or project (%)'] < 2, plat + ': Reset must stay light (under 2% of days)');
  if (base) expect(r['cards matching the user\'s stated preference (%)'] >= base.android.rates['cards matching the user\'s stated preference (%)'] - 2, plat + ': preference match may not drop more than 2 points');
});
expect(samePick === cards, 'parity: both branches must pick the same idea every time');
expect(unexplained.length === 0, 'parity: card wording may only differ by the Android nature-connect lead-in');
const shufBefore = base && (base.ios || base.android).shuffle['rerolls repeating the activity they replaced (%)'];
/* Not "must halve": most remaining same-activity rerolls come from people with a single
   preference (only "books", only "podcasts"), where another idea of that activity is
   the correct answer. Guard against regressions; measure the rest. */
if (shufBefore != null) expect(shufNow['rerolls repeating the activity they replaced (%)'] <= shufBefore + 2, 'shuffle: rerolls landing on the same activity must not get worse');

if (fails.length) { console.log('\nFAILED\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('\ndaily-flow-regression: all checks passed');
