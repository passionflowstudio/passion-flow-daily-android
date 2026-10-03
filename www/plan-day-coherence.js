/**
 * Passion Flow Daily — Daily Flow coherence.
 *
 * The engine picks each category on its own. This step looks at the five picks as
 * one day and swaps out cards that make the day unrealistic. Every swap goes through
 * repick(), which keeps the other four cards and their activities out of the running
 * and only keeps a replacement that satisfies the limit it was asked for.
 */
(function (global) {
  /* An hour or more, or something you have to book or travel to. */
  var HEAVY_EFFORT = 2.8;
  /* Reset should lower the day's load, not add to it. */
  var LIGHT_RESET_EFFORT = 2;
  /* When more than one card is heavy, this order decides which one stays: a workout
     is where effort naturally belongs, Reset never keeps a heavy card. */
  var HEAVY_KEEP_ORDER = ['move', 'create', 'connect', 'learn', 'nourish'];

  function effortOf(item) {
    return (item && item.effortScore) || 2;
  }

  function totalEffort(plan) {
    var sum = 0;
    var n = 0;
    Object.keys(plan || {}).forEach(function (k) {
      if (plan[k]) { sum += effortOf(plan[k]); n++; }
    });
    return n ? sum / n : 0;
  }

  function countProductivityHeavy(plan) {
    var c = 0;
    Object.keys(plan || {}).forEach(function (k) {
      var it = plan[k];
      if (it && it.productivityHeavy) c++;
    });
    return c;
  }

  function hasNovelty(plan) {
    return Object.keys(plan || {}).some(function (k) {
      var it = plan[k];
      return it && (it.noveltyLevel >= 2 || (it.resetStyleTags || []).indexOf('solo_reset') >= 0);
    });
  }

  function hasOffline(plan) {
    return Object.keys(plan || {}).some(function (k) {
      var it = plan[k];
      return it && (it.offline || (it.helpfulForFrictions || []).indexOf('phone_overuse') >= 0);
    });
  }

  function isHeavy(item) {
    return !!item && (effortOf(item) >= HEAVY_EFFORT || !!item.booking);
  }

  function isLightReset(item) {
    return !!item && effortOf(item) <= LIGHT_RESET_EFFORT && !item.chore && !item.booking;
  }

  /* A replacement for one card that leaves the rest of the day alone. `limits` is
     passed straight to the engine (maxEffort, lightOnly), so the engine only offers
     candidates that already meet it. Returns null rather than a worse card. */
  function repick(engine, plan, cat, profile, ctx, limits) {
    var others = Object.keys(plan).filter(function (c) { return c !== cat && plan[c]; });
    var pick = engine.pickForCategory(cat, profile, Object.assign({}, ctx, limits || {}, {
      categoryId: cat,
      excludeIds: others.map(function (c) { return plan[c].id; }).concat(plan[cat] ? [plan[cat].id] : []),
      excludeKinds: others.reduce(function (all, c) {
        return all.concat(engine.activityKinds ? engine.activityKinds(plan[c]) : [engine.activityKind(plan[c])].filter(Boolean));
      }, [])
    }));
    return pick || null;
  }

  /* About three times the person's usual time, never under 40 minutes: room for a
     couple of fuller cards and a few small ones. No cap when time is flexible. */
  var USUAL_MAX_MINUTES = { micro: 10, short: 30, medium: 60 };
  function dayMinutesCap(profile, engine) {
    var pref = profile.defaultTimeBucket || profile.preferredTime;
    var usual = USUAL_MAX_MINUTES[pref];
    return usual ? Math.max(40, usual * 3) : 0;
  }

  function refinePlan(plan, profile, ctx) {
    var engine = global.PFDRecommendationEngine;
    if (!plan || !engine) return plan;
    var fr = profile.coreFrictions || [];
    var budget = engine.dayBudget(profile);
    var alt;

    /* --- friction-specific swaps --- */
    if (fr.indexOf('work_switch_off') >= 0 && countProductivityHeavy(plan) >= 2) {
      Object.keys(plan).forEach(function (cat) {
        if (plan[cat] && plan[cat].productivityHeavy && cat !== 'create') {
          alt = repick(engine, plan, cat, profile, ctx);
          if (alt && !alt.productivityHeavy) plan[cat] = alt;
        }
      });
    }

    if (fr.indexOf('repetitive_days') >= 0 && !hasNovelty(plan)) {
      ['connect', 'move', 'nourish'].some(function (cat) {
        alt = repick(engine, plan, cat, profile, ctx);
        if (alt && alt.noveltyLevel >= 2) { plan[cat] = alt; return true; }
        return false;
      });
    }

    if (fr.indexOf('phone_overuse') >= 0 && !hasOffline(plan)) {
      alt = repick(engine, plan, 'nourish', profile, ctx, { maxEffort: LIGHT_RESET_EFFORT, lightOnly: true });
      if (alt && alt.offline) plan.nourish = alt;
    }

    /* --- the day as a whole: these run last so they have the final word --- */

    // At most one heavy card, and none at all when the person's days are full.
    var allowedHeavy = budget.maxEffort >= 3 ? 1 : 0;
    var heavy = HEAVY_KEEP_ORDER.filter(function (cat) { return isHeavy(plan[cat]); });
    heavy.slice(allowedHeavy).forEach(function (cat) {
      alt = repick(engine, plan, cat, profile, ctx, { maxEffort: HEAVY_EFFORT - 0.1, lightOnly: cat === 'nourish' });
      if (alt && !isHeavy(alt)) plan[cat] = alt;
    });

    // Reset restores. Never a chore, a booking, or a big lift.
    if (plan.nourish && !isLightReset(plan.nourish)) {
      alt = repick(engine, plan, 'nourish', profile, ctx, { maxEffort: LIGHT_RESET_EFFORT, lightOnly: true });
      if (alt) plan.nourish = alt;
    }

    /* The whole day has to fit the time the person has. Five 10 minute cards is 50
       minutes, too much for someone with 5 to 10 minutes, so the longest cards are
       swapped for shorter ones until the day fits. */
    var cap = dayMinutesCap(profile, engine);
    if (cap && engine.ideaMinutes) {
      var tried = {};
      for (var round = 0; round < 5; round++) {
        var cats = Object.keys(plan).filter(function (c) { return plan[c]; });
        var total = cats.reduce(function (sum, c) { return sum + engine.ideaMinutes(plan[c]); }, 0);
        if (total <= cap) break;
        /* Shorten general cards first. An idea written for a style the person picked
           (Piano, Film photography) is the most specific thing we know about them,
           so it is the last to go. */
        var longest = cats.filter(function (c) { return !tried[c]; })
          .sort(function (a, b) {
            var specific = (plan[a].styleId ? 1 : 0) - (plan[b].styleId ? 1 : 0);
            return specific || engine.ideaMinutes(plan[b]) - engine.ideaMinutes(plan[a]);
          })[0];
        if (!longest) break;
        tried[longest] = true;
        var mins = engine.ideaMinutes(plan[longest]);
        var limit = Math.max(5, mins - (total - cap));
        alt = repick(engine, plan, longest, profile, ctx, { maxMinutes: limit, lightOnly: longest === 'nourish' })
          || repick(engine, plan, longest, profile, ctx, { maxMinutes: mins - 1, lightOnly: longest === 'nourish' });
        if (alt && engine.ideaMinutes(alt) < mins) plan[longest] = alt;
      }
    }

    return plan;
  }

  global.PFDPlanCoherence = {
    refinePlan: refinePlan,
    totalEffort: totalEffort,
    HEAVY_EFFORT: HEAVY_EFFORT,
    dayMinutesCap: dayMinutesCap,
    LIGHT_RESET_EFFORT: LIGHT_RESET_EFFORT
  };
})(window);
