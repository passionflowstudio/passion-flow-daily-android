/**
 * Create project names only attach to ideas from the interest they belong to.
 *
 * Run:  node tests/create-project-names.test.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {}, console };
vm.createContext(ctx);
['personalization-constants.js', 'create-style-ideas.js', 'idea-metadata.js', 'recommendation-engine.js', 'recommendation-composer.js'].forEach((f) => {
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'www', f), 'utf8'), ctx, { filename: f });
});
const C = ctx.window.PFDRecommendationComposer;

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (e) { console.error('FAIL', name); throw e; }
}

const NAMES = ['passion flow gifts', 'my EP', 'garage shelves'];
const MUSIC_IDEA = { id: 'm1', text: 'Learn basic music theory', tag: 'Music', packId: 'learn-a-skill', categoryId: 'create' };
const BUSINESS_IDEA = { id: 'b1', text: 'Write down three ways to get your first customer', packId: 'build-something', tag: 'Business', categoryId: 'create', productivityHeavy: true };
const DIY_IDEA = { id: 'd1', text: 'Sketch a plan for one small fix around the house', packId: 'build-something', tag: 'DIY Projects', categoryId: 'create' };

function profile(extra) {
  return Object.assign(ctx.window.PFDConstants.createEmptyProfileV3(), {
    createInterests: ['building_business', 'music', 'diy_design'],
    projectNames: NAMES.slice(),
    projectName: NAMES[0]
  }, extra || {});
}

function titlesFor(idea, prof, picks) {
  const out = [];
  for (let i = 0; i < (picks || 6); i++) out.push(C.compose(idea, prof, 'create', { projectNamePick: i }).title);
  return out;
}

const TYPED = profile({ projectTypes: ['building_business', 'music', 'diy_design'] });

test('a business project never appears on a music idea', () => {
  titlesFor(MUSIC_IDEA, TYPED).forEach((t) => assert.ok(!/passion flow gifts|garage shelves/i.test(t), t));
});

test('a music idea can carry the music project', () => {
  assert.ok(titlesFor(MUSIC_IDEA, TYPED).some((t) => /my EP/.test(t)));
});

test('a business idea only ever carries the business project', () => {
  const ts = titlesFor(BUSINESS_IDEA, TYPED);
  ts.forEach((t) => assert.ok(!/my EP|garage shelves/i.test(t), t));
  assert.ok(ts.some((t) => /passion flow gifts/.test(t)));
});

test('a DIY idea only ever carries the DIY project', () => {
  titlesFor(DIY_IDEA, TYPED).forEach((t) => assert.ok(!/my EP|passion flow gifts/i.test(t), t));
});

test('without tags, an unclear name stays off music ideas when there are several interests', () => {
  const untagged = profile({ projectNames: ['passion flow gifts'], projectName: 'passion flow gifts' });
  titlesFor(MUSIC_IDEA, untagged).forEach((t) => assert.ok(!/passion flow gifts/i.test(t), t));
});

test('without tags, keyword names still match their interest', () => {
  const untagged = profile({ projectNames: ['my album'], projectName: 'my album' });
  assert.ok(titlesFor(MUSIC_IDEA, untagged).some((t) => /my album/.test(t)));
});

test('skipProjectName still gives a plain idea', () => {
  const r = C.compose(MUSIC_IDEA, TYPED, 'create', { skipProjectName: true });
  assert.strictEqual(r.family, 'generic');
});

test('legacy forceProjectName no longer forces an unrelated name', () => {
  const r = C.compose(MUSIC_IDEA, profile({ projectTypes: ['building_business', null, null], projectNames: ['passion flow gifts'] }), 'create', { forceProjectName: true, projectNamePick: 0 });
  assert.ok(!/passion flow gifts/i.test(r.title), r.title);
});

const K = ctx.window.PFDConstants;
const BY_INTEREST = profile({ projectNames: [], projectName: '', createProjects: { building_business: 'passion flow gifts', music: 'my EP', diy_design: 'garage shelves' } });

test('createProjects: each project stays in its own interest', () => {
  titlesFor(MUSIC_IDEA, BY_INTEREST).forEach((t) => assert.ok(!/passion flow gifts|garage shelves/i.test(t), t));
  titlesFor(BUSINESS_IDEA, BY_INTEREST).forEach((t) => assert.ok(!/my EP|garage shelves/i.test(t), t));
  titlesFor(DIY_IDEA, BY_INTEREST).forEach((t) => assert.ok(!/my EP|passion flow gifts/i.test(t), t));
});

test('migration: tagged legacy names move under their interest', () => {
  const p = K.migrateProfileToV3(profile({ projectTypes: ['building_business', 'music', 'diy_design'] }));
  assert.deepStrictEqual(JSON.parse(JSON.stringify(p.createProjects)), { building_business: 'passion flow gifts', music: 'my EP', diy_design: 'garage shelves' });
});

test('migration: untagged keyword names find their interest, unclear names get a free slot', () => {
  const p = K.migrateProfileToV3(profile({ projectNames: ['passion flow gifts', 'my album'], projectName: 'passion flow gifts' }));
  assert.strictEqual(p.createProjects.music, 'my album');
  assert.strictEqual(p.createProjects.building_business, 'passion flow gifts');
});

test('migration: legacy arrays mirror createProjects', () => {
  const p = K.migrateProfileToV3(BY_INTEREST);
  assert.strictEqual(p.projectNames.length, 3);
  assert.strictEqual(p.projectTypes[p.projectNames.indexOf('my EP')], 'music');
});

test('migration: single building type becomes a list', () => {
  const p = K.migrateProfileToV3(profile({ createBuildingType: 'real_estate' }));
  assert.deepStrictEqual(Array.from(p.createBuildingTypes), ['real_estate']);
});

test('style picks lift matching ideas', () => {
  const E = ctx.window.PFDRecommendationEngine;
  const guitar = { id: 'g1', text: 'Learn three guitar chords', tag: 'Music', packId: 'learn-a-skill', categoryId: 'create', createInterestTags: ['music'], createSubtypeTags: [] };
  const base = profile({ createMusicSubtypes: [] });
  const withStyle = profile({ createMusicSubtypes: ['guitar'] });
  const ctxArg = { categoryId: 'create' };
  assert.ok(E.scoreIdea(guitar, withStyle, ctxArg) > E.scoreIdea(guitar, base, ctxArg));
});

const S = ctx.window.PFDCreateStyleIdeas;
const STYLE_INDEX = S.buildIndex(ctx.window.PFDIdeaMetadata);
const E2 = ctx.window.PFDRecommendationEngine;
const CTX = { categoryId: 'create', relaxTime: true };
function styleIdeas(interest, style) { return STYLE_INDEX.filter((i) => i.styleInterest === interest && i.styleId === style); }

test('every chip has its own ideas and every idea id is unique', () => {
  const ids = new Set();
  K.CREATE_STYLE_GROUPS.forEach((g) => {
    assert.ok(g.options.length >= 6 && g.options.length <= 8, g.interest + ' has ' + g.options.length + ' chips');
    g.options.forEach((o) => assert.ok(styleIdeas(g.interest, o.id).length >= 6, g.interest + '/' + o.id));
  });
  STYLE_INDEX.forEach((i) => { assert.ok(!ids.has(i.id), i.id); ids.add(i.id); });
});

test('no dashes in chip labels or idea text', () => {
  K.CREATE_STYLE_GROUPS.forEach((g) => g.options.forEach((o) => assert.ok(!/[\u2013\u2014-]/.test(o.label), o.label)));
  STYLE_INDEX.forEach((i) => assert.ok(!/[\u2013\u2014]| - /.test(i.text), i.text));
});

test('guitar ideas only go to people who picked Guitar', () => {
  const g = styleIdeas('music', 'guitar');
  const noChip = profile({ createMusicSubtypes: ['piano'] });
  const chip = profile({ createMusicSubtypes: ['guitar'] });
  g.forEach((i) => assert.strictEqual(E2.passesHardFilters(i, noChip, CTX), false));
  assert.ok(g.some((i) => E2.passesHardFilters(i, chip, CTX)));
});

test('levels: beginners skip advanced ideas, regulars skip beginner ideas, back sees all', () => {
  const g = styleIdeas('music', 'guitar');
  const at = (lvl) => g.filter((i) => E2.passesHardFilters(i, profile({ createMusicSubtypes: ['guitar'], createLevels: { music: lvl } }), CTX));
  assert.ok(at('new').every((i) => i.level !== 'regular'));
  assert.ok(at('regular').every((i) => i.level !== 'new'));
  assert.strictEqual(at('back').length, g.length);
});

test('real estate ideas reach someone who picked Real estate', () => {
  const p = profile({ createBuildingTypes: ['real_estate'] });
  assert.ok(styleIdeas('building_business', 'real_estate').some((i) => E2.passesHardFilters(i, p, CTX)));
});

test('style ideas keep their exact wording, with the project in front when it fits', () => {
  const idea = styleIdeas('music', 'guitar').find((i) => i.level !== 'new');
  const plain = C.compose(idea, profile({ createMusicSubtypes: ['guitar'], projectNames: [], projectName: '' }), 'create', {});
  assert.strictEqual(plain.title, idea.text);
  const named = C.compose(idea, profile({ createMusicSubtypes: ['guitar'], projectNames: [], projectName: '', createProjects: { music: 'my EP' } }), 'create', {});
  assert.ok(named.title.indexOf('my EP') >= 0 && named.title.indexOf(idea.text) >= 0, named.title);
  const otherProject = C.compose(idea, profile({ createMusicSubtypes: ['guitar'], projectNames: [], projectName: '', createProjects: { building_business: 'passion flow gifts' } }), 'create', {});
  assert.strictEqual(otherProject.title, idea.text);
});

test('beginner lessons and ambiguous business chips never get a project name', () => {
  const beginner = styleIdeas('music', 'guitar').find((i) => i.level === 'new');
  const p = profile({ createMusicSubtypes: ['guitar'], projectNames: [], projectName: '', createProjects: { music: 'my EP' } });
  assert.strictEqual(C.compose(beginner, p, 'create', {}).title, beginner.text);
  const re = styleIdeas('building_business', 'real_estate').find((i) => i.level !== 'new');
  const biz = profile({ createInterests: ['building_business'], createBuildingTypes: ['real_estate', 'digital_products'], projectNames: [], projectName: '', createProjects: { building_business: 'passion flow gifts' } });
  assert.strictEqual(C.compose(re, biz, 'create', {}).title, re.text);
});

test('picked styles outrank generic ideas for the same interest', () => {
  const p = profile({ createMusicSubtypes: ['guitar'], createLevels: { music: 'new' } });
  const styled = styleIdeas('music', 'guitar').find((i) => i.level === 'new');
  assert.ok(E2.scoreIdea(styled, p, CTX) > E2.scoreIdea(MUSIC_IDEA, p, CTX));
});

test('old building choices carry over to the new chips', () => {
  const p = K.migrateProfileToV3(profile({ createBuildingType: 'side_hustle', createBuildingTypes: [] }));
  assert.deepStrictEqual(Array.from(p.createBuildingTypes), ['ecommerce']);
});

test('time ranges say "to", never a dash', () => {
  K.TIME_BUCKET_OPTIONS.forEach((o) => assert.ok(!/\d\s*[\u2013\u2014-]\s*\d/.test(o.label), o.label));
  const idea = { id: 'w1', text: 'Take a walk', categoryId: 'move', moveTypeTags: ['walking'], timeEstimate: 'micro' };
  const p = Object.assign(K.createEmptyProfileV3(), { movePreferences: ['walking'], defaultTimeBucket: 'micro' });
  for (let k = 0; k < 6; k++) {
    const t = C.compose(Object.assign({}, idea, { id: 'w' + k }), p, 'move', {}).title;
    assert.ok(!/\d\s*[\u2013\u2014-]\s*\d/.test(t), t);
  }
});

test('a fiction project stays off poetry and journaling ideas', () => {
  const p = profile({ createInterests: ['writing'], createWritingStyles: ['fiction', 'poetry', 'journaling'], projectNames: [], projectName: '', createProjects: { writing: 'my novel' } });
  ['poetry', 'journaling'].forEach((s) => styleIdeas('writing', s).forEach((i) => {
    for (let k = 0; k < 4; k++) assert.ok(!/my novel/.test(C.compose(i, p, 'create', { projectNamePick: k }).title), i.text);
  }));
  const fiction = styleIdeas('writing', 'fiction').filter((i) => i.level !== 'new');
  assert.ok(fiction.some((i) => /my novel/.test(C.compose(i, p, 'create', {}).title)));
});

test('a style keyword only counts when that chip is picked', () => {
  const p = profile({ createInterests: ['music'], createMusicSubtypes: ['guitar'], projectNames: [], projectName: '', createProjects: { music: 'every single winter' } });
  const g = styleIdeas('music', 'guitar').filter((i) => i.level !== 'new');
  assert.ok(g.some((i) => /every single winter/.test(C.compose(i, p, 'create', {}).title)));
});

/* A recommendation is never more specific than what we know: "Music" alone does not
   mean drums, guitar or singing, so style ideas wait until a style is picked. */
