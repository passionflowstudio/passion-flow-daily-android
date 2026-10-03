/**
 * Create ideas written for one specific style chip (Guitar, TikTok, Real estate...).
 * Entry: [level, minutes, text]. level n = just starting, r = already doing it, a = anyone.
 * Only shown to people who picked that chip, so the idea always matches what they told us.
 */
(function (global) {
  var IDEAS = {
    music: {
      guitar: [
        ['n', 15, 'Learn three open chords (G, C and D) and switch between them slowly for 15 minutes.'],
        ['n', 15, 'Watch one beginner guitar lesson and play along with just the first part.'],
        ['a', 20, 'Play along to one song you love on guitar, even if you only get the chorus.'],
        ['a', 10, 'Practice one strumming pattern with a metronome for 10 minutes.'],
        ['r', 30, 'Learn the riff or solo from a song you have always wanted to play.'],
        ['r', 15, 'Record a 30 second clip of yourself playing guitar and listen back once.']
      ],
      piano: [
        ['n', 15, 'Find middle C and learn a C major scale with your right hand.'],
        ['n', 15, 'Learn the right hand melody of one simple song you love.'],
        ['a', 15, 'Play four chords (C, G, Am, F) on the piano and loop them for 15 minutes.'],
        ['a', 10, 'Improvise on the piano for 10 minutes using only the white keys.'],
        ['r', 30, 'Learn both hands of one section of a song you have wanted to play.'],
        ['r', 15, 'Record yourself playing one piano piece start to finish and listen back.']
      ],
      singing: [
        ['n', 10, 'Do a 10 minute vocal warm up from a free video before you sing anything.'],
        ['n', 15, 'Sing along to one song you love and focus only on staying in tune.'],
        ['a', 15, 'Pick one song and sing it three times, a little more confident each time.'],
        ['a', 10, 'Hum and do lip trills for 10 minutes to loosen up your voice.'],
        ['r', 20, 'Record yourself singing one verse and chorus and note one thing to improve.'],
        ['r', 30, 'Learn the harmony part of a song you already know.']
      ],
      songwriting: [
        ['n', 15, 'Write four lines about how today actually felt. No rhyming rules.'],
        ['n', 15, 'Take a song you love and write new lyrics for just the chorus.'],
        ['a', 20, 'Hum three melody ideas into a voice memo and keep the best one.'],
        ['a', 15, 'Write a song title first, then one verse that fits it.'],
        ['r', 30, 'Finish one verse and chorus for a song you have already started.'],
        ['r', 20, 'Rewrite the weakest line in one of your songs five different ways.']
      ],
      producing: [
        ['n', 20, 'Open a free app like GarageBand and make a 4 bar drum loop.'],
        ['n', 15, 'Recreate the drum pattern from a song you love.'],
        ['a', 30, 'Make a beat in 30 minutes using only three sounds.'],
        ['a', 15, 'Flip one sample into a short loop you would actually listen to.'],
        ['r', 30, 'Finish the arrangement of one beat you started and export it.'],
        ['r', 20, 'Mix one track and fix only the levels. Nothing else.']
      ],
      drums: [
        ['n', 15, 'Learn a basic rock beat on a practice pad, a pillow or a kit.'],
        ['n', 10, 'Practice single strokes with a slow metronome for 10 minutes.'],
        ['a', 15, 'Drum along to one song you love and keep the beat steady.'],
        ['a', 10, 'Practice one new drum fill and drop it into a simple groove.'],
        ['r', 20, 'Push your tempo up 5 bpm on a groove you already know.'],
        ['r', 30, 'Record yourself drumming to a full song and listen back.']
      ],
      dj: [
        ['n', 20, 'Download a free DJ app and practice matching the beat of two songs.'],
        ['n', 15, 'Build a 5 song playlist that flows from chill to high energy.'],
        ['a', 30, 'Mix three songs together without stopping.'],
        ['a', 15, 'Practice one clean transition between two tracks you love.'],
        ['r', 30, 'Record a 20 minute mix and share it with one friend.'],
        ['r', 20, 'Dig for five new tracks in a genre you do not usually play.']
      ],
      instrument: [
        ['n', 15, 'Learn three notes or chords on your instrument and play them slowly.'],
        ['n', 15, 'Watch one beginner lesson for your instrument and follow along.'],
        ['a', 20, 'Play along to one song you love on your instrument.'],
        ['a', 10, 'Practice scales or warm ups on your instrument for 10 minutes.'],
        ['r', 30, 'Learn a new piece or song you have been putting off.'],
        ['r', 15, 'Record yourself playing and pick one thing to improve tomorrow.']
      ]
    },
    art_crafts: {
      drawing: [
        ['n', 15, 'Draw five simple objects on your desk using only basic shapes.'],
        ['n', 10, 'Do a 10 minute blind contour drawing of your hand.'],
        ['a', 15, 'Fill one page with quick sketches of whatever is around you.'],
        ['a', 20, 'Draw the same object three times, faster each time.'],
        ['r', 30, 'Draw a portrait or figure from a reference photo.'],
        ['r', 20, 'Pick an old drawing and redraw it with what you know now.']
      ],
      painting: [
        ['n', 20, 'Paint a simple sky using just two colors.'],
        ['n', 15, 'Paint three small abstract squares in colors that feel like today.'],
        ['a', 30, 'Paint something you can see from your window.'],
        ['a', 20, 'Mix five new colors from just your primary paints.'],
        ['r', 30, 'Paint a small study of a photo you love.'],
        ['r', 30, 'Finish or fix one area of a painting you set aside.']
      ],
      digital_art: [
        ['n', 20, 'Open a free drawing app and learn three brushes by doodling.'],
        ['n', 15, 'Trace over a photo to practice line work, then color it in.'],
        ['a', 20, 'Make a small digital sticker or icon of something you love.'],
        ['a', 15, 'Try one new brush or blending technique on a quick doodle.'],
        ['r', 30, 'Color and shade a finished line drawing.'],
        ['r', 30, 'Make a digital piece for a daily art prompt.']
      ],
      pottery: [
        ['n', 20, 'Shape a small pinch pot from air dry clay.'],
        ['n', 15, 'Make three small clay beads or charms.'],
        ['a', 30, 'Make a small clay dish or trinket tray.'],
        ['a', 20, 'Practice coil building a tiny clay vase.'],
        ['r', 30, 'Glaze or paint a clay piece you already made.'],
        ['r', 30, 'Try a clay form you have never made before.']
      ],
      knitting: [
        ['n', 20, 'Learn the knit stitch from a video and knit five rows.'],
        ['n', 15, 'Crochet a chain and one row of single crochet with any yarn.'],
        ['a', 30, 'Knit or crochet a small square you can turn into a coaster.'],
        ['a', 20, 'Knit or crochet for 20 minutes while listening to music.'],
        ['r', 30, 'Learn one new stitch pattern and add it to a swatch.'],
        ['r', 30, 'Finish the next section of a knitting or crochet project.']
      ],
      sewing: [
        ['n', 15, 'Sew a button back on something you own.'],
        ['n', 20, 'Practice a running stitch and a back stitch on scrap fabric.'],
        ['a', 20, 'Embroider a tiny flower or initial on a scrap or a tote.'],
        ['a', 30, 'Hem or fix one piece of clothing you stopped wearing.'],
        ['r', 30, 'Sew a small pouch or scrunchie from scrap fabric.'],
        ['r', 30, 'Add embroidery to a shirt or jacket you already own.']
      ],
      crafts: [
        ['n', 15, 'Make a card for someone using paper, pens and whatever you have.'],
        ['n', 20, 'Make a simple collage from old magazines or printouts.'],
        ['a', 20, 'Make a small handmade bookmark or keychain.'],
        ['a', 30, 'Turn a jar or box into something you would put on display.'],
        ['r', 30, 'Try a craft you have never done using a short tutorial.'],
        ['r', 30, 'Make a small handmade gift for someone this week.']
      ],
      coloring: [
        ['n', 15, 'Color one page from a coloring book or a free printable.'],
        ['n', 10, 'Color for 10 minutes using only three colors.'],
        ['a', 20, 'Color a page while listening to one album start to finish.'],
        ['a', 15, 'Practice blending two colors with pencils or markers.'],
        ['r', 30, 'Finish one detailed coloring page in a single sitting.'],
        ['r', 20, 'Color a page with a palette you would never usually pick.']
      ]
    },
    writing: {
      journaling: [
        ['n', 10, 'Write three things that happened today and how each one felt.'],
        ['n', 10, 'Write for 10 minutes starting with "Right now I feel".'],
        ['a', 15, 'Write a page about something you keep thinking about.'],
        ['a', 10, 'Write a letter to yourself one year from now.'],
        ['r', 20, 'Reread an old journal entry and write what has changed since.'],
        ['r', 15, 'Journal about one decision you are weighing, both sides.']
      ],
      poetry: [
        ['n', 10, 'Write a short poem about something you can see right now.'],
        ['n', 15, 'Write a haiku about today, then two more.'],
        ['a', 15, 'Write a poem using five words you overheard today.'],
        ['a', 20, 'Rewrite a poem you love in your own words.'],
        ['r', 30, 'Write a poem in a set form like a sonnet or a villanelle.'],
        ['r', 20, 'Edit one of your poems and cut every word that is not needed.']
      ],
      fiction: [
        ['n', 15, 'Write one scene where a character wants something and cannot get it.'],
        ['n', 15, 'Describe a stranger you saw today as if they were a character.'],
        ['a', 20, 'Write a 300 word story that starts with a phone ringing.'],
        ['a', 15, 'Write the opening paragraph of a story you would want to read.'],
        ['r', 30, 'Write the next scene of a story you have already started.'],
        ['r', 30, 'Rewrite your opening page so it starts closer to the action.']
      ],
      essays: [
        ['n', 15, 'Write one paragraph about something you changed your mind on.'],
        ['n', 20, 'Outline a short post: one idea, three points, one ending.'],
        ['a', 30, 'Write a 500 word post about something you learned this month.'],
        ['a', 15, 'Write a list of 10 topics only you could write about.'],
        ['r', 30, 'Edit and publish one draft you have been sitting on.'],
        ['r', 20, 'Rewrite your intro so the first line makes people keep reading.']
      ],
      scripts: [
        ['n', 15, 'Write a one page scene with two characters and one conflict.'],
        ['n', 15, 'Write a short dialogue between two people who want different things.'],
        ['a', 20, 'Write a 60 second sketch or short video script.'],
        ['a', 15, 'Rewrite a scene from a movie you love with a new ending.'],
        ['r', 30, 'Write the next scene of a script you have started.'],
        ['r', 20, 'Read your script out loud and fix every line that sounds stiff.']
      ],
      memoir: [
        ['n', 15, 'Write about one moment from childhood you still remember clearly.'],
        ['n', 15, 'Write about a place that shaped you, using all five senses.'],
        ['a', 20, 'Write the story of how you met someone important to you.'],
        ['a', 15, 'Write about a turning point you did not recognize at the time.'],
        ['r', 30, 'Expand one memory into a full scene with dialogue.'],
        ['r', 20, 'Edit one personal story so it ends on what you learned.']
      ]
    },
    photography: {
      phone_photos: [
        ['n', 15, 'Take 10 phone photos of one color around you.'],
        ['n', 15, 'Turn on your phone camera grid, learn focus lock, then shoot 10 photos.'],
        ['a', 20, 'Go on a 20 minute photo walk and keep your three favorites.'],
        ['a', 15, 'Shoot one object from five different angles.'],
        ['r', 30, 'Shoot a series of five photos that tell one story.'],
        ['r', 20, 'Try night or low light photos and compare your settings.']
      ],
      camera: [
        ['n', 20, 'Learn aperture by shooting one object at three different settings.'],
        ['n', 15, 'Shoot 20 photos in manual mode, even if they come out dark.'],
        ['a', 30, 'Pick one lens and shoot only with it for 30 minutes.'],
        ['a', 20, 'Practice shutter speed by photographing something moving.'],
        ['r', 30, 'Plan and shoot one photo idea you have been saving.'],
        ['r', 30, 'Shoot at golden hour and try one new composition rule.']
      ],
      portraits: [
        ['n', 15, 'Take a portrait of someone near a window with natural light.'],
        ['n', 15, 'Take five self portraits in different light around your home.'],
        ['a', 20, 'Photograph a friend doing something they love.'],
        ['a', 20, 'Shoot one portrait using a single light source and its shadows.'],
        ['r', 30, 'Plan a mini portrait shoot with a theme and 10 final photos.'],
        ['r', 30, 'Edit a portrait set so the color feels consistent.']
      ],
      nature: [
        ['n', 20, 'Photograph 10 textures you find outside.'],
        ['n', 15, 'Shoot the sky three times today and compare the light.'],
        ['a', 30, 'Go somewhere green and come back with five photos you love.'],
        ['a', 20, 'Get close and photograph small details like leaves or flowers.'],
        ['r', 30, 'Shoot a landscape at sunrise or sunset with a plan.'],
        ['r', 30, 'Try a long exposure of water, clouds or traffic lights.']
      ],
      street: [
        ['n', 20, 'Walk your neighborhood and photograph 10 interesting signs or doors.'],
        ['n', 15, 'Shoot people from a distance at a busy spot, focusing on shapes.'],
        ['a', 30, 'Pick one street and photograph it for 30 minutes.'],
        ['a', 20, 'Photograph light and shadow on buildings.'],
        ['r', 30, 'Shoot a street series around one theme like waiting or color.'],
        ['r', 30, 'Stand in one spot for 20 minutes and wait for the moment.']
      ],
      video_film: [
        ['n', 15, 'Film five short clips of your day and cut them into a 30 second video.'],
        ['n', 15, 'Film one thing from three angles: wide, medium and close.'],
        ['a', 20, 'Make a 1 minute video of a place you love.'],
        ['a', 20, 'Film a time lapse of something changing.'],
        ['r', 30, 'Shoot and edit a short video with a beginning, middle and end.'],
        ['r', 30, 'Recreate one shot from a film you love.']
      ],
      editing: [
        ['n', 15, 'Edit one photo using only light and contrast.'],
        ['n', 20, 'Pick your best three out of 10 photos, then edit them.'],
        ['a', 20, 'Create a simple preset and use it on five photos.'],
        ['a', 15, 'Edit one photo two ways: bright and moody.'],
        ['r', 30, 'Color grade a set of photos so they feel like one series.'],
        ['r', 30, 'Edit an old photo again with what you know now.']
      ]
    },
    cooking_baking: {
      everyday_meals: [
        ['n', 20, 'Cook one simple meal with five ingredients or fewer.'],
        ['n', 15, 'Learn to chop an onion properly and use it in tonight\'s dinner.'],
        ['a', 30, 'Cook tonight\'s dinner without a recipe and taste as you go.'],
        ['a', 20, 'Make a new sauce for something you already cook.'],
        ['r', 30, 'Cook a meal for someone and plate it like a restaurant.'],
        ['r', 30, 'Prep three lunches for the week in one go.']
      ],
      baking: [
        ['n', 30, 'Bake a simple batch of cookies from scratch.'],
        ['n', 20, 'Make banana bread or muffins from a basic recipe.'],
        ['a', 30, 'Bake something you have never made before.'],
        ['a', 20, 'Decorate a few cookies or cupcakes just for fun.'],
        ['r', 30, 'Try a baking technique you have not done yet, like piping or lamination.'],
        ['r', 30, 'Change one recipe you already bake to make it your own.']
      ],
      bread: [
        ['n', 30, 'Make a simple no knead bread dough tonight.'],
        ['n', 20, 'Make flatbread on the stove with flour, water and salt.'],
        ['a', 20, 'Feed or start a sourdough starter.'],
        ['a', 30, 'Bake focaccia and top it with whatever you have.'],
        ['r', 30, 'Try a new shaping or scoring pattern on your loaf.'],
        ['r', 30, 'Bake a loaf with a new flour like rye or whole wheat.']
      ],
      desserts: [
        ['n', 20, 'Make a no bake dessert like chocolate bark or truffles.'],
        ['n', 15, 'Make a simple fruit dessert with what is in your kitchen.'],
        ['a', 30, 'Recreate a dessert you loved at a restaurant.'],
        ['a', 20, 'Make a small batch dessert for one or two.'],
        ['r', 30, 'Make a plated dessert with three parts.'],
        ['r', 30, 'Make a dessert from a different country.']
      ],
      world_cuisines: [
        ['n', 30, 'Cook one simple dish from a country you have never cooked from.'],
        ['n', 20, 'Cook a dish from your family\'s background and ask someone about it.'],
        ['a', 30, 'Cook a dish from a cuisine you love eating out.'],
        ['a', 20, 'Buy one new spice and use it in tonight\'s meal.'],
        ['r', 30, 'Make a dish completely from scratch, including the sauce or paste.'],
        ['r', 30, 'Cook a full meal from one cuisine: main, side and drink.']
      ],
      healthy: [
        ['n', 20, 'Make a colorful bowl with a grain, a protein and three vegetables.'],
        ['n', 15, 'Make a smoothie with something green in it.'],
        ['a', 20, 'Cook a healthier version of a comfort food you love.'],
        ['a', 30, 'Try one new vegetable and cook it two ways.'],
        ['r', 30, 'Plan and prep three healthy meals for the next few days.'],
        ['r', 20, 'Make a homemade dressing to replace a store bought one.']
      ],
      drinks: [
        ['n', 10, 'Make a cafe style drink at home with what you have.'],
        ['n', 15, 'Make a fresh mocktail with fruit, herbs and sparkling water.'],
        ['a', 15, 'Try a new coffee or tea brewing method.'],
        ['a', 20, 'Make a homemade syrup like vanilla or cinnamon.'],
        ['r', 20, 'Practice latte art or the perfect pour over.'],
        ['r', 30, 'Create your own signature drink and give it a name.']
      ]
    },
    content_creation: {
      tiktok: [
        ['n', 15, 'Film a 15 second TikTok about one thing you learned this week.'],
        ['n', 15, 'Save five TikToks you love and write down why each one works.'],
        ['a', 20, 'Film and post one TikTok using a trending sound.'],
        ['a', 15, 'Write three hooks for your next TikTok.'],
        ['r', 30, 'Batch film three TikToks in one sitting.'],
        ['r', 20, 'Look at your best TikTok and make a new version of it.']
      ],
      instagram: [
        ['n', 15, 'Post one Instagram photo with a caption that tells a tiny story.'],
        ['n', 20, 'Make a simple 3 slide Instagram carousel about something you know.'],
        ['a', 20, 'Film and post one Reel about a normal part of your day.'],
        ['a', 15, 'Plan your next three Instagram posts in your notes app.'],
        ['r', 30, 'Batch create a week of Instagram Stories or posts.'],
        ['r', 20, 'Reply to comments and DMs, then post a Story about one of them.']
      ],
      youtube: [
        ['n', 15, 'Write the title and thumbnail idea for your next YouTube video.'],
        ['n', 20, 'Film a 1 minute YouTube Short about one thing you love.'],
        ['a', 30, 'Outline one YouTube video: hook, three points and an ending.'],
        ['a', 20, 'Film the intro of your next video three different ways.'],
        ['r', 30, 'Edit the next section of a YouTube video you have filmed.'],
        ['r', 20, 'Study one YouTuber you love and note how they keep people watching.']
      ],
      podcast: [
        ['n', 15, 'Record a 5 minute voice memo podcast episode about one idea.'],
        ['n', 20, 'Write 10 podcast episode ideas and pick the best one.'],
        ['a', 20, 'Outline your next podcast episode with three talking points.'],
        ['a', 30, 'Record one segment of your next podcast episode.'],
        ['r', 30, 'Edit one podcast episode and write its show notes.'],
        ['r', 20, 'Reach out to one person you would love to interview.']
      ],
      newsletter: [
        ['n', 15, 'Write down 10 topics you could write about every week.'],
        ['n', 20, 'Write a sample issue of your newsletter or blog.'],
        ['a', 30, 'Write your next newsletter draft in one sitting.'],
        ['a', 15, 'Write five subject lines and pick the strongest.'],
        ['r', 30, 'Edit and schedule your next newsletter issue.'],
        ['r', 20, 'Share your newsletter or blog in one new place.']
      ],
      streaming: [
        ['n', 20, 'Set up a simple stream scene with your camera and one overlay.'],
        ['n', 15, 'Watch a streamer you like and note three things they do well.'],
        ['a', 30, 'Go live for 30 minutes, even if nobody shows up.'],
        ['a', 15, 'Plan the theme and title of your next stream.'],
        ['r', 30, 'Clip your three best moments from your last stream.'],
        ['r', 20, 'Try one new segment or interaction on your next stream.']
      ],
      linkedin: [
        ['n', 15, 'Update your LinkedIn headline and about section.'],
        ['n', 15, 'Write a short LinkedIn post about one thing you learned at work.'],
        ['a', 20, 'Write a LinkedIn post sharing a small win and what made it work.'],
        ['a', 15, 'Leave thoughtful comments on five LinkedIn posts in your field.'],
        ['r', 30, 'Write a LinkedIn story post about a lesson from your career.'],
        ['r', 20, 'Message one person on LinkedIn you would like to learn from.']
      ]
    },
    building_business: {
      online_business: [
        ['n', 15, 'Write down one problem you could solve online and who has it.'],
        ['n', 20, 'Sketch a one page plan: who it is for, what you sell, how they find you.'],
        ['a', 30, 'Build a simple landing page for your idea with a free tool.'],
        ['a', 20, 'Message three people who might need your idea and ask about their problem.'],
        ['r', 30, 'Fix the one step where customers drop off the most.'],
        ['r', 20, 'Write one email to your list or your customers.']
      ],
      digital_products: [
        ['n', 15, 'List five things you know well that someone would pay to learn.'],
        ['n', 20, 'Outline a simple template, guide or checklist you could sell.'],
        ['a', 30, 'Create the first page or section of your digital product.'],
        ['a', 20, 'Write the sales page headline and three benefits.'],
        ['r', 30, 'Ask one customer for feedback and improve your product.'],
        ['r', 20, 'Bundle two products or add a bonus to boost the value.']
      ],
      ecommerce: [
        ['n', 15, 'Research five products in a niche you love and note their prices.'],
        ['n', 20, 'Write a product description for one item you would sell.'],
        ['a', 30, 'Take better photos of one product using natural light.'],
        ['a', 20, 'List one new product or update an old listing.'],
        ['r', 30, 'Look at your best seller and find one way to sell more of it.'],
        ['r', 20, 'Reply to your reviews and turn one into a social post.']
      ],
      personal_brand: [
        ['n', 15, 'Write one sentence about what you want to be known for.'],
        ['n', 20, 'Pick three topics you will always post about and write them down.'],
        ['a', 20, 'Post one piece of content that shows how you think.'],
        ['a', 15, 'Update your bio on every platform so they all say the same thing.'],
        ['r', 30, 'Batch create a week of content around your three topics.'],
        ['r', 20, 'Reach out to one creator in your space about a collab.']
      ],
      freelancing: [
        ['n', 15, 'Write down the one service you could offer and who would pay for it.'],
        ['n', 20, 'Make a simple portfolio page with three examples of your work.'],
        ['a', 20, 'Send three personal pitches to potential clients.'],
        ['a', 15, 'Set your rates and write down exactly what is included.'],
        ['r', 30, 'Ask a past client for a testimonial or a referral.'],
        ['r', 20, 'Raise your rate on your next proposal and see what happens.']
      ],
      real_estate: [
        ['n', 20, 'Learn five key real estate terms like cap rate and cash flow.'],
        ['n', 15, 'Look at five listings in your area and note the price per square foot.'],
        ['a', 20, 'Run the numbers on one rental property listing.'],
        ['a', 30, 'Watch or read one deal breakdown from a real estate investor you trust.'],
        ['r', 30, 'Analyze three real estate deals and rank them by cash flow.'],
        ['r', 20, 'Reach out to one agent, lender or investor in your area.']
      ],
      sales: [
        ['n', 15, 'Write a 30 second pitch for something you believe in.'],
        ['n', 15, 'Learn one sales question that uncovers what someone really needs.'],
        ['a', 20, 'Practice your answer to one common objection out loud.'],
        ['a', 20, 'Follow up with three people you have not heard back from.'],
        ['r', 30, 'Review one lost deal and write what you would do differently.'],
        ['r', 20, 'Write a new opening line for your calls and test it today.']
      ],
      tech_apps: [
        ['n', 20, 'Follow one beginner coding tutorial and build something tiny that works.'],
        ['n', 15, 'Write down one app idea and the single main thing it does.'],
        ['a', 30, 'Build one small feature for your app or website.'],
        ['a', 20, 'Fix one bug or clean up one messy part of your code.'],
        ['r', 30, 'Ship one improvement to your app and tell one user about it.'],
        ['r', 20, 'Sketch the next screen of your app on paper.']
      ]
    },
    diy_design: {
      home_projects: [
        ['n', 20, 'Fix one small thing at home you have been ignoring.'],
        ['n', 15, 'Organize one drawer or shelf completely.'],
        ['a', 30, 'Hang art or a shelf in a spot that has been empty.'],
        ['a', 20, 'List five home projects and do the smallest one.'],
        ['r', 30, 'Start a weekend home project and finish the first step today.'],
        ['r', 30, 'Paint or refresh one wall, door or piece of trim.']
      ],
      woodworking: [
        ['n', 20, 'Build a simple box or crate from scrap wood.'],
        ['n', 15, 'Sand and oil one wooden item you already own.'],
        ['a', 30, 'Build a small shelf or plant stand.'],
        ['a', 20, 'Practice straight cuts and clean joints on scrap wood.'],
        ['r', 30, 'Make the next part of a furniture piece you are building.'],
        ['r', 30, 'Try a new joint like a dovetail or a box joint.']
      ],
      interior_design: [
        ['n', 15, 'Rearrange one corner of your room so it feels more like you.'],
        ['n', 20, 'Make a mood board for one room in your home.'],
        ['a', 20, 'Style one shelf or table with things you already own.'],
        ['a', 15, 'Move or add one lamp to change the mood of a room.'],
        ['r', 30, 'Plan a full room refresh with a budget and a shopping list.'],
        ['r', 30, 'Make one piece of art that fits a room in your home.']
      ],
      graphic_design: [
        ['n', 20, 'Make a simple poster in a free design app.'],
        ['n', 15, 'Recreate a logo you like to learn how it was built.'],
        ['a', 20, 'Design a social post or flyer using one font and two colors.'],
        ['a', 30, 'Design a logo for a made up brand you would love to own.'],
        ['r', 30, 'Redesign something you made last year.'],
        ['r', 20, 'Do one daily design prompt and save it to your portfolio.']
      ],
      upcycling: [
        ['n', 15, 'Turn a glass jar into a vase, pen holder or candle.'],
        ['n', 20, 'Cut an old shirt into a tote bag or cleaning rags.'],
        ['a', 30, 'Give an old piece of furniture a new paint color.'],
        ['a', 20, 'Find three things you were going to throw out and repurpose one.'],
        ['r', 30, 'Thrift one item and transform it into something new.'],
        ['r', 30, 'Upcycle something into a gift for someone.']
      ],
      plants: [
        ['n', 15, 'Repot one plant, or water and wipe the leaves of all your plants.'],
        ['n', 20, 'Plant herbs or seeds in a pot by your window.'],
        ['a', 20, 'Propagate a cutting from a plant you already own.'],
        ['a', 30, 'Rearrange your plants so each one gets better light.'],
        ['r', 30, 'Plan or plant a small balcony or garden bed.'],
        ['r', 20, 'Make a simple care schedule for all your plants.']
      ]
    },
    fashion_beauty: {
      styling: [
        ['n', 15, 'Make three new outfits from clothes you already own.'],
        ['n', 15, 'Find five outfit photos you love and spot what they have in common.'],
        ['a', 20, 'Style one piece you never wear in three different ways.'],
        ['a', 15, 'Plan tomorrow\'s outfit, including accessories.'],
        ['r', 30, 'Build a capsule of 10 pieces that all work together.'],
        ['r', 20, 'Try an outfit outside your comfort zone and wear it today.']
      ],
      makeup: [
        ['n', 15, 'Try one new makeup look from a beginner tutorial.'],
        ['n', 10, 'Practice winged liner one eye at a time for 10 minutes.'],
        ['a', 20, 'Recreate a makeup look you saw and loved.'],
        ['a', 15, 'Do a full makeup look using only three products.'],
        ['r', 30, 'Create a bold editorial makeup look just for fun.'],
        ['r', 20, 'Try a new technique like a cut crease or graphic liner.']
      ],
      skincare: [
        ['n', 10, 'Write down your skin type and the three steps you actually need.'],
        ['n', 15, 'Do a slow, full skincare routine tonight.'],
        ['a', 15, 'Clear out expired skincare and keep only what works.'],
        ['a', 20, 'Read the ingredients on your products and look up one you do not know.'],
        ['r', 20, 'Start one new product and track how your skin feels for a week.'],
        ['r', 15, 'Do a relaxing face mask and a facial massage.']
      ],
      hair: [
        ['n', 15, 'Learn one new braid from a tutorial.'],
        ['n', 20, 'Try a heatless curls method tonight.'],
        ['a', 20, 'Style your hair a way you never have before.'],
        ['a', 15, 'Do a deep conditioning hair treatment.'],
        ['r', 30, 'Master one advanced hairstyle like a French braid or an updo.'],
        ['r', 20, 'Try a new hair product or tool and compare the results.']
      ],
      nails: [
        ['n', 20, 'Do a clean, simple manicure with one color.'],
        ['n', 20, 'Try a two color nail design using tape for straight lines.'],
        ['a', 30, 'Recreate a nail design you saved.'],
        ['a', 20, 'Do a dotted or French tip nail design.'],
        ['r', 30, 'Try nail art like marble or hand painted details.'],
        ['r', 30, 'Do a full set of press on nails styled your way.']
      ],
      thrifting: [
        ['n', 30, 'Visit a thrift store with a list of three things you are looking for.'],
        ['n', 15, 'Go through your closet and pick five things to sell or swap.'],
        ['a', 30, 'Thrift one piece and style it three ways.'],
        ['a', 20, 'Browse a secondhand app for one item you actually want.'],
        ['r', 30, 'Flip one thrifted find by altering or restyling it.'],
        ['r', 20, 'List three items to sell online with good photos.']
      ],
      making_clothes: [
        ['n', 20, 'Hem or shorten one piece of clothing you own.'],
        ['n', 30, 'Sew a simple scrunchie or tote bag.'],
        ['a', 30, 'Alter one piece so it fits you better.'],
        ['a', 20, 'Add patches, embroidery or paint to a jacket or jeans.'],
        ['r', 30, 'Cut and sew the next piece of a garment you are making.'],
        ['r', 30, 'Draft a simple pattern from a piece you already love.']
      ]
    }
  };

  var LEVELS = { n: 'new', r: 'regular', a: null };

  function timeEstimate(minutes) {
    if (minutes <= 15) return 'micro';
    if (minutes <= 30) return 'short';
    return 'medium';
  }

  /* Index entries look like every other idea, plus styleInterest / styleId / level. */
  function buildIndex(meta) {
    var out = [];
    Object.keys(IDEAS).forEach(function (interest) {
      Object.keys(IDEAS[interest]).forEach(function (style) {
        IDEAS[interest][style].forEach(function (row, i) {
          var text = row[2];
          var base = meta && meta.getIdeaMetadata
            ? meta.getIdeaMetadata({ text: text }, 'create', 'style-ideas')
            : { categoryId: 'create', text: text };
          base.id = 'create:style:' + interest + ':' + style + ':' + (i + 1);
          base.packId = 'style-ideas';
          base.styleInterest = interest;
          base.styleId = style;
          base.level = LEVELS[row[0]];
          base.timeEstimate = timeEstimate(row[1]);
          base.rawTime = row[1] <= 15 ? '15m' : row[1] <= 30 ? '30m' : '1h';
          base.createInterestTags = [interest];
          base.createSubtypeTags = [style];
          out.push(base);
        });
      });
    });
    return out;
  }

  var api = { IDEAS: IDEAS, buildIndex: buildIndex };
  global.PFDCreateStyleIdeas = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
