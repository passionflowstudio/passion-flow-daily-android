# PassionFlow personalization audit

Audit only. No app code was changed. Every number below comes from running the real
recommendation engine (the code now in both apps) on simulated users. It doesn't come
from reading the code and guessing.

---

## The short version

1. **The app personalizes *which* idea you get, but never *how it's said*.** Frictions,
   goals and time all change the pick. The card text only ever adds your name or project
   name. That's ChatGPT's diagnosis, and the code confirms it.
2. **Some picks are wrong, and no sentence can fix a wrong pick.** For 87% of library
   ideas, the app guesses the length from the wording. That's how a tired parent with
   5 to 10 minutes gets "Master one traditional recipe".
3. **This doesn't need 750 rewrites.** Only 457 ideas ever reach users, and **the top
   150 make up 88% of all library cards shown**. Review those 150 and most of what
   people see is fixed.
4. **Recommended design:** each card gets an idea plus one short line under it, written
   together as a pair and chosen for what the person told us. The person picks how they
   want to be encouraged (Gentle, Steady, Push me) on the last tune-up screen and in Settings.

---

## 1. How personalization works today, end to end

**What we collect**
- Onboarding: goals (up to 4), frictions (up to 2), life context, how full your days
  are, usual time, and the new quick picks for each area.
- Fine-tune / Settings: style chips for each interest, project names, names of the people
  in your life (partner, friends, family, community), connection styles, how you want
  movement to feel, mindset needs and formats, reset styles.

**How a Daily Flow is built** (`recommendation-engine.js`)
1. **Hard filters.** These remove an idea outright if it:
   - spans several days
   - needs gear or a place we don't know you have
   - is a style chip you didn't pick
   - is longer than your time
   - has the wrong person or interest for that area
2. **Score.** Points for:
   - matching your area preference (+10)
   - helping your friction (+2 to +4)
   - fitting a goal (+2 to +3)
   - time fit, effort versus your bandwidth, starter ideas while your profile is broad
   - penalties for an activity already on another card, a recently shown idea, or the
     same theme as before
3. **Pick per area**, in this order: Create, Mindset, Connect, Move, Reset. It's a random
   pick from the top 4 to 8, for day to day variety.
4. **Day check** (`plan-day-coherence.js`). At most one demanding card. Reset is always
   light. No activity repeats across cards.
5. **Card text** (`recommendation-composer.js`) adds a lead-in such as "Do this with
   Josh:" or "For Megan's music album, 'the truth':", or a length ("Try this for 15
   minutes:") when it's safe.

**Shuffle**
- Excludes ideas already shown.
- Penalizes the same theme.
- Moves away from the activity it's replacing (fixed this week; repeat rerolls went from
  14% to 5%).
- Keeps relevance, because it re-ranks the same scored list.

---

## 2. Which signals actually change your Daily Flow

I ran 400 users, then switched off one signal at a time on the same day:

| Signal | Cards that change without it | Changes the wording? |
|---|---|---|
| Area preferences | 97% | Only names and project names |
| Frictions | 61% | **No** (except one walking variant) |
| Time preference | 64% | Only the "Try this for 15 minutes" prefix |
| Goals | 41% | **No** |
| Move feelings | 28% of Move cards | **No** |
| How full your days are | 11% | No |
| Life context | **0%** | No |

(A change here means the pick changed. Even a small score shift can swap the pick, so
read these as "has influence", not "how much".)

## 3. Stored but unused or underused

- **Life context** (student, parent, works from home…) has **zero effect**. It's asked in
  onboarding and does nothing.
- **Goals, frictions, move feelings, mindset needs** influence the pick but **never the
  words**.