test('an interest with no styles picked gets none of the style specific ideas', () => {
  const p = profile({ createInterests: ['music'], createMusicSubtypes: [] });
  assert.strictEqual(STYLE_INDEX.filter((i) => i.styleInterest === 'music' && E2.passesHardFilters(i, p, CTX)).length, 0);
  assert.strictEqual(STYLE_INDEX.filter((i) => i.styleInterest === 'writing' && E2.passesHardFilters(i, p, CTX)).length, 0);
});

test('a detailed user who picked styles still gets exactly those style ideas', () => {
  const p = profile({ createInterests: ['music'], createMusicSubtypes: ['guitar', 'singing'], deepPersonalizationCompleted: true });
  const passing = STYLE_INDEX.filter((i) => i.styleInterest === 'music' && E2.passesHardFilters(i, p, CTX));
  const styles = new Set(passing.map((i) => i.styleId));
  assert.ok(passing.length >= 10, 'only ' + passing.length + ' guitar / singing ideas passed');
  assert.deepStrictEqual(Array.from(styles).sort(), ['guitar', 'singing']);
  assert.ok(styleIdeas('music', 'drums').every((i) => !E2.passesHardFilters(i, p, CTX)), 'drums leaked in');
});

test('a broad profile never sees ideas that assume gear or places, a detailed one can', () => {
  const W = ctx.window;
  const gear = W.PFDIdeaMetadata.getIdeaMetadata({ text: 'Take your camera to the beach at golden hour' }, 'create', null);
  assert.ok(gear.assumes, 'camera / beach should mark the idea as assuming gear or a place');
  const idea = Object.assign({ id: 'g1', text: 'Take your camera to the beach at golden hour', categoryId: 'create' }, gear);
  const plain = Object.assign({}, idea, { assumes: false });
  const broad = profile({ createInterests: ['photography'], deepPersonalizationCompleted: false }), deep = profile({ createInterests: ['photography'], deepPersonalizationCompleted: true });
  assert.strictEqual(E2.passesHardFilters(plain, broad, CTX), true, 'control: the idea passes when it assumes nothing');
  assert.strictEqual(E2.passesHardFilters(idea, broad, CTX), false);
  assert.strictEqual(E2.passesHardFilters(idea, deep, CTX), E2.passesHardFilters(plain, deep, CTX));
});

