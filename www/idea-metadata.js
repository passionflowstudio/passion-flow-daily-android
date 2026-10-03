/**
 * Passion Flow Daily — Idea metadata (Tier A heuristics + Tier B tag map)
 * Used by recommendation engine. Built at app init from FOCUS_PACKS.
 */
(function (global) {
  /* ── Tier B: pack tag → canonical goal tags (v2 + v3 overallGoalTags) ── */
  var TAG_GOAL_MAP = {
    Art: ['creativity', 'new_hobbies', 'more_creativity'],
    Writing: ['creativity', 'growth', 'more_creativity', 'personal_growth'],
    Photography: ['creativity', 'new_hobbies', 'more_creativity', 'fun_novelty'],
    Crafts: ['creativity', 'new_hobbies', 'more_creativity'],
    DIY: ['creativity', 'new_hobbies', 'more_creativity'],
    Build: ['creativity', 'growth', 'more_creativity', 'personal_growth'],
    Code: ['growth', 'new_hobbies', 'personal_growth'],
    Design: ['creativity', 'growth', 'more_creativity'],
    'DIY Projects': ['creativity', 'new_hobbies', 'more_creativity'],
    Launch: ['growth', 'consistency', 'personal_growth', 'structure_consistency'],
    Learning: ['growth', 'new_hobbies', 'personal_growth'],
    Reading: ['growth', 'mindfulness', 'personal_growth', 'peace_presence'],
    Skills: ['growth', 'new_hobbies', 'personal_growth'],
    Business: ['growth', 'consistency', 'personal_growth', 'structure_consistency'],
    Mindset: ['mindfulness', 'growth', 'peace_presence', 'personal_growth'],
    Productivity: ['consistency', 'growth', 'structure_consistency', 'personal_growth'],
    Confidence: ['growth', 'mindfulness', 'confidence', 'personal_growth'],
    Friends: ['deeper_connections', 'deeper_relationships'],
    Family: ['deeper_connections', 'deeper_relationships'],
    Romance: ['deeper_connections', 'deeper_relationships'],
    Community: ['deeper_connections', 'deeper_relationships'],
    Social: ['deeper_connections', 'deeper_relationships'],
    Cardio: ['more_movement', 'movement_energy'],
    Strength: ['more_movement', 'movement_energy'],
    Yoga: ['more_movement', 'mindfulness', 'movement_energy', 'peace_presence'],
    Outdoors: ['more_movement', 'adventure', 'movement_energy', 'fun_novelty'],
    Sports: ['more_movement', 'movement_energy'],
    Dance: ['more_movement', 'creativity', 'movement_energy', 'more_creativity'],
    Rest: ['self_care', 'time_for_self'],
    Organization: ['consistency', 'self_care', 'structure_consistency', 'time_for_self'],
    Nourishment: ['self_care', 'time_for_self'],
    'Self-care': ['self_care', 'time_for_self'],
    Wellness: ['self_care', 'mindfulness', 'time_for_self', 'peace_presence'],
    Digital: ['less_screen_time'],
    Nature: ['adventure', 'mindfulness', 'fun_novelty', 'peace_presence'],
    Adventure: ['adventure', 'new_hobbies', 'fun_novelty'],
    Play: ['adventure', 'creativity', 'fun_novelty', 'more_creativity']
  };

  var PACK_CREATE_TAGS = {
    Art: ['art_crafts'], Writing: ['writing'], Write: ['writing'], Photography: ['photography'],
    Crafts: ['art_crafts', 'diy_design'], DIY: ['diy_design'], Build: ['building_business'],
    Code: ['building_business'], Design: ['diy_design'], 'DIY Projects': ['diy_design'],
    Launch: ['building_business'], Dance: ['music'], Music: ['music'], Make: ['art_crafts', 'diy_design'],
    Explore: ['creative_discovery'], Cooking: ['cooking_baking'], Drawing: ['art_crafts'],
    Language: ['creative_discovery'], Instrument: ['music'], Vision: ['building_business'],
    Planning: ['building_business'], Building: ['building_business'], Portfolio: ['content_creation'],
    Content: ['content_creation'], Fashion: ['fashion_beauty'], Beauty: ['fashion_beauty']
  };

  var PACK_ID_CREATE = {
    'build-something': ['building_business'],
    'dream-projects': ['building_business']
  };

  var PACK_MINDSET_NEED = {
    Journaling: ['overthinking', 'presence'], 'Self-Reflection': ['overthinking', 'self_trust', 'negative_self_talk'],
    Goals: ['direction', 'decision_making'], Clarity: ['overthinking', 'mental_overwhelm'],
    Growth: ['direction'], Gratitude: ['presence', 'negative_self_talk'],
    Appreciation: ['comparison', 'negative_self_talk'], Abundance: ['comparison'],
    Joy: ['presence'], Presence: ['presence'], Meditation: ['presence', 'mental_overwhelm', 'overthinking'],
    Breathing: ['mental_overwhelm', 'presence'], Awareness: ['presence', 'overthinking'],
    Focus: ['mental_overwhelm'], Stillness: ['mental_overwhelm', 'presence'],
    Habits: ['motivation'], Mindset: ['negative_self_talk', 'self_trust'],
    Confidence: ['confidence'], Values: ['direction', 'self_trust'], Purpose: ['direction'],
    Reading: ['presence'], Podcasts: ['motivation'], Video: ['motivation'], Documentary: ['motivation'],
    Study: ['direction'], Research: ['direction']
  };

  var PACK_MINDSET_FORMAT = {
    Reading: ['books'], Podcasts: ['podcasts'], Video: ['videos'], Documentary: ['documentaries'],
    Research: ['articles'], Study: ['learning'], Journaling: ['journaling'],
    'Self-Reflection': ['reflection_prompts'], Goals: ['reflection_prompts'],
    Clarity: ['reflection_prompts'], Growth: ['reflection_prompts'],
    Gratitude: ['journaling'], Appreciation: ['journaling'],
    Abundance: ['journaling'], Joy: ['journaling'],
    Presence: ['mindfulness'], Meditation: ['mindfulness'], Breathing: ['mindfulness'],
    Awareness: ['mindfulness'], Focus: ['mindfulness'], Stillness: ['mindfulness'],
    Habits: ['learning'], Mindset: ['reflection_prompts'], Confidence: ['reflection_prompts'],
    Values: ['reflection_prompts'], Purpose: ['reflection_prompts']
  };

  var PACK_ID_LEARN = {
    'learn-expand': [],
    reflect: [],
    gratitude: [],
    mindfulness: ['mindfulness'],
    'personal-growth': []
  };

  var PACK_CONNECT = {
    Friends: ['friends'], Family: ['family'], Romance: ['partner'], Partner: ['partner'],
    Community: ['community'], Social: ['community'], Hangout: ['friends'], Messages: ['friends'],
    Fun: ['friends'], Reconnect: ['friends'], Traditions: ['family'], Memories: ['family'],
    'Deeper Connection': ['partner'], Neighbors: ['community'],
    Kindness: ['community'], Service: ['community'], Belonging: ['community']
  };

  var PACK_ID_CONNECT = {
    friends: ['friends'],
    family: ['family'],
    relationships: ['partner'],
    community: ['community'],
    'nature-connect': ['self']
  };

  var PACK_CONNECT_STYLE = {
    Romance: ['cozy', 'date_night'], Partner: ['date_night'], 'Deeper Connection': ['deep_conversation'],
    Hangout: ['low_key'], Messages: ['catching_up'], Fun: ['trying_new'], Reconnect: ['catching_up'],
    'Quality Time': ['low_key'], Traditions: ['catching_up'], Memories: ['catching_up']
  };

  /* Keys must match idea.tag values in FOCUS_PACKS, not pack titles. */
  var PACK_MOVE = {
    Running: ['running'], Walking: ['walking'], Hiking: ['hiking'],
    Sports: ['sports'], Dance: ['dance'], Yoga: ['yoga_stretch'],
    Stretching: ['yoga_stretch'], Breathwork: ['yoga_stretch'], Recovery: ['yoga_stretch'],
    'Upper Body': ['strength'], 'Lower Body': ['strength'], 'Full Body': ['strength'],
    Core: ['strength'], Pilates: ['fitness_classes', 'strength'], HIIT: ['fitness_classes'],
    Challenges: ['sports'],
    Water: ['hiking'], Exploring: ['hiking']
  };

  var PACK_MOVE_FEELING = {
    Running: ['energizing'], Walking: ['calming'], Hiking: ['calming', 'playful'],
    Sports: ['challenging', 'playful'], Dance: ['playful'], Yoga: ['calming'],
    Stretching: ['calming'], Breathwork: ['calming'], Recovery: ['calming'],
    'Upper Body': ['strong'], 'Lower Body': ['strong'], 'Full Body': ['strong'],
    Core: ['strong'], Pilates: ['strong'], HIIT: ['energizing', 'challenging'],
    Challenges: ['challenging']
  };

  var PACK_RESET = {
    Rest: ['rest_reset'], Ritual: ['self_care'], Skin: ['self_care'], Beauty: ['self_care'],
    Relax: ['self_care'], Clean: ['space_reset'], Organize: ['space_reset'], Declutter: ['space_reset'],
    Refresh: ['space_reset'], Hygge: ['self_care', 'space_reset'], Cook: ['nourishing_reset'],
    Hydrate: ['nourishing_reset'], Nutrition: ['nourishing_reset'], 'Gut Health': ['nourishing_reset'],
    Energy: ['nourishing_reset'], Unplug: ['offline_reset'], Offline: ['offline_reset'],
    'Screen-Free': ['offline_reset'], Simplify: ['offline_reset'], Focus: ['offline_reset'],
    Adventure: ['solo_reset'], Creative: ['solo_reset'], Mindful: ['solo_reset'],
    Social: ['solo_reset'], Movement: ['solo_reset'], Nature: ['nature_reset']
  };

  var PACK_ID_NOURISH = {
    'self-care': ['self_care'],
    'home-reset': ['space_reset'],
    'nourish-body': ['nourishing_reset'],
    'digital-detox': ['offline_reset'],
    'solo-side-quests': ['solo_reset']
  };

  var V2_TO_V3_GOAL = {
    creativity: 'more_creativity', less_screen_time: 'less_screen_time',
    more_movement: 'movement_energy', deeper_connections: 'deeper_relationships',
    mindfulness: 'peace_presence', new_hobbies: 'fun_novelty',
    consistency: 'structure_consistency', self_care: 'time_for_self',
    growth: 'personal_growth', adventure: 'fun_novelty', confidence: 'confidence'
  };

  function minutesToTime(n) {
    return n <= 15 ? '15m' : n <= 30 ? '30m' : n <= 60 ? '1h' : '2h+';
  }

  /* A length the idea states in its own words: "20 minutes", "an hour", "an
     afternoon", "from scratch", "a class". Returns a raw time, or null. */
  function statedTime(t) {
    // "20 minutes", "a 45-minute session", "40 full minutes"
    var m = t.match(/(\d+)[\s-]*(?:full\s+)?(?:minutes?|mins?)\b/);
    if (m) return minutesToTime(+m[1]);
    // "2 hours", "a 1-hour ride"
    var h = t.match(/(\d+)[\s-]*(?:hours?|hrs?)\b/);
    if (h) return +h[1] >= 2 ? '2h+' : '1h';
    // "an hour", "one focused hour", "one full uninterrupted hour"
    if (/\b(?:an?|one)\s+(?:[a-z]+\s+){0,2}hour\b/.test(t)) return '1h';
    if (/\b(?:an?|one|the|full|whole|entire)\s+(?:single\s+)?(?:afternoon|evening|morning)\b|\bhalf.day\b/.test(t)) return '2h+';
    if (/\bfrom scratch\b|\b(?:class|course|workshop|lesson)\b/.test(t)) return '1h';
    return null;
  }

  function ideaTime(text) {
    var t = text.toLowerCase();
    if (/\btrip\b|overnight|camping|weekend|full day|all day|day trip|road trip/.test(t)) return '2h+';
    var stated = statedTime(t);
    if (stated) return stated;
    if (/full workout|one full hour|full hour|pilates class|spin class/.test(t)) return '1h';
    if (/voice memo|10 push.ups|quick/.test(t)) return '15m';
    /* No clue in the text: assume about half an hour. Nothing is called quick unless
       its wording says so or idea-overrides.js was checked by hand, so 5 to 10 minute
       days are built from ideas that really are that short. */
    return '30m';
  }

  function mapTimeEstimate(raw) {
    if (raw === '15m') return 'micro';
    if (raw === '30m') return 'short';
    if (raw === '1h') return 'medium';
    // Longer than anyone's "30-60 min" preference, so it must not share that bucket.
    if (raw === '2h+') return 'long';
    return 'flexible';
  }

  function ideaVibe(text) {
    var t = text.toLowerCase();
    if (/workout|run\b|hike|bike|swim|dance|exercise|yoga|strength|cardio/.test(t)) return 'active';
    if (/paint|draw|sketch|write|build|create|design|craft|film/.test(t)) return 'creative';
    if (/meditat|breath|stillness|quiet|mindful|journal|reflect|gratitude/.test(t)) return 'mindful';
    if (/friend|family|partner|together|someone|people|social|volunteer|community/.test(t)) return 'social';
    if (/bath|spa|rest|sleep|nap|relax|slow|unwind|candle|cozy|self-care/.test(t)) return 'relaxing';
    if (/game|play|adventure|spontan|explore|karaoke/.test(t)) return 'fun';
    return 'easy';
  }

  function ideaWhere(text) {
    var t = text.toLowerCase();
    if (/hike|trail|park|outdoor|nature|beach|run |bike|walk |forest|mountain|outside|garden/.test(t)) return 'outside';
    if (/cook|clean|organize|home|bedroom|kitchen|bathroom|house|room|declutter|cozy|at home/.test(t)) return 'home';
    return 'anywhere';
  }

  function ideaSocialType(text) {
    var t = text.toLowerCase();
    if (/friend|family|partner|together|with someone|with people|volunteer|community|neighbor|call someone/.test(t)) return 'others';
    if (/solo|alone|by yourself|just you|no audience/.test(t)) return 'solo';
    return 'either';
  }

  function goalTagsFromText(text) {
    var t = text.toLowerCase();
    var tags = [];
    function add(tag) {
      if (tags.indexOf(tag) < 0) tags.push(tag);
    }
    if (/paint|draw|art|create|film|photo|craft|design|write/.test(t)) add('creativity');
    if (/meditat|breath|mindful|gratitude|journal|reflect|stillness/.test(t)) add('mindfulness');
    if (/friend|family|connect|together|volunteer|community|call/.test(t)) add('deeper_connections');
    if (/workout|run|hike|yoga|dance|move|exercise|walk|bike|swim/.test(t)) add('more_movement');
    if (/rest|bath|spa|relax|cozy|self-care|nap|unwind/.test(t)) add('self_care');
    if (/learn|read|study|skill|course|research|podcast/.test(t)) add('growth');
    if (/explore|adventure|try something|new|spontan/.test(t)) add('adventure');
    if (/phone|screen|digital|unplug|offline/.test(t)) add('less_screen_time');
    if (/habit|daily|routine|consistent/.test(t)) add('consistency');
    return tags;
  }

  function toOverallGoalTags(goalTags) {
    var out = [];
    (goalTags || []).forEach(function (g) {
      var v3 = V2_TO_V3_GOAL[g] || g;
      if (out.indexOf(v3) < 0) out.push(v3);
    });
    return out;
  }

  /* Automatic flags, one readable rule each. When a rule gets a particular idea
     wrong, correct that idea in idea-overrides.js instead of bending the rule.

       multiDay  spans several days, so it is never offered as today's idea
       booking   needs a class, a booking, travel or planning ahead
       chore     housework or a project: worth doing, but it adds work, so it is
                 never used as the day's Reset
       openEnded leaves the person to choose or design the activity ("find a
                 project", "plan your..."), which is one more decision for someone
                 who told us they overthink or have too many choices
       assumes   needs equipment, a skill or a place that a broad preference does
                 not tell us they have (a camera, a gym, a guitar, a beach). Shown
                 only once the person has given us that detail */
  var FLAG_RULES = {
    /* Watching, scrolling or tapping on a screen. Never offline, and kept away from
       people who told us their phone is the problem. */
    screen: {
      match: /\b(?:youtube|videos?|vlog|tiktok|instagram|netflix|tv|cinema|movie|documentar(?:y|ies)|watch (?:a |an |one |the )?(?:live )?(?:talk|lecture|interview|episode|show|series)|online|apps?|screens?|scroll(?:ing)?|social media)\b/,
      unless: /\bno screens?\b|screen.free|phone (?:away|off|down)|without (?:a |your )?(?:phone|screen)|apps? you open purely/
    },
    multiDay: {
      match: /\b(?:every (?:single )?(?:day|morning|night|week)|each day|per day|one per day|for (?:a|one) (?:full )?(?:week|month)|this (?:week|month|season)|for \d+ days|\d+ days|\d+.day|[a-z]+-a-day|weekly)\b/
    },
    booking: {
      match: /\b(?:class|course|workshop|lesson|sign up|register|book a|tickets?|museum|concert|spa|restaurant|gym|escape room)\b/,
      unless: /\b(?:online|youtube|at[\s-]home|video|app)\b/
    },
    chore: {
      match: /\b(?:deep clean|clean (?:out|your|the|one)|declutter|organi[sz]e|capsule wardrobe|meal prep|from scratch|track (?:how|your|what))\b/
    },
    openEnded: {
      match: /\b(?:find (?:a|an|one|something|your|new)|choose (?:a|an|one|your|something)|decide (?:on|what|which)|plan (?:a|an|your|out|the)|design (?:your|a|an)|map (?:out|your)|brainstorm|come up with|figure out|research|anything you|whatever you|any technique|start (?:a|an) (?:new )?(?:project|business|side hustle|blog|channel|podcast))\b/
    },
    assumes: {
      match: /\b(?:camera|dslr|lens|tripod|gym|reformer|kettlebells?|barbells?|dumbbells?|trx|sandbag|weights|bike|cycling|surf(?:ing)?|kayak|paddle ?board|swim(?:ming)?|pool|beach|ocean|lake|river|waterfall|coast(?:al)?|body of water|mountains?|ski(?:ing)?|snowboard|piano|guitar|ukulele|drums?|violin|instrument|sewing machine|easel|pottery wheel|kiln|drive|car|road trip|tent|camping)\b/
    }
  };

  var EFFORT_WORDS = { light: 1, moderate: 2, heavy: 3 };

  function ideaFlags(text, override) {
    var t = (text || '').toLowerCase();
    var out = {};
    Object.keys(FLAG_RULES).forEach(function (name) {
      var rule = FLAG_RULES[name];
      out[name] = rule.match.test(t) && !(rule.unless && rule.unless.test(t));
      if (override && typeof override[name] === 'boolean') out[name] = override[name];
    });
    return out;
  }

  function effortScoreFrom(rawTime, text, vibe) {
    var t = (text || '').toLowerCase();
    if (rawTime === '15m' || /quick|5 min|voice memo/.test(t)) return 1;
    if (rawTime === '2h+' || /full day|overnight|weekend/.test(t)) return 3.5;
    if (rawTime === '1h' || /full workout|pilates class/.test(t)) return 2.8;
    if (vibe === 'relaxing' || vibe === 'mindful') return 1.5;
    if (vibe === 'active') return 2.5;
    return 2;
  }

  function noveltyLevelFrom(text, packTag) {
    var t = (text || '').toLowerCase();
    var n = 1;
    if (/new|try|explore|spontan|different|never|first time|somewhere you/.test(t)) n += 1;
    if (/adventure|karaoke|random|surprise/.test(t)) n += 1;
    if (packTag === 'Adventure' || packTag === 'Play') n += 1;
    return Math.min(n, 3);
  }

  function isOffline(text) {
    var t = (text || '').toLowerCase();
    if (/phone away|unplug|offline|no screen|without your phone|leave your phone|digital detox/.test(t)) return true;
    if (/phone|screen|scroll|social media|netflix|tv/.test(t) && !/away|off|down|without/.test(t)) return false;
    if (/walk|hike|paint|draw|journal|stretch|yoga|cook|clean|organiz|bath|nap|read a book/.test(t)) return true;
    return false;
  }

  function isProductivityHeavy(text, packTag) {
    var t = (text || '').toLowerCase();
    if (packTag === 'Productivity' || packTag === 'Business' || packTag === 'Launch') return true;
    if (/work on|business|side hustle|email|inbox|optimize|productivity|to-do|deadline|study for/.test(t)) return true;
    return false;
  }

  function helpfulForFrictionsFrom(text, meta) {
    var t = (text || '').toLowerCase();
    var fr = [];
    function add(f) { if (fr.indexOf(f) < 0) fr.push(f); }
    if (meta.offline || /phone away|unplug|offline/.test(t)) add('phone_overuse');
    if (/journal|decide|one sentence|write down|reflect/.test(t)) add('overthinking');
    if (meta.effortScore <= 1.5 || /quick|5 min|easy|gentle|slow/.test(t)) {
      add('low_energy'); add('activation_difficulty'); add('time_pressure');
    }
    if (meta.noveltyLevel >= 2) add('repetitive_days');
    if (/self-care|cozy|rest|nap|bath|for yourself/.test(t)) {
      add('self_neglect'); add('others_first');
    }
    if (!meta.productivityHeavy && /walk|nature|dance|play|fun/.test(t)) add('work_switch_off');
    if (meta.effortScore <= 2) add('choice_overload');
    if (/direction|learn|curious|new topic/.test(t)) add('lack_direction');
    return fr;
  }

  function tagsFromTextHeuristics(text, categoryId) {
    var t = (text || '').toLowerCase();
    var create = [], mindsetNeed = [], mindsetFormat = [], connect = [], connStyle = [];
    var move = [], moveFeel = [], reset = [], subtypes = [];

    if (/paint|draw|sketch|color|craft/.test(t)) create.push('art_crafts');
    if (/write|journal|poem|story/.test(t)) create.push('writing');
    if (/photo|film|camera|shoot/.test(t)) create.push('photography');
    if (/cook|bake|recipe/.test(t)) create.push('cooking_baking');
    if (/music|song|sing|instrument|guitar|piano/.test(t)) {
      create.push('music');
      if (/sing/.test(t)) subtypes.push('singing');
      if (/write.*song|songwrite/.test(t)) subtypes.push('songwriting');
      if (/produc|beat|mix/.test(t)) subtypes.push('producing');
    }
    if (/business|side hustle|launch|startup/.test(t)) create.push('building_business');
    if (/\b(diy|furniture|shelf)\b/.test(t)) create.push('diy_design');
    if (/outfit|makeup|fashion|wardrobe|getting ready/.test(t)) create.push('fashion_beauty');

    if (/book|read/.test(t)) mindsetFormat.push('books');
    if (/podcast|audiobook/.test(t) || (/listen/.test(t) && /podcast|audio|episode/.test(t))) mindsetFormat.push('podcasts');
    if (/journal|write down|reflect|morning pages/.test(t)) mindsetFormat.push('journaling');
    if (/article|essay|newsletter|wikipedia/.test(t)) mindsetFormat.push('articles');
    if (/learn|study|course|research/.test(t)) mindsetFormat.push('learning');
    if (/documentary|docuseries/.test(t)) {
      mindsetFormat.push('documentaries');
    } else if (/ted talk|masterclass|youtube|lecture|conference talk/.test(t)) {
      mindsetFormat.push('videos');
    } else if (/\bwatch\b/.test(t) && !/candle|sunset|sunrise|flame|tide|water/.test(t)) {
      mindsetFormat.push('videos');
    }
    if (/\b(meditat|mindful|breathwork|stillness|body scan)\b/.test(t)) mindsetFormat.push('mindfulness');
    if (/prompt|values|mission|belief/.test(t)) mindsetFormat.push('reflection_prompts');
    if (/overthink|decision|choose/.test(t)) mindsetNeed.push('overthinking', 'decision_making');
    if (/confidence|believe in yourself|comfort zone/.test(t)) mindsetNeed.push('confidence');
    if (/motivat/.test(t)) mindsetNeed.push('motivation');
    if (/present|mindful|breath|stillness/.test(t)) mindsetNeed.push('presence');
    if (/overwhelm|stress|spiral/.test(t)) mindsetNeed.push('mental_overwhelm');
    if (/direction|purpose|values|mission/.test(t)) mindsetNeed.push('direction');
    if (/self-talk|limiting belief|playing small/.test(t)) mindsetNeed.push('negative_self_talk', 'self_trust');

    if (/partner|date|romantic/.test(t)) connect.push('partner');
    if (/friend/.test(t)) connect.push('friends');
    if (/family|parent|sibling|mom|dad/.test(t)) connect.push('family');
    if (/community|volunteer|neighbor|new people/.test(t)) connect.push('community');
    if (/yourself|solo|alone|for you/.test(t)) connect.push('self');
    if (/café|coffee|food|restaurant|treat/.test(t)) connStyle.push('food_cafes');
    if (/cozy|night in|movie/.test(t)) connStyle.push('cozy');
    if (/walk|active|workout together/.test(t)) connStyle.push('active');
    if (/deep|conversation|talk about/.test(t)) connStyle.push('deep_conversation');
    if (/catch up|text|call|voice note/.test(t)) connStyle.push('catching_up');
    if (/low-key|hang/.test(t)) connStyle.push('low_key');

    if (/\b(run|running|jog|jogging|sprints?)\b/.test(t)) move.push('running');
    if (/\b(hike|hiking|trail)\b/.test(t) || (/\bnature\b/.test(t) && /\b(outdoor|outside|forest|mountain|woods)\b/.test(t))) move.push('hiking');
    if (/\b(walk|walking|stroll|steps)\b/.test(t) && move.indexOf('running') < 0 && move.indexOf('hiking') < 0) move.push('walking');
    if (/\b(strength|push-ups?|weight|lift|dumbbell|resistance band|pull-ups?)\b/.test(t)) move.push('strength');
    if (/\b(yoga|stretch|stretching|pilates)\b/.test(t)) move.push('yoga_stretch');
    if (/\b(dance|dancing|zumba|salsa|bachata|hip-hop)\b/.test(t)) move.push('dance');
    if (/\b(pickleball|basketball|tennis|soccer|volleyball|badminton|frisbee|baseball|softball|football|hockey|lacrosse|golf|bowling|sport|sports)\b/.test(t)) move.push('sports');
    if (/\b(class|barre|spin class|fitness class|crossfit)\b/.test(t)) move.push('fitness_classes');
    if (/energiz/.test(t)) moveFeel.push('energizing');
    if (/calm|slow|gentle/.test(t)) moveFeel.push('calming');
    if (/playful|fun/.test(t)) moveFeel.push('playful');
    if (/strong|power/.test(t)) moveFeel.push('strong');

    if (/shower|skincare|self-care|cozy|bath|spa|manicure|face mask/.test(t)) reset.push('self_care');
    if (/clean|organiz|tidy|declutter|reorganize/.test(t)) reset.push('space_reset');
    if (/outside|sun|nature|fresh air|garden|park|trail|beach|hike|ocean|lake/.test(t)) reset.push('nature_reset');
    if (/café|bookstore|wander|yourself somewhere|solo|alone/.test(t)) reset.push('solo_reset');
    if (/phone away|offline|unplug|no screen|no social|screen-free/.test(t)) reset.push('offline_reset');
    if (/\b(nap|rest|lie down|do nothing|doing absolutely nothing)\b/.test(t)) reset.push('rest_reset');
    if (/\b(tea|coffee|meal|smoothie|cook|recipe|hydrate|nourish)\b/.test(t)) reset.push('nourishing_reset');

    return {
      createInterestTags: create, createSubtypeTags: subtypes,
      mindsetNeedTags: mindsetNeed, mindsetFormatTags: mindsetFormat,
      connectTargetTags: connect, connectionStyleTags: connStyle,
      moveTypeTags: move, moveFeelingTags: moveFeel, resetStyleTags: reset
    };
  }

  function mergeTags(arr, extra) {
    var out = (arr || []).slice();
    (extra || []).forEach(function (x) {
      if (out.indexOf(x) < 0) out.push(x);
    });
    return out;
  }

  function stableIdeaId(categoryId, packId, text) {
    var base = categoryId + ':' + (packId || 'misc') + ':' + text;
    var h = 0;
    for (var i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
    return categoryId + ':' + (packId || 'misc') + ':' + h.toString(36);
  }

  /* `known` (optional): facts already known about an idea written for a purpose,
     such as the starter ideas. Same fields as an idea-overrides.js entry
     (time, effort, any flag, offline, novel). Takes the place of the override table. */
  function getIdeaMetadata(idea, categoryId, packId, known) {
    var text = typeof idea === 'string' ? idea : (idea && idea.text) || '';
    // A reworded idea keeps its original sentence as its key: same id, same corrections.
    var key = (idea && typeof idea === 'object' && idea.originalText) || text;
    var packTag = typeof idea === 'object' && idea ? idea.tag : '';
    var goalTags = [];
    if (packTag && TAG_GOAL_MAP[packTag]) {
      TAG_GOAL_MAP[packTag].forEach(function (g) {
        if (goalTags.indexOf(g) < 0) goalTags.push(g);
      });
    }
    goalTagsFromText(text).forEach(function (g) {
      if (goalTags.indexOf(g) < 0) goalTags.push(g);
    });

    var override = known || overrideFor(key, packId);
    var rawTime = (override && override.time) || ideaTime(text);
    var vibe = ideaVibe(text);
    var effort = override && override.effort ? EFFORT_WORDS[override.effort] : effortScoreFrom(rawTime, text, vibe);
    var flags = ideaFlags(text, override);
    // Something you have to book or travel to is never a light lift, however short.
    if (flags.booking && !(override && override.effort)) effort = Math.max(effort, 2.8);
    var novelty = noveltyLevelFrom(text, packTag);
    var offline = isOffline(text) && !flags.screen;
    if (override && typeof override.offline === 'boolean') offline = override.offline;
    if (override && override.novel === true) novelty = Math.max(novelty, 2);
    var prodHeavy = isProductivityHeavy(text, packTag);

    var heur = tagsFromTextHeuristics(text, categoryId);
    var createInterestTags = mergeTags(mergeTags(PACK_CREATE_TAGS[packTag] || [], PACK_ID_CREATE[packId] || []), heur.createInterestTags);
    var createSubtypeTags = heur.createSubtypeTags.slice();
    var mindsetNeedTags = mergeTags(PACK_MINDSET_NEED[packTag] || [], heur.mindsetNeedTags);
    var mindsetFormatTags = mergeTags(mergeTags(PACK_MINDSET_FORMAT[packTag] || [], PACK_ID_LEARN[packId] || []), heur.mindsetFormatTags);
    var connectTargetTags = mergeTags(mergeTags(PACK_CONNECT[packTag] || [], PACK_ID_CONNECT[packId] || []), heur.connectTargetTags);
    var connectionStyleTags = mergeTags(PACK_CONNECT_STYLE[packTag] || [], heur.connectionStyleTags);
    var moveTypeTags = mergeTags(PACK_MOVE[packTag] || [], heur.moveTypeTags);
    var moveFeelingTags = mergeTags(PACK_MOVE_FEELING[packTag] || [], heur.moveFeelingTags);
    var resetStyleTags = mergeTags(mergeTags(PACK_RESET[packTag] || [], PACK_ID_NOURISH[packId] || []), heur.resetStyleTags);

    var meta = {
      id: stableIdeaId(categoryId, packId, key),
      categoryId: categoryId,
      packId: packId || null,
      text: text,
      originalText: key !== text ? key : undefined,
      tag: packTag || null,
      goalTags: goalTags,
      overallGoalTags: toOverallGoalTags(goalTags),
      timeEstimate: mapTimeEstimate(rawTime),
      rawTime: rawTime,
      energyLevel: vibe,
      location: ideaWhere(text),
      socialType: ideaSocialType(text),
      difficulty: rawTime === '15m' ? 'easy' : rawTime === '2h+' ? 'hard' : 'medium',
      effortScore: effort,
      noveltyLevel: novelty,
      offline: offline,
      productivityHeavy: prodHeavy,
      multiDay: flags.multiDay,
      booking: flags.booking,
      chore: flags.chore,
      openEnded: flags.openEnded,
      assumes: flags.assumes,
      screen: flags.screen,
      createInterestTags: createInterestTags,
      createSubtypeTags: createSubtypeTags,
      mindsetNeedTags: mindsetNeedTags,
      mindsetFormatTags: mindsetFormatTags,
      connectTargetTags: connectTargetTags,
      connectionStyleTags: connectionStyleTags,
      moveTypeTags: moveTypeTags,
      moveFeelingTags: moveFeelingTags,
      resetStyleTags: resetStyleTags
    };
    meta.helpfulForFrictions = helpfulForFrictionsFrom(text, meta);
    return meta;
  }

  /* The correction for one pack idea. "packId::sentence" applies to that pack only, for
     the few sentences that sit in two packs where only one copy changes. */
  function overrideFor(original, packId) {
    var table = global.PFDIdeaOverrides;
    if (!table) return null;
    return (packId && table[packId + '::' + original]) || table[original] || null;
  }

  /* How a pack idea reads on screen: its new wording from idea-overrides.js if it has
     one, otherwise the original sentence finished with a period, like every other card. */
  function displayText(original, packId) {
    var fix = overrideFor(original, packId);
    if (fix && typeof fix.text === 'string') return fix.text;
    var t = (original || '').replace(/\s+$/, '');
    return /[.!?…]$/.test(t) ? t : t + '.';
  }

  /* ---------- the emoji shown next to an idea ----------
     Checked in order: the first theme an idea's wording matches wins. When nothing
     matches, the idea gets one of a few emojis for its area, picked from its wording
     so it never changes, instead of the same sparkle on every row. */
  var EMOJI_THEMES = [
    ['🎤', /\b(?:karaoke|open mic|stand.?up|comedy|improv|speech)\b/],
    ['🎧', /\b(?:podcast|audiobook|episode)\b/],
    ['🎸', /\b(?:guitar|ukulele|piano|instrument|violin|drums?)\b/],
    ['💃', /\b(?:danc\w*|salsa|bachata|ballet|choreo\w*|zumba|line dancing)\b/],
    ['🎵', /\b(?:music|songs?|playlist|album|sing\w*|melody|lyric\w*|djing|dj|beat|hum)\b/],
    ['📸', /\b(?:photo\w*|camera|portrait|shoot)\b/],
    ['🎬', /\b(?:film|movie|documentar\w*|docuseries|video|cinema|time.?lapse|tiktok)\b/],
    ['🧵', /\b(?:craft\w*|knit\w*|crochet|embroider\w*|sew\w*|origami|weav\w*|pottery|clay|lino|wheel throwing|calligraphy|lettering|bracelets?)\b/],
    ['🎨', /\b(?:paint\w*|art|artist|draw\w*|sketch\w*|illustrat\w*|canvas|watercolors?|doodle|collage|zine|moodboard|scrapbook|vision board)\b/],
    ['💡', /\b(?:business|product\w*|brand|launch|website|pitch|newsletter|etsy|course|portfolio|prototype|notion|content calendar|infographic|landing page|mockup|logo)\b/],
    ['🛁', /\b(?:bath|bathhouse|shower|spa|epsom)\b/],
    ['🧴', /\b(?:skincare|face mask|hair mask|manicure|hand cream|gua sha|lotion|moisturi\w*|exfoliate|beauty)\b/],
    ['💆', /\b(?:massage|compress|lymphatic)\b/],
    ['💧', /\b(?:water|hydrate)\b(?!fall)/],
    ['☕', /\b(?:coffee|cafe|tea|matcha|chai|latte|drink)\b/],
    ['🧁', /\b(?:bak\w*|cake|cookies?|tart|croissants?|brioche|bread|sourdough)\b/],
    ['🍳', /\b(?:cook\w*|recipe|meal|kitchen|dish|dinner|lunch|breakfast|brunch|pasta|sushi|soup|pizza|snack|smoothie|oats|granola|dumplings|noodles|charcuterie|grain bowl|protein|vegetables?|juic\w*|ferment\w*|nut butter|chef)\b/],
    ['🥾', /\b(?:hike|hiking|trail|climb\w*|hill|viewpoint|lookout|mountains?|summit|bouldering|foraging)\b/],
    ['🚴', /\b(?:bike|biking|cycl\w*|ride|spin class)\b/],
    ['🏊', /\b(?:swim\w*|pool|float|snorkel\w*|dip)\b/],
    ['🛶', /\b(?:kayak\w*|paddle\w*|canoe|boat|tubing|rapids)\b/],
    ['🌊', /\b(?:ocean|sea|beach|lake|river|waterfall|tide|stream|pond)\b/],
    ['🔥', /\b(?:fire|campfire)\b/],
    ['⭐', /\b(?:stars?|stargaz\w*)\b/],
    ['🌅', /\b(?:sunrise|sunset|golden hour)\b/],
    ['🌸', /\b(?:flowers?|wildflowers|bloom)\b/],
    ['🌱', /\b(?:plant\w*|seeds?|herb|grow)\b/],
    ['🏋️', /\b(?:workout|strength|squats?|planks?|push.?ups?|pull.?ups?|lift\w*|dumbbells?|kettlebells?|weights|reps|pilates|barre|circuit|hiit|tabata|gym|crossfit|resistance bands?|core|hip thrusts|lunges)\b/],
    ['🏃', /\b(?:run\w*|jog\w*|sprint\w*|5k|race|cardio|intervals?|track|treadmill|stairs?)\b/],
    ['🧘', /\b(?:yoga|meditat\w*|breath\w*|stretch\w*|mindful\w*|stillness|silence|body scan|tai chi|qi gong|nidra|grounding|loving.?kindness)\b/],
    ['🚶', /\b(?:walk\w*|stroll|steps|wander\w*)\b/],
    ['⚽', /\b(?:soccer|basketball|volleyball|tennis|pickleball|badminton|frisbee|sports?|league|batting|golf|capture the flag|tag)\b/],
    ['🛼', /\b(?:skate\w*|rollerskate|skateboard|trampoline|axe throwing|laser tag|go.?kart\w*)\b/],
    ['🎲', /\b(?:games?|board game|card game|puzzle|lego|bowling|mini golf|escape room|magic trick)\b/],
    ['📵', /\b(?:phones?|screens?|notifications?|social media|apps?|offline|digital|inbox|email|wi.?fi|scroll\w*|instagram|news)\b/],
    ['💬', /\b(?:conversation|chat|catch up|call)\b/],
    ['🎧', /\b(?:listen\w*)\b/],
    ['📚', /\b(?:read\w*|books?|chapter|pages?|library|bookstore|novel|biography|classic|article|essay|wikipedia)\b/],
    ['✍️', /\b(?:writ\w*|journal\w*|letter|poem|list|manifesto|headline|story|morning pages)\b/],
    ['🧠', /\b(?:learn\w*|study|research|explainer|science\w*|scientific|history|historical|philosophy|psychology|economics|language|words|talk|lecture|masterclass|tutorial|ted)\b/],
    ['💌', /\b(?:thank\w*|appreciat\w*|grateful|gratitude|compliment\w*|voice note|kind\w*)\b/],
    ['🤝', /\b(?:volunteer\w*|donat\w*|community|neighbou?rs?|strangers?|help\w*|local cause|book swap)\b/],
    ['💞', /\b(?:partner|date|couple|romantic|each other)\b/],
    ['👨‍👩‍👧', /\b(?:family|grandparents?|parents?|relative)\b/],
    ['👯', /\b(?:friends?|bestie|sleepover)\b/],
    ['🛍️', /\b(?:thrift\w*|shop\w*|flea market|farmers market|market|store|buy)\b/],
    ['🌟', /\b(?:dream\w*|vision|future|someday|five year|5 year)\b/],
    ['🗺️', /\b(?:trip|travel\w*|explore|map|neighborhood|town|city|bus|train|drive|road|museum|gallery|botanical|national|park)\b/],
    ['🧹', /\b(?:clean\w*|declutter\w*|organi[sz]\w*|tidy|drawer|wardrobe|closet|fridge|pantry|unsubscribe|light bulb)\b/],
    ['🕯️', /\b(?:candles?|cozy|hygge|lamp|lighting|string lights)\b/],
    ['🛏️', /\b(?:bed\w*|nap|sleep\w*|rest|lie down|lay)\b/],
    ['🏡', /\b(?:home|room|space|corner|entryway|furniture|shelf|desk|nook|wall|keys|chargers)\b/],
    ['🪞', /\b(?:outfit|style|fashion|makeup|hair|dress up|wear)\b/],
    ['🎯', /\b(?:challenge|goals?|habit|track\w*|commit\w*|record|accountability)\b/],
    ['💭', /\b(?:reflect\w*|feeling|thoughts?|fears?|beliefs?|values|questions?|honest\w*|proud|mindset|regret\w*|lessons?)\b/],
    ['🌳', /\b(?:tree|forest|grass|garden|nature|green|outdoors?|outside|fresh air|sun)\b/],
    ['🌙', /\b(?:night|evening|bedtime|dark)\b/]
  ];
  var AREA_EMOJI = {
    create: ['🎨', '🧵', '💡', '✏️'],
    learn: ['🧠', '💭', '📖', '🔍'],
    connect: ['💞', '🤝', '💬', '🫶'],
    move: ['🤸', '⚡', '🏃', '🌿'],
    nourish: ['🌿', '🕯️', '🍵', '☁️']
  };

  function ideaEmoji(text, categoryId) {
    var t = (text || '').toLowerCase();
    for (var i = 0; i < EMOJI_THEMES.length; i++) {
      if (EMOJI_THEMES[i][1].test(t)) return EMOJI_THEMES[i][0];
    }
    var set = AREA_EMOJI[categoryId] || ['🌟', '🎈', '🌈', '🍀'];
    var h = 0;
    for (var j = 0; j < t.length; j++) h = (h * 31 + t.charCodeAt(j)) & 0xffff;
    return set[h % set.length];
  }

  // Original sentence -> what people now see, for every pack idea that changed.
  var REWORDED = {};

  /* Rewords pack ideas in place, so every screen (browse lists included) shows the same
     wording. The original sentence is kept as `originalText`: it stays the key for ids,
     corrections and history. Safe to call more than once. */
  function applyRewrites(focusPacks) {
    if (!focusPacks) return focusPacks;
    Object.keys(focusPacks).forEach(function (categoryId) {
      (focusPacks[categoryId] || []).forEach(function (pack) {
        (pack.ideas || []).forEach(function (idea) {
          if (!idea || idea.originalText || typeof idea.text !== 'string') return;
          var shown = displayText(idea.text, pack.id);
          if (shown === idea.text) return;
          /* A replacement is a different idea, so saved and finished copies of the old
             one stay as they were. Only new wording follows into those lists. */
          var fix = overrideFor(idea.text, pack.id);
          if (!(fix && fix.replaces)) REWORDED[idea.text] = shown;
          idea.originalText = idea.text;
          idea.text = shown;
        });
      });
    });
    return focusPacks;
  }

  /* Saved, added, done and deleted ideas are stored as sentences, by area. When the
     app loads them, any old wording becomes the new wording, so a saved idea still
     shows as saved and a deleted one stays deleted. The person's own custom ideas are
     never in the table, so they are never touched. */
  function updateRewordedIdeas(byArea) {
    if (!byArea || typeof byArea !== 'object' || Array.isArray(byArea)) return byArea;
    var out = {};
    Object.keys(byArea).forEach(function (area) {
      var list = byArea[area];
      if (!Array.isArray(list)) { out[area] = list; return; }
      var seen = {};
      out[area] = [];
      list.forEach(function (s) {
        var v = typeof s === 'string' && REWORDED[s] ? REWORDED[s] : s;
        if (typeof v === 'string') { if (seen[v]) return; seen[v] = true; }
        out[area].push(v);
      });
    });
    return out;
  }

  function buildIdeaIndex(focusPacks) {
    var index = [];
    if (!focusPacks) return index;
    applyRewrites(focusPacks);
    Object.keys(focusPacks).forEach(function (categoryId) {
      (focusPacks[categoryId] || []).forEach(function (pack) {
        (pack.ideas || []).forEach(function (idea) {
          index.push(getIdeaMetadata(idea, categoryId, pack.id));
        });
      });
    });
    if (global.PFDCreateStyleIdeas) {
      index = index.concat(global.PFDCreateStyleIdeas.buildIndex({ getIdeaMetadata: getIdeaMetadata }));
    }
    // Starter ideas are ordinary library ideas, written to need nothing beyond a
    // broad preference. The engine ranks them up while a profile is still broad.
    if (global.PFDStarterIdeas) {
      index = index.concat(global.PFDStarterIdeas.buildIndex({ getIdeaMetadata: getIdeaMetadata, mapTimeEstimate: mapTimeEstimate }));
    }
    return index;
  }

  global.PFDIdeaMetadata = {
    TAG_GOAL_MAP: TAG_GOAL_MAP,
    getIdeaMetadata: getIdeaMetadata,
    applyRewrites: applyRewrites,
    displayText: displayText,
    ideaEmoji: ideaEmoji,
    overrideFor: overrideFor,
    updateRewordedIdeas: updateRewordedIdeas,
    FLAG_RULES: FLAG_RULES,
    EFFORT_WORDS: EFFORT_WORDS,
    buildIdeaIndex: buildIdeaIndex,
    mapTimeEstimate: mapTimeEstimate
  };
})(window);
