/**
 * Daily Flow simulation harness.
 *
 * Loads the real www/ files into an isolated sandbox, builds the real idea index
 * from the FOCUS_PACKS in index.html, and generates hundreds of seeded days.
 *
 * The YARDSTICK below is deliberately independent of the code under test: it judges
 * ideas by their text with its own patterns, so a change to the engine or the
 * metadata cannot quietly grade its own homework.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SCRIPTS = [
  'personalization-constants.js',
  'idea-overrides.js',          // optional: absent in older builds
  'create-style-ideas.js',
  'starter-ideas.js',           // optional: absent in older builds
  'idea-metadata.js',
  'recommendation-engine.js',
  'recommendation-composer.js',
  'plan-day-coherence.js',
  'onboarding-preferences.js'   // optional: absent in older builds
];
const CATS = ['create', 'learn', 'connect', 'move', 'nourish'];

/* ---------- seeded randomness (one stream per purpose, never shared) ---------- */
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/* ---------- loading ---------- */
function extractObjectLiteral(src, marker) {
  const i = src.indexOf(marker);
  if (i < 0) throw new Error('marker not found: ' + marker);
  const start = src.indexOf('{', i);
  let depth = 0, inStr = null, esc = false;
  for (let k = start; k < src.length; k++) {
    const c = src[k];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(start, k + 1); }
  }
  throw new Error('unbalanced object literal');
}

/**
 * platform: 'android' | 'ios'. The composer decides by window.Capacitor, so this
 * runs the SAME files down either platform branch.
 */
function load(wwwRoot, platform) {
  const math = Object.create(Math);
  math.random = rng(1);
  const ctx = { window: {}, console, Math: math };
  vm.createContext(ctx);
  ctx.window.Math = math;
  if (platform === 'android') ctx.window.Capacitor = { getPlatform: () => 'android' };
  const loaded = [];
  SCRIPTS.forEach((f) => {
    const p = path.join(wwwRoot, f);
    if (!fs.existsSync(p)) return;
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
    loaded.push(f);
  });
  const html = fs.readFileSync(path.join(wwwRoot, 'index.html'), 'utf8');
  const packs = vm.runInContext('(' + extractObjectLiteral(html, 'var FOCUS_PACKS = {') + ')', ctx);
  ctx.window.pfdIdeaIndex = ctx.window.PFDIdeaMetadata.buildIdeaIndex(packs);
  return {
    W: ctx.window,
    loaded,
    platform,
    seed(n) { math.random = rng(n); }
  };
}

/* ---------- profiles ---------- */
const NAMED = {
  'Overthinker runner': { overallGoals: ['peace_presence'], coreFrictions: ['overthinking', 'work_switch_off'], dayBandwidth: 'pretty_full', defaultTimeBucket: 'short',
    createInterests: ['writing'], createWritingStyles: ['journaling'], mindsetNeeds: ['overthinking', 'presence'], mindsetFormats: ['journaling', 'books'],
    connectTargets: ['partner'], partnerName: 'Josh', movePreferences: ['running', 'walking'], moveDesiredFeelings: ['calming'], resetStyles: ['nature_reset', 'offline_reset'] },
  'Low energy parent': { overallGoals: ['time_for_self'], coreFrictions: ['low_energy', 'self_neglect', 'others_first'], dayBandwidth: 'very_full', defaultTimeBucket: 'micro',
    createInterests: ['cooking_baking'], mindsetNeeds: ['mental_overwhelm'], connectTargets: ['family'], familyNames: ['Maya'], movePreferences: ['walking', 'yoga_stretch'], resetStyles: ['rest_reset', 'self_care'] },
  'Ambitious builder': { overallGoals: ['personal_growth', 'more_creativity'], coreFrictions: ['activation_difficulty'], dayBandwidth: 'very_flexible', defaultTimeBucket: 'flexible',
    createInterests: ['building_business', 'content_creation'], createBuildingTypes: ['digital_products'], createContentStyles: ['tiktok'], createProjects: { building_business: 'passion flow gifts' },
    mindsetNeeds: ['confidence', 'motivation'], mindsetFormats: ['podcasts'], connectTargets: ['community', 'friends'], movePreferences: ['strength', 'fitness_classes'], moveDesiredFeelings: ['strong'], resetStyles: ['space_reset'] },
  'Phone heavy student': { overallGoals: ['less_screen_time', 'fun_novelty'], coreFrictions: ['phone_overuse', 'repetitive_days'], dayBandwidth: 'balanced', defaultTimeBucket: 'short',
    createInterests: ['photography', 'music'], createPhotoStyles: ['phone_photos'], createMusicSubtypes: ['guitar'], createLevels: { music: 'new' }, mindsetFormats: ['videos'],
    connectTargets: ['friends'], friendNames: ['Lena'], movePreferences: ['dance', 'sports'], resetStyles: ['offline_reset', 'solo_reset'] },
  'Megan, musician': { overallGoals: ['more_creativity', 'deeper_relationships'], coreFrictions: ['choice_overload'], dayBandwidth: 'balanced', defaultTimeBucket: 'short',
    createInterests: ['music'], createMusicSubtypes: ['songwriting', 'singing'], createLevels: { music: 'regular' }, createProjects: { music: "Megan's music album, 'the truth'" },
    mindsetFormats: ['books'], connectTargets: ['partner'], partnerName: 'Josh', partnerConnectionStyles: ['cozy'], movePreferences: ['fitness_classes', 'dance'], resetStyles: ['nourishing_reset', 'self_care'] }
};

