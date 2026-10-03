/**
 * Passion Flow Daily — recommendation scorer (no AI)
 */
(function (global) {
  var TIME_ORDER = { micro: 1, short: 2, medium: 3, long: 4, flexible: 5, '5-10': 1, '15-30': 2, '30-60': 3, any: 5 };

  /* What you actually do, read from the idea's wording. Two ideas with the same kind
     feel like the same activity even when they sit in different categories, which is
     why a day should not show "walk" twice and a reroll should not offer "read" again.
     Order matters: the first match wins. */
  var ACTIVITY_KINDS = [
    'journal', 'meditat', 'breath', 'walk', 'hike', 'run', 'jog', 'stretch', 'yoga', 'dance',
    'podcast', 'read', 'book', 'write', 'letter', 'paint', 'draw', 'sketch', 'sing', 'song',
    'photo', 'film', 'cook', 'bake', 'recipe', 'tea', 'coffee', 'bath', 'shower', 'nap',
    'clean', 'declutter', 'organiz', 'call', 'text', 'garden', 'plant', 'drink', 'snack', 'meal'
  ];
  /* Different words for the same thing to do, so a day never offers a drink three
     times over (a cup of tea to make, a coffee with a friend, a warm drink tonight). */
  var KIND_ALIASES = { tea: 'drink', coffee: 'drink', cook: 'food', bake: 'food', recipe: 'food', snack: 'food', meal: 'food' };
  // Each kind must start a word: "tea" is not inside "instead", "run" not inside "brunch".
  var KIND_PATTERNS = ACTIVITY_KINDS.map(function (k) { return new RegExp('\\b' + k); });

  // The idea's main activity (the first one named); theme keys use this.
  function activityKind(idea) {
    var t = ((idea && idea.text) || '').toLowerCase();
    for (var i = 0; i < ACTIVITY_KINDS.length; i++) {
      if (KIND_PATTERNS[i].test(t)) return KIND_ALIASES[ACTIVITY_KINDS[i]] || ACTIVITY_KINDS[i];
    }
    return '';
  }

  /* Every activity the idea involves. "A 25 minute walk, letting your breathing match
     your steps" is a walk as much as a breathing exercise, so it clashes with both. */
  function activityKinds(idea) {
    var t = ((idea && idea.text) || '').toLowerCase();
    var out = [];
    for (var i = 0; i < ACTIVITY_KINDS.length; i++) {
      if (!KIND_PATTERNS[i].test(t)) continue;
      var k = KIND_ALIASES[ACTIVITY_KINDS[i]] || ACTIVITY_KINDS[i];
      if (out.indexOf(k) < 0) out.push(k);
    }
    return out;
  }

  function sharesKind(idea, kinds) {
    if (!kinds || !kinds.length) return false;
    return activityKinds(idea).some(function (k) { return kinds.indexOf(k) >= 0; });
  }

  function getTimeBucket(profile) {
    return profile.defaultTimeBucket || profile.preferredTime || 'flexible';
  }

  function frictionList(profile) {
    return profile.coreFrictions || [];
  }

  /* ---------- versions: what kind of day suits this person ----------
     Each starter idea is written in versions (starter-ideas.js): E easy, C calm,
     D decided, U unplugged, W not work, N new, S stretch. These weights say how
     strongly someone's own answers point to each one. Frictions weigh more than
     goals. Nothing here is guessed: no answer, no weight. */
  var MODE_SIGNALS = {
    E: { frictions: ['low_energy', 'time_pressure'], goals: [], bandwidth: ['very_full'], time: ['micro'] },
    C: { frictions: ['overthinking'], goals: ['peace_presence'] },
    D: { frictions: ['choice_overload', 'overthinking', 'activation_difficulty'], goals: [] },
    U: { frictions: ['phone_overuse'], goals: ['less_screen_time'] },
    W: { frictions: ['work_switch_off', 'self_neglect', 'others_first'], goals: ['time_for_self'] },
    N: { frictions: ['repetitive_days', 'lack_direction'], goals: ['fun_novelty'] },
    S: { frictions: [], goals: ['confidence'] }
  };

  function personModes(profile) {
    var fr = frictionList(profile), goals = profile.overallGoals || [], out = {};
    Object.keys(MODE_SIGNALS).forEach(function (m) {
      var sig = MODE_SIGNALS[m], w = 0;
      sig.frictions.forEach(function (f) { if (fr.indexOf(f) >= 0) w += 2; });
      sig.goals.forEach(function (g) { if (goals.indexOf(g) >= 0) w += 1; });
      if (sig.bandwidth && sig.bandwidth.indexOf(profile.dayBandwidth) >= 0) w += 2;
      if (sig.time && sig.time.indexOf(getTimeBucket(profile)) >= 0) w += 1;
      if (m === 'S' && profile.encouragementStyle === 'push') w += 2;
      if (w) out[m] = Math.min(w, 4);
    });
    if (getTimeBucket(profile) === 'micro') Object.defineProperty(out, '_micro', { value: true });
    return out;
  }

  /* How many cards one version may take in a day. Two, so a tired person can still
     get a playful Create card. With only 5 to 10 minutes everything that fits is
     short, so easy versions may take three. */
  function modeLimit(m, modes) {
    return m === 'E' && modes && modes._micro ? 3 : 2;
  }

  /* The version this idea counts as for this person: their strongest one it has,
     preferring versions not already at their limit today. */
  function primaryMode(idea, modes, counts) {
    var best = null;
    function open(m) { return !counts || (counts[m] || 0) < modeLimit(m, modes); }
    (idea.modes || []).forEach(function (m) {
      if (!modes[m]) return;
      if (!best || (open(m) && !open(best)) || (open(m) === open(best) && modes[m] > modes[best])) best = m;
    });
    return best;
  }

  // Minutes an idea takes: exact for written ideas, otherwise the middle of its bucket.
  var BUCKET_MINUTES = { micro: 10, short: 25, medium: 45, long: 120 };
  function ideaMinutes(idea) {
    return (idea && idea.minutes) || BUCKET_MINUTES[idea && idea.timeEstimate] || 30;
  }

  function dayBudget(profile) {
    var bw = profile.dayBandwidth || 'balanced';
    var fr = frictionList(profile);
    var maxEffort = 3;
    if (bw === 'very_full' || fr.indexOf('low_energy') >= 0) maxEffort = 1.5;
    else if (bw === 'pretty_full') maxEffort = 2.2;
    else if (bw === 'very_flexible') maxEffort = 3.5;
    if (fr.indexOf('time_pressure') >= 0) maxEffort = Math.min(maxEffort, 2);
    return { maxEffort: maxEffort, bandwidth: bw, timeBucket: getTimeBucket(profile) };
  }

  /* Upper bound of each time preference, in minutes. Ideas that know their exact
     length (starter ideas) are held to it; the rest are compared by bucket, since
     a bucket is all we know about them. */
  var TIME_PREFERENCE_MAX_MINUTES = { micro: 10, '5-10': 10, short: 30, '15-30': 30, medium: 60, '30-60': 60 };

  function passesTimeHardFilter(idea, preferred) {
    if (!preferred || preferred === 'flexible' || preferred === 'any') return true;
    if (idea.minutes && TIME_PREFERENCE_MAX_MINUTES[preferred]) {
      return idea.minutes <= TIME_PREFERENCE_MAX_MINUTES[preferred];
    }
    var it = TIME_ORDER[idea.timeEstimate] || 3;
    var pt = TIME_ORDER[preferred] || 4;
    return it <= pt;
  }

  function hasTagOverlap(prefs, tags) {
    if (!prefs || !prefs.length) return true;
    if (!tags || !tags.length) return false;
    return prefs.some(function (p) { return tags.indexOf(p) >= 0; });
  }

  function passesConnectHardFilter(idea, profile) {
    return hasTagOverlap(profile.connectTargets, idea.connectTargetTags);
  }

  /* Who the idea is shown for. Same precedence the composer uses to word it,
     so rotating on this rotates what the user actually sees. */
  var CONNECT_TARGET_ORDER = ['partner', 'family', 'community', 'friends'];
  function primaryConnectTarget(idea, profile) {
    var tags = (idea && idea.connectTargetTags) || [];
    var picked = (profile && profile.connectTargets) || [];
    var mine = picked.length ? tags.filter(function (t) { return picked.indexOf(t) >= 0; }) : tags;
    if (!mine.length) return tags[0] || 'any';
    for (var i = 0; i < CONNECT_TARGET_ORDER.length; i++) {
      if (mine.indexOf(CONNECT_TARGET_ORDER[i]) >= 0) return CONNECT_TARGET_ORDER[i];
    }
    return mine[0];
  }

  /* Style ideas name one exact thing (Guitar, TikTok), so they only go to people
     who picked that chip, at a level that fits them. "back" sees every level. */
  function passesStyleIdeaFilter(idea, profile) {
    var groups = (global.PFDConstants && global.PFDConstants.CREATE_STYLE_GROUPS) || [];
    var group = groups.filter(function (g) { return g.interest === idea.styleInterest; })[0];
    if (!group) return false;
    /* A chip idea names one exact thing (guitar, TikTok, sourdough). It is only
       shown to someone who picked that chip: a recommendation is never more
       specific than what the person has told us. Someone who picked "Music" but
       no chips gets broad music ideas from the rest of the library instead. */
    var picked = profile[group.field] || [];
    if (picked.indexOf(idea.styleId) < 0) return false;
    var lvl = (profile.createLevels || {})[idea.styleInterest];
    if (!idea.level || !lvl || lvl === 'back') return true;
    return lvl === idea.level;
  }

  function passesCreateHardFilter(idea, profile) {
    if (idea && idea.styleId && !passesStyleIdeaFilter(idea, profile)) return false;
    var interests = profile.createInterests || [];
    if (!interests.length) return true;
    return interests.indexOf(primaryCreateInterest(idea, profile)) >= 0;
  }

  function passesLearnHardFilter(idea, profile) {
    var formats = profile.mindsetFormats || [];
    var needs = profile.mindsetNeeds || [];
    if (formats.length) return formats.indexOf(primaryMindsetFormat(idea, profile)) >= 0;
    if (needs.length) return hasTagOverlap(needs, idea.mindsetNeedTags);
    return true;
  }

  function passesMoveHardFilter(idea, profile) {
    return hasTagOverlap(profile.movePreferences, idea.moveTypeTags);
  }

  function primaryResetStyle(idea) {
    var pack = idea && idea.packId;
    var tag = (idea && idea.tag) || '';
    var text = ((idea && idea.text) || '').toLowerCase();
    if (pack === 'nourish-body') return 'nourishing_reset';
    if (pack === 'digital-detox') return 'offline_reset';
    if (pack === 'home-reset') return 'space_reset';
    if (pack === 'self-care') {
      if (tag === 'Rest') return 'rest_reset';
      if (tag === 'Nature') return 'nature_reset';
      return 'self_care';
    }
    if (pack === 'solo-side-quests') {
      if (tag === 'Nature') return 'nature_reset';
      if (tag === 'Movement' && /hike|garden|sunset|sunrise|beach|nature|outside|trail|park|ocean|lake/.test(text)) {
        return 'nature_reset';
      }
      return 'solo_reset';
    }
    var tags = (idea && idea.resetStyleTags) || [];
    if (tags.indexOf('rest_reset') >= 0 && tag === 'Rest') return 'rest_reset';
    if (tags.indexOf('nature_reset') >= 0 && (tag === 'Nature' || /outside|sun|nature/.test(text))) return 'nature_reset';
    return tags[0] || 'self_care';
  }

  function primaryCreateInterest(idea, profile) {
    if (idea && idea.styleInterest) return idea.styleInterest;
    var pack = idea && idea.packId;
    var tag = (idea && idea.tag) || '';
    var text = ((idea && idea.text) || '').toLowerCase();
    var prefs = (profile && profile.createInterests) || [];
    if (/chapter|poem|lyrics|letter to|journal/.test(text) && prefs.indexOf('writing') >= 0) return 'writing';
    if (tag === 'Fashion' || tag === 'Beauty') return 'fashion_beauty';
    if (tag === 'Photography' || (/\b(photo|photograph|camera|time-lapse)\b/.test(text) && pack !== 'build-something' && pack !== 'creative-expression')) return 'photography';
    if (tag === 'Cooking' || (pack === 'learn-a-skill' && /cook|bake|recipe|fridge|cocktail|sourdough|pasta|sushi/.test(text))) return 'cooking_baking';
    if (tag === 'Music' || tag === 'Instrument' || /djing|instrument|playlist|song by ear|singing|guitar|ukulele|music theory/.test(text)) return 'music';
    if (tag === 'Portfolio' || tag === 'Content' || /content calendar|behind-the-scenes|social media account/.test(text)) return 'content_creation';
    if (pack === 'build-something' || pack === 'dream-projects') {
      if (tag === 'DIY Projects') return 'diy_design';
      if (tag === 'Portfolio' || tag === 'Content') return 'content_creation';
      return 'building_business';
    }
    var tagMap = {
      Art: 'art_crafts', Crafts: 'art_crafts', Drawing: 'art_crafts', Make: 'art_crafts',
      Writing: 'writing', Write: 'writing',
      Photography: 'photography',
      Music: 'music', Instrument: 'music', Dance: 'music',
      Cooking: 'cooking_baking',
      Fashion: 'fashion_beauty', Beauty: 'fashion_beauty',
      DIY: 'diy_design', Design: 'diy_design', 'DIY Projects': 'diy_design',
      Explore: 'creative_discovery', Language: 'creative_discovery',
      Portfolio: 'content_creation', Content: 'content_creation',
      Build: 'building_business', Code: 'building_business', Launch: 'building_business',
      Vision: 'building_business', Planning: 'building_business', Building: 'building_business'
    };
    if (tagMap[tag]) return tagMap[tag];
    var tags = (idea && idea.createInterestTags) || [];
    var i;
    for (i = 0; i < prefs.length; i++) {
      if (tags.indexOf(prefs[i]) >= 0) return prefs[i];
    }
    return tags[0] || 'creative_discovery';
  }

  function primaryMindsetFormat(idea, profile) {
    var pack = idea && idea.packId;
    var tag = (idea && idea.tag) || '';
    var text = ((idea && idea.text) || '').toLowerCase();
    if (pack === 'mindfulness') return 'mindfulness';
    if (pack === 'learn-expand') {
      if (tag === 'Reading') return 'books';
      if (tag === 'Podcasts') return 'podcasts';
      if (tag === 'Video') return 'videos';
      if (tag === 'Documentary') return 'documentaries';
      if (tag === 'Research') return 'articles';
      if (tag === 'Study') return 'learning';
    }
    if (pack === 'reflect') {
      if (tag === 'Journaling') return 'journaling';
      return 'reflection_prompts';
    }
    if (pack === 'gratitude') return 'journaling';
    if (pack === 'personal-growth') {
      if (/\b(book|biography|10 pages of reading)\b/.test(text)) return 'books';
      if (tag === 'Habits') return 'learning';
      return 'reflection_prompts';
    }
    var prefs = (profile && profile.mindsetFormats) || [];
    var tags = (idea && idea.mindsetFormatTags) || [];
    var order = ['documentaries', 'podcasts', 'videos', 'books', 'journaling', 'mindfulness', 'articles', 'reflection_prompts', 'learning'];
    var i;
    for (i = 0; i < order.length; i++) {
      if (prefs.indexOf(order[i]) >= 0 && tags.indexOf(order[i]) >= 0) return order[i];
    }
    for (i = 0; i < order.length; i++) {
      if (tags.indexOf(order[i]) >= 0) return order[i];
    }
    return tags[0] || 'learning';
  }

  function unusedThenLruPrefs(prefs, excludeThemes) {
    if (!prefs || !prefs.length) return { unused: [], used: [] };
    var lastIdx = {};
    (excludeThemes || []).forEach(function (t, i) {
      var key = String(t || '').split(':')[0];
      if (key && prefs.indexOf(key) >= 0) lastIdx[key] = i;
    });
    var unused = prefs.filter(function (p) { return lastIdx[p] == null; });
    var usedPrefs = prefs.filter(function (p) { return lastIdx[p] != null; });
    usedPrefs.sort(function (a, b) { return lastIdx[a] - lastIdx[b]; });
    if (unused.length > 1) {
      var start = Math.floor(Math.random() * unused.length);
      unused = unused.slice(start).concat(unused.slice(0, start));
    }
    return { unused: unused, used: usedPrefs };
  }

  function rotatePrefList(prefs, excludeThemes) {
    var ordered = unusedThenLruPrefs(prefs, excludeThemes);
    return ordered.unused.concat(ordered.used);
  }

  function passesNourishHardFilter(idea, profile) {
    var prefs = profile.resetStyles || [];
    if (!prefs.length) return true;
    return prefs.indexOf(primaryResetStyle(idea)) >= 0;
  }

  function passesHardFilters(idea, profile, ctx) {
    var cat = ctx.categoryId || idea.categoryId;
    /* Every caller of the engine is a "do this today" surface (Daily Flow, Pick for
       Me), so a challenge that spans days never qualifies. The browse lists under
       each wheel slice do not use the engine and still show them. */
    if (idea.multiDay) return false;
    /* Same principle beyond Create: an idea that needs a camera, a gym, a guitar or a
       beach waits until the person has told us more than a broad preference. Chip
       ideas are exempt because picking the chip is that detail. */
    if (idea.assumes && !idea.styleId && !profile.deepPersonalizationCompleted) return false;
    // Limits the day-composition step asks for when it swaps a card out.
    if (ctx.maxEffort != null && idea.effortScore > ctx.maxEffort) return false;
    if (ctx.lightOnly && (idea.chore || idea.booking)) return false;
    if (!ctx.relaxTime && !passesTimeHardFilter(idea, getTimeBucket(profile))) return false;
    /* The fallback that relaxes time when nothing fits may still offer a slightly
       longer idea, but never an outing or a class: those must genuinely fit. */
    if (ctx.relaxTime && idea.booking && !passesTimeHardFilter(idea, getTimeBucket(profile))) return false;
    if (cat === 'connect' && !passesConnectHardFilter(idea, profile)) return false;
    if (cat === 'create' && !passesCreateHardFilter(idea, profile)) return false;
    if (cat === 'learn' && !passesLearnHardFilter(idea, profile)) return false;
    if (cat === 'move' && !passesMoveHardFilter(idea, profile)) return false;
    if (cat === 'nourish' && !passesNourishHardFilter(idea, profile)) return false;
    return true;
  }

  function timeFitScore(ideaTime, preferred) {
    var it = TIME_ORDER[ideaTime] || 3;
    var pt = TIME_ORDER[preferred] || 4;
    if (preferred === 'flexible' || preferred === 'any') return 2;
    if (it === pt) return 4;
    if (Math.abs(it - pt) === 1) return 2;
    if (it > pt) return -3;
    // Someone who told us they have an hour shouldn't get mostly five minute ideas.
    if (pt - it >= 2) return -2;
    return 1;
  }

  function overlapScore(arr, tags, weight) {
    weight = weight || 3;
    if (!arr || !arr.length || !tags || !tags.length) return 0;
    var s = 0;
    arr.forEach(function (a) {
      if (tags.indexOf(a) >= 0) s += weight;
    });
    return s;
  }

  function recommendationThemeKey(idea, profile, categoryId) {
    var cat = categoryId || idea.categoryId;
    if (cat === 'connect') {
      var t = primaryConnectTarget(idea, profile);
      var s = (idea.connectionStyleTags && idea.connectionStyleTags[0]) || 'generic';
      if (/walk|run|active|move|workout/.test((idea.text || '').toLowerCase())) s += '_active';
      else if (/café|coffee|food|restaurant|treat|eat/.test((idea.text || '').toLowerCase())) s += '_food';
      else if (/cozy|movie|night in/.test((idea.text || '').toLowerCase())) s += '_cozy';
      else if (/conversation|talk|deep/.test((idea.text || '').toLowerCase())) s += '_talk';
      return t + ':' + s;
    }
    if (cat === 'move') {
      var mt = (idea.moveTypeTags && idea.moveTypeTags[0]) || 'move';
      var mf = (idea.moveFeelingTags && idea.moveFeelingTags[0]) || 'feel';
      return mt + ':' + mf;
    }
    /* The preference comes first (unusedThenLruPrefs splits on ":" to rotate
       preferences), then the activity, so a reroll moves to a different activity
       even for someone with a single preference. */
    var kind = activityKind(idea);
    if (cat === 'create') {
      return primaryCreateInterest(idea, profile) + (kind ? ':' + kind : '');
    }
    if (cat === 'learn') {
      return primaryMindsetFormat(idea, profile) + (kind ? ':' + kind : '');
    }
    if (cat === 'nourish') {
      return primaryResetStyle(idea) + (kind ? ':' + kind : '');
    }
    return idea.id;
  }

  function frictionModifier(idea, frictions, categoryId, why) {
    if (!frictions.length) return 0;
    var s = 0;
    function add(reason, v) { if (!v) return; s += v; if (why) why(reason, v); }
    var h = idea.helpfulForFrictions || [];
    frictions.forEach(function (f) {
      if (h.indexOf(f) >= 0) add('helps with ' + f, 4);
    });
    if (frictions.indexOf('phone_overuse') >= 0) {
      if (idea.offline) add('offline, for phone_overuse', 3);
      if (idea.screen) add('on a screen, for phone_overuse', -6);
      if ((idea.text || '').toLowerCase().indexOf('phone') >= 0 && (idea.text || '').indexOf('away') < 0) add('involves the phone, for phone_overuse', -4);
    }
    if (frictions.indexOf('work_switch_off') >= 0) {
      if (idea.productivityHeavy) add('work-like, for work_switch_off', -6);
      if (categoryId === 'create' && idea.productivityHeavy) add('work-like Create, for work_switch_off', -3);
      if (categoryId === 'create' && !idea.productivityHeavy && (idea.noveltyLevel >= 1 || idea.offline)) add('playful Create, for work_switch_off', 2);
      if (categoryId !== 'create' && !idea.productivityHeavy) add('not work, for work_switch_off', 1);
    }
    if (frictions.indexOf('choice_overload') >= 0) {
      if (idea.effortScore > 2.5) add('big lift, for choice_overload', -3);
      if (idea.effortScore <= 1.5) add('small and simple, for choice_overload', 2);
    }
    /* Someone who overthinks or has too many choices should get a bounded idea, not
       another decision to make. */
    if ((frictions.indexOf('overthinking') >= 0 || frictions.indexOf('choice_overload') >= 0) && idea.openEnded) {
      add('open ended, for overthinking / choice_overload', -10);
    }
    if (frictions.indexOf('activation_difficulty') >= 0 && idea.effortScore <= 1.5) add('easy to start, for activation_difficulty', 3);
    if (frictions.indexOf('low_energy') >= 0 && idea.effortScore > 2) add('too demanding, for low_energy', -5);
    if (frictions.indexOf('repetitive_days') >= 0 && idea.noveltyLevel >= 2) add('something new, for repetitive_days', 4);
    if (frictions.indexOf('self_neglect') >= 0 || frictions.indexOf('others_first') >= 0) {
      if (idea.resetStyleTags && idea.resetStyleTags.indexOf('self_care') >= 0) add('self care, for self_neglect', 2);
      if (categoryId === 'nourish') add('Reset, for self_neglect', 2);
    }
    if (frictions.indexOf('lack_direction') >= 0) {
      if (idea.noveltyLevel >= 2) add('exploring, for lack_direction', 2);
      if ((idea.mindsetNeedTags || []).indexOf('direction') >= 0 || /learn|curious|explore|new/.test((idea.text || '').toLowerCase())) add('curiosity, for lack_direction', 2);
    }
    if (frictions.indexOf('overthinking') >= 0 && categoryId === 'learn') add('Mindset, for overthinking', 1);
    return s;
  }


  function goalModifier(idea, goals, categoryId, why) {
    var s = 0;
    function add(reason, v) { if (!v) return; s += v; if (why) why(reason, v); }
    (goals || []).forEach(function (g) {
      if ((idea.overallGoalTags || idea.goalTags || []).indexOf(g) >= 0) add('fits goal ' + g, 3);
    });
    if (goals.indexOf('less_screen_time') >= 0) {
      if (idea.offline) add('offline, for less_screen_time', 4);
      if (idea.screen) add('on a screen, for less_screen_time', -5);
      if (/phone|screen|scroll|netflix|social media/.test((idea.text || '').toLowerCase()) && !idea.offline) add('screen based, for less_screen_time', -3);
    }
    if (goals.indexOf('movement_energy') >= 0 && categoryId === 'move') add('Move, for movement_energy', 2);
    if (goals.indexOf('deeper_relationships') >= 0 && categoryId === 'connect') add('Connect, for deeper_relationships', 2);
    if (goals.indexOf('peace_presence') >= 0 && (categoryId === 'learn' || categoryId === 'nourish')) add('calm area, for peace_presence', 2);
    if (goals.indexOf('fun_novelty') >= 0 && idea.noveltyLevel >= 2) add('something new, for fun_novelty', 2);
    return s;
  }


  /* +3 per picked style the idea fits, only for interests the user still has picked. */
  function pickedStylesFor(profile, interest) {
    var groups = (global.PFDConstants && global.PFDConstants.CREATE_STYLE_GROUPS) || [];
    return groups.some(function (g) { return g.interest === interest && (profile[g.field] || []).length > 0; });
  }

  function createStyleScore(idea, profile) {
    var groups = (global.PFDConstants && global.PFDConstants.CREATE_STYLE_GROUPS) || [];
    var interests = profile.createInterests || [];
    var text = ((idea && idea.text) || '').toLowerCase();
    var tags = (idea && idea.createSubtypeTags) || [];
    var ideaInterests = (idea && idea.createInterestTags) || [];
    var score = 0;
    groups.forEach(function (g) {
      if (interests.indexOf(g.interest) < 0) return;
      if (g.interest === 'building_business') return;
      if (ideaInterests.length && ideaInterests.indexOf(g.interest) < 0 && primaryCreateInterest(idea, profile) !== g.interest) return;
      var picked = profile[g.field] || [];
      g.options.forEach(function (opt) {
        if (picked.indexOf(opt.id) < 0) return;
        if (tags.indexOf(opt.id) >= 0 || (opt.re && opt.re.test(text))) score += 3;
      });
    });
    return Math.min(score, 6);
  }

  /* ctx.explain, when it is an array, receives [reason, points] for every term that
     moved the score. Used by the tests to show why an idea ranked where it did. */
  function scoreIdea(idea, profile, ctx) {
    if (!passesHardFilters(idea, profile, ctx)) return -9999;

    var score = 0;
    var explain = Array.isArray(ctx.explain) ? ctx.explain : null;
    function add(reason, v) { if (!v) return; score += v; if (explain) explain.push([reason, v]); }
    function note(reason, v) { if (explain && v) explain.push([reason, v]); }
    var fr = frictionList(profile);
    var cat = ctx.categoryId || idea.categoryId;
    var goals = profile.overallGoals || [];

    score += goalModifier(idea, goals, cat, note);
    score += frictionModifier(idea, fr, cat, note);
    add('time fit', timeFitScore(idea.timeEstimate, getTimeBucket(profile)));
    /* Written ideas know their exact length, so they can fit the time someone has
       more closely: an hour-person gets fuller ideas, a quick 5 minutes is for when
       that's all there is. */
    var usualMin = { short: 15, medium: 30 }[getTimeBucket(profile)];
    if (idea.minutes && usualMin && idea.minutes < usualMin / 2) add('much shorter than the time they have', -5);

    if (cat === 'create') {
      add('matches Create interest', overlapScore(profile.createInterests, idea.createInterestTags || [], 10));
      add('matches a picked style', createStyleScore(idea, profile));
      if ((profile.createInterests || []).indexOf('building_business') >= 0 && idea.productivityHeavy) add('business interest', 2);
      if ((profile.createBuildingTypes || []).length && (profile.createInterests || []).indexOf('building_business') >= 0 && idea.productivityHeavy) add('business type picked', 2);
      if (idea.styleId) {
        add('written for a picked chip', 10);
        var lvl = (profile.createLevels || {})[idea.styleInterest];
        if (lvl && idea.level && lvl === idea.level) add('matches their level', 3);
      }
    }
    if (cat === 'learn') {
      add('matches a mindset need', overlapScore(profile.mindsetNeeds, idea.mindsetNeedTags || [], 6));
      add('matches a Mindset format', overlapScore(profile.mindsetFormats, idea.mindsetFormatTags || [], 10));
    }
    if (cat === 'connect') {
      add('matches a Connect target', overlapScore(profile.connectTargets, idea.connectTargetTags || [], 5));
      add('partner style', overlapScore(profile.partnerConnectionStyles, idea.connectionStyleTags || [], 4));
      add('friend style', overlapScore(profile.friendConnectionStyles, idea.connectionStyleTags || [], 4));
      add('family style', overlapScore(profile.familyConnectionStyles, idea.connectionStyleTags || [], 4));
      add('community style', overlapScore(profile.communityConnectionStyles, idea.connectionStyleTags || [], 4));
    }
    if (cat === 'move') {
      add('matches a Move type', overlapScore(profile.movePreferences, idea.moveTypeTags || [], 10));
      add('matches a Move feeling', overlapScore(profile.moveDesiredFeelings, idea.moveFeelingTags || [], 3));
    }
    if (cat === 'nourish') {
      add('matches a Reset style', overlapScore(profile.resetStyles, idea.resetStyleTags || [], 10));
    }

    /* Starter ideas need nothing beyond a broad preference, so while a profile is
       still broad they should lead. Once the person adds detail, specific ideas
       compete on equal terms. */
    if (idea.starter && !profile.deepPersonalizationCompleted) add('starter idea, profile still broad', 8);
    /* Specific beats broad: someone who picked Guitar should mostly get guitar ideas,
       not the broad Music versions written for people who only said "Music". */
    if (idea.starter && cat === 'create' && pickedStylesFor(profile, idea.styleInterest)) add('they picked a specific style for this', -10);

    /* The version of the activity that suits this person today. A tired person gets
       the easy version, someone who wants confidence the stretch version. */
    if (idea.modes && idea.modes.length) {
      var modes = ctx.personModes || personModes(profile);
      var counts = ctx.modeCounts || {};
      var fit = 0;
      // A version already on two cards today no longer earns anything.
      idea.modes.forEach(function (m) { if (modes[m] && (counts[m] || 0) < modeLimit(m, modes)) fit += modes[m] * 3; });
      add('the right version for how they told us today should feel', Math.min(fit, 10));
      if (modes.E >= 2 && idea.modes.indexOf('S') >= 0 && idea.modes.indexOf('E') < 0) add('a challenge on a day that should be easy', -8);
      if (!modes.S && idea.modes.length === 1 && idea.modes[0] === 'S') add('a challenge nobody asked for', -3);
      // No single version takes over the whole day: a tired person can still get a playful Create card.
      var pm = primaryMode(idea, modes, counts);
      if (pm && (counts[pm] || 0) >= modeLimit(pm, modes)) add('this version already on enough cards today', -12);
    }

    if (idea.effortScore > dayBudget(profile).maxEffort) add('over the day\'s effort budget', -8);

    /* Life context: optional, lightly weighted. Bandwidth and time drive fit much more. */
    add('life context', overlapScore(profile.lifeContext, idea.lifeContextTags || [], 1));

    if (ctx.maxMinutes && ideaMinutes(idea) > ctx.maxMinutes) return -9999;

    var exclude = ctx.excludeTexts || [];
    var excludeIds = ctx.excludeIds || [];
    if (exclude.indexOf(idea.text) >= 0 || excludeIds.indexOf(idea.id) >= 0) return -9999;
    if (ctx.deleted && ctx.deleted.indexOf(idea.text) >= 0) return -9999;
    if (ctx.selected && ctx.selected.indexOf(idea.text) >= 0) return -9999;

    // Daily Flow: an activity another card already uses today.
    if (sharesKind(idea, ctx.excludeKinds)) add('activity already on another card', -14);

    var theme = recommendationThemeKey(idea, profile, cat);
    if (ctx.excludeThemes && ctx.excludeThemes.indexOf(theme) >= 0) {
      add('same theme as before', ctx.shuffleMode ? -18 : -8);
    }
    if (ctx.recentShown && ctx.recentShown.indexOf(idea.id) >= 0) return -9999;
    if (ctx.recentCompleted && ctx.recentCompleted.indexOf(idea.id) >= 0) add('done recently', -6);
    if (ctx.saved && ctx.saved.indexOf(idea.text) >= 0) add('saved', 3);

    score += Math.random() * 1.5;
    return score;
  }


  function filterCandidates(index, categoryId) {
    return (index || []).filter(function (i) { return i.categoryId === categoryId; });
  }

  function pickFromPool(pool, profile, ctx, count, opts) {
    count = count || 1;
    opts = opts || {};
    var shuffle = !!ctx.shuffleMode;
    var topN = ctx.topN || opts.topN || (shuffle ? 40 : Math.max(8, count * 3));
    var scored = pool.map(function (idea) {
      return { idea: idea, score: scoreIdea(idea, profile, ctx) };
    }).filter(function (x) { return x.score > -100; });
    /* An activity already on another card today is only a last resort: a strong match
       could otherwise outscore the penalty and put two walks in one day. */
    if (ctx.excludeKinds && ctx.excludeKinds.length) {
      var fresh = scored.filter(function (x) { return !sharesKind(x.idea, ctx.excludeKinds); });
      if (fresh.length) scored = fresh;
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    var top = scored.slice(0, topN);
    var picks = [];
    var used = (ctx.excludeIds || []).slice();
    var usedText = (ctx.excludeTexts || []).slice();
    var usedThemes = (ctx.excludeThemes || []).slice();
    var strictPrefs = (ctx.categoryId === 'move' && (profile.movePreferences || []).length) ||
      (ctx.categoryId === 'create' && (profile.createInterests || []).length) ||
      (ctx.categoryId === 'connect' && (profile.connectTargets || []).length) ||
      (ctx.categoryId === 'nourish' && (profile.resetStyles || []).length) ||
      (ctx.categoryId === 'learn' && ((profile.mindsetFormats || []).length || (profile.mindsetNeeds || []).length));
    /* Daily Flow picks at random from the top few for day to day variety. A caller
       that needs the strongest matches (the onboarding preview) narrows it. */
    var pickWindow = ctx.pickWindow ? Math.min(top.length, ctx.pickWindow)
      : shuffle ? Math.min(top.length, Math.max(6, count * 3)) : Math.min(top.length, strictPrefs ? 4 : 8);
    for (var n = 0; n < count && top.length; n++) {
      var idx = Math.floor(Math.random() * Math.max(1, pickWindow));
      var chosen = top.splice(idx, 1)[0];
      if (!chosen) break;
      picks.push(chosen.idea);
      used.push(chosen.idea.id);
      usedText.push(chosen.idea.text);
      usedThemes.push(recommendationThemeKey(chosen.idea, profile, ctx.categoryId));
      ctx = Object.assign({}, ctx, { excludeIds: used, excludeTexts: usedText, excludeThemes: usedThemes });
      if (!shuffle) {
        top = top.map(function (x) {
          return { idea: x.idea, score: scoreIdea(x.idea, profile, ctx) };
        }).filter(function (x) { return x.score > -100; });
      }
    }
    return picks;
  }

  function pickFromPrefSubset(pool, profile, ctx, prefs, matchFn) {
    var ordered = unusedThenLruPrefs(prefs, ctx.excludeThemes);
    var unused = ordered.unused;
    var usedPrefs = ordered.used;
    function tryList(list, extraCtx) {
      var tryCtx = Object.assign({}, ctx, extraCtx || {});
      var i, subset, picks;
      for (i = 0; i < list.length; i++) {
        subset = pool.filter(function (idea) { return matchFn(idea, list[i]); });
        if (!subset.length) continue;
        picks = pickFromPool(subset, profile, tryCtx, 1);
        if (picks[0]) return picks[0];
      }
      return null;
    }
    var pick = tryList(unused);
    if (pick) return pick;
    pick = tryList(unused, { relaxTime: true });
    if (pick) return pick;
    pick = tryList(unused, { relaxTime: true, excludeIds: [], recentShown: [] });
    if (pick) return pick;
    pick = tryList(usedPrefs, { relaxTime: true });
    if (pick) return pick;
    return tryList(prefs, { relaxTime: true, excludeIds: [], recentShown: [] });
  }

  function pickForCategory(categoryId, profile, ctx) {
    var index = global.pfdIdeaIndex || [];
    var pool = filterCandidates(index, categoryId);
    if (!pool.length) return null;
    ctx = Object.assign({ categoryId: categoryId }, ctx || {});
    /* A shuffle replacing a card moves on from that card's activity when anything else
       fits (another walk is not a new idea). Someone whose only preference is that
       activity still gets it, because a repeated activity is a last resort, not banned. */
    if (ctx.replacing) ctx.excludeKinds = (ctx.excludeKinds || []).concat(activityKinds(ctx.replacing));
    var pick = null;
    if (categoryId === 'nourish' && (profile.resetStyles || []).length) {
      pick = pickFromPrefSubset(pool, profile, ctx, profile.resetStyles, function (idea, style) {
        return primaryResetStyle(idea) === style;
      });
    } else if (categoryId === 'learn' && (profile.mindsetFormats || []).length) {
      pick = pickFromPrefSubset(pool, profile, ctx, profile.mindsetFormats, function (idea, format) {
        return primaryMindsetFormat(idea, profile) === format;
      });
    } else if (categoryId === 'connect' && (profile.connectTargets || []).length > 1) {
      pick = pickFromPrefSubset(pool, profile, ctx, profile.connectTargets, function (idea, target) {
        return primaryConnectTarget(idea, profile) === target;
      });
    } else if (categoryId === 'create' && (profile.createInterests || []).length) {
      pick = pickFromPrefSubset(pool, profile, ctx, profile.createInterests, function (idea, interest) {
        return primaryCreateInterest(idea, profile) === interest;
      });
    }
    if (pick) return pick;
    var picks = pickFromPool(pool, profile, ctx, 1);
    if (picks[0]) return picks[0];
    picks = pickFromPool(pool, profile, Object.assign({}, ctx, { relaxTime: true }), 1);
    return picks[0] || null;
  }

  /* Preferences that are one activity by nature. When it is someone's only pick for an
     area, that card will be that activity, so earlier cards leave it free: a photo walk
     on Create should not use up the walk of someone whose Move is "walking". */
  var PREF_KINDS = {
    move: { field: 'movePreferences', kinds: { walking: ['walk'], running: ['run', 'jog'], dance: ['dance'], yoga_stretch: ['yoga', 'stretch'] } },
    learn: { field: 'mindsetFormats', kinds: { journaling: ['journal'], books: ['read', 'book'], podcasts: ['podcast'] } }
  };
  function reservedKinds(profile, cats) {
    var out = [];
    cats.forEach(function (cat) {
      var spec = PREF_KINDS[cat];
      var picked = spec ? (profile[spec.field] || []) : [];
      if (picked.length === 1 && spec.kinds[picked[0]]) out = out.concat(spec.kinds[picked[0]]);
    });
    return out;
  }

  function planMyDay(profile, ctx) {
    ctx = ctx || {};
    var shuffle = !!ctx.shuffleMode;
    var cats = global.PFDConstants ? global.PFDConstants.CATEGORY_IDS.slice() : ['create', 'learn', 'connect', 'move', 'nourish'];
    var plan = {};
    var excludeIds = [];
    var excludeTexts = [];
    var excludeKinds = [];
    var modes = personModes(profile);
    var modeCounts = {};
    function remember(pick) {
      var pm = primaryMode(pick, modes, modeCounts);
      if (pm) modeCounts[pm] = (modeCounts[pm] || 0) + 1;
      excludeIds.push(pick.id);
      excludeTexts.push(pick.text);
      activityKinds(pick).forEach(function (k) { if (excludeKinds.indexOf(k) < 0) excludeKinds.push(k); });
    }
    cats.forEach(function (cat, i) {
      var pick = pickForCategory(cat, profile, Object.assign({}, ctx, {
        categoryId: cat,
        excludeIds: excludeIds.slice(),
        excludeTexts: excludeTexts.slice(),
        excludeKinds: excludeKinds.concat(reservedKinds(profile, cats.slice(i + 1))),
        personModes: modes,
        modeCounts: Object.assign({}, modeCounts),
        shuffleMode: shuffle,
        topN: ctx.topN || (shuffle ? 50 : undefined)
      }));
      if (pick) {
        plan[cat] = pick;
        remember(pick);
      }
    });
    cats.forEach(function (cat) {
      if (plan[cat]) return;
      var retry = pickForCategory(cat, profile, Object.assign({}, ctx, {
        categoryId: cat,
        excludeIds: excludeIds.slice(),
        excludeTexts: excludeTexts.slice(),
        excludeKinds: excludeKinds.slice(),
        shuffleMode: true,
        relaxTime: true,
        recentShown: []
      }));
      if (retry) {
        plan[cat] = retry;
        remember(retry);
      }
    });
    if (global.PFDPlanCoherence && global.PFDPlanCoherence.refinePlan) {
      plan = global.PFDPlanCoherence.refinePlan(plan, profile, ctx);
    }
    return plan;
  }

  global.PFDRecommendationEngine = {
    scoreIdea: scoreIdea,
    pickForCategory: pickForCategory,
    planMyDay: planMyDay,
    dayBudget: dayBudget,
    pickFromPool: pickFromPool,
    recommendationThemeKey: recommendationThemeKey,
    activityKind: activityKind,
    activityKinds: activityKinds,
    personModes: personModes,
    modeLimit: modeLimit,
    primaryMode: primaryMode,
    ideaMinutes: ideaMinutes,
    primaryResetStyle: primaryResetStyle,
    primaryMindsetFormat: primaryMindsetFormat,
    primaryCreateInterest: primaryCreateInterest,
    primaryConnectTarget: primaryConnectTarget,
    passesHardFilters: passesHardFilters,
    hasTagOverlap: hasTagOverlap
  };
})(window);
