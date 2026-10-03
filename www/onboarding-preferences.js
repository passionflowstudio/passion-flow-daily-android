/**
 * Passion Flow Daily — onboarding quick preferences and the first Daily Flow preview.
 *
 * Shared by iOS and Android: the screen's choices, where each answer is stored, how
 * the preview picks its ideas, and the words around the preview and the paywall.
 * Only the visuals live in each app's index.html.
 *
 * The quick screen writes into the SAME profile fields the deeper Settings
 * personalization edits (createInterests, mindsetFormats, connectTargets,
 * movePreferences, resetStyles). There is no separate onboarding profile: these
 * answers are simply where the real profile starts.
 *
 * No dashes in any copy here.
 */
(function (global) {
  /* What sounds most like you? One section per area, ids are the existing profile
     values for that field. */
  var QUICK_PREFERENCE_AREAS = [
    { area: 'create', field: 'createInterests', choices: [
      { id: 'art_crafts', emoji: '🎨', label: 'Make things' },
      { id: 'writing', emoji: '✍️', label: 'Write' },
      { id: 'music', emoji: '🎵', label: 'Music' },
      { id: 'photography', emoji: '📸', label: 'Capture' },
      { id: 'cooking_baking', emoji: '🍳', label: 'Cook' },
      { id: 'building_business', emoji: '💡', label: 'Build' }
    ] },
    { area: 'learn', field: 'mindsetFormats', choices: [
      { id: 'journaling', emoji: '📓', label: 'Journal' },
      { id: 'books', emoji: '📚', label: 'Read' },
      { id: 'podcasts', emoji: '🎧', label: 'Listen' },
      { id: 'mindfulness', emoji: '🧘', label: 'Be mindful' },
      { id: 'learning', emoji: '💡', label: 'Learn' }
    ] },
    { area: 'connect', field: 'connectTargets', choices: [
      { id: 'partner', emoji: '💗', label: 'Partner' },
      { id: 'friends', emoji: '👯', label: 'Friends' },
      { id: 'family', emoji: '🏡', label: 'Family' },
      { id: 'community', emoji: '🌎', label: 'New people' },
      { id: 'self', emoji: '🫶', label: 'Myself' }
    ] },
    { area: 'move', field: 'movePreferences', choices: [
      { id: 'walking', emoji: '🚶', label: 'Walk' },
      { id: 'strength', emoji: '🏋️', label: 'Strength' },
      { id: 'yoga_stretch', emoji: '🧘', label: 'Yoga' },
      { id: 'dance', emoji: '💃', label: 'Dance' },
      { id: 'running', emoji: '🏃', label: 'Cardio' },
      { id: 'hiking', emoji: '🌿', label: 'Outdoors' }
    ] },
    { area: 'nourish', field: 'resetStyles', choices: [
      { id: 'self_care', emoji: '🛁', label: 'Self-care' },
      { id: 'space_reset', emoji: '🧹', label: 'Space' },
      { id: 'nature_reset', emoji: '🌿', label: 'Nature' },
      { id: 'offline_reset', emoji: '📵', label: 'Offline' },
      { id: 'rest_reset', emoji: '😴', label: 'Rest' },
      { id: 'nourishing_reset', emoji: '☕', label: 'Nourish' }
    ] }
  ];

  /* Up to two per area. Every area is optional: an area left empty is generated
     from the person's other answers. */
  var QUICK_PREFERENCE_MAX = 2;

  var QUICK_PREFERENCE_COPY = {
    title: 'What sounds most like you? ✨',
    subtitle: 'Choose what you naturally enjoy. We’ll use this to shape your first Daily Flow.',
    hint: 'Pick up to 2 in any area, or skip the ones you’re not sure about.'
  };

  function quickPreferenceCount(profile) {
    var n = 0;
    QUICK_PREFERENCE_AREAS.forEach(function (a) { n += ((profile && profile[a.field]) || []).length; });
    return n;
  }

  /* Recorded when the quick screen filled anything in, so the app still offers the
     deeper questions and keeps its specific ideas back until it knows more. */
  function withQuickPreferencesMarked(profile) {
    if (!profile || !quickPreferenceCount(profile)) return profile;
    var next = Object.assign({}, profile);
    if (!next.quickPreferencesAt) next.quickPreferencesAt = Date.now();
    return next;
  }

  /* How the preview selects: the strongest matches rather than the wider random
     pool Daily Flow uses for day to day variety. This is the sales demo, so it shows
     the best fit; shuffle is there for variety. */
  function previewContext(base) {
    return Object.assign({}, base || {}, { topN: 30, pickWindow: 2 });
  }

  /* ---------- "A first look, made for you" ---------- */

  var WANT_PHRASES = {
    more_creativity: 'more creativity',
    peace_presence: 'more peace',
    deeper_relationships: 'deeper connection',
    movement_energy: 'more energy',
    fun_novelty: 'more fun',
    confidence: 'more confidence',
    time_for_self: 'more time for yourself',
    less_screen_time: 'less screen time',
    personal_growth: 'more growth'
  };

  var FRICTION_CLAUSES = {
    overthinking: 'without giving you more to overthink',
    choice_overload: 'with no extra decisions to make',
    phone_overuse: 'mostly away from your phone',
    work_switch_off: 'with nothing that feels like work',
    low_energy: 'gentle enough for a tired day',
    time_pressure: 'sized for the time you actually have',
    activation_difficulty: 'all easy to start',
    repetitive_days: 'and a little something new in your day',
    self_neglect: 'with real room for you in each one',
    others_first: 'with real room for you in each one',
    lack_direction: 'to help you explore what you love'
  };

  var BANDWIDTH_CLAUSES = {
    very_full: 'even on a very full day',
    pretty_full: 'even on a pretty full day'
  };

  /* "more creativity" + "more peace" reads as "more creativity and peace". */
  function joinWants(a, b) {
    if (!b) return a;
    if (a.indexOf('more ') === 0 && b.indexOf('more ') === 0) return a + ' and ' + b.slice(5);
    return a + ' and ' + b;
  }

  /* Two or three of the person's strongest signals, written as one warm sentence. */
  function previewSubtitle(profile) {
    var p = profile || {};
    var wants = (p.overallGoals || []).map(function (g) { return WANT_PHRASES[g]; }).filter(Boolean).slice(0, 2);
    if (!wants.length) return 'Picked around what you shared with us.';
    var friction = null;
    (p.coreFrictions || []).some(function (f) { friction = FRICTION_CLAUSES[f] || null; return !!friction; });
    var clause = friction || BANDWIDTH_CLAUSES[p.dayBandwidth] || '';
    var sentence = 'Picked to bring you ' + joinWants(wants[0], wants[1]);
    if (clause) sentence += ', ' + clause;
    return sentence + '.';
  }

  var PREVIEW_COPY = {
    title: 'A first look, made for you',
    // These five are only a first look: say what is waiting behind them.
    bridgeTitle: 'This is just the beginning \u2728',
    bridgeBody: 'A fresh Daily Flow every morning from 2,000+ ideas, and the more you use it, the more it feels like you.',
    // Opens the paywall; it does not buy anything.
    cta: 'Continue to my Daily Flow'
  };

  /* ---------- paywall: "what do I get if I continue?" ---------- */

  var PAYWALL_COPY = {
    subtitle: 'Wake up to ideas shaped around you, and make more room for what you love across every area of your life.',
    benefits: [
      { emoji: '✨', bold: 'Fresh personalized ideas every day', light: 'a new Daily Flow every morning, shaped around you.' },
      { emoji: '🌱', bold: 'Hundreds of meaningful ideas', light: 'across all five areas of your life.' },
      { emoji: '🌈', bold: 'Balance all five parts', light: 'create, mindset, connect, move, reset.' },
      { emoji: '🏷️', bold: 'Save the ideas you love', light: 'build a personal idea library.' },
      { emoji: '📝', bold: 'Reflect with journal and voice', light: 'capture what made each day meaningful.' },
      { emoji: '📈', bold: 'Watch your Flow grow over time', light: 'progress across all five areas.' }
    ]
  };

  global.PFDOnboarding = {
    QUICK_PREFERENCE_AREAS: QUICK_PREFERENCE_AREAS,
    QUICK_PREFERENCE_MAX: QUICK_PREFERENCE_MAX,
    QUICK_PREFERENCE_COPY: QUICK_PREFERENCE_COPY,
    quickPreferenceCount: quickPreferenceCount,
    withQuickPreferencesMarked: withQuickPreferencesMarked,
    previewContext: previewContext,
    previewSubtitle: previewSubtitle,
    PREVIEW_COPY: PREVIEW_COPY,
    PAYWALL_COPY: PAYWALL_COPY
  };
})(window);
