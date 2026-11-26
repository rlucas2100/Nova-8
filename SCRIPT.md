# Cosmic Castaways: the full script

Every line of text in Chapter 1, in the order you meet it: the intro, each area and its people, Enya's
echo, the ending, the battles, the memories and the creatures. It was written from the game's code
(`src/game/story.js`, `scenes.js`, `battle.js`, `data.js`, `maps.js`) on 26 Nov 2026, so it matches the
game as it is now. If the story changes, ask Claude to refresh it.

**How to read it**

- **SPRIG:** a character speaking.
- **[YOU]:** the hero, with the name you chose (MANNY, SPACEY or RHINO if you leave it empty).
- **[YOU]** *(mumbling)*: the hero's concussed mumbling, typed out slowly in lavender.
- A line with no name is narration or on-screen text.
- **[COMPANION]** is your companion's name: NOVA (tiger), EMBER or AZURE (red or blue dragon) or LUMI (octopus).
- *[Notes in square brackets]* say when a line appears.
- ❓ is a question, with the answers you can pick.
- ♥ MEMORY is a memory coming back (the full texts are in [Memories](#9-memories)).

## Contents

1. [Title and intro](#1-title-and-intro)
2. [Bloomhaven](#2-bloomhaven)
3. [The Crimson Wilds](#3-the-crimson-wilds)
4. [The Whisperwood](#4-the-whisperwood)
5. [The Jelly Jam](#5-the-jelly-jam)
6. [Enya's echo](#6-enyas-echo)
7. [The end of Chapter 1](#7-the-end-of-chapter-1)
8. [Battles](#8-battles)
9. [Memories](#9-memories)
10. [Creatures](#10-creatures)
11. [Companions, moves and items](#11-companions-moves-and-items)
12. [Quest notes](#12-quest-notes)
13. [Help and looking around](#13-help-and-looking-around)

---

## 1. Title and intro

### Title screen

- COSMIC CASTAWAYS
- CHAPTER 1: CRASH LANDING
- PRESS START
- © 2026 RYAN LUCAS
- *[The menu]* CONTINUE *(with a save)* · NEW GAME · SOUND TEST · CONTROLS
- *[NEW GAME, when you have a save]* ❓ Start a new game? Your saved adventure will be replaced when you next save. **NEW GAME / CANCEL**

### The intro

*[Each line stays up long enough to read; A moves on sooner, START skips the intro.]*

- Your homeworld is under attack. Your family have been warriors for generations...
- ...but you've seen enough war for one lifetime. Now all you want is to find HER.
- *[Out into space.]*
- Your childhood sweetheart. Your long-lost love.
- Her last signal came from the purple planet KIRRA...
- WARNING! WARNING! METEOR STORM!
- *[A meteor hits the COMET.]*
- MAYDAY! MAYDAY! The COMET is going down!
- *[The crash.]*

### Your name

- Ugh... your head is pounding. What was your name again...?
- *[The naming screen: YOUR NAME? with DELETE, RANDOM and DONE. MANNY, SPACEY or RHINO shows faintly and is
  used if you leave it empty. RANDOM picks from MANNY, SPACEY, RHINO, KAI, RIGEL, ATLAS, ZANE, JAX, ORRIN, LEO,
  CASSIUS; the Celtic RONAN, CORMAC, DECLAN, OISIN, CIAN, CONALL, TADHG, BRAN; and the elvish-sounding AELAR,
  ELDRIN, SILVAN, THAELIN, CAELUM, FAELAN.]*
- *[On the naming screen]* Type it, or pick letters with the D-pad. RANDOM (or SELECT) picks a name for you.
- ❓ So your name is [YOU]? **YES / NO**

---

## 2. Bloomhaven

*The garden city on planet Kirra where you crash.*

### Waking up by the COMET

*[You wake up seeing double. SPRIG the gardening robot rolls over.]*

- Ugh... your head is pounding, and everything is blurry. Where are you?
- **[YOU]** *(mumbling)*: ...Em...? Where... are you...?
- **SPRIG:** Beep! Boop! A visitor fell out of the sky! Are you hurt?
- **[YOU]** *(mumbling)*: My head... I was going somewhere... to someone. I can't... remember...
- **SPRIG:** You have a nasty bump, [YOU]. Your name is stitched on your flight suit! Bzzt.
- ♥ MEMORY: FIRE IN THE SKY
- *[The first memory only:]* A memory came back! Everything you remember is kept on the MEMORIES page of your QUEST notes (START, then QUEST).
- **SPRIG:** I am SPRIG, gardener of BLOOMHAVEN, the garden city of planet KIRRA. You crashed right into our moss-roses!
- **SPRIG:** Let me scan your ship... Oh dear. Bzzt.
- **SPRIG:** My scanner says your ship needs SIX new parts to fly. THREE of them landed in the CRIMSON WILDS, east of the river: a FUEL CELL, a NAV CORE and a THRUSTER.
- **SPRIG:** The Wilds are full of wild creatures. You must not go alone! Come to the GROVE, up the path. Our three young guardians are waiting to meet you.

### SPRIG, later

- *[Before you choose a companion]* **SPRIG:** The three pods hold our young guardians. Look at each one, then choose who will travel with you!
- *[No parts yet]* **SPRIG:** Your parts are somewhere in the CRIMSON WILDS, across the bridge. Rest at the FOUNTAIN if [COMPANION] gets tired!
- *[Some parts]* **SPRIG:** You have found [N] of 3 parts! Keep going, [YOU]!
- *[Then]* **SPRIG:** TIP: press SELECT to hop on or off your companion. Riding is twice as fast! Press START for your menu.
- *[After Chapter 1]* **SPRIG:** Beep! The COMET is looking shinier every day. Bzzt.

### The guardian pods: choosing your companion

*[Walk up to a pod in the GROVE. The chooser shows all three (CHOOSE YOUR COMPANION); on the dragon, up and
down switch between red and blue.]*

- *[Under each guardian]* NOVA: claws, fire, healing licks · EMBER: red: breathes fire · AZURE: blue: breathes frost · LUMI: heals and baffles
- *[At the bottom]* ◀▶ choose  ▲▼ colour  A pick *(on the dragon)* / ◀▶ choose   A pick   B back
- ❓ Choose NOVA, the tiger? / Choose EMBER, the red dragon? / Choose AZURE, the blue dragon? / Choose LUMI, the octopus? **YES / NO**
- *[Tiger]* [COMPANION] bounds out of the pod and nuzzles your hand. Purrr!
- *[Dragon]* [COMPANION] flutters out of the pod and puffs a little smoke ring! *(a snowflake, if blue)*
- *[Octopus]* [COMPANION] floats out of the pod, pushes up her glasses and waves a tentacle at you.
- [COMPANION] joined you!
- *[Tiger]* [COMPANION] sniffs the bump on your head... and gives it a big, rough lick!
- *[Tiger]* Tiger saliva has powerful healing powers. The throbbing fades, and a name floats up out of the fog...
- *[Dragon]* [COMPANION] curls up against you, warm as a little stove. The throbbing in your head eases, and a name floats up out of the fog...
- *[Octopus]* [COMPANION] rests a cool, glowing tentacle on your forehead. The throbbing eases, and a name floats up out of the fog...
- **[YOU]** *(mumbling)*: ...Em? ...Gem...? Who... who is that?
- ♥ MEMORY: A NAME
- TIP: press B to hop. Your companion loves it! Face your companion and press A to give them a fuss.
- **SPRIG:** Wonderful choice! [COMPANION] will keep you safe. Here are 3 GLOWBERRIES for the road.
- You got 3 GLOWBERRIES!
- **SPRIG:** Press SELECT to ride, START for your menu. The gate drone by the bridge will let you pass now. Good luck!

Looking at the pods afterwards:

- *[Your companion's pod]* The pod is empty. Your companion lived here!
- *[The other two]* The guardian inside is fast asleep, dreaming. Shh...

### Giving your companion a fuss

*[Face your companion and press A. The lines take turns.]*

NOVA, the tiger:

- You scratch [COMPANION] behind the ears. He purrs like a little engine.
- [COMPANION] licks your scraped hands. Tiger saliva heals cuts in no time!
- [COMPANION] rolls over for a belly rub. Purrrr!
- [COMPANION] headbutts your knee, then licks the bump on your head. It hardly hurts now.
- *[While your eyes still glow after a FURY]* [COMPANION] licks your face until your eyes stop glowing green. You feel calm again.

EMBER or AZURE, the dragon:

- [COMPANION] puffs a happy smoke ring and nuzzles your hand. *(a snowflake, if blue)*
- [COMPANION] flaps up onto your shoulder for a moment. Heavy!
- You stroke [COMPANION]'s warm scales. [COMPANION] hums happily.

LUMI, the octopus:

- [COMPANION] pats your head with a tentacle and pushes up her glasses.
- [COMPANION] glows a happy pink when you tickle her.
- [COMPANION] gives you a tiny, squishy high-five.

### The GATE DRONE (at the bridge, east)

- *[Without a companion]* **GATE DRONE:** HALT. The CRIMSON WILDS are full of wild creatures. No one may pass without a companion. BZZT.
- *[The first time with one]* **GATE DRONE:** Companion detected: [COMPANION]. ACCESS GRANTED. Travel safely.
- *[After that]* **GATE DRONE:** Have a pleasant adventure. Do not feed the THORNBACKS.

### The fountain

- *[Without a companion]* A fountain of glowing green water. It smells like mint and rain.
- [COMPANION] drinks the glowing water...
- HP and EN fully restored!

### MOSSA's shop

- **MOSSA:** Welcome, welcome! Shiny jewels for tasty treats! What can MOSSA get you?
- *[First visit, while you're still concussed]* **[YOU]** *(mumbling)*: ...I... sorry. I can't remember what I came here for.
- *[Then]* **MOSSA:** Ho ho! Snacks, dearie. Everyone comes for snacks. And my COSMIC TUBES are very popular!
- *[The shop: YOU HAVE ◆[money]. GLOWBERRY ◆6, STAR TONIC ◆8, MOON MELON ◆15, COSMIC TUBE ◆8.]*
- *[Each thing you buy]* **MOSSA:** One [ITEM]! [the item's description]
- **MOSSA:** Come back with more sparkles!

### The COMET

- *[Before you have all three parts]* The COMET, your star-skiff. Its hull is cracked and smoking. Parts found: [N] of 3.
- *[Then a checklist, ★ for each part found]* ★ FUEL CELL   - NAV CORE   - THRUSTER
- *[With all three parts: the end of Chapter 1, see [section 7](#7-the-end-of-chapter-1).]*
- *[After Chapter 1]* The COMET hums quietly. Three new parts gleam on its hull. Three more to go...

### The people of Bloomhaven

*[Your mumbled replies only come the first time you talk to each of them, while you're still concussed (until
the end of Chapter 1).]*

- **FERN:** The river glows because of the algae. At night the little jellies come up to the top and sing!
  - **[YOU]** *(mumbling)*: ...singing... she used to sing... I can almost hear it...
- **BUD:** Tall violet GLOWGRASS hides wild critters. Walk around it if your companion is tired!
  - **[YOU]** *(mumbling)*: ...sorry, what? My head's still ringing...
- **SOL:** MOSSA trades snacks for jewels: GOLD COINS, EMERALDS, SAPPHIRES, RUBIES, DIAMONDS... she loves them all!
  - **[YOU]** *(mumbling)*: ...diamonds... someone I knew wore a diamond... on a necklace...
- **SKYE**, whose lines change with the story:
  - *[Before you meet Enya]* **SKYE:** Have you heard about the ghost girl with golden hair? She rides a huge green tiger through the Wilds, then vanishes like mist!
  - *[Then, the first time]* **[YOU]** *(mumbling)*: ...golden hair... Em...?
  - *[While Enya's echo is with you]* **SKYE:** You met ENYA? She's my hero! But... is she a ghost? I can see the fountain right through her!
  - *[After Chapter 1]* **SKYE:** Where did ENYA go? She just... faded away. I hope she comes back soon.
- **REEF:** I'm fishing for star-shrimp. This river runs to the edge of the world and pours right off it into the sky! They say a JELLY up there floats people down.
  - **[YOU]** *(mumbling)*: ...the edge of the world... I flew to the edge of everything... to find her...

### Signs

- CRASH SITE / The COMET, your star-skiff. It has seen better days.
- BLOOMHAVEN / Garden city of planet Kirra. Please do not eat the flowers.
- EAST: THE CRIMSON WILDS / Wild creatures roam the glowgrass. Travel with a companion!

---

## 3. The Crimson Wilds

*Red earth, violet glowgrass and a glowing green river, east of Bloomhaven. Wild creatures: GLORP, SPORELET,
FLITTERFIN, CRYSTABUG and THORNBACK. Bosses: the THORNBACK ALPHA and RUSTCLAW.*

### Arriving

- THE CRIMSON WILDS. Red earth, violet glowgrass and a river that glows green. Somewhere out here are your three ship parts!
- TIP: move with W A S D, the arrow keys or the D-pad. Walk over jewels to pick them up. Wild creatures hide in the tall violet glowgrass!

### MOSS, the field medic

- **MOSS:** I'm the Wilds' field medic. Let me patch up your companion... There! Good as new.
- *[First time, while you're still concussed]* **MOSS:** And look at the bump on YOUR head! Did you fall out of the sky or something?
- *[Then]* **[YOU]** *(mumbling)*: ...something like that... I've had worse. I think.
- HP and EN fully restored! If you get into trouble, you can rest here.

### PEBBLE, the scout

- *[Before RUSTCLAW is beaten]* **PEBBLE:** A giant scrap crab called RUSTCLAW lives in the nest down south-east. It stole something shiny from a crashed ship and wears it like a shell!
- *[After]* **PEBBLE:** You beat RUSTCLAW?! Wait until everyone in Bloomhaven hears about this!
- *[Until the thorns are cleared]* **PEBBLE:** And keep away from the black THORNS on the east trail. Nobody's got past them for ages. They give me the creeps!

### The THORNBACK ALPHA, and meeting ENYA

*[Walking up to it, in the west of the Wilds:]*

- GRRRAAAH! A huge THORNBACK ALPHA is sitting on something metal, and it does NOT want to share!

*[Or talking to it:]*

- The THORNBACK ALPHA growls and stamps its feet!

*[The battle (Lv 6). In round 2, Enya breaks through from the other side:]*

- The air TEARS open like glass!
- A girl with golden hair leaps through on a huge, ghostly green tiger!
- **ENYA:** Easy there, scaly! Pick on someone your own size!

*[She fights beside you for the rest of the battle (see [Battles](#8-battles)). After you win:]*

- **ENYA:** Nice moves, you two! Name's ENYA. And this big lad is the EMERALD TIGER.
- *[If you've already seen her in the Veil Gate vision]* **[YOU]:** You... I saw you. Through the gate in the Whisperwood!
- **[YOU]** *(mumbling)*: ...that necklace... Gem...? ...Em...?
- **ENYA:** ...What did you just call me?
- **ENYA:** Nobody's called me that in a very long time. Look at me... You really don't know who I am, do you?
- **[YOU]** *(mumbling)*: I... I want to. My head's all in pieces...
- **ENYA:** ...It's alright. The GEM remembers for both of us.
- ♥ MEMORY: THE CELESTIAL GEM
- **ENYA:** I'm from Tipperary, back on Earth. But I'm not really here, you know. I'm lost somewhere else... somewhere dark.
- **ENYA:** The GEM lets me reach across to you, as an echo, for as long as its light holds.
- *[If your companion is NOVA]* [COMPANION] can't stop staring at ENYA. Little hearts float up around him!
- *[If your companion is NOVA]* **ENYA:** Ha! Hello to you too, handsome.
- **ENYA:** That ALPHA was sitting on something shiny... Here. Is this yours?
- You got the FUEL CELL! (1 of 3)
- **ENYA:** Your ship needs more parts? Then you've got yourself a partner, [YOU]. For as long as the GEM's light holds.
- ENYA's echo and the EMERALD TIGER joined you! In battle she uses DIAMOND FLASH, SHAMROCK CHEER and the EMERALD TIGER's pounce.
- TIP: face ENYA and press A to talk. Her words might bring your memories back.
- *[Only on an old save where Enya had already joined]* The ALPHA was guarding your FUEL CELL! You got the FUEL CELL!

### The NAV CORE (on the river island)

- You found the NAV CORE! ([N] of 3)
- *[With Enya, if a part is still missing]* **ENYA:** Brilliant! Word is RUSTCLAW has the last one. It's in the scrap nest, past the bridge in the south.
- *[With Enya, if that was the last part]* **ENYA:** That's the lot! Back to your ship!
- *[All three parts]* All three parts! Head back to the COMET in BLOOMHAVEN.

### RUSTCLAW (the scrap nest, south-east)

- A giant crab, as big as a car! And it's wearing your ship's THRUSTER as a shell!
- *[Without Enya]* RUSTCLAW snaps its huge claws at you! You back away. It's far too strong to face alone... maybe someone in the Wilds could help you.
- *[With Enya]* **ENYA:** That's your THRUSTER, isn't it? Right. Ready when you are!
- ❓ Fight RUSTCLAW? **YES / NO**
- *[No]* **ENYA:** Take your time. Rest with the medic up north if you need to!
- *[The battle (Lv 9). After you win:]* RUSTCLAW wriggles out of the THRUSTER and scuttles away into the rocks!
- You got the THRUSTER! ([N] of 3)
- **ENYA:** Ha! Did you see its face? Come on, let's get these back to your ship!

### The black THORNS (the east trail)

- Thick black THORNS choke the trail east. They pulse with a cold, shadowy light...
- You reach out to touch one, and the world spins...
- A flash: a girl with golden hair, bound in thorns just like these, and shadowy GHOULS laughing in the dark.
- Something snaps inside you. Your eyes blaze GREEN, and a warrior's strength floods your arms!
- You tear the thorns apart with your bare hands! The trail east to the WHISPERWOOD is open.
- *[If your companion is NOVA]* [COMPANION] stares at you, wide-eyed... then purrs, very impressed.
- *[With Enya]* **ENYA:** ...Where did THAT come from? Remind me never to get on your bad side.

### Signs

- THE CRIMSON WILDS / WEST: Bloomhaven.  Stay out of the glowgrass if your companion is tired!
- SOUTH-EAST: the scrap nest. / Something big has been dragging metal in there...
- EAST: the WHISPERWOOD. / The old jungle, where the veil between worlds is thin.
- JELLY EXPRESS / Down to the JELLY JAM, where the river falls into the sky!

*[The JELLY FERRY at the top of the waterfall is in [section 5](#5-the-jelly-jam).]*

---

## 4. The Whisperwood

*The old jungle east of the Wilds, behind the black thorns. Wild creatures: LUMOTH, JADEHOP, VINESNAP and
MOSSHELL, plus GHOULS from beyond the veil (a COSMIC TUBE can't hold them). Boss: the GRIMGHOUL.*

### Arriving

- THE WHISPERWOOD. Giant trees, glowing vines and ferns taller than you. The air hums with something very old...
- Whispers drift between the trees. You could swear one of them just said your name.
- **[YOU]** *(mumbling)*: ...that voice...? ...Em?
- *[If you have COSMIC TUBES]* TIP: wild creatures hide in the tall ferns. Weaken one in battle, then capture it with a COSMIC TUBE from your BAG!
- *[If not]* TIP: wild creatures hide in the tall ferns. The LIGHT KEEPER lives by the old gate, over the stream to the north-east.

### The VEIL GATE

- An ancient stone arch. Inside it, dark motes swirl slowly... You feel someone watching you from the other side.
- *[First time, while you're still concussed]* **[YOU]** *(mumbling)*: ...is someone... there...?
- *[After the GRIMGHOUL]* The VEIL GATE. Its runes glow softly, as if it remembers you.

### LUMEN, the Light Keeper

*[The first time:]*

- **LUMEN:** Oh! A traveller from the stars... with a little spark of HER light on you. How curious.
- **LUMEN:** I am LUMEN, keeper of the VEIL GATE. Beyond it lies the OTHER SIDE: a dark mirror of our world.
- **LUMEN:** The veil is wearing thin. GHOULS slip through, and their shadow frightens our creatures half to death.
- **LUMEN:** Light heals shadow. Capture a creature in a COSMIC TUBE, and the infinite light inside will make it well again.
- You got 3 COSMIC TUBES!
- **LUMEN:** Weaken a wild creature in battle, then open a tube from your BAG. Bring me the light of 3 creatures...
- **LUMEN:** ...and perhaps the gate will show you what you are looking for.
- **[YOU]** *(mumbling)*: ...what I'm looking for... Em...
- *[If you've already captured 3]* **LUMEN:** Oh! But you already carry so much light... *(and the gate wakes, below)*

*[Later, with fewer than 3 captured:]*

- **LUMEN:** Rest in my light a while. (HP and EN fully restored!)
- *[If you're out of tubes]* **LUMEN:** Out of tubes? Here, take 2 more. Use them gently.
- *[If you're out of tubes]* You got 2 COSMIC TUBES!
- **LUMEN:** Creatures captured: [N] of 3. Their light will wake the gate.

*[After the GRIMGHOUL:]*

- **LUMEN:** Rest in my light a while, star traveller. (HP and EN fully restored!)
- **LUMEN:** The gate remembers you now. When your light is strong enough, it will open for you. I am sure of it.

### The gate wakes: the vision and the GRIMGHOUL

*[Talk to LUMEN with 3 creatures captured.]*

- **LUMEN:** So much light... Look! The gate is waking!
- Through the shimmering gate you see a dark, broken forest... and a girl with golden hair, running.
- Shadowy GHOULS are closing in on her. The diamond at her throat blazes like a star.
- **[YOU]:** EM! ...GEM!
- **ENYA** *(named ??? if you haven't met her yet)*: ...Is that you? You came! I knew you'd come for me, I knew it—
- CRACK! The vision shatters like a diamond!
- *[With Enya]* **ENYA:** That... that's where I really am. They're getting closer.
- ♥ MEMORY: THE OTHER SIDE

*[If you lost to the GRIMGHOUL and come back, instead of the vision:]*

- The gate shudders. Something is clawing its way through again...

*[Then:]*

- Something slipped through before the gate closed... a GRIMGHOUL! It sniffs the air, hungry for light.
- Your eyes blaze green. You will NOT let these things anywhere near her.
- *[The battle (Lv 8), with your FURY already at 60. After you win:]*
- The GRIMGHOUL dissolves into cold black smoke.
- **LUMEN:** The gate remembers you now. When your light is strong enough, it will open for you.
- **LUMEN:** They say only a love bright enough to light a COSMIC FLAME can open it for good.
- *[If Enya hasn't told you that story yet]* **[YOU]** *(mumbling)*: ...a cosmic flame... my grandmother's old story...
- *[Then]* ♥ MEMORY: THE COSMIC FLAME
- LUMEN gave you 2 MOON MELONS!

### Signs and things to look at

- THE WHISPERWOOD / The LIGHT KEEPER lives by the old gate, over the stream to the north-east.
- *[The giant trees]* Giant trees, packed tight. Somewhere in the leaves, something whispers your name...

---

## 5. The Jelly Jam

*Islands of purple alien plants floating in the sky, below the waterfall at the edge of the Wilds. Everything
moves to the beat. Wild creatures: BOPJELLY and DRUMCAP.*

### The JELLY FERRY

*[At the top of the waterfall in the Wilds:]*

- **JELLY FERRY:** Bloop! Wanna see where the river goes? I'll float you down to the JELLY JAM! Best party on all of KIRRA!
- ❓ Float down to the JELLY JAM? **YES / NO**
- *[No]* **JELLY FERRY:** Bloop! Any time!

*[In the Jelly Jam, to go back up:]*

- **JELLY FERRY:** Bloop! Heading back up to the CRIMSON WILDS?
- ❓ Float back up to the WILDS? **YES / NO**
- *[No]* **JELLY FERRY:** Stay and dance a while! Bloop!

### Arriving (the first time)

- THE JELLY JAM: islands of glowing purple alien plants, floating in a deep purple sky. Somewhere, a big beat is pumping!
- The jellyfolk who live here bop along to the bass. Even the plants pulse in time!
- *[With Enya]* **ENYA:** Ha! This place is brilliant. Reminds me of the dances back home in Tipperary.
- TIP: DJ JIGGLE is by the big boombox in JELLY TOWN, over the leaf bridge.

### DJ JIGGLE and the dance

- **DJ JIGGLE:** Yo yo YO! DJ JIGGLE in the house! This boombox fell out of the stars, just like you! Wanna dance?
- ❓ Dance with DJ JIGGLE? **DANCE! / NOT NOW**
- *[Not now]* **DJ JIGGLE:** No worries! The beat'll be right here when you're ready!
- **DJ JIGGLE:** Drop the bass! Everybody, on the beat... GO!
- *[Everyone dances, 8 moves on the beat.]*
- The jellies go wild! Bloop! Bloop! BLOOP!
- *[First dance, with Enya]* **ENYA:** Look at you! Still got two left feet.
- *[First dance]* **[YOU]** *(mumbling)*: ...a crowded hall... music... she pulled me onto the floor... I kept treading on her toes...
- *[First dance]* ♥ MEMORY: THE DANCE
- *[First dance]* **DJ JIGGLE:** Moves like that deserve a prize! Here, have a shiny DIAMOND!
- *[First dance]* You got a DIAMOND!
- *[Every dance after]* **DJ JIGGLE:** Fresh moves, star traveller! Come back any time!

### The jellyfolk

- **BLOOP:** Bloop bloop! Welcome to the JELLY JAM! Down here, everything moves to the beat!
- **WOBBLE:** The glow-plants shine brighter every time the bass drops. Can you feel it in your tentacles?
  - **[YOU]:** ...I don't have tentacles.
  - **WOBBLE:** Aww. You poor thing.
- **SQUISH:** We float up to the river at night and sing to the stars. Do you sing, star traveller?
  - *[First time, while you're still concussed]* **[YOU]** *(mumbling)*: ...she used to hum on the walk home... the same little tune, every time...
- **PLINK:** DJ JIGGLE found that boombox when it fell out of the sky. Now the party NEVER stops! Bloop!
- **GLOOP:** Shh... the DRUMCAPS are practising their drum solos in the sprout patch. They get grumpy if you interrupt!
- **HUM:** Hmm-hmm-hmmm... Oh! I hum along with the stars. They're always singing, you know. You just have to be very quiet.
  - *[With Enya]* **ENYA:** My gran used to say that too...

### Signs and things to look at

- THE JELLY JAM / Feel the beat! JELLY TOWN is east, over the leaf bridge.
- *[The boombox]* DJ JIGGLE's boombox. The bass makes your teeth buzz!
- *[The edge of an island]* Purple sky in every direction. Far below, giant jellies drift by like slow balloons.

---

## 6. Enya's echo

*From the THORNBACK ALPHA until the end of Chapter 1, Enya's echo rides beside you on the EMERALD TIGER. Face
her and press A: each talk brings a little more back.*

The first talk:

- **ENYA:** Do you remember the hill behind my house? We used to lie in the long grass and count shooting stars.
- **[YOU]** *(mumbling)*: ...a hill... the grass was always wet... you found more stars than me...
- **ENYA:** Ha! Every single time. So you DO remember a little.
- ♥ MEMORY: STARRY HILL

The second:

- **ENYA:** This necklace? It's the CELESTIAL GEM. My gran said it holds a splinter of the very first star.
- **[YOU]** *(mumbling)*: ...Gem... Em... why do those sound... the same...?
- **ENYA:** Keep thinking. You'll get there. You always were a slow one!

The third:

- **ENYA:** Where I really am, it's cold and dark. GHOULS hunt anything that shines... and the GEM shines brightest of all.
- *[Your eyes glow green for a while.]*
- **[YOU]:** I won't let them near you.
- **ENYA:** ...There it is. That green in your eyes. You always got that look when someone picked on me.

The fourth:

- **ENYA:** My gran had an old story: when two hearts that belong together finally meet, they light a COSMIC FLAME...
- **ENYA:** ...bright enough to start a whole new universe. Daft, isn't it?
- **[YOU]** *(mumbling)*: ...not daft... my grandmother told me the very same story...
- ♥ MEMORY: THE COSMIC FLAME

After that, taking turns:

- **ENYA:** The GEM is holding. For now.
- **ENYA:** [COMPANION] keeps staring at me. Is that normal?
- **ENYA:** Tipperary feels a million miles away. It probably is.
- **ENYA:** Find your parts first. Then we'll find a way to the real me.

*[Her other lines are in each area, marked "With Enya".]*

---

## 7. The end of Chapter 1

*[Bring all three parts back to the COMET.]*

- You hand the three parts to SPRIG, who has rolled over from the grove.
- **SPRIG:** Beep... boop... FUEL CELL: installed. NAV CORE: installed. THRUSTER: installed! Bzzt!
- The COMET coughs, rumbles and lights up! Smoke stops pouring out of the engine.
- **SPRIG:** It can fly again! But only short hops. The other THREE parts landed somewhere far across KIRRA.
- **ENYA:** Then you'll go and get them. Kirra's a big planet, but you never were one to give up.
- ENYA's echo flickers... and starts to fade!
- **ENYA:** No... not yet! The GEM's light is running out...
- Cold shadows curl around her. Something on the other side is pulling her back!
- **[YOU]:** EM! NO!
- You lunge for her, eyes blazing green... but your hands close on nothing but light.
- **ENYA:** Listen to me, [YOU]. They're coming for the GEM, and for me. You have to find me. The REAL me.
- **ENYA:** Remember the hill? The shooting stars? You made me a promise up there.
- *[If it hasn't come back yet]* ♥ MEMORY: STARRY HILL
- **[YOU]:** ...Wherever the stars take you, I'll find you. I remember. I promised.
- **ENYA:** You always did keep your promises... Hurry.
- She is gone, in a shower of diamond light. One tiny spark drifts down into your hand, still warm.
- ♥ MEMORY: THE PROMISE
- *[If your companion is NOVA]* [COMPANION] presses against your legs and lets out a small, sad purr.
- **[YOU]:** I'm coming, Em. Hold on.

*[Enya's part of this scene needs her echo with you. You can't beat RUSTCLAW without her, so in normal play
she's always there.]*

### The CHAPTER 1 COMPLETE screen

- CHAPTER 1 / COMPLETE!
- [COMPANION] Lv [N] · MEMORIES [N]/9 · CAPTURED [N] · JEWELS [N] (◆[money]) · BATTLES [N] · TIME [play time]
- TO BE CONTINUED...
- PRESS A

---

## 8. Battles

### A battle starts

- *[The creature's own line (see [Creatures](#10-creatures)), for example]* A GLORP oozes out of the glowgrass!
- *[Against a GHOUL]* Your eyes flicker green at the sight of it. Your FURY rises!
- *[With Enya]* ENYA's echo and the EMERALD TIGER fight beside you!
- Go, [COMPANION]!

### Your turn: FIGHT, BAG, GUARD or RUN

- *[GUARD]* [COMPANION] braces for impact! (+3 EN)
- *[An item from the BAG]* You gave [COMPANION] a [ITEM]! → [COMPANION] feels great!
- *[RUN]* You got away safely! / Couldn't get away! / *[from a boss]* There's no running from this one!
- *[Moves]* But it missed! · Hit [N] times! · A critical hit! · [NAME]'s ATTACK, DEFENCE, SPEED or ACCURACY rose! / rose sharply! / fell! / fell sharply! / won't go any higher! / won't go any lower!
- *[Effects]* [NAME] is hurt by its burn! · [NAME] is dazed and can’t move! · [NAME] is knocked off balance!
- *[Healing moves]* [NAME] feels much better! *(HEALING LICK: Tiger saliva heals fast! [COMPANION] feels much better!)*
- *[TIGER STEP]* [COMPANION] blinks away in a flash of light! → *[the next attack]* [COMPANION] is already gone in a flash of light! It missed!

### Enya's turn (while her echo is with you)

- **ENYA:** Hang in there, [COMPANION]! SHAMROCK CHEER! → [COMPANION] feels lucky! HP restored.
- ENYA used DIAMOND FLASH! The GEM at her throat blazes! → Its light shatters like a diamond in [FOE]'s eyes. [FOE] is dazed! *(or: [FOE] shut its eyes just in time!)*
  - *[The first DIAMOND FLASH you see]* **[YOU]** *(mumbling)*: That light... I know that light...
- The EMERALD TIGER pounces!

### FURY

*[Your FURY meter fills when your companion gets hurt. When it's full, it bursts after Enya's turn: a close-up
of his face, brows slamming down and eyes blazing emerald as the power builds.]*

- Your eyes blaze green! The warrior blood of your ancestors surges!
- WARRIOR STRIKE! It hits [FOE] hard!
- *[The first time]* ♥ MEMORY: WARRIOR BLOOD, then: (FURY builds when your companion is hurt. When it's full, your warrior blood takes over!)

### COSMIC TUBES: capturing a creature

- *[If your companion is NOVA]* [COMPANION] pins [FOE] down!
- You open a COSMIC TUBE!
- *[A boss]* [BOSS] is far too strong to fit in a tube!
- *[A GHOUL]* The light passes straight through it! It isn't from this world...
- *[It escapes]* Oh no! [FOE] broke free! / Argh! So close! / Almost had it!
- [FOE] is held in an infinity of light. Captured!
- *[A kind you haven't caught before]* A new creature for your COSMIC TUBES! (START, then TUBES)

### Winning and losing

- The wild [FOE] is out cold! · *[a GHOUL]* The [GHOUL] melts back into the shadows! · *[a boss]* [BOSS] is beaten!
- [COMPANION] gained [N] XP! · [COMPANION] grew to Lv [N]! · [COMPANION] learned [MOVE]!
- [FOE] left behind a [JEWEL]!
- [COMPANION] is worn out!

### When your companion is worn out

*[You wake up at the last place you rested.]*

- Everything goes dark...
- *[NOVA]* Something warm and rough is licking your face. [COMPANION]! Tiger saliva has powerful healing properties. You both feel much better.
- *[Dragon]* [COMPANION] is curled round you like a warm, scaly blanket. You both feel much better.
- *[Octopus]* [COMPANION]'s soft glow eases the ache in your head. You both feel much better.

---

## 9. Memories

*[Kept on the MEMORIES page of your QUEST notes. Each one arrives with "♥ MEMORY: [title]".]*

| # | Memory | When it comes back | What it says |
|---|---|---|---|
| 1 | FIRE IN THE SKY | Waking up, when SPRIG reads your name | Your homeworld under attack. Sirens and burning banners. You left anyway, chasing one last signal across the stars... to her. |
| 2 | A NAME | Choosing your companion | Em... Gem... A name, half-lost in the fog, right on the tip of your tongue. |
| 3 | THE CELESTIAL GEM | Meeting Enya after the THORNBACK ALPHA | Her diamond necklace, the CELESTIAL GEM, bright as a star. She wore it every single day, even when the whole world was at war. |
| 4 | STARRY HILL | Enya's first talk (or the ending) | Two kids lying in the long grass on a hill, counting shooting stars. She always found more than you did. |
| 5 | WARRIOR BLOOD | Your first FURY in battle | Your father's voice: 'Our anger burns green, son. Only ever point it at whatever threatens the ones you love.' |
| 6 | THE OTHER SIDE | The Veil Gate vision | She is trapped beyond the VEIL, in a dark mirror of this world. GHOULS hunt her for the light of the GEM. |
| 7 | THE COSMIC FLAME | Enya's fourth talk, or after the GRIMGHOUL | An old bedtime story: when two hearts meant for each other finally meet, they light a COSMIC FLAME bright enough to begin a universe. |
| 8 | THE DANCE | Your first dance with DJ JIGGLE | A summer dance in a crowded hall. She pulled you onto the floor and laughed every time you trod on her toes. |
| 9 | THE PROMISE | The end of Chapter 1 | 'Wherever the stars take you, I'll find you.' You promised her that, long ago. You still mean every word. |

---

## 10. Creatures

*[The descriptions show on the TUBES page once you've caught one.]*

| Creature | Where | When it appears | Its moves | Description |
|---|---|---|---|---|
| GLORP | Crimson Wilds | A GLORP oozes out of the glowgrass! | BOUNCE, GOO | A wobbly green blob. It bounces when it is happy, which is always. |
| SPORELET | Crimson Wilds | A grumpy SPORELET pops up! | HEADBUTT, SPORES | A grumpy little mushroom. Its spores make everyone sneeze. |
| FLITTERFIN | Crimson Wilds | A FLITTERFIN zips out of the river spray! | FIN SLAP, DIVE BOMB | A flying fish that zips out of the river spray. |
| CRYSTABUG | Crimson Wilds | A CRYSTABUG clicks its crystal shell! | PINCH, CRYSTAL SHARD, HARDEN | Grows crystals on its back, and often drops jewels. |
| THORNBACK | Crimson Wilds | A spiky THORNBACK blocks the way! | BITE, SPIKE ROLL | Spiky and stubborn. Will do anything for a melon. |
| THORNBACK ALPHA | Crimson Wilds (boss, Lv 6) | The THORNBACK ALPHA charges! | BITE, SPIKE ROLL, STOMP | *(can't be caught)* |
| RUSTCLAW | Crimson Wilds (boss, Lv 9) | RUSTCLAW rears up, its stolen THRUSTER blazing! | CRUSH CLAW, HOT SCRAP, THRUSTER BLAST, HARDEN | *(can't be caught)* |
| LUMOTH | Whisperwood | A LUMOTH flutters out of the ferns, glowing like a lantern! | FLUTTER, MOTH DUST | A moth that glows like a lantern. Its wing dust sparkles. |
| JADEHOP | Whisperwood | A JADEHOP leaps out of the ferns! Ribbit! | TONGUE LASH, LEAP | A frog with a jade crystal back. It can leap over a whole tree. |
| VINESNAP | Whisperwood | A VINESNAP uncurls from the undergrowth, jaws snapping! | SNAP, VINE WRAP | A snappy plant that walks on its vines. All bark, mostly bite. |
| MOSSHELL | Whisperwood | A MOSSHELL plods out of the ferns. A garden grows on its back! | SHELL BASH, HARDEN, MOSS BLOOM | An old turtle with a little glowing garden on its shell. |
| GHOUL | Whisperwood | A GHOUL seeps out of the shadows! It came from beyond the veil... | SHADOW CLAW, WAIL, GRAVE CHILL | *(from beyond the veil: can't be caught)* |
| GRIMGHOUL | Whisperwood (boss, Lv 8) | The GRIMGHOUL reaches for you with long, grasping claws! | GRASP, GLOOM WAVE, SHADOW CLAW, GRAVE CHILL | *(from beyond the veil: can't be caught)* |
| BOPJELLY | Jelly Jam | A BOPJELLY bops down out of the purple sky! | BOP, ZAP STING | A sky jelly in tiny headphones. It bops along to any beat. |
| DRUMCAP | Jelly Jam | A DRUMCAP drums its way out of the alien sprouts! | DRUM ROLL, SPORE BEAT, BASS DROP | A mushroom whose cap is a drum. It has never missed a beat. |

---

## 11. Companions, moves and items

### Companions

- **NOVA, the tiger:** A tiger cub with fiery stripes and bright green eyes. Strong claws, a mighty ROAR, a healing lick, and he can teleport in a flash of light.
- **EMBER or AZURE, the dragon:** A baby dragon with shimmering scales. Breathes fire (or frost!), and packs a TAIL SWIPE.
- **LUMI, the octopus:** A glowing octopus in tiny reading glasses. Very clever: LUMI heals herself and baffles foes with ink.

### Their moves (and the level they learn them)

| Companion | Move | Lv | Description |
|---|---|---|---|
| NOVA | CLAW | 1 | Swipe with sharp claws. |
| NOVA | ROAR | 1 | A mighty roar. Lowers the foe's attack and may stun it. |
| NOVA | POUNCE | 1 | A huge leap. Often lands a critical hit. |
| NOVA | HEALING LICK | 4 | Tiger saliva has amazing healing powers. Restores HP. |
| NOVA | TIGER STEP | 5 | Teleports in a flash of light, strikes, and dodges the next attack. |
| NOVA | FLAME AURA | 7 | Crimson flames blaze up: attack sharply up. |
| EMBER | SWIPE | 1 | A quick swipe of the claws. |
| EMBER | FLAME | 1 | Breathes fire. May burn the foe. |
| EMBER | TAIL SWIPE | 1 | A spinning tail hit. May knock the foe off balance. |
| EMBER | SMOKE SCREEN | 5 | Crimson smoke. Lowers the foe's accuracy. |
| EMBER | DRAGON DIVE | 7 | Soars up and dives down hard. |
| AZURE | FROST BREATH *(instead of FLAME)* | 1 | Icy breath. May freeze the foe for a turn. |
| AZURE | MIST VEIL *(instead of SMOKE SCREEN)* | 5 | A cold mist. Lowers the foe's accuracy. |
| LUMI | TENTACLE WHIP | 1 | Hits 2 to 4 times in a row. |
| LUMI | INK CLOUD | 1 | Squirts glowing ink. Lowers the foe's accuracy. |
| LUMI | GLOW PULSE | 1 | A soothing glow that restores HP. |
| LUMI | MIND WAVE | 5 | A clever psychic wave. Ignores defence. |
| LUMI | PRISM SHIMMER | 7 | Dazzling colours. Often dazes the foe. |

Enya's moves (on the PARTY page while she's with you):

- DIAMOND FLASH: The GEM's light dazes the foe.
- SHAMROCK CHEER: Heals your companion.
- EMERALD POUNCE: The tiger leaps in to attack.

### Items (from MOSSA's shop)

| Item | Price | Description |
|---|---|---|
| GLOWBERRY | ◆6 | A sweet glowing berry. Restores 30 HP. |
| STAR TONIC | ◆8 | Fizzy and bright. Fills EN to the top. |
| MOON MELON | ◆15 | A whole melon! Restores all HP and EN. |
| COSMIC TUBE | ◆8 | Holds an infinity of light. In battle, it captures a weakened wild creature. |

Using the BAG outside battle:

- *[None left]* You don't have any.
- *[A COSMIC TUBE]* Use it in battle: weaken a wild creature first, then open the tube!
- *[Before you have a companion]* You have no companion to give it to yet.
- *[HP and EN already full]* [COMPANION] is already full of beans!
- [COMPANION] munches the [ITEM]. Delicious!

### Jewels

GOLD COIN ◆1, EMERALD ◆5, SAPPHIRE ◆5, RUBY ◆5, DIAMOND ◆10. Picking one up shows, for example, "+1 EMERALD  ◆5".

### Ship parts (in the QUEST notes)

- FUEL CELL: Guarded by a huge THORNBACK in the west of the Wilds.
- NAV CORE: On the island in the middle of the river.
- THRUSTER: Worn as a shell by RUSTCLAW, in the scrap nest (south-east).

---

## 12. Quest notes

Your goal, as it changes through the chapter (QUEST in the START menu):

1. Find out where you are.
2. Meet the guardians in the GROVE (north of the plaza) and choose a companion.
3. Cross the bridge (east) into the CRIMSON WILDS and find your three ship parts.
4. *[After the ALPHA]* Find the other ship parts: the NAV CORE (river island) and the THRUSTER (RUSTCLAW’s nest, south-east).
5. *[After another part]* Find the remaining ship parts.
6. *[All three]* Take the parts back to the COMET in Bloomhaven!
7. Chapter 1 complete! Find a way beyond the veil to reach the real ENYA... Chapter 2 is on its way.

---

## 13. Help and looking around

### Menus

- START menu: PARTY · BAG · TUBES · QUEST · SAVE · OPTIONS · CLOSE
- *[SAVE]* Your adventure has been saved on this device. *(or: Sorry, this browser won't let the game save (private browsing?).)*
- *[PARTY, Enya's card while her echo is with you]* From Tipperary. Lost beyond the veil, she reaches you as an echo through the GEM.
- *[PARTY, Enya's card after Chapter 1]* The ghouls pulled her back beyond the veil. She is waiting for you to find her.
- *[TUBES, a creature you haven't caught yet]* Not captured yet. Weaken one in battle, then open a COSMIC TUBE!
- *[QUEST, first page]* SHIP PARTS   → MEMORIES, each part FOUND or ???, then NOW: and your goal (see [Quest notes](#12-quest-notes)).
- *[QUEST, bottom line, between meeting LUMEN and beating the GRIMGHOUL]* LUMEN'S LIGHT: [N] of 3 creatures *(otherwise your CAPTURED and MEMORIES counts)*
- *[QUEST, MEMORIES page, a memory that hasn't come back]* Still lost in the fog. Explore, talk to everyone, and it may come back to you...
- *[SOUND TEST, from the title menu: every tune and sound effect]* A: play   B: back

### The bump on your head

*[Now and then, while you're still concussed, your head throbs and your vision blurs, and a fragment drifts up,
in turn:]*

- ...Em...? · ...a diamond, shining... · ...sirens... fire... · ...stars... a hill... · ...Gem...? · ...I promised...
- *[If your companion is NOVA]* [COMPANION] licks you. Ahh, better!
- *[Whenever anyone says "Em" or "Gem", NOVA's hearts float up, and the Emerald Tiger's too.]*

### Controls and looking around

The controls (from the title screen's menu):

- MOVE: W A S D, the arrow keys, or the D-pad. / A: SPACE, J, Z or ENTER (talk, choose). / B: K, X or BACKSPACE (back).
- START: ESC or P (menu, pause). / SELECT: SHIFT or Q (hop on or off your companion). / A gamepad works too. On a phone, tap the console buttons.

Looking at things anywhere:

- *[The river]* The river glows a soft, bright green.
- *[Algae in the river]* Glowing algae sway in the water. A tiny jelly blinks at you.
- *[The edge of the world, in the Wilds]* The land ends here. Below, the purple sky goes on forever...
