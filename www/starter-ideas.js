/**
 * Passion Flow Daily — starter ideas.
 *
 * Ordinary library ideas, written to need nothing beyond a broad preference. When
 * someone only tells us "Music" or "Walk", these are what we can honestly suggest:
 * no instrument, camera, gym, car or beach assumed, no open-ended decisions, and a
 * real length. They stay in the library for good; the engine ranks them up while a
 * profile is still broad and lets more specific ideas take over once the person
 * tells us more (for example Music, then Songwriting).
 *
 * One list per preference, keyed by the same ids the profile already stores
 * (createInterests, mindsetFormats, connectTargets, movePreferences, resetStyles).
 *
 * Entry: [minutes, text, traits, modes, line]
 *   traits: 'o' offline, 'n' something new, 'a' physically active
 *   modes:  the kind of day this version suits, matched to what the person told us
 *           (recommendation-engine.js personModes):
 *             E easy       low energy, very full days, little time
 *             C calm       wants more peace, overthinks
 *             D decided    nothing left to choose: too many choices, overthinking,
 *                          trouble starting
 *             U unplugged  phone overuse, wants less screen time
 *             W not work   can't switch off from work, puts themselves last
 *             N new        days feel repetitive, wants fun, unsure what they want
 *             S stretch    wants confidence: a small challenge
 *   line:   the second sentence on the card, written for this exact idea. It shapes
 *           why the idea fits without repeating the person's answers back to them.
 *
 * New versions are added at the end of a list so existing ids never change.
 *
 * Lengths are spread so every preference has ideas for 5 to 10 minute days.
 * No dashes in any text or line.
 */