function mkProfile(W, fields) {
  const p = W.PFDConstants.createEmptyProfileV3();
  Object.assign(p, JSON.parse(JSON.stringify(fields)));
  p.completedAt = 1;
  return p;
}

const BW = ['very_full', 'pretty_full', 'balanced', 'very_flexible'];
const TB = ['micro', 'short', 'medium', 'flexible'];
const FR = ['overthinking', 'work_switch_off', 'phone_overuse', 'low_energy', 'repetitive_days', 'choice_overload', 'activation_difficulty', 'self_neglect', 'time_pressure', 'lack_direction'];
const CREATE = ['art_crafts', 'writing', 'music', 'photography', 'cooking_baking', 'content_creation', 'building_business', 'diy_design', 'fashion_beauty'];
const MOVE = ['walking', 'running', 'yoga_stretch', 'strength', 'dance', 'sports', 'fitness_classes', 'hiking'];
const RESET = ['self_care', 'space_reset', 'nature_reset', 'solo_reset', 'offline_reset', 'rest_reset', 'nourishing_reset'];
const TARGETS = ['partner', 'friends', 'family', 'community'];
const FORMATS = ['books', 'podcasts', 'journaling', 'videos', 'learning', 'mindfulness'];

/** The same seed always yields the same profiles, on any platform. */
function randomProfiles(n, seed) {
  const r = rng(seed);
  const pick = (arr, k) => { const c = arr.slice(), o = []; while (o.length < k && c.length) o.push(c.splice(Math.floor(r() * c.length), 1)[0]); return o; };
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      dayBandwidth: BW[i % 4], defaultTimeBucket: TB[(i >> 2) % 4], coreFrictions: pick(FR, 2),
      createInterests: pick(CREATE, 2), movePreferences: pick(MOVE, 2), resetStyles: pick(RESET, 2),
      connectTargets: pick(TARGETS, 2), mindsetFormats: pick(FORMATS, 2), partnerName: 'Sam', friendNames: ['Ana'], familyNames: ['Mom']
    });
  }
  return out;
}

/* ---------- the yardstick (independent of the code under test) ---------- */
const Y = {
  multiDay: /\b(every day|each day|per day|for a week|this week|for \d+ days|\d+ days|\d+.day|for a month|this month|every week|weekly|one per day|every morning|every night|[a-z]+-a-day)\b/i,
  heavy: /\b(class|course|workshop|lesson|trip|museum|concert|spa\b|restaurant|gym|afternoon|whole day|full day|all day|from scratch|full (meal|holiday meal|biography|book|session)|marathon|5k|deep clean)\b/i,
  resetChore: /\b(deep clean|declutter|organiz|capsule wardrobe|meal prep|clean (out|your|the)|from scratch|recipe|every single street|explore|track)\b/i,
  statedLength: /\b\d+\s*(minutes?|mins?|hours?|days?|weeks?)\b|\b(afternoon|morning|evening|full day|all day)\b/i,
  timePrefix: /^(Try this for|Give yourself) /,
  kinds: ['journal', 'walk', 'run', 'jog', 'read', 'book', 'podcast', 'stretch', 'yoga', 'dance', 'cook', 'bake', 'recipe', 'photo', 'clean', 'declutter', 'organiz', 'nap', 'shower', 'bath', 'tea', 'letter', 'paint', 'draw', 'sing', 'song', 'write', 'meditat', 'breath']
};
/* Ideas a human has checked where the yardstick's wording pattern is wrong. Each
   needs a reason. Keep this short: a growing list means the yardstick needs work. */