test('a leading "for" in the project name is not doubled', () => {
  const idea = styleIdeas('music', 'guitar').find((i) => i.level !== 'new');
  const p = profile({ createMusicSubtypes: ['guitar'], projectNames: [], projectName: '', createProjects: { music: 'For the album' } });
  const t = C.compose(idea, p, 'create', {}).title;
  assert.ok(/the album/.test(t) && !/for for/i.test(t), t);
});

test('Connect shuffles rotate across every person type the user picked', () => {
  const p = Object.assign(K.createEmptyProfileV3(), { connectTargets: ['partner', 'friends', 'community', 'family'], partnerName: 'Megan', defaultTimeBucket: 'flexible' });
  const pool = [];
  ['partner', 'friends', 'community', 'family'].forEach((t) => { for (let i = 0; i < 6; i++) pool.push({ id: t + i, text: t + ' idea ' + i, categoryId: 'connect', connectTargetTags: [t], timeEstimate: 'short' }); });
  const prevIndex = ctx.window.pfdIdeaIndex;
  ctx.window.pfdIdeaIndex = pool;
  const seen = [], themes = [], ids = [];
  for (let k = 0; k < 8; k++) {
    const idea = E2.pickForCategory('connect', p, { excludeIds: ids.slice(), excludeThemes: themes.slice(), shuffleMode: true });
    ids.push(idea.id);
    themes.push(E2.recommendationThemeKey(idea, p, 'connect'));
    seen.push(E2.primaryConnectTarget(idea, p));
  }
  ctx.window.pfdIdeaIndex = prevIndex;
  assert.strictEqual(new Set(seen.slice(0, 4)).size, 4, seen.join(','));
  assert.strictEqual(new Set(seen.slice(4, 8)).size, 4, seen.join(','));
});

console.log(`create-project-names: ${passed} passed`);