- **A reason line already exists in the code**, but it only has 4 rules ("Picked for less
  screen time."), never appears on Daily Flow, and has a bug: it can print "Picked for
  less screen time and less screen time."
- **The Daily Flow header** is always the same: "Five personalized ideas for your day."
- `preferredDaypart` and `socialPreference` exist in the profile but are never asked
  or used.

---

## 4. Why the weak examples happened

These are real outputs from today's engine (deep profiles, the same day for everyone):

| Card | Root cause |
|---|---|
| Tired parent with 5 to 10 min gets "Master one traditional recipe from a culture you love" | The length is guessed from wording (87% of library ideas). "Master" isn't a 15 minute thing |
| Phone-heavy student gets "Find a YouTube lecture" | Their Mindset pick (videos) conflicts with their friction (phone use). A screen penalty exists but loses to the preference bonus |
| Overthinker's "offline" Reset is "Watch one complete thing with no second screen" | Tagging works by matching words: "no second screen" read as offline |
| "See a film at the cinema alone" as a 15 minute Reset | Cinema isn't recognized as going out or booking, and the length is guessed |
| Runner who wants energy gets "Do a slow controlled core workout… calming" | Desired feeling is worth only +3 against +10 for type, so feeling barely matters |
| "Read the first chapter of a book you have been avoiding" (2 of 5 users) | Obligation wording in the library. Reading should be a pleasure |
| "For Megan's music album: Hum three melody ideas…" | The idea is fine, but the only personal part is the project name. Nothing explains why it's for her |

**Already fixed in the build you're testing** (verified over 400 Daily Flows for Megan):
- "Try this for 15 minutes" in front of 20 minute or afternoon ideas: 0%
- 7 day challenges: blocked
- kickboxing class: never shown
- two demanding cards in a day: 0.3%
- Reset turning into a chore: 0%

If an old example still shows on your phone, it's the Daily Flow saved earlier that day.

**Weak patterns in what people actually see** (2,000 simulated users):
- Ideas that need a venue but aren't flagged as an outing: 4.9% of cards
- Big scope ideas ("Master…", "Complete 4 rounds…", "an afternoon"): 1.9%
- Spending money ("Buy one thing…"): 1.0%
- Screens inside "offline" ideas: about 1%
- Obligation wording ("you have been avoiding", "every single"): 0.8%

---

## 5. Proposed architecture

```
WHO THEY ARE        area picks, names, projects
WHAT GETS IN THE WAY / WHAT THEY WANT MORE OF   frictions, goals, move feelings
WHAT FITS TODAY     time, how full the day is, what else is in today's flow
        │
        ▼
1. pick the RIGHT VERSION of the activity   (what)
2. pair it with the line written for it     (how)
3. check the whole day                       (already built)
4. header that reflects the day              (small)
```

**Personalization happens at two levels, as ChatGPT says:**

1. **What.** The same preference has different versions. Running becomes an easy
   10 minute jog (tired), an easy outdoor run (peace), a slightly harder mile
   (confidence), a new route (repetitive days), or a run with notifications off (phone).
2. **How.** One short line, written for that exact version.

### The core: "mode" versions of each preference

There are about 30 area preferences (Music, Write, Walk, Cardio, Rest, Partner…). Each
one gets a few versions keyed to a **mode**: the way of doing it that suits a signal
we were told about.

| Mode | Triggered by (explicit signals only) |
|---|---|
| easy | low energy, very full days, time pressure, short time |
| calm | wants more peace, overthinking |
| no decisions | choice overload, overthinking, trouble starting |
| unplugged | phone overuse, wants less screen time |
| not work | trouble switching off work, self neglect |
| new | repetitive days, wants fun or novelty, unsure what I want |
| stretch | wants confidence, or the person chose "Push me" |

Each version is a **pair**: the idea and its line, written together. For example:

> **Cardio, easy:** Head outside for an easy 10 minute jog.
> *Short counts. Stop while it still feels good.*

> **Cardio, calm:** Take an easy 20 minute run outside.
> *Forget the pace today. Let moving give your mind somewhere quieter to land.*

> **Cardio, stretch:** Push yourself a little on one mile today.
> *Give yourself one small challenge and notice what your body can do.*

The sentence is written for its own idea, so it can't say something false about it.

**Scale:** about 30 preferences × 4 to 6 modes ≈ **150 to 180 pairs**. This extends the
140 starter ideas we just built: same file, same rules, same review process. I draft,
you review.

### Lines for library ideas (the other 46% of cards)

Library ideas get a line from a **small rule table** (about 30 rules × 3 tones). A rule
only fires when **both** are true:
- the person told us the signal, and
- the idea really has the trait the sentence talks about. "Phone away" requires the idea
  to be offline **and** not use the phone. "Stop when it feels good" requires low effort.

If no rule fits, the card gets **no line**. An honest blank beats an invented reason. In
the prototype the rules covered 63% of library cards. After the content review in
Phase 1, that should reach about 80%.

### Copy rules (these become automated checks)

- On screen it's two sentences only, **no "Action:" or "Nudge:" labels.** The idea is
  normal text, the line under it smaller and softer.
- The line is 90 characters or less, with no dashes.
- **Never repeat their profile back to them.** No "because you…" or "since you…", and no
  friction words in the line (overthink, tired, low energy, repetitive, switch off,
  scroll). Express the profile through the recommendation instead.
- Within one day, no signal is used for more than 2 lines. The same friction shows up
  differently in each area, not as "stop overthinking" five times.
- No assumptions about gear, money, place, skill or relationships we weren't told about
  (the specificity rule already in the engine).
- The idea must say what to do today. Nothing framed as "this week" or as homework.

---

## 6. Is a "How do you want to be encouraged?" setting worth it?

**Yes, but small, and not in onboarding.**

- **Why it matters:** two people with identical answers can want very different voices.
  That's the main thing the profile can't tell apart today.
- **Smallest useful set: 3 options**
  - **Gentle:** help me go easy on myself
  - **Steady:** supportive and straightforward
  - **Push me:** a little challenge when I need it

  "Playful" isn't needed as a tone: the *more fun* goal and the "new" mode already make
  the ideas themselves playful.
- **Where (your call):** the **10th and last screen of the tune-up**, the 9 question
  pop up that opens when a new user first taps Pick My Daily Flow. It's one tap at the
  end, after they've already shown they care about personalization, so it costs nothing
  at signup. It's also in **Settings**, so people who already finished the tune-up can
  set it. Onboarding stays at 4 screens.
- **Default for everyone, including existing users:** worked out from what they already
  told us.
  - **Gentle** if they chose low energy, very full days, or more peace.
  - **Steady** otherwise.
  - **Push me is never assumed.** Pushing someone who didn't ask for it is how an app
    feels pushy.
- **What it changes:**
  - the tone of every line, with each pair written in 3 tones where it matters
  - a nudge to the mode: Push me makes "stretch" versions possible, and Gentle leans
    toward "easy"

## 7. On the card

```
✨ CREATE
Put on a song you love and spend 25 minutes making something of your own.
Don't worry about whether it's good yet. Making it is the whole point.
[Add]  [🎲 Shuffle]                                               🔖
```

- Shown on Daily Flow, Pick for Me, and the onboarding preview. The preview is tight on
  space, so I'd show it there only if it fits without scrolling.
- **Add** saves only the first sentence to your day, exactly as today. The line is never
  stored, so saved and completed ideas don't change.

## 8. The day as a whole

Already built: at most one demanding card, Reset always light, no activity twice, an
effort budget based on how full your days are.

**Add:**
- **A total-time budget for the day.** A 5 to 10 minute person shouldn't get five
  10-minute cards (50 minutes). Cap the day at about 3× their usual time, so the lightest
  cards fill out the rest.
- **One mode per day per person.** If "easy" is the mode, all five cards lean easy. That
  makes the day feel like it understood one person, as in ChatGPT's "I'm usually tired"
  example.

## 9. Shuffle

Mostly done this week (no repeats, theme penalty, moves away from the replaced
activity). **One addition:** a shuffle may switch to a *different mode* of the same
preference (from the calm run to the new route run), so a reroll changes something
meaningful but stays relevant.

## 10. Data changes (minimal)

- **Profile:** add one field, `encouragementStyle: null`. Null means it's worked out
  from existing answers.
- **Ideas:** add `modes: [...]` and a paired line on the new pairs (in the starter ideas
  file). For library ideas, two computed traits, `usesPhone` and `intensity`, plus hand
  overrides in the existing `idea-overrides.js` for the top 150.
- **Card output:** add a `nudge` field next to `title`. The old `reason` line is removed
  (it had the duplication bug anyway).
- No new profile system, no AI, nothing extra stored per user.

## 11. Existing users

- No re-onboarding.
- Lines appear automatically from answers they already gave.
- Tone defaults as described in section 6.
- The new Settings question is optional.
- Saved ideas, progress and today's already-built Daily Flow are untouched. The new
  cards start tomorrow.

## 12. Plan, ranked by impact versus effort

| Phase | What | Impact | Effort |
|---|---|---|---|
| **0** | Two small bugs: the reason line duplication, and one onboarding subtitle that reads "…more confidence and energy, and easy to start" (should be "all easy to start") | small | tiny |
| **1** | **Content review of the 150 most-shown library ideas**: real lengths, obligation wording, venue and booking flags, screen ideas mislabeled offline, spending. Make "trouble switching off work" override business ideas in Create | **high**: fixes most wrong cards people actually see | low to medium (data only) |
| **2** | **Mode pairs for each preference** (about 150 to 180, drafted by me, reviewed by you) + pick the mode from explicit signals + one mode per day + total-time budget | **highest**: this is the "how did it know" feeling | medium |
| **3** | Rule-table lines for library cards + the new card layout + header ("A gentle flow today ✨", reusing the onboarding subtitle under it) | high | low to medium |
| **4** | "How do you want to be encouraged?" as the 10th tune-up screen + Settings, with 3 tones | medium | low |
| **5** | Decide on life context: use it (for example, students get campus-friendly ideas) or stop asking | low | low |

Each phase gets the same treatment as this week's work: tests, the A/B/C-style
acceptance profiles, iOS parity, and a Cursor bundle.

---

## 13. Before and after: five people

**BEFORE** is real output from today's engine. **AFTER** shows what Phases 1 to 3 would
produce. They're written by hand, but every card follows the rules above and uses only
signals that person gave.

### 1. Megan: music, books, dance, partner Josh · wants creativity and connection · too many choices · 15 to 30 min · Steady

| | Before | After |
|---|---|---|
| Create | For Megan's music album, 'the truth': Hum three melody ideas into a voice memo and keep the best one. | For 'the truth': hum one melody into a voice memo, and keep it even if it's rough.<br>*One idea is enough today. No picking the best.* |
| Mindset | Read the first chapter of a book you have been avoiding | Read for 20 minutes from whatever book is closest to you.<br>*Already chosen. Just open it.* |
| Connect | Do this with Josh: Go antique or thrift shopping, each finds something for the other | Do this with Josh: put on one song you both love and dance in the kitchen until it ends.<br>*Small moments like this count.* |
| Move | Put on three songs you love and dance through all three. | Learn the first part of a dance you love from a video.<br>*Just the first part. That's enough for today.* |
| Reset | Make yourself a simple snack you love and eat it sitting down. | Make yourself a snack you love and eat it sitting down.<br>*No plan needed for this one.* |

(After the change, dancing moves to Connect, so Move switches to a different version of
dance. No activity appears twice in one day.)

### 2. Runner who overthinks · wants peace · can't switch off work · pretty full · 15 to 30 min · Gentle (worked out from "peace")

| | Before | After |
|---|---|---|
| Create | Write a letter to yourself one year from now. | Write for 10 minutes about whatever's in your head, then stop.<br>*It doesn't need to be good or go anywhere.* |
| Mindset | Read the first chapter of a book you have been avoiding | Read something you're curious about that has nothing to do with work.<br>*Let your mind wander somewhere it doesn't have to perform.* |
| Connect | Do this with Josh: Put on one song you both love and dance in the kitchen until it ends. | Spend 20 minutes with Josh with both phones out of reach.<br>*Let this part of the day belong to the two of you.* |
| Move | Take a slow 30-minute walk without tracking anything… | Take an easy 20 minute run outside.<br>*Forget the pace today. Let moving give your mind somewhere quieter to land.* |
| Reset | Watch one complete thing with no second screen beside it at all | Sit outside for 15 minutes without trying to figure anything out.<br>*Let noticing replace solving for a little while.* |

### 3. Runner who wants confidence · trouble starting · balanced · 15 to 30 min · Push me (chosen)

| | Before | After |
|---|---|---|
| Create | Design a product line, even if it is just sketches on paper | Film one 30 second clip about something you know well.<br>*Post it or don't. Making it is the win.* |
| Mindset | Listen to a short talk by someone whose life looks nothing like yours. | Listen to a 15 minute talk from someone who built something from nothing.<br>*Start it now, before you find a reason not to.* |
| Connect | Do this with a friend: Go on a 15 minute walk and catch up properly… | Text a friend and pick a day and time to run together.<br>*Send it before you rewrite it.* |
| Move | Do a slow controlled core workout, no momentum, feel every rep | Push yourself a little on one mile today.<br>*Give yourself one small challenge and notice what your body can do.* |
| Reset | Take a 25 minute nap or rest, even if you do not fall asleep. | Lie down for 15 minutes with your phone in another room.<br>*Rest is part of getting stronger.* |

(Same "running" preference as person 2, a completely different experience: that's the
two-level personalization.)

### 4. Tired parent · wants time for self · low energy, puts others first · very full · 5 to 10 min · Gentle

| | Before | After |
|---|---|---|
| Create | Master one traditional recipe from a culture you love | Make yourself a drink you love and serve it in your nicest glass.<br>*Something small and lovely, just for you.* |
| Mindset | Practice loving-kindness meditation genuinely for 5 people | Sit somewhere comfortable for 5 minutes and let your mind settle.<br>*Nothing to fix. Just a pause.* |
| Connect | Do this with Maya: Learn a skill from a family member who is actually good at it | Send Maya a voice note about one good thing from today.<br>*Connection can be small and still feel real.* |
| Move | Do 5 to 10 minutes of gentle floor stretching with no performance goal. | Stretch slowly for 10 minutes somewhere comfortable.<br>*Keep it easy enough that your body feels better afterward.* |
| Reset | Lie down for 10 minutes with your eyes closed and nothing to do. | Lie down for 10 minutes with your eyes closed and nothing to do.<br>*You don't need to earn a little rest.* |

Header: **A gentle flow today ✨** · *Picked to bring you more time for yourself, gentle
enough for a tired day.* The whole day is 45 minutes or less, within the budget.

### 5. Phone-heavy student · wants less screen time and fun · repetitive days · balanced · 15 to 30 min · Steady

| | Before | After |
|---|---|---|
| Create | Go on a 20 minute photo walk and keep your three favorites. | Photograph five ordinary things from angles you've never tried.<br>*Make somewhere familiar look unfamiliar for a few minutes.* |
| Mindset | Find a YouTube lecture on something that genuinely excites you | Learn about one thing you've always wondered about, from a book or a person.<br>*Follow a rabbit hole your usual day wouldn't lead you to.* |
| Connect | Do this with Lena: Try a new restaurant and rate every single dish like actual critics | Do this with Lena: walk somewhere neither of you has been and grab one snack there.<br>*Give the week a story you couldn't have predicted.* |
| Move | Move your body to music you enjoy for 30 minutes, no choreography required. | Take your walk on a route you've never used.<br>*A small change of scenery counts.* |
| Reset | See a film at the cinema alone, popcorn, full seat, enjoy every second | Put your phone in another room for 20 minutes and do one slow thing by hand.<br>*Let your attention stop being pulled somewhere else.* |

Header: **A little something new today ✨**

---

## Decisions I need from you

1. **Order.** Phase 0 → 1 → 2 → 3, then 4. Or do you want the visible line (Phase 3)
   earlier, even before the content review?
2. **The tone setting:** agreed. It's the last tune-up screen plus Settings. Still to
   confirm: 3 options (Gentle, Steady, Push me), with Push me never assumed.
3. **Where the line shows:** Daily Flow, Pick for Me, and the onboarding preview (if it
   fits)?
4. **The mode pairs:** I draft about 150 to 180 pairs, in batches by area, for you to
   review like the starters. OK?
5. **Life context:** use it or stop asking?