const REVIEWED_NOT_MULTI_DAY = {
  // "weekly" describes the report; checking it is a ten minute task today.
  'Do a screen-time audit, check your weekly report and be honest': true
};
function isMultiDay(text) {
  return Y.multiDay.test(text) && !REVIEWED_NOT_MULTI_DAY[text];
}

function kindOf(text) {
  const t = (text || '').toLowerCase();
  for (const k of Y.kinds) if (t.includes(k)) return k;
  return '';
}
function statedMinutes(text) {
  const t = (text || '').toLowerCase();
  const m = t.match(/(\d+)\s*(minutes?|mins?)\b/);
  if (m) return +m[1];
  const h = t.match(/(\d+)\s*hours?\b/);
  if (h) return 60 * +h[1];
  if (/\b(an?|one)\s+hour\b/.test(t)) return 60;
  // "good morning" is a greeting, not a length.
  if (/\b(afternoon|morning|evening|full day|all day|whole day)\b/.test(t.replace(/good (?:morning|afternoon|evening)/g, ''))) return 180;
  return null;
}
const BUCKET_MAX = { micro: 10, short: 30, medium: 60, flexible: Infinity };
/** Does the idea match what this person said they like, for its category? */
function matchesPreference(idea, p, cat) {
  const ov = (a, b) => (a || []).some((x) => (b || []).includes(x));
  if (cat === 'create') return !(p.createInterests || []).length || ov(idea.createInterestTags, p.createInterests);
  if (cat === 'learn') return !(p.mindsetFormats || []).length || ov(idea.mindsetFormatTags, p.mindsetFormats);
  if (cat === 'connect') return !(p.connectTargets || []).length || ov(idea.connectTargetTags, p.connectTargets);
  if (cat === 'move') return !(p.movePreferences || []).length || ov(idea.moveTypeTags, p.movePreferences);
  if (cat === 'nourish') return !(p.resetStyles || []).length || ov(idea.resetStyleTags, p.resetStyles);
  return true;
}

/* ---------- runs ---------- */
function composeTitle(sys, idea, p, cat) {
  return sys.W.PFDRecommendationComposer.compose(idea, p, cat, {}).title;
}

/** Daily Flow for one profile with a fixed engine seed. */
/* extraCtx lets a caller reproduce a specific surface, e.g. the onboarding preview's
   PFDOnboarding.previewContext(). */
function dailyFlow(sys, fields, seed, extraCtx) {
  sys.seed(seed);
  const p = mkProfile(sys.W, fields);
  const plan = sys.W.PFDRecommendationEngine.planMyDay(p, Object.assign({ recentShown: [] }, extraCtx || {}));
  const cards = {};
  CATS.forEach((c) => { if (plan[c]) cards[c] = { idea: plan[c], title: composeTitle(sys, plan[c], p, c) }; });
  return { profile: p, cards };
}