(function (global) {
  var IDEAS = {
    create: {
      art_crafts: [
        [10, 'Draw the view from where you are sitting for 10 minutes, no erasing allowed.', 'o', 'EDU', 'The view is already chosen. Start with the first line you see.'],
        [10, 'Make a tiny collage from scraps of paper, packaging or old receipts you already have.', 'o', 'EW', 'Everything you need is already in the house. It only has to be small.'],
        [15, 'Pick one color and spend 15 minutes making a page that is only shades of it.', 'o', 'DC', 'One color, no other choices to make. Let it be calm and a little messy.'],
        [25, 'Make something small for your space, a little drawing, a folded paper shape or a painted stone, and put it where you will see it.', 'on', 'NW', 'Something you made, somewhere you’ll see it every day.'],
        [40, 'Put on music you love and spend 40 minutes making something with your hands, with no idea how it will turn out.', 'o', 'WC', 'Nothing to finish or show anyone. Making it is the whole point.'],
        [5, 'Doodle for 5 minutes on whatever paper is closest, with whatever pen is closest.', 'o', 'EDU', 'Small enough to start right now.'],
        [20, 'Draw one object in front of you for 20 minutes, slower and in more detail than feels normal.', 'o', 'CDS', 'Stay with one thing long enough to really see it.'],
        [25, 'Draw or paint something you have never tried before, like hands, a face or the sky.', 'on', 'NS', 'Try the hard version today. Wobbly lines are part of it.']
      ],
      writing: [
        [10, 'Write one paragraph about the best part of your day so far.', 'o', 'ED', 'Just one paragraph. Start with the first moment that comes to mind.'],
        [10, 'Write a short note to someone who made your week better, even if you never send it.', 'o', 'EW', 'A small, warm thing to write. Sending it is optional.'],
        [15, 'Spend 15 minutes writing a short story that starts with the last thing you overheard.', 'on', 'ND', 'The first line is already decided. See where it goes.'],
        [25, 'Write about a place you loved as a kid for 25 minutes, in as much sensory detail as you can.', 'o', 'CW', 'Let yourself go somewhere slower for a while.'],
        [40, 'Write for 40 minutes about a version of your life you are curious about, as if it already happened.', 'on', 'NS', 'Write it as if it’s true, and see what you notice.'],
        [10, 'Write for 10 minutes about whatever is in your head, then stop.', 'o', 'CWD', 'It doesn’t need to be good or go anywhere.'],
        [20, 'Write one page without stopping, starting with the words: today I want...', 'o', 'DSU', 'Keep the pen moving. No going back to fix anything.'],
        [5, 'Write down three words that describe today, then one sentence about the best one.', 'o', 'ED', 'Three words is enough to start.']
      ],
      music: [
        [10, 'Put on a song you love and write down every image it puts in your head, for 10 minutes.', 'o', 'EC', 'Let the song do the work. You’re only writing down what it shows you.'],
        [10, 'Make a five song playlist for the mood you want more of today.', '', 'EW', 'Five songs is enough. Let the first ones that come to mind count.'],
        [15, 'Spend 15 minutes exploring an artist or genre you have always been curious about.', 'n', 'N', 'Follow your curiosity somewhere new for a few songs.'],
        [25, 'Put on a song you love and spend 25 minutes making something inspired by how it feels: a drawing, a few lines, or a dance in your kitchen.', 'n', 'WN', 'Don’t worry about whether it’s good. Making it is the whole point.'],
        [40, 'Spend 40 minutes making a playlist that tells the story of your life so far, one song for each chapter.', 'n', 'CW', 'Let each song bring back where you were when it mattered.'],
        [10, 'Hum or sing one melody into a voice memo, and keep it even if it is rough.', '', 'DES', 'One idea is enough today. No picking the best.'],
        [10, 'Sing along to two songs you love, start to finish, as loud as feels good.', '', 'EW', 'Not for anyone else. Just for the fun of it.'],
        [5, 'Put on one song you love and do nothing else until it ends.', '', 'EC', 'Just you and one song. Nothing else for a few minutes.'],
        [30, 'Listen to one full album from start to finish, in order, doing nothing else.', '', 'DC', 'The album decides the order. You just listen.']
      ],
      photography: [
        [10, 'Take five photos of things around you that you usually walk past without noticing.', 'n', 'NE', 'Somewhere familiar, seen a little differently.'],
        [10, 'Photograph one color everywhere you go for the next 10 minutes.', 'n', 'ND', 'One color decides everything. All you have to do is look.'],
        [15, 'Take a 15 minute walk and capture one photo that sums up how today feels.', '', 'CD', 'Just one photo. Let it be the one that feels right.'],
        [25, 'Spend 25 minutes photographing light, shadows and reflections, then keep your three favorites.', 'n', 'NS', 'Look for the light first. The photos will follow.'],
        [40, 'Spend 40 minutes taking photos of a street or park near you as if you were seeing it for the first time.', 'n', 'NC', 'Walk slower than usual. There’s more to see than you think.'],
        [15, 'Photograph five ordinary things from angles you have never tried.', 'n', 'NE', 'Make somewhere familiar look unfamiliar for a few minutes.'],
        [20, 'Take one portrait of something or someone you love, and keep taking it until it feels right.', '', 'SD', 'One subject. Stay with it until it clicks.'],
        [5, 'Take one photo of the nicest light you can find right now.', 'n', 'EDN', 'Just one photo. The light decides.']
      ],
      cooking_baking: [
        [10, 'Make yourself a drink you love and serve it in your nicest glass.', 'o', 'EW', 'Something small and lovely, just for you.'],
        [10, 'Plate a simple snack as if it were going to be photographed for a cafe menu.', 'n', 'EN', 'A few minutes of play with something you’d eat anyway.'],
        [15, 'Make toast or a simple bowl a little more special with one topping you have never tried together.', 'n', 'N', 'One small surprise in an ordinary meal.'],
        [25, 'Cook one simple meal you love with music on and no rushing.', 'o', 'CWU', 'No rushing this one. Let making it be part of enjoying it.'],
        [40, 'Make a dish you already know by heart, but change one ingredient to see what happens.', 'n', 'NS', 'You know the recipe. Today, play with it.'],
        [20, 'Cook something simple using only what is already in your kitchen.', 'o', 'DW', 'No shopping, no plan. What you have is enough.'],
        [5, 'Make your next drink or snack with a little extra care, like a nice glass or a real plate.', 'o', 'EW', 'A little care makes an ordinary moment yours.']
      ],
      building_business: [
        [10, 'Write down three things people often ask you for help with, and circle the one you enjoy most.', 'o', 'DE', 'Three things, one circle. That’s all for today.'],
        [10, 'Sketch the simplest version of an idea you keep thinking about on one page.', 'o', 'ED', 'One page keeps it small. Simple is the goal.'],
        [15, 'Give an idea you care about 15 minutes and make one tiny piece of it: a name, a sketch or a first sentence.', '', 'DS', 'One tiny piece is real progress.'],
        [25, 'Spend 25 minutes finishing one small piece of an idea you care about that you could show someone.', '', 'S', 'Finish something small enough to show today.'],
        [40, 'Spend 40 minutes making a rough first version of something you want to exist. Messy is the goal.', 'n', 'SN', 'A rough version beats a perfect plan.'],
        [20, 'Make something with your hands that has nothing to do with work, like a sketch, a meal or a playlist.', 'o', 'W', 'Give your creative side somewhere to exist without needing to be useful.'],
        [5, 'Write down the one next step on an idea you care about, and stop there.', 'o', 'ED', 'One step is enough to keep it alive.']
      ]
    },

    learn: {
      journaling: [
        [10, 'Write down one decision you keep going back and forth on, then write what you would pick if it did not have to be perfect.', 'o', 'DC', 'One honest answer is enough for now.'],
        [10, 'Journal for 10 minutes starting with: right now I am carrying...', 'o', 'CEU', 'Set some of it down on the page.'],
        [15, 'Write three things that went better than you expected lately, and what made them go well.', 'o', 'DS', 'Notice what’s already working.'],
        [25, 'Write a letter to yourself from five years ago, telling them what you know now.', 'o', 'CN', 'You know more than you did. Let yourself see it.'],
        [40, 'Journal for 40 minutes about what a really good ordinary day looks like for you, hour by hour.', 'o', 'WC', 'Picture it in detail. It might be closer than it seems.'],
        [10, 'Write down three things you have felt drawn toward lately, even if they do not make sense yet.', 'o', 'N', 'You don’t need a plan today. Just notice what keeps pulling at you.'],
        [5, 'Write one sentence about how today feels, then close the notebook.', 'o', 'ED', 'One sentence counts.'],
        [25, 'Answer three questions in your journal: what went well, what was hard, and what you want tomorrow.', 'o', 'DC', 'Three questions, already written for you.']
      ],
      books: [
        [10, 'Read 10 pages of the book closest to you right now.', 'o', 'ED', 'Already chosen. Just open it.'],
        [10, 'Read one short poem out loud, slowly, twice.', 'o', 'EC', 'Two slow readings. Notice what lands the second time.'],
        [15, 'Read for 15 minutes somewhere you do not usually read, like a bench, the floor or a cafe.', 'n', 'N', 'Same book, new spot. It changes more than you’d think.'],
        [25, 'Reread the first chapter of a book you loved years ago and notice what feels different now.', 'o', 'C', 'Meet an old favorite again.'],
        [40, 'Read for 40 minutes with your phone away and a drink you like next to you.', 'o', 'UC', 'Let the book be the only thing asking for your attention.'],
        [20, 'Read something you are curious about that has nothing to do with work.', 'o', 'W', 'Let your mind wander somewhere it doesn’t have to perform.'],
        [30, 'Read 30 pages of something a little harder than your usual pick.', 'o', 'S', 'Give your mind a small challenge today.'],
        [5, 'Read one page of anything you have nearby, slowly.', 'o', 'ED', 'One page counts.'],
        [30, 'Read the next chapter of whatever you are reading now, start to finish.', 'o', 'DC', 'No choosing. Just the next chapter.']
      ],
      podcasts: [
        [10, 'Listen to 10 minutes of a podcast or audiobook on a topic you know nothing about.', 'n', 'NE', 'Ten minutes in a world that isn’t yours.'],
        [10, 'Listen to a short talk by someone whose life looks nothing like yours.', 'n', 'N', 'A different life, and a new way of seeing your own.'],
        [15, 'Put in headphones and listen to something interesting on a 15 minute walk.', '', 'EW', 'Let your feet and your mind both wander.'],
        [25, 'Listen to one podcast episode while you do something with your hands, like folding laundry or cooking.', '', 'D', 'Something to look forward to while you do the ordinary stuff.'],
        [40, 'Lie down and listen to an audiobook chapter for 40 minutes with nothing else to do.', '', 'CE', 'Rest and a story at the same time.'],
        [15, 'Listen to a 15 minute talk from someone who built something from nothing.', 'n', 'SD', 'Start it now, before you find a reason not to.'],
        [20, 'Listen to something that makes you laugh for 20 minutes, with nothing else going on.', '', 'WE', 'Not to learn anything. Just because it’s good.'],
        [5, 'Listen to the first 5 minutes of a podcast you have never tried.', 'n', 'EN', 'Five minutes is enough to know if you like it.'],
        [30, 'Listen to the newest episode of a podcast you already like, start to finish.', '', 'D', 'Already chosen. Just press play.']
      ],
      mindfulness: [
        [5, 'Sit somewhere comfortable for 5 minutes and notice what your mind is carrying, without trying to solve any of it.', 'o', 'ECD', 'Nothing to fix. Just a pause.'],
        [10, 'Make a cup of tea and drink it slowly, paying attention only to the taste and the warmth.', 'o', 'ECU', 'One warm cup, and nothing else asking for you.'],
        [15, 'Take a slow 15 minute walk and name five things you can hear.', 'o', 'CU', 'Sounds you’d normally miss become the whole walk.'],
        [25, 'Lie down and do a slow body scan for 25 minutes, from your feet up to your head.', 'o', 'C', 'No need to relax on purpose. Just notice.'],
        [40, 'Spend 40 minutes doing one ordinary thing very slowly, like cooking or tidying, with no podcast and no screens.', 'o', 'CU', 'Slow on purpose, for once.'],
        [10, 'Sit somewhere comfortable for 10 minutes without your phone and notice what is around you.', 'o', 'UE', 'Give your attention somewhere to go that isn’t a screen.'],
        [10, 'Breathe in for four counts and out for six, for 10 minutes, wherever you are.', 'o', 'DE', 'The counting is the whole plan.'],
        [20, 'Set a timer for 20 minutes and sit, walk or stretch slowly until it rings.', 'o', 'DC', 'The timer holds the plan. You just stay with it.']
      ],
      learning: [
        [10, 'Look up the story behind one everyday object you use, like a zipper or a pencil.', 'n', 'NE', 'A tiny rabbit hole, just for fun.'],
        [10, 'Learn 10 words in a language you would love to speak someday.', 'n', 'ND', 'Ten words is a real start.'],
        [15, 'Watch one short explainer video on something you have always wondered about.', 'n', 'N', 'Finally get the answer to one small question.'],
        [25, 'Spend 25 minutes learning the basics of something you have always been curious about, just for fun.', 'n', 'WN', 'No test at the end. Just curiosity.'],
        [40, 'Spend 40 minutes learning how something you use all the time actually works, like coffee, music or the internet.', 'n', 'NS', 'Understand one everyday thing properly.'],
        [20, 'Learn about one thing you have always wondered about, from a book or a person.', 'on', 'NU', 'Follow a rabbit hole your usual day wouldn’t lead you to.'],
        [10, 'Learn one small thing today that you could explain to a friend tonight.', 'n', 'S', 'Learning sticks when you share it.'],
        [5, 'Look up one word or fact you have been curious about lately.', 'n', 'ED', 'One small answer, just for you.']
      ]
    },

    /* Partner, friend and family ideas are things you do together. Ideas without a
       {who} are shown as "Do this with ...: <idea>". In ideas with {who}, the name
       goes in the sentence: "Spend 20 minutes with Josh..." */
    connect: {
      partner: [
        [10, 'Each share the best moment of your day so far, and ask one follow up question.', 'o', 'EDC', 'One good moment each. Listen for the details.'],
        [10, 'Put on one song you both love and dance in the kitchen until it ends.', 'n', 'EWN', 'Small moments like this count.'],
        [15, 'Take a 15 minute walk together with your phones away and talk about anything but logistics.', 'o', 'UCW', 'No plans, no to do lists. Just the two of you.'],
        [25, 'Cook or put together something simple side by side, with music on and no screens.', 'o', 'WU', 'Making something together counts as time together.'],
        [40, 'Spend 40 minutes doing something neither of you has done together before, like a new walk, a new game or a new snack.', 'n', 'NS', 'A little novelty makes an ordinary night feel different.'],
        [20, 'Spend 20 minutes with {who} with both phones out of reach.', 'o', 'UWC', 'Let this part of the day belong to the two of you.'],
        [10, 'Tell {who} one specific thing you appreciated about them lately.', 'o', 'ED', 'Specific is what makes it land.'],
        [5, 'Give {who} a long hug and tell them one thing you love about them.', 'o', 'EDW', 'Small gestures still count as time together.'],
        [30, 'Cook dinner together using a recipe one of you already knows by heart.', 'o', 'DW', 'No new recipes, no decisions. Just cooking together.']
      ],
      friends: [
        [10, 'Call each other for 10 minutes and swap the best and hardest part of your week.', '', 'ED', 'Ten minutes can go a long way.'],
        [10, 'Send each other one photo that sums up your day, and the story behind it.', '', 'EN', 'A small window into each other’s day.'],
        [15, 'Go on a 15 minute walk and catch up properly, with your phones away.', 'o', 'UC', 'A conversation that goes beyond sending each other posts.'],
        [25, 'Meet for a coffee and ask each other one question you never usually ask.', 'n', 'NS', 'Let the conversation go somewhere new.'],
        [40, 'Share a simple meal together with your phones away from the table.', 'o', 'UW', 'Nothing to do but eat and talk.'],
        [5, 'Text {who} and pick a day and time to do something together.', '', 'DS', 'Send it before you rewrite it.'],
        [10, 'Send {who} a voice note about one thing that made you think of them.', '', 'EW', 'A small way of saying you’re thinking of them.'],
        [30, 'Call {who} and take a walk while you talk, each of you wherever you are.', 'o', 'DW', 'A walk and a catch up at the same time.']
      ],
      family: [
        [10, 'Ask each other about a favorite memory from when you were younger.', 'o', 'EC', 'Let the story take as long as it needs.'],
        [10, 'Look through old photos together and tell the story behind one of them.', 'o', 'EC', 'One photo is enough to start a good story.'],
        [15, 'Play one card game or board game together with no screens around.', 'o', 'UW', 'Just a game. No one needs to be anywhere else.'],
        [25, 'Cook one family dish together and talk about who taught it to you.', 'o', 'WC', 'The recipe comes with a story. Let it.'],
        [40, 'Take a 40 minute walk together somewhere you all like, with your phones away.', 'o', 'UC', 'Walking side by side makes talking easier.'],
        [10, 'Send {who} a voice note about one good thing from today.', '', 'EW', 'Connection can be small and still feel real.'],
        [15, 'Call {who} and ask them something you never usually ask about their life.', '', 'NS', 'Give the call room to be more than a quick check in.'],
        [5, 'Send {who} a photo of something that made you think of them.', '', 'ED', 'A tiny hello that brightens their day.']
      ],
      community: [
        [10, 'Give one genuine compliment to someone you do not know well.', 'n', 'EN', 'A small kindness that makes two days better.'],
        [10, 'Start one small conversation with someone you see often but have never really talked to.', 'n', 'NS', 'One small hello is how most good things start.'],
        [15, 'Go somewhere people naturally gather, like a cafe or a park, and say hello to one new person.', 'n', 'NS', 'Let your routine make room for someone new.'],
        [25, 'Spend 25 minutes doing something kind for a neighbor, like bringing over a snack or offering a hand.', 'o', 'W', 'Helping someone close by is its own kind of connection.'],
        [40, 'Spend 40 minutes at a library, market or park you have never visited, and talk to one person there.', 'n', 'N', 'A new place makes meeting someone easier.'],
        [10, 'Say a genuine thank you to someone whose work usually goes unnoticed.', '', 'ED', 'A few kind words, and their day gets a little better.'],
        [5, 'Smile and say good morning to someone you pass most days.', 'n', 'ED', 'Small hellos make a place feel like home.']
      ],
      self: [
        [10, 'Step outside on your own for 10 minutes and check in with how you are really feeling.', 'o', 'ECU', 'Your own company counts as meaningful time too.'],
        [10, 'Write yourself a short note about something you handled well recently.', 'o', 'EC', 'Give yourself the credit you’d give a friend.'],
        [15, 'Give yourself 15 minutes that belong to nobody else: no work, no messages, no catching up.', 'o', 'WU', 'No one else needs anything from this time.'],
        [25, 'Make yourself a proper breakfast or lunch and eat it slowly, sitting down, with your phone away.', 'o', 'WU', 'Give yourself the same care you’d give someone else.'],
        [40, 'Take yourself on a 40 minute solo outing to a bookstore, a cafe or a park, somewhere that feels like a small treat.', 'n', 'NW', 'Your own company gets to count as a treat.'],
        [5, 'Take five slow breaths and ask yourself what you need most today.', 'o', 'ECD', 'Five breaths, one honest answer.'],
        [30, 'Walk to the nearest cafe or park on your own, stay a little while, and walk back.', 'o', 'DW', 'A small outing that’s already planned for you.']
      ]
    },

    move: {
      walking: [
        [10, 'Take a 10 minute walk around the block and notice three things you have never noticed before.', 'n', 'EN', 'Same block, new details.'],
        [10, 'Walk for 10 minutes with your phone away and let your mind wander.', 'o', 'EUC', 'Nothing needs solving while you’re outside.'],
        [15, 'Walk 15 minutes to somewhere small, like a corner shop or a bench, and come back a different way.', 'n', 'N', 'Coming back a different way makes the whole walk feel new.'],
        [25, 'Take a 25 minute walk somewhere green and let your breathing match your steps.', 'o', 'C', 'Let moving give your mind somewhere quieter to land.'],
        [40, 'Take a 40 minute walk somewhere you enjoy, leave the podcast behind, and let your mind wander.', 'o', 'UW', 'No input for a while. See what comes up.'],
        [20, 'Take a 20 minute walk without bringing work along, not even in your headphones.', 'o', 'W', 'Let work wait at home for this one.'],
        [30, 'Take a brisk 30 minute walk and pick up the pace for the last five minutes.', 'a', 'S', 'Finish strong, and notice how good it feels to push a little.'],
        [15, 'Take your walk on a route you have never used.', 'n', 'N', 'A small change of scenery counts.'],
        [5, 'Step outside and walk for 5 minutes in any direction.', 'o', 'ED', 'Five minutes outside still counts.'],
        [25, 'Walk 12 minutes in one direction, then turn around and walk back.', 'o', 'DC', 'No route to plan. Halfway is wherever the timer says.']
      ],
      strength: [
        [10, 'Do 10 minutes of bodyweight moves at home: squats, wall pushups and a plank, at your own pace.', 'a', 'E', 'Your pace, your reps. Starting is the hard part.'],
        [10, 'Hold a wall sit and a plank for as long as feels good, twice each.', 'a', 'ED', 'Two moves, no plan needed.'],
        [15, 'Do a 15 minute bodyweight circuit at home and rest whenever you want.', 'a', 'W', 'Rest whenever you want. This one is for you.'],
        [25, 'Follow a 25 minute beginner strength video at home and change anything that does not feel right.', 'a', 'D', 'Someone else made the plan. You just follow along.'],
        [40, 'Do a 40 minute bodyweight workout at home to music you love, and stop on a high note.', 'a', 'S', 'Give yourself something to feel stronger in today.'],
        [30, 'Do three rounds of squats, pushups and lunges, adding one rep each round.', 'a', 'SD', 'Keep it simple, and feel a little stronger by the last round.'],
        [5, 'Do 10 squats and a 30 second plank, and call it done.', 'a', 'ED', 'Small is still strong.']
      ],
      yoga_stretch: [
        [10, 'Do a gentle 10 minute stretch and let feeling better be the only goal.', 'o', 'EC', 'Choose whatever feels good instead of making it a workout.'],
        [10, 'Stretch your neck, shoulders and back for 10 minutes, slowly, with your eyes closed.', 'o', 'ECW', 'Let your shoulders put down what they’ve been holding.'],
        [15, 'Follow a 15 minute beginner yoga video and skip any pose that does not feel good.', '', 'D', 'Someone else leads. You only follow what feels good.'],
        [25, 'Do 25 minutes of slow floor stretches with a calm playlist on.', 'o', 'CU', 'Slow is the point here.'],
        [40, 'Follow a 40 minute gentle yoga session at home and end with five minutes lying still.', '', 'CS', 'Stay for the quiet minutes at the end. They count the most.'],
        [10, 'Stretch slowly for 10 minutes somewhere comfortable.', 'o', 'E', 'Keep it easy enough that your body feels better afterward.'],
        [20, 'Hold three deeper stretches for two minutes each, breathing slowly.', 'o', 'S', 'Go a little further than usual, and breathe through it.'],
        [5, 'Reach your arms up, fold forward and roll your shoulders for 5 slow minutes.', 'o', 'EC', 'A few minutes of feeling your body loosen.']
      ],
      dance: [
        [10, 'Put on three songs that make you feel good and dance until they are over.', 'na', 'EWN', 'Make movement the part of today that doesn’t need to be serious.'],
        [10, 'Dance to one song as if nobody is watching, then one more because it was fun.', 'a', 'EW', 'Nobody is watching. That’s the point.'],
        [15, 'Learn the first part of a dance you love from a video, just for fun.', 'na', 'DN', 'Just the first part. That’s enough for today.'],
        [25, 'Make a 25 minute playlist of songs you cannot sit still to, and move to all of it.', 'a', 'W', 'Let the music decide how you move.'],
        [40, 'Follow a 40 minute dance workout video at home and laugh at every move you miss.', 'na', 'S', 'Missing moves is part of it. Keep going.'],
        [5, 'Dance to one song in your kitchen, however you want.', 'a', 'EW', 'One song is a whole dance party.'],
        [20, 'Put on an album you love and dance through the first five songs.', 'a', 'DW', 'The album decides. You just move.']
      ],
      running: [
        [10, 'Do 10 minutes of brisk walking or easy jogging, and stop while it still feels good.', 'a', 'E', 'Short counts, and it still changes how the day feels.'],
        [10, 'Do a 10 minute cardio mix at home: marching, jumping jacks and dancing in place.', 'a', 'ED', 'No route, no gear. Just your living room.'],
        [15, 'For 15 minutes, alternate one minute fast and one minute easy, walking or jogging.', 'a', 'SD', 'Only the next fast minute. That’s all you have to think about.'],
        [25, 'Go for a 25 minute easy jog or brisk walk at a pace where you could still talk.', 'a', 'C', 'Forget the pace today. Let moving give your mind somewhere quieter to land.'],
        [40, 'Do a 40 minute cardio session you enjoy, walking, jogging or a workout video, and finish with a slow cool down.', 'a', 'S', 'Give the session your energy, then let the cool down be slow.'],
        [15, 'Push yourself a little for one mile today, jogging or walking fast.', 'a', 'S', 'Give yourself one small challenge and notice what your body can do.'],
        [20, 'Jog or walk fast for 20 minutes on a route you have never taken.', 'an', 'N', 'A new route makes the time go faster.'],
        [20, 'Take a 20 minute run or brisk walk with your notifications off.', 'a', 'U', 'Let the route be the only thing asking for your attention.'],
        [5, 'March or jog in place for 5 minutes to a song you love.', 'a', 'ED', 'Five minutes is enough to get your heart going.'],
        [25, 'Walk or jog for 12 minutes away from your door, then come back the same way.', 'a', 'DC', 'Out and back. Nothing to plan.']
      ],
      hiking: [
        [10, 'Step outside for 10 minutes and walk to the nearest tree or patch of green you can see.', 'o', 'E', 'The nearest green thing is enough.'],
        [10, 'Spend 10 minutes outside noticing the sky, the air and three sounds around you.', 'o', 'ECU', 'Let the outside do the work for a few minutes.'],
        [15, 'Take a 15 minute walk outside in a direction you do not usually go.', 'n', 'N', 'A few streets away can still feel new.'],
        [25, 'Spend 25 minutes walking in the nearest park or green space you can get to.', 'o', 'CW', 'Green space, no agenda.'],
        [40, 'Spend 40 minutes outdoors on a walk somewhere with trees, water or a view, at an easy pace.', 'o', 'CU', 'Easy pace. Let the view set the mood.'],
        [30, 'Find the steepest street or hill near you and walk up it twice.', 'a', 'S', 'A small climb you can feel. Enjoy the view at the top.'],
        [5, 'Step outside for 5 minutes and find one living thing to look at closely.', 'o', 'EC', 'A leaf, a bird, a cloud. Just one.']
      ]
    },

    // Reset ideas lower the day's load, so none of them are chores or projects.
    nourish: {
      self_care: [
        [10, 'Do your skincare slowly tonight with your phone away and music on.', 'o', 'ECU', 'Slow hands, soft music, nowhere to be.'],
        [10, 'Put on your comfiest clothes and give your hands or feet a slow, gentle massage.', 'o', 'EW', 'A small kindness to your own body.'],
        [15, 'Take a slow shower and let it be the only thing you are doing.', 'o', 'CW', 'Nothing needs to be accomplished for the next 15 minutes.'],
        [25, 'Give yourself a 25 minute at home spa moment: a face mask, a warm towel and music.', 'o', 'W', 'This isn’t time you need to earn.'],
        [40, 'Fill a warm bath or take a long shower with candles or music, and take your time for 40 minutes.', 'o', 'CU', 'Take all of it. No rushing out.'],
        [15, 'Take a long shower and leave your phone outside the bathroom.', 'o', 'UW', 'For the next 15 minutes, nothing needs to be answered.'],
        [5, 'Put on hand cream slowly and stretch your fingers for 5 minutes.', 'o', 'E', 'Five quiet minutes of looking after yourself.'],
        [20, 'Do the skincare you always do, just twice as slowly.', 'o', 'DC', 'Nothing new to choose. Just slower.']
      ],
      space_reset: [
        [10, 'Clear just one surface, like your nightstand or desk, and put one thing you love on it.', 'o', 'ED', 'Just this one surface. One finished corner is enough.'],
        [10, 'Open your windows for 10 minutes and let fresh air move through your space.', 'o', 'EC', 'Fresh air changes a room more than you’d think.'],
        [15, 'Light a candle or turn on a lamp and make one corner feel cozy for tonight.', 'o', 'CW', 'One cozy corner to come back to tonight.'],
        [25, 'Spend 25 minutes making your bedroom feel calm for tonight: soft light, a made bed and a clear floor.', 'o', 'C', 'Tonight’s rest starts here.'],
        [40, 'Spend 40 minutes making your space feel good: open the windows, light a candle, put on music and tidy only what bothers you.', 'o', 'W', 'Only what bothers you. The rest can wait.'],
        [5, 'Put away five things that are out of place, then stop.', 'o', 'ED', 'Five things. Not one more.']
      ],
      nature_reset: [
        [10, 'Step outside for 10 minutes and just look at the sky.', 'o', 'ECU', 'Nothing to do but look up.'],
        [10, 'Sit by a window or outside with a drink and watch the light change for 10 minutes.', 'o', 'EC', 'Let the light change while you stay still.'],
        [15, 'Take 15 quiet minutes outside somewhere you do not usually sit.', 'on', 'N', 'A new spot makes the same outdoors feel different.'],
        [25, 'Spend 25 minutes in the nearest park or green space with nothing to do.', 'o', 'CW', 'Nothing to do is the whole plan.'],
        [40, 'Take a slow 40 minute walk somewhere green and keep your phone away the whole time.', 'o', 'UC', 'Let the green do the talking.'],
        [15, 'Sit outside for 15 minutes without trying to figure anything out.', 'o', 'C', 'Let noticing replace solving for a little while.'],
        [5, 'Open a window and breathe the outside air for 5 minutes.', 'o', 'EC', 'Fresh air, and nothing else.'],
        [25, 'Walk to the nearest patch of green, sit for 10 minutes, then walk back.', 'o', 'DC', 'Three simple steps. Nothing to plan.']
      ],
      offline_reset: [
        [10, 'Put your phone away for 10 minutes and do one slow thing by hand.', 'o', 'EU', 'Ten minutes where nothing can reach you.'],
        [10, 'Sit with a drink for 10 minutes with no screen in sight.', 'o', 'ECU', 'Just you and something warm. No input.'],
        [15, 'Put your phone away and spend 15 minutes on something you used to love before phones.', 'o', 'UN', 'Remember what you used to do with this time.'],
        [25, 'Put your phone away for 25 minutes and read, draw or just sit somewhere comfortable.', 'o', 'UC', 'Read, draw or sit. All three count.'],
        [40, 'Put your phone away for 40 minutes and do one slow thing without adding more input.', 'o', 'UC', 'Let the input stop for a while.'],
        [20, 'Put your phone in another room for 20 minutes and do one slow thing by hand.', 'o', 'UD', 'Let your attention stop being pulled somewhere else.'],
        [5, 'Put your phone in another room for 5 minutes and just sit.', 'o', 'EU', 'A short break from everything that wants your attention.']
      ],
      rest_reset: [
        [10, 'Lie down for 10 minutes with your eyes closed and nothing to do.', 'o', 'EC', 'You don’t need to earn a little rest.'],
        [10, 'Put on a calm song and lie on the floor until it ends.', 'o', 'ED', 'One song long. That’s the whole plan.'],
        [15, 'Rest with a warm drink and a blanket for 15 minutes, no screens.', 'o', 'CU', 'This isn’t time you need to make productive.'],
        [25, 'Take a 25 minute nap or rest, even if you do not fall asleep.', 'o', 'EW', 'Resting counts even if you don’t sleep.'],
        [40, 'Give yourself 40 minutes of real rest: lie down, read something gentle or doze, with your phone away.', 'o', 'CU', 'Real rest, with nothing asking for you.'],
        [15, 'Lie down for 15 minutes with your phone in another room.', 'o', 'SU', 'Rest is part of getting stronger.'],
        [5, 'Close your eyes and take ten slow breaths wherever you are.', 'o', 'EC', 'A pause small enough to fit anywhere.']
      ],
      nourishing_reset: [
        [10, 'Make a warm drink and sit with it for 10 minutes, doing nothing else.', 'o', 'EC', 'Sit, sip, nothing else.'],
        [10, 'Eat a piece of fruit slowly and actually taste it.', 'o', 'ED', 'Slow enough to really notice it.'],
        [15, 'Make yourself a simple snack you love and eat it sitting down.', 'o', 'EDW', 'No plan needed for this one.'],
        [25, 'Make a simple, colorful plate of food and eat it slowly, sitting down, with your phone away.', 'o', 'UC', 'A meal with your full attention.'],
        [40, 'Cook a simple, comforting meal for yourself, slowly, with music on.', 'o', 'WC', 'Make something you actually want to eat, the slow way.'],
        [20, 'Make yourself something you actually want to eat or drink and sit down to enjoy it.', 'o', 'W', 'Give yourself the same care you’d naturally give someone else.'],
        [5, 'Drink a full glass of water slowly, sitting down.', 'o', 'ED', 'A small reset your body will thank you for.']
      ]
    }
  };

  // Which tag list each area's preference ids live in.
  var TAG_FIELD = {
    create: 'createInterestTags',
    learn: 'mindsetFormatTags',
    connect: 'connectTargetTags',
    move: 'moveTypeTags',
    nourish: 'resetStyleTags'
  };

  function rawTimeFor(minutes) {
    return minutes <= 15 ? '15m' : minutes <= 30 ? '30m' : minutes <= 60 ? '1h' : '2h+';
  }

  // Effort follows length, one step up for physically active ideas.
  function effortWordFor(minutes, active) {
    if (minutes <= 15) return active ? 'moderate' : 'light';
    if (minutes <= 30) return active ? 'moderate' : 'light';
    return active ? 'heavy' : 'moderate';
  }

  function buildIndex(meta) {
    var out = [];
    Object.keys(IDEAS).forEach(function (categoryId) {
      Object.keys(IDEAS[categoryId]).forEach(function (pref) {
        IDEAS[categoryId][pref].forEach(function (row, i) {
          var minutes = row[0], text = row[1], traits = row[2] || '', modes = row[3] || '', line = row[4] || '';
          var rawTime = rawTimeFor(minutes);
          // Written for this purpose, so its facts are known rather than inferred.
          var known = {
            time: rawTime,
            effort: effortWordFor(minutes, traits.indexOf('a') >= 0),
            multiDay: false, booking: false, chore: false, openEnded: false, assumes: false,
            offline: traits.indexOf('o') >= 0 || undefined,
            novel: traits.indexOf('n') >= 0 || undefined
          };
          var idea = meta.getIdeaMetadata({ text: text }, categoryId, 'starter', known);
          idea.id = 'starter:' + categoryId + ':' + pref + ':' + (i + 1);
          idea.packId = 'starter';
          idea.starter = true;
          idea.minutes = minutes;
          idea.modes = modes.split('');
          idea.line = line;
          idea[TAG_FIELD[categoryId]] = [pref];
          if (categoryId === 'create') idea.styleInterest = pref;
          out.push(idea);
        });
      });
    });
    return out;
  }

  global.PFDStarterIdeas = { IDEAS: IDEAS, buildIndex: buildIndex };
})(window);
