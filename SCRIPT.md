# Cosmic Castaways: the full script

Every line of text in Chapters 1 and 2, in the order you meet it: the intro, each area and its people, Enya's
echo, Cody the white cat, the turtles, the end of Chapter 1, the COMET's hops and the dreams, the Venom Mire,
the Jade Lagoon, the Withered Deep, the end of Chapter 2, the battles, the memories and the creatures. It was
written from the game's code (`src/game/story.js`, `scenes.js`, `battle.js`, `world.js`, `data.js`, `maps.js`)
on 27 Nov 2026, so it matches the game as it is now. If the story changes, ask Claude to refresh it.

**How to read it**

- **SPRIG:** a character speaking.
- **[YOU]:** the hero, with the name you chose (MANNY, SPACEY or RHINO if you leave it empty).
- **[YOU]** *(mumbling)*: the hero's concussed mumbling, typed out slowly in lavender.
- A line with no name is narration or on-screen text.
- **[COMPANION]** is your companion's name: NOVA (tiger), EMBER or AZURE (red or blue dragon) or LUMI (octopus).
- *[Notes in square brackets]* say when a line appears.
- ❓ is a question, with the answers you can pick.
- ♥ MEMORY is a memory coming back (the full texts are in [Memories](#15-memories)).

## Contents

1. [Title and intro](#1-title-and-intro)
2. [Bloomhaven](#2-bloomhaven)
3. [The Crimson Wilds](#3-the-crimson-wilds)
4. [The Whisperwood](#4-the-whisperwood)
5. [The Jelly Jam](#5-the-jelly-jam)
6. [Enya's echo](#6-enyas-echo)
7. [Cody, the turtles and her tune](#7-cody-the-turtles-and-her-tune)
8. [The end of Chapter 1](#8-the-end-of-chapter-1)
9. [Chapter 2: the COMET's hops and the dreams](#9-chapter-2-the-comets-hops-and-the-dreams)
10. [The Venom Mire](#10-the-venom-mire)
11. [The Jade Lagoon](#11-the-jade-lagoon)
12. [The Withered Deep](#12-the-withered-deep)
13. [The end of Chapter 2](#13-the-end-of-chapter-2)
14. [Battles](#14-battles)
15. [Memories](#15-memories)
16. [Creatures](#16-creatures)
17. [Companions, moves and items](#17-companions-moves-and-items)
18. [Quest notes](#18-quest-notes)
19. [Help and looking around](#19-help-and-looking-around)

---

## 1. Title and intro

### Title screen

- COSMIC CASTAWAYS
- CHAPTER 2: THE DRAGON KINGS
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
- *[With all three parts: the end of Chapter 1, see [section 8](#8-the-end-of-chapter-1).]*
- *[After Chapter 1: short hops across Kirra, see [section 9](#9-chapter-2-the-comets-hops-and-the-dreams).]*

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

*[She fights beside you for the rest of the battle (see [Battles](#14-battles)). After you win:]*

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

## 7. Cody, the turtles and her tune

### CODY, the wise (and cheeky) white cat

*CODY walks on two legs and leans on a wooden staff with gold bands and a star on top: the Dragon King's old
pillar. It grows ("BIG!"), stretches ("EXTEND!"), shrinks to the size of an earbud so he can keep it in his ear
("small!"), flies ("FLY!") and fights on command, and it weighs seven thousand kilos. His own swing tune plays
while he's about.*

The first time you meet him (wherever that is):

- **CODY:** Mrrrow? ...A star traveller. With a bump on his head the size of a MOON MELON.
- **[YOU]** *(mumbling, or out loud after Chapter 1)*: ...Did that cat just talk?
- **CODY:** That cat has a name, kid. CODY. Wise, handsome, and only eight hundred and twelve years old.
- **CODY:** Give or take. You stop counting after the first few centuries.
- *[NOVA]* **CODY:** And who's this? A tiger cub! Fire in his belly, and he doesn't even know it yet. Heh.
- *[Another companion]* **CODY:** Nice friend you've got there. [COMPANION], is it? Good name.

**The Crimson Wilds** *(north of the meadow, near the trail from Bloomhaven)*:

- A white cat is fast asleep... standing up on its back legs, leaning on a wooden staff. It is snoring.
- You give the cat a gentle poke.
- *[The first meeting, above]*
- **CODY:** You look like you've lost something. Bits of your ship? Bits of your memory? Bits of your heart, maybe?
- **[YOU]** *(mumbling)*: ...All three, I think.
- **CODY:** Ha! Honest. I like that. Here: GOLDEN CATNIP, from my secret stash. Don't tell anyone.
- You got a GOLDEN CATNIP! Give it to your companion from your BAG (START, then BAG): one sniff and they grow a whole level!
- **CODY:** Right. Nap time, somewhere quieter. Staff... small!
- The staff shrinks... and shrinks... until it is no bigger than an earbud. CODY pops it into his ear.
- **[YOU]** *(mumbling)*: ...He just put his staff in his ear.
- **CODY:** Best place for it. It weighs seven thousand kilos, you know. Try carrying THAT in your pocket.
- **CODY:** See you around, kid. I get about.
- *[He vanishes in a puff of white fur.]*

**The Whisperwood** *(the south glade)*: he teaches NOVA the FIRE TIGER RING.

- *[If you've met him]* **CODY:** Oh, it's you again. The kid with the bump. Still mumbling about 'Em'?
- **CODY:** I remember everything, you know. Except where I left my sunglasses. Never had any, come to think of it. Shame. I'd look GREAT in sunglasses.
- *[NOVA]* **CODY:** Now then, [COMPANION]. Let's see that fire of yours. Staff... BIG!
  - **CODY:** A tiger's fire isn't in his claws, cub. It's in here.
  - CODY taps [COMPANION] on the chest with the end of his staff. [COMPANION] takes a deep, deep breath...
  - **CODY:** ...and let it go. ALL the way round you!
  - A RING OF FIRE pulses out around [COMPANION], stretching wider and wider, crackling through the ferns!
  - [COMPANION] learned FIRE TIGER RING! (Taught by CODY: a ring of fire pulses out, stretches wide and engulfs the foe. May burn.)
  - **CODY:** Not bad for a cub. Use it to protect the ones you love, eh?
  - *[With Enya]* **CODY:** ...Like that echo of a girl riding round behind you. → **ENYA:** Oi! I can look after myself, thanks very much. → **CODY:** Course you can. But it's nice not to have to, sometimes. → **ENYA:** ...Fair point, cat.
- *[Another companion]* **CODY:** [COMPANION]'s fire is a different sort from mine. Here: have a GOLDEN CATNIP instead. Works on everyone. *(You got a GOLDEN CATNIP!...)*
- **CODY:** Right, I am off. Staff... FLY!
- CODY zooms up into the treetops on his staff. "WHEEEEEE!"

**The Jelly Jam** *(Jelly Town, by the dance floor)*:

- *[If you've met him]* **CODY:** Oh, hello again! Lovely party. The bass makes my staff hum in my ear. Bzzzzm.
- **CODY:** See DJ JIGGLE's shades? THAT is what I need. A pair of smart, cool cat SUNGLASSES.
- **CODY:** The DRAGON KING out at the JADE LAGOON owes me a favour. Well, I owe him a staff. Same thing, really.
- **CODY:** Here: a GOLDEN CATNIP. For dancing. Or for not dancing. I'm not judging.
- You got a GOLDEN CATNIP! Give it to your companion from your BAG (START, then BAG): one sniff and they grow a whole level!
- **CODY:** If you're ever out east at the JADE LAGOON, pop in. I'll be the one in sunglasses.

*[CODY turns up again in Chapter 2: at the Venom Mire, the Jade Lagoon and the Withered Deep.]*

### GOLDEN CATNIP (from the BAG)

- *[NOVA]* [COMPANION] sniffs the GOLDEN CATNIP... and rolls about in it, purring like an engine!
- *[Dragon]* [COMPANION] sniffs the GOLDEN CATNIP and sneezes out a puff of golden sparkles!
- *[Octopus]* [COMPANION] sniffs the GOLDEN CATNIP and glows every colour of the rainbow!
- [COMPANION] grew to Lv [N]!  HP [N]  ATK [N]  DEF [N]  SPD [N]
- *[A new move at that level]* [COMPANION] learned [MOVE]!
- *[At Lv 30]* [COMPANION] is already as strong as a companion can be!

### The turtles

*Little GREEN, PURPLE and YELLOW TURTLES wander about in Bloomhaven, the Wilds, the Whisperwood, the Jelly Jam,
the Venom Mire, the Jade Lagoon and (once it's healed) the Deep. Each one carries a gift the first time you talk
to it.*

- A little [GREEN / PURPLE / YELLOW] TURTLE pokes its head out of its shell and blinks up at you. There's something balanced on its back!
- You got GLOWBERRY ×2! / You got STAR TONIC! / You got COSMIC TUBE ×2! / You got MOON MELON! / You got 3 GOLD COINS! / You got a DIAMOND! *(green ones carry snacks, purple ones melons, tubes and tonics, yellow ones gold and diamonds)*
- *[NOVA]* [COMPANION] sniffs the turtle. The turtle sniffs [COMPANION] right back.

After that, a little peace and quiet, in turn:

- You sit with the turtle for a while. Turtles never hurry. The noise in your head slows down, too.
- The turtle munches a leaf, very, very slowly. Watching it is the most peaceful thing you have done all week.
- The turtle blinks at you, slow and kind. For a moment, everything is quiet.

### Her tune

*[Now and then, after you've found your companion, you whistle or hum a little tune without thinking, and your
companion joins in. You can keep walking while you do.]*

- ♪ You whistle a little tune... / ♪ You hum a little tune...
- *[NOVA]* ♪ [COMPANION] hums along. A bit off-key.
- *[Dragon]* ♪ [COMPANION] puffs little rings in time.
- *[Octopus]* ♪ [COMPANION] glows in time with the tune.
- *[The first time]* **[YOU]** *(mumbling)*: ...this tune... where do I know it from...? She hummed it... on the walk home... every single time...
- ♥ MEMORY: HER TUNE

### NOVA saves Enya's echo

*[Once NOVA knows the FIRE TIGER RING, a GHOUL now and then grabs at Enya's echo as you walk the Wilds, the
Whisperwood or the Jelly Jam.]*

- *[The first time]* **ENYA:** Oi! Get OFF! It's got the tiger by the paws!
- *[Later, one of]* **ENYA:** Not again! Get away from me! / Ugh, these things! NOVA? / A little help here?!
- *[The first time]* Shadowy tendrils wrap round the EMERALD TIGER's legs. ENYA is stuck!
- *[The first time]* [COMPANION] roars! A RING OF FIRE pulses out around him, stretching wider and wider... and swallows the GHOUL whole!
- *[The first time]* **ENYA:** ...Wow. Good lad, [COMPANION]! Thank you.
- *[Later, one of]* **ENYA:** My hero! Well, one of them. / Nice one, [COMPANION]! / Ha! Burnt to a crisp. Thanks, handsome.

### Flowers

- *[A glowflower in the Whisperwood or the Deep]* You breathe in the glowflower's scent: honey and rain. For a moment, your head is perfectly quiet.
- *[A grey flower in the Withered Deep]* A grey, wilted flower. When you touch it, its petals fall like ash.

---

## 8. The end of Chapter 1

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
- [COMPANION] Lv [N] · MEMORIES [N]/15 · CAPTURED [N] · JEWELS [N] (◆[money]) · BATTLES [N] · TIME [play time]
- TO BE CONTINUED...
- PRESS A

---

## 9. Chapter 2: the COMET's hops and the dreams

### SPRIG, after Chapter 1

- **SPRIG:** Beep! The COMET can make short hops now. Talk to it: its scanner is looking for your other three parts! Bzzt.
- *[Once you've started hopping]* **SPRIG:** You have found [N] of the last 3 parts! The COMET will hop you anywhere you need to go. Bzzt.
- *[After Chapter 2]* **SPRIG:** The COMET is whole again! Beep! I polished every single rivet. Twice. Bzzt.

### The COMET's scanner (the first time you talk to it after Chapter 1)

- The COMET's scanner gives a happy PING! Three faint signals blink on its screen, far across KIRRA.
- **COMET:** SIGNALS FOUND: 3. NEAREST: A SWAMP TO THE SOUTH. THE VENOM MIRE.
- **COMET:** SECOND SIGNAL: FAR TO THE EAST, BY A LAGOON. THIRD SIGNAL: ...MOVING. SOMETHING HAS SWALLOWED IT.
- **[YOU]:** Short hops will do. One part at a time.
- **[YOU]:** Hold on, Em. I'm coming.

### Hopping

- *[Later]* The COMET can make short hops across KIRRA. Parts found: [N] of the last 3.
- *[After Chapter 2]* The COMET hums, whole again, its engines warm. Ready for the longest trip of all... (Chapter 3 is on its way!)
- *[The menu]* THE COMET: BLOOMHAVEN · THE VENOM MIRE · THE JADE LAGOON *(once the Mire is done)* · REST ON BOARD · STAY HERE
- *[REST ON BOARD]* You and [COMPANION] rest in the COMET's cosy little cabin. (HP and EN fully restored!)
- *[The flight]* SHORT HOP TO / [PLACE]
- *[After a dream]* ...You wake with a jolt as the COMET bumps down. The dream fades, but the warm feeling stays.

### The first dream: a summer, long ago *(on your first hop)*

- · a memory · / a summer, long ago
- A warm kerb. A blue sky. The smell of cut grass. You know this street...
- **ENYA:** This is the best day EVER. No school, no chores, nothing to do all day but this.
- **[YOU]:** My lolly is melting all down my arm.
- **ENYA:** Lick faster, then! Ha!
- **[YOU]** *(mumbling)*: ...sitting on the kerb outside her house, doing nothing at all... the best days of your life...
- ♥ MEMORY: SUMMER DAYS
- **ENYA:** Right. Bet you can't beat me at wall-ball.
- She pulls a scruffy old tennis ball out of her pocket. TIP: press A to hit the ball back when it comes to you!
- *[She smacks the ball off the gable wall; when it bounces back to you, A! (shown over your head) hits it back.]*
  - *[A good hit, the first time]* Nice shot!
  - *[A miss, one of]* **ENYA:** Butterfingers! / Ha! Too slow! / Watch the BALL, not me!
- **[YOU]:** Right. Watch THIS one.
- *[Far too hard: it sails right up onto the roof next door.]*
- THUNK. The ball rolls along the slates... and drops into Mr Nolan's gutter.
- **ENYA:** Uh-oh.
- *[An upstairs window flies open, and MR NOLAN leans out, red in the face, with a "!" over his head.]*
- **MR NOLAN:** OI! SH!TE! Not AGAIN! That's the third ball on me roof this WEEK!
- **MR NOLAN:** #$%&! Ya little gurriers! It's MINE now, d'ye hear me?!
- **ENYA:** RUN!
- Laughter echoes down the street, all the way round the corner.
- **[YOU]** *(mumbling)*: ...Mr Nolan. He never gave a single ball back. She laughed so hard she cried...
- ♥ MEMORY: THE TENNIS BALL

### The second dream: the lost years *(on your first hop to the Jade Lagoon)*

- You are dreaming of the war again.
- *[Over a burning city, searchlights sweeping]* YEAR 1 · YEAR 2 · YEAR 4 · YEAR 7 · YEAR ?
- Sirens. Searchlights. Orders shouted in the dark. You stopped counting the days, then the months, then the years.
- **[YOU]** *(mumbling)*: ...how long was I gone...? Two years...? Ten...? Nobody could ever tell me...
- ♥ MEMORY: THE LOST YEARS
- Then, through the smoke, a little light. Bright as a diamond.
- **ENYA:** Wherever the stars take you...
- **[YOU]:** ...I'll find you.

---

## 10. The Venom Mire

*A swamp of dead, mossy trees and thick yellow-green ooze. The COMET lands on the west side; the WARP COIL is
across the widest river of ooze, where the old plank bridge has fallen in.*

### Arriving

- THE VENOM MIRE. Dead trees drip with moss, and rivers of thick yellow-green ooze bubble and gloop between them.
- It smells like a thousand old socks. Something hisses, somewhere in the reeds.
- *[NOVA]* [COMPANION] wrinkles his nose and sneezes.
- **[YOU]:** The WARP COIL's signal is coming from the east. Right across the ooze, by the looks of it.
- TIP: snakes hide in the reeds. Their bites can POISON your companion: it stings at the end of every round until it wears off.

### The broken bridge: CODY's staff

- The old plank bridge stops dead in the middle. The planks have fallen in, and the ooze below gurgles hungrily.
- A white blur drops out of the dead trees, in a puff of fur!
- *[If you've met him; otherwise the first meeting]* **CODY:** Fancy meeting you here. Mind the ooze, kid. It stains.
- **CODY:** Bridge out, is it? Stand back. Staff... EXTEND!
- *[The staff shoots out of his ear and right across the gap.]*
- THOOM! The staff crashes down across the gap so hard that every plank in the Mire rattles.
- **CODY:** Go on, it won't bend. Seven thousand kilos, that staff. Mind the ooze... and whatever lives in it.

### Snakes on the bridge

- Halfway across the planks, the ooze beside you bulges... and something comes slithering up out of it!
- *[Battle: a HISSLING, Lv 10]* → The HISSLING slithers back down into the ooze. Bloop.
- Right over the deepest ooze, on CODY's staff, a SPITVIPER rears up in front of you, hood flared!
- **CODY:** Don't look down! ...Or do. I'm not your mum.
- *[Battle: a SPITVIPER, Lv 11]* → The SPITVIPER sulks off into the ooze, spitting at nothing.

### OOZEFANG (the far bank)

- The far bank heaves. A GIANT serpent rears up out of the ooze, dripping, its eyes burning red...
- ...and wound round its middle like a belt: the WARP COIL!
- **[YOU]:** That's my WARP COIL. Give it back, you overgrown worm!
- *[Battle: OOZEFANG, Lv 12]*
- OOZEFANG thrashes, shrinks... and slithers away into the ooze, coughing up the WARP COIL!
- You got the WARP COIL! ([N] of 3)
- **CODY:** Bravo! Now, I will be wanting my staff back. But first, let us mend your bridge properly. Staff... FISH!
- The staff fishes the old planks out of the ooze and slots them back in, neat as you like. Then it shrinks to the size of an earbud and zips into CODY's ear.
- **CODY:** Took the shortcut. *(he pops up right next to you)*
- **CODY:** Here: a GOLDEN CATNIP, for being brave. Or daft. Same thing, mostly.
- You got a GOLDEN CATNIP! Give it to your companion from your BAG (START, then BAG): one sniff and they grow a whole level!
- **CODY:** Now, if you will excuse me, I am off to the JADE LAGOON. The DRAGON KING has a whole palace full of treasure...
- **CODY:** ...and I have my heart set on a pair of smart, cool cat SUNGLASSES. Purrr.
- **[YOU]:** Isn't the Dragon King the one you nicked that staff from?
- **CODY:** BORROWED. ...See you there, kid! Staff... FLY!

### Signs and things to look at

- THE VENOM MIRE / Mind the ooze. Mind the snakes. Mind your step on the old bridge (east).
- DANGER! BRIDGE OUT! / Something big lives in the ooze. Something with FANGS.
- *[The ooze]* Thick yellow-green ooze, bubbling and glooping. It smells like old socks. You are NOT going in there.
- *[The dead trees]* Dead swamp trees, dripping with moss. Two little yellow eyes blink at you from the dark... then vanish.

---

## 11. The Jade Lagoon

*A beach, clear turquoise water, and on an island the DRAGON KING's palace: red lacquer walls, green-tiled
roofs, jade paving, a great gong, and a heap of treasure.*

### Arriving

- THE JADE LAGOON. Water as clear as glass, white sand, and out on an island a palace of red lacquer and jade.
- Somewhere inside, a very loud, very cross voice is shouting about a CAT.

### The crabs at the gate

- **CRAB GUARD:** HALT! Who goes there? ...A star traveller, with a tiger? Hmm. In you go, then. Snip snip.
- **CRAB GUARD:** But mind your manners. The DRAGON KING is in a VERY bad mood. Some cat has been pestering him all morning.
- **CRAB GUARD:** And whatever you do, do NOT mention the pillar.
- *[After you've beaten the King]* **CRAB GUARD:** The KING says you may come and go as you please. Most unusual! Snip snip!
- **CRAB CAPTAIN:** I'm the CRAB CAPTAIN. Well, I'm a crab. Captain is more of a hobby.
- **CRAB CAPTAIN:** The KING's pillar was the biggest in the whole lagoon, you know. Then a CAT borrowed it. Sore subject.
- *[After the gong]* **CRAB CAPTAIN:** THREE Dragon Kings in one day! Well, two. My claws are shaking!

### The courtyard: CODY and the DRAGON KING

- **DRAGON KING:** FOR THE LAST TIME, CAT: NO! SUNGLASSES!
- **CODY:** Not even a little pair? Cat-sized. Gold rims. I'm not fussy.
- **DRAGON KING:** You STOLE my PILLAR! The great iron pillar that measured the depths of the COSMIC SEA!
- **CODY:** Borrowed. And I made it ever so much more useful. It fits in my ear now. Look! Staff... BIG!
- **DRAGON KING:** GRRRAAAAAAH!
- **CODY:** ...Small!
- **DRAGON KING:** And who is THIS? Another thief, come to rob a poor old Dragon King?
- Behind the throne, on a heap of gold, something glows soft white and blue... your STAR CORE!
- **[YOU]:** That's part of my ship. The STAR CORE. I need it to... to find someone.
- **DRAGON KING:** That? That is my new PEARL. It fell out of the sky, and it glows all night long. MINE.
- **DRAGON KING:** ...But I do love a contest. Best me in battle, star traveller, and the pearl is yours.
- ❓ Fight the DRAGON KING? **YES / NO**
  - *[NO]* **DRAGON KING:** Hmph. Come back when your little friend has grown some teeth.
  - *[Talking to him again]* **DRAGON KING:** Well? Will you fight me for the pearl, or not?
- *[Battle: the DRAGON KING, Lv 14]*
- **DRAGON KING:** Hmph! Well fought, star traveller. A deal is a deal.
- The DRAGON KING hands over his "pearl". You got the STAR CORE! ([N] of 3)
- **DRAGON KING:** Mind you, I have reigned over this lagoon for three thousand years. A pearl comes, a pearl goes.
- **[YOU]:** Three thousand years... I can't even tell you how many years the war took from me.

### Sunglasses, and the great gong

- **CODY:** Wonderful! Lovely! So. About those sunglasses...
- **DRAGON KING:** AAARGH! FINE! FINE! Anything to be rid of you!
- **DRAGON KING:** My brothers owe me favours. The Dragon Kings of the north and the south. One of them will have your... SUNGLASSES.
- BWONNNNNG! The great gong booms out across the lagoon, across the sea, across the whole sky...
- A WHITE DRAGON swoops down out of the clouds in a swirl of glittering frost!
- **WHITE DRAGON:** You rang, brother? I came as fast as the wind would carry me.
- **DRAGON KING:** Where is our brother, the BLACK DRAGON? He never misses a summons.
- **WHITE DRAGON:** ...He will not come. He has gone into the deep jungle beyond the WHISPERWOOD, and he is drinking its life.
- **WHITE DRAGON:** The trees are turning grey. The birds have stopped singing. Something dark from beyond the VEIL has got into him.
- **[YOU]:** Beyond the veil... the GHOULS.
- **WHITE DRAGON:** He even swallowed a sail of star-metal that fell out of the sky. He wears it like a cloak, and drinks its light.
- **[YOU]:** A sail... the SOLAR SAIL! The last part of my ship!
- **CODY:** Ahem. Before all the doom and gloom: SUNGLASSES?
- **WHITE DRAGON:** ...Sunglasses? Oh! You mean these?
- The WHITE DRAGON hands CODY a pair of shades carved from the ice at the top of the world. They will never melt.
- **CODY:** ...Purr-fect.
- **CODY:** Well? How do I look?
- *[NOVA]* [COMPANION] tilts his head. He has never seen anything so cool in his whole life.
- **[YOU]:** Very cool, Cody.
- **CODY:** I KNOW.
- **WHITE DRAGON:** Star traveller. Will you help me save my brother, and the jungle with him? Climb on my back. I will fly you there.
- ❓ Fly to the WITHERED DEEP? **FLY! / NOT YET**
  - *[NOT YET]* **WHITE DRAGON:** Then rest and ready yourself. I will wait for you here. But please, do not be long.
  - *[Talking to him again]* **WHITE DRAGON:** Are you ready? The jungle has not long left. *(after a visit: My brother needs you. The jungle needs you. Hurry, star traveller!)*
- *[FLY!, the first time]* **CODY:** You go on. I'll catch you up. I just want to admire myself in the lagoon for a bit.
- *[The flight]* FLYING TO / THE WITHERED DEEP

### Talking to them afterwards

- *[Before the fight]* **CODY:** Shh. I am working on him. He WILL crack. Every Dragon King has his price.
- **CODY** *(in his shades)*, one of: These shades make everything look cooler. Even you. / Frost-glass. They never melt. A bit like me. / Go on. Tell me I look magnificent.
- **DRAGON KING:** My poor brother... Help him, star traveller. I would go myself, but my old bones creak so.
- *[After the Deep]* **DRAGON KING:** My brothers are safe, and that CAT has gone. My lagoon is quiet again. ...I almost miss him. ALMOST.
- *[The gong]* A great bronze gong in a red frame. You had better not touch it: the crab guards are watching. *(after: The great bronze gong still hums, very softly, if you put your ear close.)*
- *[The treasure]* A heap of gold and jewels. On top, glowing soft white and blue: your STAR CORE! → **DRAGON KING:** Paws OFF my pearl! *(after: A heap of gold and jewels. The DRAGON KING counts it every night, twice.)*

### Signs and things to look at

- THE JADE LAGOON / Palace of the DRAGON KING. Visitors: bow. Cats: GO AWAY.
- *[The water]* The lagoon is as clear as glass. Little goldfish dart about over the white sand.
- *[The palace walls]* The palace wall: red lacquer and gold. Somewhere inside, someone is shouting about a cat. *(after: The palace wall: red lacquer and gold, warm in the sun.)*

---

## 12. The Withered Deep

*The jungle beyond the Whisperwood, drained grey by the BLACK DRAGON. Dead vines block the way back to the
Whisperwood until he's beaten.*

### Arriving

- THE WITHERED DEEP. The jungle here is grey and silent. No birds. No wind. The leaves crumble to dust when you touch them.
- **[YOU]** *(mumbling)*: ...It's so quiet. Like the house was, after the war...
- Your father's chair by the fire. Empty. The clock ticking in the hall. You never got to say goodbye.
- ♥ MEMORY: AN EMPTY CHAIR
- *[NOVA]* [COMPANION] presses his big head into your hand and purrs, very softly. The quiet doesn't feel so heavy any more.
- *[Dragon]* [COMPANION] curls round your legs, warm as a little stove. The quiet doesn't feel so heavy any more.
- *[Octopus]* [COMPANION] wraps a cool, glowing tentacle round your hand. The quiet doesn't feel so heavy any more.
- **[YOU]:** ...Thanks, [COMPANION]. Come on. Let's bring some noise back to this place.
- **WHITE DRAGON:** My brother's lair is at the heart of the Deep, over the grey stream to the east. I will stay here and keep the way back open.
- **WHITE DRAGON:** If you are hurt, come back to me. My frost will soothe you.
- *[Talking to the WHITE DRAGON]* The WHITE DRAGON breathes a soft, cool frost over you. (HP and EN fully restored!)
- *[After]* **WHITE DRAGON:** Listen to that: birdsong! Thank you, star traveller. (The WHITE DRAGON breathes a cool frost over you: HP and EN fully restored!)

### The BLACK DRAGON's lair

- Coiled round the great dead tree is a BLACK DRAGON, wrapped in a shimmering sail of star-metal like a cloak.
- **BLACK DRAGON:** MORE... light... MORE...
- His eyes burn violet, just like the GHOULS beyond the veil.
- **BLACK DRAGON:** Little star... you shine so brightly... GIVE IT TO ME!
- Your eyes blaze green. Whatever has got into him came from the same dark place that took ENYA.
- **CODY:** Thought you could use a hand. And a staff. And some STYLE. *(in a puff of fur, in his shades)*
- **CODY:** Shall we?
- *[Battle: the BLACK DRAGON, Lv 16, with CODY fighting beside you]*
- A cloud of shadow pours out of the BLACK DRAGON and streams away through the trees, back towards the VEIL.
- His eyes clear to a warm, dark gold.
- **BLACK DRAGON:** ...What... what have I done? The jungle... all that life...
- **WHITE DRAGON:** BROTHER! *(swooping down)*
- **BLACK DRAGON:** It whispered to me from beyond the VEIL. It was so HUNGRY. I could not stop...
- The SOLAR SAIL slides from his back, and all the light he drank pours out of it at once...
- Colour floods back into the jungle! Leaves unfurl, flowers burst open, the stream runs clear and green...
- ...and somewhere, a bird begins to sing.
- Without even thinking, you whistle her little tune.
- A bird whistles it right back to you, note for note.
- **[YOU]** *(mumbling)*: ...After the war, the birds were the only thing that helped. Sitting so still in the garden while they came back, one by one...
- ♥ MEMORY: BIRDSONG
- You got the SOLAR SAIL! ([N] of 3)
- **BLACK DRAGON:** Thank you, little star. And forgive me. When you face whatever hides beyond the VEIL, call the DRAGON KINGS. We will come.
- **CODY:** Well. That was fun. Don't I look marvellous in the sunlight?
- **CODY:** One more GOLDEN CATNIP, kid. You've earned it.
- You got a GOLDEN CATNIP! Give it to your companion from your BAG (START, then BAG): one sniff and they grow a whole level!
- **[YOU]:** Cody... the war took so many years from me. I don't even know how many.
- **CODY:** Time's not robbed, kid. It's only borrowed for a while, by the wrong people. You'll get it back. Every minute. Usually when you least expect it.
- **CODY:** Now go and find that girl of yours. Staff... FLY!
- **WHITE DRAGON:** My brother is himself again, and the jungle sings. Let me fly you home, you and your little ship. It is the least I can do.
- *[Talking to the BLACK DRAGON afterwards]* **BLACK DRAGON:** The jungle sings again. I had forgotten how lovely it sounds. Thank you, little star.

### Things to look at

- *[The dead vines]* Grey, dead vines choke the path. They crumble at a touch... then creep right back. Something beyond them is drinking the life out of the jungle.
- *[The trees, while it's grey]* Grey, dead trees. The leaves crumble to dust when you touch them.
- *[The stream, while it's grey]* The stream is grey and still. Nothing moves in it at all.

---

## 13. The end of Chapter 2

- *[The flight]* FLYING TO / BLOOMHAVEN
- The WHITE DRAGON sets you down in BLOOMHAVEN, the COMET held gently in its claws, then bows and flies off into the clouds.
- **SPRIG:** Beep! Boop! You found them ALL! Bzzt!
- **SPRIG:** WARP COIL: installed. STAR CORE: installed. SOLAR SAIL: installed. ALL SIX PARTS!
- The COMET roars to life! It lifts off the ground and hovers there, humming, its hull shining like new.
- **SPRIG:** It can fly anywhere now. Anywhere at all. Maybe even... through the VEIL itself!
- In your pocket, the tiny spark of diamond light ENYA left you begins to glow. Warm. Brighter than ever.
- **ENYA:** ...You're getting closer. I can feel it. The GEM's light reaches a little further every day.
- **ENYA:** Do you remember the tennis ball? On Mr Nolan's roof?
- **[YOU]:** ...Every single time. He never once gave it back.
- **ENYA:** Ha! ...And that little tune you're always whistling? It's mine, you know. I used to hum it on the walk home.
- **[YOU]:** I know. I remember now.
- **ENYA:** Then come and find me. The real me. And bring that tune.
- **[YOU]:** I'm coming, Em. Hold on. Not long now.

### The CHAPTER 2 COMPLETE screen

- CHAPTER 2 / COMPLETE!
- [COMPANION] Lv [N] · MEMORIES [N]/15 · CAPTURED [N] · JEWELS [N] (◆[money]) · BATTLES [N] · TIME [play time]
- TO BE CONTINUED...
- PRESS A

---

## 14. Battles

### A battle starts

- *[The creature's own line (see [Creatures](#16-creatures)), for example]* A GLORP oozes out of the glowgrass!
- *[Against a GHOUL]* Your eyes flicker green at the sight of it. Your FURY rises!
- *[Against the BLACK DRAGON]* Those violet eyes... the same shadow as the ghouls! Your FURY rises!
- *[With Enya]* ENYA's echo and the EMERALD TIGER fight beside you!
- *[With CODY]* **CODY:** Right then. Staff, wake up. We have work to do.
- Go, [COMPANION]!

### Your turn: FIGHT, BAG, GUARD or RUN

- *[GUARD]* [COMPANION] braces for impact! (+3 EN)
- *[An item from the BAG]* You gave [COMPANION] a [ITEM]! → [COMPANION] feels great!
- *[RUN]* You got away safely! / Couldn't get away! / *[from a boss]* There's no running from this one!
- *[Moves]* But it missed! · Hit [N] times! · A critical hit! · [NAME]'s ATTACK, DEFENCE, SPEED or ACCURACY rose! / rose sharply! / fell! / fell sharply! / won't go any higher! / won't go any lower!
- *[Effects]* [NAME] is hurt by its burn! · [NAME]'s burn healed. · [NAME] is dazed and can’t move! · [NAME] is knocked off balance!
- *[Poison, from the Venom Mire's snakes]* [NAME] was poisoned! · [NAME] is hurt by poison! · [NAME] shook off the poison. *(PSN shows by its name)*
- *[DRAIN LIFE]* [NAME] drank in some of the life it took!
- *[Healing moves]* [NAME] feels much better! *(HEALING LICK: Tiger saliva heals fast! [COMPANION] feels much better!)*
- *[TIGER STEP]* [COMPANION] blinks away in a flash of light! → *[the next attack]* [COMPANION] is already gone in a flash of light! It missed!

### Enya's turn (while her echo is with you)

- **ENYA:** Hang in there, [COMPANION]! SHAMROCK CHEER! → [COMPANION] feels lucky! HP restored.
- ENYA used DIAMOND FLASH! The GEM at her throat blazes! → Its light shatters like a diamond in [FOE]'s eyes. [FOE] is dazed! *(or: [FOE] shut its eyes just in time!)*
  - *[The first DIAMOND FLASH you see]* **[YOU]** *(mumbling)*: That light... I know that light...
- The EMERALD TIGER pounces!

### CODY's turn (against the BLACK DRAGON)

*[His staff does what it's told, in turn: EXTEND (a long jab), FLY (it spins out and back, twice), BIG (seven
thousand kilos of staff, slammed down; it may leave the foe seeing stars).]*

- **CODY:** Staff... EXTEND! / **CODY:** Staff... FLY! / **CODY:** Staff... BIG! Seven thousand kilos, coming down!
- *[After BIG]* [FOE] is seeing stars!
- *[When your companion is low]* **CODY:** Chin up, [COMPANION]! Catch! → [COMPANION] munches a GLOWBERRY. HP restored!

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

## 15. Memories

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
| 10 | HER TUNE | The first time you whistle or hum without thinking | The little tune she always hummed on the walk home. You still whistle it without thinking. |
| 11 | SUMMER DAYS | The first dream on the COMET | Sitting on the warm kerb with her, sharing a bag of sweets and doing nothing at all. The best days of your life, and you never even knew it. |
| 12 | THE TENNIS BALL | The same dream, after Mr Nolan | Smacking an old tennis ball off the gable wall, squash-style. It always ended up on Mr Nolan's roof. He never once gave it back. |
| 13 | THE LOST YEARS | The dream on your first hop to the Jade Lagoon | How long did the war go on? Two years? Ten? The battles blur together, and the years went with them. Nobody can tell you how many. |
| 14 | AN EMPTY CHAIR | Arriving in the grey, silent Withered Deep | Home after the war. Your father's chair by the fire, empty. The clock ticking. You never got to say goodbye. |
| 15 | BIRDSONG | When the Deep's colour floods back | After the war, the only thing that helped: sitting very still in the garden while the birds came back, one by one. |

---

## 16. Creatures

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
| HISSLING | Venom Mire | A HISSLING slithers out of the reeds! Hsssss! | POISON FANG, HISS | A little striped snake. Its bite is poisonous, but it mostly wants to be left alone. |
| SPITVIPER | Venom Mire | A SPITVIPER rears up out of the ooze, hood flared wide! | VENOM SPIT, POISON FANG, COIL | A hooded viper that spits glowing venom. Luckily, its aim is terrible. |
| OOZEFANG | Venom Mire (boss, Lv 12) | OOZEFANG rises out of the ooze, the WARP COIL glinting in its coils! | VENOM BITE, OOZE WAVE, VENOM SPIT, COIL | *(can't be caught)* |
| DRAGON KING | Jade Lagoon (boss, Lv 14) | The DRAGON KING rises from his throne, scales flashing jade and gold! | JADE BREATH, TIDAL WAVE, DRAGON CLAW, KINGLY ROAR | *(can't be caught)* |
| WITHERWISP | Withered Deep | A WITHERWISP drifts out of the grey ferns, cold as ash... | DRAIN LIFE, WITHER | A wisp of life the Black Dragon drank. Inside a COSMIC TUBE, its colour comes back. |
| BLACK DRAGON | Withered Deep (boss, Lv 16) | The BLACK DRAGON uncoils from the dead tree, eyes burning violet! | SHADOW BREATH, DRAIN LIFE, DRAGON CLAW, GLOOM WAVE | *(can't be caught)* |

*[Once the Deep is healed, LUMOTHS, JADEHOPS, VINESNAPS and MOSSHELLS live there instead of WITHERWISPS and GHOULS.]*

---

## 17. Companions, moves and items

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
| NOVA | FIRE TIGER RING | *(taught by CODY in the Whisperwood)* | Taught by CODY: a ring of fire pulses out, stretches wide and engulfs the foe. May burn. |
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
| GOLDEN CATNIP | *(only from CODY)* | From CODY's secret stash. One sniff and your companion grows a whole level! *(used from the BAG, outside battle)* |

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
- WARP COIL: Wrapped in the coils of OOZEFANG, across the ooze in the VENOM MIRE.
- STAR CORE: Kept as a 'pearl' by the DRAGON KING, in his palace at the JADE LAGOON.
- SOLAR SAIL: Wrapped round the BLACK DRAGON, deep in the WITHERED DEEP.

*[In Chapter 2 the QUEST page shows all six, in two columns, with ??? for the Chapter 2 parts you haven't found.]*

---

## 18. Quest notes

Your goal, as it changes through the chapter (QUEST in the START menu):

1. Find out where you are.
2. Meet the guardians in the GROVE (north of the plaza) and choose a companion.
3. Cross the bridge (east) into the CRIMSON WILDS and find your three ship parts.
4. *[After the ALPHA]* Find the other ship parts: the NAV CORE (river island) and the THRUSTER (RUSTCLAW’s nest, south-east).
5. *[After another part]* Find the remaining ship parts.
6. *[All three]* Take the parts back to the COMET in Bloomhaven!
7. Chapter 1 complete! Talk to the COMET in BLOOMHAVEN: its scanner is looking for your last three parts.
8. Hop to the VENOM MIRE in the COMET and find the WARP COIL.
9. Find the WARP COIL: its signal is across the big river of ooze, to the east.
10. Cross the ooze on CODY's staff and find the WARP COIL.
11. Back to the COMET (west of the Mire) and hop to the JADE LAGOON. The STAR CORE is there... and so is CODY.
12. Cross the red bridge to the DRAGON KING's palace. The STAR CORE's signal is coming from inside.
13. *[If you say NOT YET to the WHITE DRAGON]* Talk to the WHITE DRAGON in the palace when you are ready to fly to the WITHERED DEEP.
14. Find the BLACK DRAGON's lair, over the grey stream to the east.
15. Chapter 2 complete! The COMET is whole again. Next: through the VEIL, to find the real ENYA... Chapter 3 is on its way.

---

## 19. Help and looking around

### Menus

- START menu: PARTY · BAG · TUBES · QUEST · SAVE · OPTIONS · CLOSE
- *[SAVE]* Your adventure has been saved on this device. *(or: Sorry, this browser won't let the game save (private browsing?).)*
- *[PARTY, Enya's card while her echo is with you]* From Tipperary. Lost beyond the veil, she reaches you as an echo through the GEM.
- *[PARTY, Enya's card after Chapter 1]* The ghouls pulled her back beyond the veil. She is waiting for you to find her.
- *[TUBES, a creature you haven't caught yet]* Not captured yet. Weaken one in battle, then open a COSMIC TUBE!
- *[QUEST, first page]* SHIP PARTS [N]/3 (or /6 in Chapter 2)  → MEMORIES, each part FOUND or ???, then NOW: and your goal (see [Quest notes](#18-quest-notes)).
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