function measure(sys, profiles, seed) {
  const m = { days: 0, cards: 0, contra: 0, multiDayDays: 0, heavyDays: 0, twoHeavyDays: 0, repeatDays: 0,
    resetChoreDays: 0, overTimeCards: 0, prefMatch: 0, pfmCards: 0, pfmMultiDay: 0 };
  const failures = { contra: [], multiDay: [], twoHeavy: [], repeat: [], resetChore: [], overTime: [] };
  profiles.forEach((fields, i) => {
    const day = dailyFlow(sys, fields, seed + i);
    const p = day.profile;
    m.days++;
    let heavy = 0, multi = false, chore = false;
    const kinds = [];
    Object.keys(day.cards).forEach((c) => {
      const { idea, title } = day.cards[c];
      m.cards++;
      // The bug being measured: a length placed IN FRONT OF the idea's own wording when
      // that wording already states a length. Templates that write their own activity
      // ("Give yourself 15 minutes of slow stretching") set their own length and are fine.
      const prefixed = title !== idea.text && title.endsWith(idea.text) && Y.timePrefix.test(title);
      if (prefixed && Y.statedLength.test(idea.text)) { m.contra++; failures.contra.push(title); }
      if (isMultiDay(idea.text)) { multi = true; failures.multiDay.push('[' + c + '] ' + idea.text); }
      if (Y.heavy.test(idea.text)) heavy++;
      if (c === 'nourish' && Y.resetChore.test(idea.text)) { chore = true; failures.resetChore.push(idea.text); }
      const mins = statedMinutes(idea.text);
      if (mins != null && mins > BUCKET_MAX[p.defaultTimeBucket || 'flexible']) { m.overTimeCards++; failures.overTime.push('[' + p.defaultTimeBucket + '] ' + idea.text); }
      if (matchesPreference(idea, p, c)) m.prefMatch++;
      kinds.push(kindOf(idea.text));
    });
    if (multi) m.multiDayDays++;
    if (heavy) m.heavyDays++;
    if (heavy >= 2) { m.twoHeavyDays++; failures.twoHeavy.push(Object.keys(day.cards).map((c) => day.cards[c].idea.text).filter((t) => Y.heavy.test(t)).join('  +  ')); }
    const k = kinds.filter(Boolean);
    if (new Set(k).size < k.length) {
      m.repeatDays++;
      const dup = k.find((x, j) => k.indexOf(x) !== j);
      failures.repeat.push(dup + ': ' + Object.keys(day.cards).map((c) => day.cards[c].idea.text).filter((t) => kindOf(t) === dup).join('  |  '));
    }
    if (chore) m.resetChoreDays++;
    // Pick for Me: one card per category
    sys.seed(seed + 100000 + i);
    CATS.forEach((c) => {
      const one = sys.W.PFDRecommendationEngine.pickForCategory(c, p, { categoryId: c, recentShown: [] });
      if (!one) return;
      m.pfmCards++;
      if (isMultiDay(one.text)) m.pfmMultiDay++;
    });
  });
  return { m, failures };
}

/** 12 consecutive single-card shuffles, mirroring the UI's exclusion cascade. */
function shuffleDiversity(sys, fields, seed) {
  const E = sys.W.PFDRecommendationEngine;
  const p = mkProfile(sys.W, fields);
  const out = {};
  CATS.forEach((cat, ci) => {
    sys.seed(seed + ci);
    const ids = [], themes = [], seen = new Set(), kinds = {};
    const first = E.pickForCategory(cat, p, { categoryId: cat, recentShown: [] });
    if (!first) return;
    ids.push(first.id); themes.push(E.recommendationThemeKey(first, p, cat)); seen.add(first.id);
    kinds[kindOf(first.text) || 'other'] = 1;
    let repeats = 0, rerolls = 0, sameAsReplaced = 0, prevKind = kindOf(first.text), current = first;
    for (let n = 0; n < 12; n++) {
      let got = null;
      const tries = [ids.slice(), ids.length ? ids.slice(-1) : [], [], []];
      for (let t = 0; t < tries.length && !got; t++) {
        // As the app does: the shuffle knows which card it is replacing.
        got = E.pickForCategory(cat, p, { categoryId: cat, excludeIds: tries[t], excludeThemes: themes.slice(), shuffleMode: true, topN: 50, recentShown: [], replacing: current });
      }
      if (got) current = got;
      if (!got) break;
      rerolls++;
      const gotKind = kindOf(got.text);
      // What a user feels: "I hit shuffle and got the same kind of thing again."
      if (prevKind && gotKind === prevKind) sameAsReplaced++;
      prevKind = gotKind;
      if (seen.has(got.id)) repeats++;
      seen.add(got.id); ids.push(got.id);
      const th = E.recommendationThemeKey(got, p, cat);
      if (!themes.includes(th)) themes.push(th);
      const k = kindOf(got.text) || 'other';
      kinds[k] = (kinds[k] || 0) + 1;
    }
    const top = Math.max.apply(null, Object.values(kinds));
    out[cat] = { distinctIdeas: seen.size, repeats, themeKeys: themes.length, topKindShare: top / 13, rerolls, sameAsReplaced };
  });
  return out;
}

module.exports = { load, rng, NAMED, mkProfile, randomProfiles, measure, shuffleDiversity, dailyFlow, CATS, Y, kindOf };
