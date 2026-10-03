/**
 * Passion Flow Daily — personalization v3 constants
 */
(function (global) {
  var OVERALL_GOAL_OPTIONS = [
    { id: 'more_creativity', label: 'More creativity' },
    { id: 'peace_presence', label: 'More peace & presence' },
    { id: 'deeper_relationships', label: 'Deeper relationships' },
    { id: 'movement_energy', label: 'More movement & energy' },
    { id: 'fun_novelty', label: 'More fun & novelty' },
    { id: 'confidence', label: 'More confidence' },
    { id: 'time_for_self', label: 'More time for myself' },
    { id: 'less_screen_time', label: 'Less screen time' },
    { id: 'personal_growth', label: 'More personal growth' }
  ];

  var CORE_FRICTION_OPTIONS = [
    { id: 'overthinking', label: 'I overthink everything' },
    { id: 'choice_overload', label: 'I get overwhelmed by too many choices' },
    { id: 'phone_overuse', label: "I'm always on my phone" },
    { id: 'work_switch_off', label: 'I have trouble switching off from work or school' },
    { id: 'low_energy', label: "I'm usually tired" },
    { id: 'time_pressure', label: 'I never feel like I have enough time' },
    { id: 'activation_difficulty', label: 'I struggle to get myself started' },
    { id: 'repetitive_days', label: 'My days feel repetitive' },
    { id: 'self_neglect', label: 'I forget to make time for myself' },
    { id: 'lack_direction', label: 'I feel a little lost / unsure what I want' }
  ];

  var LIFE_CONTEXT_OPTIONS = [
    { id: 'student', label: 'Student' },
    { id: 'full_time_work', label: 'Work full-time' },
    { id: 'part_time_work', label: 'Work part-time' },
    { id: 'work_from_home', label: 'Work from home' },
    { id: 'self_employed', label: 'Self-employed / creator' },
    { id: 'caregiver', label: 'Parent / caregiver' },
    { id: 'transition_period', label: 'Between things / figuring it out' },
    { id: 'flexible_schedule', label: 'My schedule is pretty flexible' }
  ];

  var DAY_BANDWIDTH_OPTIONS = [
    { id: 'very_full', label: 'Very full: I barely have time for myself' },
    { id: 'pretty_full', label: 'Pretty full: I have some pockets of free time' },
    { id: 'balanced', label: 'Balanced: I usually have time for myself' },
    { id: 'very_flexible', label: 'Very flexible: I have lots of control over my day' }
  ];

  var TIME_BUCKET_OPTIONS = [
    { id: 'micro', label: '5 to 10 minutes' },
    { id: 'short', label: '15 to 30 minutes' },
    { id: 'medium', label: '30 to 60 minutes' },
    { id: 'flexible', label: "I'm flexible" }
  ];

  var CREATE_INTEREST_OPTIONS = [
    { id: 'art_crafts', label: 'Art & crafts' },
    { id: 'writing', label: 'Writing' },
    { id: 'music', label: 'Music' },
    { id: 'photography', label: 'Photography' },
    { id: 'cooking_baking', label: 'Cooking & baking' },
    { id: 'content_creation', label: 'Content creation' },
    { id: 'building_business', label: 'Building / business' },
    { id: 'diy_design', label: 'DIY / design' },
    { id: 'fashion_beauty', label: 'Fashion / beauty' },
    { id: 'creative_discovery', label: 'Trying new things / I want to discover what I like' }
  ];

  /* `re` matches idea text so a picked style can lift ideas that fit it.
     Ids must match the keys in create-style-ideas.js. */
  var CREATE_MUSIC_SUBTYPES = [
    { id: 'guitar', label: 'Guitar', re: /guitar|chord|strum|riff/ },
    { id: 'piano', label: 'Piano / keys', re: /piano|keyboard|keys/ },
    { id: 'singing', label: 'Singing', re: /sing|vocal|karaoke/ },
    { id: 'songwriting', label: 'Songwriting', re: /songwrit|write.*song|lyric|melody|chorus/ },
    { id: 'producing', label: 'Producing beats', re: /produc|beat|mix|loop|daw|sample/ },
    { id: 'drums', label: 'Drums', re: /drum|rhythm|groove/ },
    { id: 'dj', label: 'DJing', re: /\bdj|turntable|playlist/ },
    { id: 'instrument', label: 'Another instrument', re: /instrument|ukulele|violin|bass|music theory|by ear/ }
  ];

  var CREATE_ART_SUBTYPES = [
    { id: 'drawing', label: 'Drawing', re: /draw|sketch|doodle/ },
    { id: 'painting', label: 'Painting', re: /paint|watercolor|canvas/ },
    { id: 'digital_art', label: 'Digital art', re: /digital|procreate|ipad|illustrat/ },
    { id: 'pottery', label: 'Pottery / clay', re: /clay|pottery|ceramic/ },
    { id: 'knitting', label: 'Knitting / crochet', re: /knit|crochet|yarn/ },
    { id: 'sewing', label: 'Sewing / embroidery', re: /sew|embroider|stitch/ },
    { id: 'crafts', label: 'Crafts', re: /craft|collage|origami|bead|card/ },
    { id: 'coloring', label: 'Coloring', re: /color/ }
  ];

  var CREATE_BUILDING_TYPES = [
    { id: 'online_business', label: 'Online business', re: /business|customer|launch|startup|online/ },
    { id: 'digital_products', label: 'Digital products', re: /digital product|template|ebook|course|guide/ },
    { id: 'ecommerce', label: 'Selling products', re: /sell|etsy|shop|store|product/ },
    { id: 'personal_brand', label: 'Personal brand', re: /brand|audience|post|content/ },
    { id: 'freelancing', label: 'Freelancing / services', re: /freelanc|client|portfolio|service/ },
    { id: 'real_estate', label: 'Real estate', re: /real estate|property|rental/ },
    { id: 'sales', label: 'Sales', re: /sales|pitch|prospect|close/ },
    { id: 'tech_apps', label: 'Tech / apps', re: /code|coding|\bapp\b|website|software/ }
  ];

  var CREATE_WRITING_STYLES = [
    { id: 'journaling', label: 'Journaling', re: /journal|morning pages|reflect/ },
    { id: 'poetry', label: 'Poetry', re: /poem|poetry|haiku/ },
    { id: 'fiction', label: 'Stories / fiction', re: /story|stories|fiction|novel|character|chapter/ },
    { id: 'essays', label: 'Essays / blogging', re: /essay|blog|article|post/ },
    { id: 'scripts', label: 'Scripts', re: /script|screenplay|scene|dialogue/ },
    { id: 'memoir', label: 'Memoir / personal stories', re: /memoir|memory|childhood|personal story/ }
  ];

  var CREATE_PHOTO_STYLES = [
    { id: 'phone_photos', label: 'Phone photos', re: /phone|photo walk|snap/ },
    { id: 'camera', label: 'Camera', re: /camera|lens|exposure|manual/ },
    { id: 'portraits', label: 'Portraits', re: /portrait|people|selfie/ },
    { id: 'nature', label: 'Nature / landscape', re: /nature|landscape|sunset|sky|outside/ },
    { id: 'street', label: 'Street', re: /street|city|neighborhood/ },
    { id: 'video_film', label: 'Video / film', re: /video|film|clip|time.lapse/ },
    { id: 'editing', label: 'Editing', re: /edit|preset|color grade|lightroom/ }
  ];

  var CREATE_COOKING_STYLES = [
    { id: 'everyday_meals', label: 'Everyday meals', re: /cook|meal|dinner|lunch/ },
    { id: 'baking', label: 'Baking', re: /bake|baking|cookie|cake|muffin/ },
    { id: 'bread', label: 'Bread / sourdough', re: /bread|sourdough|dough|focaccia/ },
    { id: 'desserts', label: 'Desserts', re: /dessert|sweet|chocolate|cake|cookie/ },
    { id: 'world_cuisines', label: 'World cuisines', re: /cuisine|country|spice|new dish/ },
    { id: 'healthy', label: 'Healthy cooking', re: /healthy|salad|vegetable|bowl|smoothie/ },
    { id: 'drinks', label: 'Coffee / drinks', re: /drink|coffee|tea|latte|cocktail|mocktail/ }
  ];

  var CREATE_CONTENT_STYLES = [
    { id: 'tiktok', label: 'TikTok', re: /tiktok|short video/ },
    { id: 'instagram', label: 'Instagram', re: /instagram|reel|carousel|story/ },
    { id: 'youtube', label: 'YouTube', re: /youtube|vlog|channel/ },
    { id: 'podcast', label: 'Podcasting', re: /podcast|episode|audio/ },
    { id: 'newsletter', label: 'Newsletter / blog', re: /newsletter|blog|substack/ },
    { id: 'streaming', label: 'Streaming', re: /stream|twitch|go live/ },
    { id: 'linkedin', label: 'LinkedIn', re: /linkedin/ }
  ];

  var CREATE_DIY_STYLES = [
    { id: 'home_projects', label: 'Home projects', re: /home|room|house|fix|repair/ },
    { id: 'woodworking', label: 'Woodworking', re: /wood|furniture|shelf|shelves/ },
    { id: 'interior_design', label: 'Interior design', re: /interior|decor|rearrange|layout|room/ },
    { id: 'graphic_design', label: 'Graphic design', re: /graphic|logo|poster|canva|font|design/ },
    { id: 'upcycling', label: 'Upcycling', re: /upcycl|thrift|repurpose|old .* into/ },
    { id: 'plants', label: 'Plants / gardening', re: /plant|garden|herb|seed/ }
  ];

  var CREATE_FASHION_STYLES = [
    { id: 'styling', label: 'Styling outfits', re: /outfit|style|wardrobe|closet/ },
    { id: 'makeup', label: 'Makeup', re: /makeup|liner|lip/ },
    { id: 'skincare', label: 'Skincare', re: /skin|face mask|routine/ },
    { id: 'hair', label: 'Hair', re: /hair|braid|curl/ },
    { id: 'nails', label: 'Nails', re: /nail|manicure/ },
    { id: 'thrifting', label: 'Thrifting', re: /thrift|vintage|secondhand/ },
    { id: 'making_clothes', label: 'Making clothes', re: /sew|alter|hem|embroider|garment/ }
  ];

  var CREATE_LEVEL_OPTIONS = [
    { id: 'new', label: 'Just starting' },
    { id: 'back', label: 'Getting back into it' },
    { id: 'regular', label: 'Already doing it' }
  ];

  /* One section per Create interest: its style chips and one optional project name.
     creative_discovery has no section on purpose. */
  var CREATE_STYLE_GROUPS = [
    { interest: 'music', field: 'createMusicSubtypes', options: CREATE_MUSIC_SUBTYPES, project: 'Music project', placeholder: 'e.g. my EP' },
    { interest: 'art_crafts', field: 'createArtSubtypes', options: CREATE_ART_SUBTYPES, project: 'Art project', placeholder: 'e.g. my sketchbook' },
    { interest: 'writing', field: 'createWritingStyles', options: CREATE_WRITING_STYLES, project: 'Writing project', placeholder: 'e.g. my novel' },
    { interest: 'photography', field: 'createPhotoStyles', options: CREATE_PHOTO_STYLES, project: 'Photo project', placeholder: 'e.g. my portfolio' },
    { interest: 'cooking_baking', field: 'createCookingStyles', options: CREATE_COOKING_STYLES, project: 'Cooking project', placeholder: 'e.g. family cookbook' },
    { interest: 'content_creation', field: 'createContentStyles', options: CREATE_CONTENT_STYLES, project: 'Content project', placeholder: 'e.g. my channel' },
    { interest: 'building_business', field: 'createBuildingTypes', options: CREATE_BUILDING_TYPES, project: 'Business project', placeholder: 'e.g. my shop' },
    { interest: 'diy_design', field: 'createDiyStyles', options: CREATE_DIY_STYLES, project: 'DIY project', placeholder: 'e.g. garage shelves' },
    { interest: 'fashion_beauty', field: 'createFashionStyles', options: CREATE_FASHION_STYLES, project: 'Fashion project', placeholder: 'e.g. capsule wardrobe' }
  ];

  var MINDSET_NEED_OPTIONS = [
    { id: 'overthinking', label: 'Overthinking' }, { id: 'decision_making', label: 'Decision-making' },
    { id: 'confidence', label: 'Confidence' }, { id: 'self_trust', label: 'Self-trust' },
    { id: 'comparison', label: 'Comparison' }, { id: 'motivation', label: 'Motivation' },
    { id: 'negative_self_talk', label: 'Negative self-talk' }, { id: 'presence', label: 'Being present' },
    { id: 'direction', label: 'Finding direction' }, { id: 'mental_overwhelm', label: 'Stress / mental overwhelm' }
  ];

  var MINDSET_FORMAT_OPTIONS = [
    { id: 'books', label: 'Reading books' }, { id: 'journaling', label: 'Journaling & reflection' },
    { id: 'podcasts', label: 'Podcasts / audio' }, { id: 'videos', label: 'Videos & talks' },
    { id: 'articles', label: 'Articles & essays' }, { id: 'documentaries', label: 'Documentaries' },
    { id: 'learning', label: 'Learning something new' }, { id: 'mindfulness', label: 'Mindfulness' },
    { id: 'reflection_prompts', label: 'Thought-provoking prompts' }
  ];

  var CONNECT_TARGET_OPTIONS = [
    { id: 'partner', label: 'My partner' }, { id: 'friends', label: 'Friends' },
    { id: 'family', label: 'Family' }, { id: 'community', label: 'Community / new people' },
    { id: 'self', label: 'Myself' }
  ];

  var PARTNER_STYLE_OPTIONS = [
    { id: 'cozy', label: 'Cozy nights in' }, { id: 'food_cafes', label: 'Restaurants / cafés' },
    { id: 'adventure', label: 'Little adventures' }, { id: 'active', label: 'Working out / being active' },
    { id: 'deep_conversation', label: 'Deep conversations' }, { id: 'movies_shows', label: 'Movies / shows' },
    { id: 'create_together', label: 'Cooking / making things together' }, { id: 'date_night', label: 'Going out / date nights' }
  ];

  var FRIEND_STYLE_OPTIONS = [
    { id: 'catching_up', label: 'Catching up' }, { id: 'going_out', label: 'Going out' },
    { id: 'food_cafes', label: 'Cafés / food' }, { id: 'active', label: 'Active things' },
    { id: 'creative', label: 'Creative things' }, { id: 'low_key', label: 'Low-key hangs' },
    { id: 'trying_new', label: 'Trying something new' }
  ];

  var MOVE_PREF_OPTIONS = [
    { id: 'walking', label: 'Walking' }, { id: 'running', label: 'Running' },
    { id: 'strength', label: 'Strength training' }, { id: 'yoga_stretch', label: 'Yoga / stretching' },
    { id: 'dance', label: 'Dance' }, { id: 'hiking', label: 'Hiking / nature' },
    { id: 'sports', label: 'Sports' }, { id: 'fitness_classes', label: 'Fitness classes' }
  ];

  var MOVE_FEELING_OPTIONS = [
    { id: 'energizing', label: 'Energizing' }, { id: 'strong', label: 'Strong' },
    { id: 'calming', label: 'Calming' }, { id: 'playful', label: 'Playful' },
    { id: 'challenging', label: 'Challenging' }
  ];

  var RESET_STYLE_OPTIONS = [
    { id: 'self_care', label: 'Self-care: shower, skincare, get cozy' },
    { id: 'space_reset', label: 'Space reset: tidy up, fresh sheets' },
    { id: 'nature_reset', label: 'Nature reset: outside, sunlight, quiet' },
    { id: 'solo_reset', label: 'Solo outing: treat yourself, wander' },
    { id: 'offline_reset', label: 'Offline reset: phone away, read or color' },
    { id: 'rest_reset', label: 'Rest reset: lie down, nap, do nothing' },
    { id: 'nourishing_reset', label: 'Nourishing reset: make a drink or meal, savor it' }
  ];

  var CATEGORY_IDS = ['create', 'learn', 'connect', 'move', 'nourish'];
  var CATEGORY_LABELS = { create: 'Create', learn: 'Mindset', connect: 'Connect', move: 'Move', nourish: 'Reset' };

  function createEmptyProfileV3() {
    return {
      version: 3,
      completedAt: null,
      skippedAt: null,
      overallGoals: [],
      coreFrictions: [],
      lifeContext: [],
      dayBandwidth: null,
      defaultTimeBucket: null,
      createInterests: [],
      createMusicSubtypes: [],
      createArtSubtypes: [],
      createBuildingType: null,
      createBuildingTypes: [],
      createWritingStyles: [],
      createPhotoStyles: [],
      createCookingStyles: [],
      createContentStyles: [],
      createDiyStyles: [],
      createFashionStyles: [],
      createProjects: {},
      createLevels: {},
      createStylesSeen: false,
      // When the onboarding quick-preference screen filled in area preferences. Those
      // answers live in the normal fields above; this only records that they are
      // broad, so the app keeps offering the deeper questions instead of treating
      // the profile as fully personalized.
      quickPreferencesAt: null,
      projectName: '',
      projectNames: [],
      projectTypes: [],
      mindsetNeeds: [],
      mindsetFormats: [],
      connectTargets: [],
      partnerConnectionStyles: [],
      partnerName: '',
      friendNames: [],
      familyNames: [],
      communityNames: [],
      communityName: '',
      friendConnectionStyles: [],
      familyConnectionStyles: [],
      communityConnectionStyles: [],
      movePreferences: [],
      moveDesiredFeelings: [],
      resetStyles: [],
      preferredDaypart: null,
      socialPreference: null,
      deepPersonalizationCompleted: false,
      deepPersonalizationTriggeredBy: null,
      updatedAt: null
    };
  }

  /* Fields rebuilt from legacy shapes below — never overlay them raw, or v2 ids leak through. */
  var DERIVED_FIELDS = { version: 1, updatedAt: 1, overallGoals: 1 };

  function hasValue(v) {
    if (v === null || v === undefined) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.trim() !== '';
    return true;
  }

  function overlayExistingValues(target, source) {
    Object.keys(target).forEach(function (key) {
      if (DERIVED_FIELDS[key]) return;
      if (hasValue(source[key])) target[key] = source[key];
    });
    return target;
  }

  /* Layer 1 drives scoring hardest, so treat it as missing until frictions,
     bandwidth and time are all answered — regardless of any "completed" flag. */
  function needsLayer1(profile) {
    if (!profile) return true;
    if (!(profile.coreFrictions || []).length) return true;
    if (!profile.dayBandwidth) return true;
    if (!profile.defaultTimeBucket) return true;
    return false;
  }

  var PROJECT_SHAPED_FIRST = ['building_business', 'content_creation', 'writing', 'music', 'art_crafts', 'diy_design', 'photography', 'fashion_beauty', 'cooking_baking'];

  /* Older builds stored up to 3 loose project names. Give each one a home under a
     single Create interest so it shows in that interest's section. */
  function legacyProjectsByInterest(p) {
    var out = {};
    var interests = (p.createInterests || []).filter(function (id) { return id !== 'creative_discovery'; });
    var types = p.projectTypes || [];
    var composer = global.PFDRecommendationComposer;
    var leftovers = [];
    (p.projectNames || []).concat([p.projectName]).forEach(function (n, i) {
      var name = (n || '').trim();
      if (!name) return;
      var placed = Object.keys(out).some(function (k) { return out[k] === name; });
      if (placed || leftovers.indexOf(name) >= 0) return;
      var target = types[i] && !out[types[i]] ? types[i] : null;
      if (!target && composer && composer.projectInterestsFor) {
        target = composer.projectInterestsFor(name).filter(function (id) {
          return interests.indexOf(id) >= 0 && !out[id];
        })[0] || null;
      }
      if (target) out[target] = name;
      else leftovers.push(name);
    });
    leftovers.forEach(function (name) {
      var free = PROJECT_SHAPED_FIRST.filter(function (id) { return interests.indexOf(id) >= 0 && !out[id]; })[0];
      if (free) out[free] = name;
    });
    return out;
  }

  /* projectNames / projectTypes / projectName mirror createProjects for older app versions. */
  function syncLegacyProjectFields(p) {
    var names = [], types = [];
    Object.keys(p.createProjects || {}).forEach(function (id) {
      var name = (p.createProjects[id] || '').trim();
      if (!name) { delete p.createProjects[id]; return; }
      p.createProjects[id] = name;
      names.push(name);
      types.push(id);
    });
    p.projectNames = names;
    p.projectTypes = types;
    p.projectName = names[0] || '';
    p.createBuildingType = (p.createBuildingTypes || [])[0] || null;
    return p;
  }

  function migrateProfileToV3(profile) {
    var p = createEmptyProfileV3();
    if (!profile) return p;
    var mapGoals = {
      creativity: 'more_creativity', less_screen_time: 'less_screen_time', more_movement: 'movement_energy',
      deeper_connections: 'deeper_relationships', mindfulness: 'peace_presence', new_hobbies: 'more_creativity',
      consistency: 'personal_growth', self_care: 'time_for_self', growth: 'personal_growth', adventure: 'fun_novelty',
      structure_consistency: 'personal_growth'
    };
    var mapTime = { '5-10': 'micro', '15-30': 'short', '30-60': 'medium', any: 'flexible' };
    (profile.overallGoals || []).forEach(function (g) {
      var id = mapGoals[g] || g;
      if (p.overallGoals.indexOf(id) < 0) p.overallGoals.push(id);
    });
    p.dayBandwidth = profile.dayBandwidth || null;
    p.defaultTimeBucket = mapTime[profile.preferredTime] || profile.defaultTimeBucket || null;
    p.socialPreference = profile.socialPreference || null;
    p.preferredDaypart = profile.preferredDaypart || null;
    p.partnerName = profile.partnerName || '';
    p.communityName = profile.communityName || '';
    p.communityNames = (profile.communityNames || []).slice();
    if (!p.communityNames.length && p.communityName) p.communityNames = [p.communityName];
    if (!p.communityName && p.communityNames.length) p.communityName = p.communityNames[0] || '';
    p.projectName = profile.projectName || '';
    p.projectNames = (profile.projectNames || []).slice();
    if (!p.projectNames.length && p.projectName) p.projectNames = [p.projectName];
    if (!p.projectName && p.projectNames.length) p.projectName = p.projectNames[0] || '';
    if (profile.categoryGoals) {
      var cg = profile.categoryGoals;
      var createMap = { art: 'art_crafts', writing: 'writing', content: 'content_creation', building: 'building_business', photography: 'photography' };
      (cg.create || []).forEach(function (x) { if (createMap[x] && p.createInterests.indexOf(createMap[x]) < 0) p.createInterests.push(createMap[x]); });
      var learnMap = { learning: 'learning', mindfulness: 'mindfulness', productivity: 'learning', confidence: 'confidence', reading: 'books' };
      (cg.learn || []).forEach(function (x) {
        if (learnMap[x] === 'books') { if (p.mindsetFormats.indexOf('books') < 0) p.mindsetFormats.push('books'); }
        else if (learnMap[x] === 'mindfulness') { if (p.mindsetFormats.indexOf('mindfulness') < 0) p.mindsetFormats.push('mindfulness'); }
        else if (learnMap[x] === 'confidence') { if (p.mindsetNeeds.indexOf('confidence') < 0) p.mindsetNeeds.push('confidence'); }
      });
      var connectMap = { friends: 'friends', family: 'family', community: 'community', romance: 'partner' };
      (cg.connect || []).forEach(function (x) { if (connectMap[x] && p.connectTargets.indexOf(connectMap[x]) < 0) p.connectTargets.push(connectMap[x]); });
      var moveMap = { cardio: 'running', strength: 'strength', yoga: 'yoga_stretch', outdoors: 'hiking' };
      (cg.move || []).forEach(function (x) { if (moveMap[x] && p.movePreferences.indexOf(moveMap[x]) < 0) p.movePreferences.push(moveMap[x]); });
      var resetMap = { rest: 'rest_reset', organization: 'space_reset', nourishment: 'nourishing_reset', digital_detox: 'offline_reset' };
      (cg.nourish || []).forEach(function (x) { if (resetMap[x] && p.resetStyles.indexOf(resetMap[x]) < 0) p.resetStyles.push(resetMap[x]); });
    }
    overlayExistingValues(p, profile);
    if (!p.createBuildingTypes.length && p.createBuildingType) p.createBuildingTypes = [p.createBuildingType];
    var oldBuilding = { own_business: 'online_business', side_hustle: 'ecommerce' };
    p.createBuildingTypes = p.createBuildingTypes.map(function (id) { return oldBuilding[id] || id; }).filter(function (id, i, arr) {
      return arr.indexOf(id) === i && CREATE_BUILDING_TYPES.some(function (o) { return o.id === id; });
    });
    p.createProjects = Object.keys(p.createProjects || {}).length ? Object.assign({}, p.createProjects) : legacyProjectsByInterest(p);
    syncLegacyProjectFields(p);
    if (profile.completedAt || profile.version >= 2) {
      p.completedAt = profile.completedAt || Date.now();
    }
    p.deepPersonalizationCompleted = !!profile.deepPersonalizationCompleted;
    p.updatedAt = profile.updatedAt || Date.now();
    return p;
  }

  global.PFDConstants = {
    OVERALL_GOAL_OPTIONS: OVERALL_GOAL_OPTIONS,
    CORE_FRICTION_OPTIONS: CORE_FRICTION_OPTIONS,
    LIFE_CONTEXT_OPTIONS: LIFE_CONTEXT_OPTIONS,
    DAY_BANDWIDTH_OPTIONS: DAY_BANDWIDTH_OPTIONS,
    TIME_BUCKET_OPTIONS: TIME_BUCKET_OPTIONS,
    CREATE_INTEREST_OPTIONS: CREATE_INTEREST_OPTIONS,
    CREATE_MUSIC_SUBTYPES: CREATE_MUSIC_SUBTYPES,
    CREATE_ART_SUBTYPES: CREATE_ART_SUBTYPES,
    CREATE_BUILDING_TYPES: CREATE_BUILDING_TYPES,
    CREATE_STYLE_GROUPS: CREATE_STYLE_GROUPS,
    CREATE_LEVEL_OPTIONS: CREATE_LEVEL_OPTIONS,
    syncLegacyProjectFields: syncLegacyProjectFields,
    MINDSET_NEED_OPTIONS: MINDSET_NEED_OPTIONS,
    MINDSET_FORMAT_OPTIONS: MINDSET_FORMAT_OPTIONS,
    CONNECT_TARGET_OPTIONS: CONNECT_TARGET_OPTIONS,
    PARTNER_STYLE_OPTIONS: PARTNER_STYLE_OPTIONS,
    FRIEND_STYLE_OPTIONS: FRIEND_STYLE_OPTIONS,
    MOVE_PREF_OPTIONS: MOVE_PREF_OPTIONS,
    MOVE_FEELING_OPTIONS: MOVE_FEELING_OPTIONS,
    RESET_STYLE_OPTIONS: RESET_STYLE_OPTIONS,
    CATEGORY_IDS: CATEGORY_IDS,
    CATEGORY_LABELS: CATEGORY_LABELS,
    createEmptyProfileV3: createEmptyProfileV3,
    migrateProfileToV3: migrateProfileToV3,
    needsLayer1: needsLayer1
  };
})(window);
