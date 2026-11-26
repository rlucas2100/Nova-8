# Cosmic Castaways

An original pixel-art adventure RPG that runs on the **NOVA-8**, a handheld console drawn in the browser
with HTML and CSS. It's played on the games page of my portfolio: https://www.ryanlucas.co.uk/games.php

Your homeworld is at war, and you come from a long line of warriors. You've had enough of fighting and set
off across the stars to find your long-lost love, until a meteor storm brings your star-skiff, the Comet,
down in Bloomhaven, a garden city on planet Kirra (red earth, purple skies, glowing green rivers). The crash
scrambles your memory: at first you can only mumble "Em... Gem...", and the story comes back in pieces.

Choose a companion (NOVA the tiger, EMBER or AZURE the dragon, or LUMI the glowing octopus), cross into the
Crimson Wilds, battle wild creatures and bring back your ship's three missing parts. Enya reaches you as an
echo from beyond the veil, through the Celestial Gem (her diamond necklace), with the Emerald Tiger; the Whisperwood
jungle hides the Veil Gate and its Light Keeper; and the jellyfolk of the Shroom Groove dance on mushroom
islands floating in a purple sky. This is Chapter 1.

- No image or audio files: every sprite, tile and prop is pixel art written in code, and the music and
  sound effects come from a small Web Audio "sound chip" (two pulse channels, a triangle and noise).
- Plain JavaScript, no libraries. Vite only bundles it into one script and one stylesheet.
- 160 x 144 screen, 60 updates a second, scaled up in whole pixels where it fits.
- Nine memories to win back (the story so far, kept in your QUEST notes), your eyes turning from violet to
  blazing green as your FURY builds in battle, NOVA's hearts and healing licks, and COSMIC TUBES that capture
  wild creatures in an infinity of light (eleven to collect).
- 22 original tunes (each area has two backing tracks that take turns, riding has its own, the music turns tense
  near the boss, and the Shroom Groove has a funk jam with a plucked bass line, while the boombox in the corner
  of the screen and the console's own speaker pump along to the beat), jingles that duck the music, and
  era-style effects: a cha-ching coin, hops, companion wiggles, creature cries, voice blips. An in-game SOUND
  TEST, and a soundboard for the page (`<div data-castaways-soundboard>`).
- Keyboard, touch (the console's own buttons) and gamepad. Saves to `localStorage` (older saves are upgraded).

## Controls

| Button | Keyboard |
| --- | --- |
| D-pad | W A S D or the arrow keys |
| A | Space, J, Z or Enter |
| B | K, X or Backspace (back; in the world: hop) |
| START (menu) | Esc or P |
| SELECT (ride your companion; on the naming screen, a random name) | Shift or Q |

Turn round to face your companion or Enya and press A to give them a fuss or have a talk.

## Working on it

```
npm install
npm run dev            # http://localhost:5173/ : the console on a test page
                       # /preview.html : every walking sprite   /maps.html?id=wilds : a whole map
                       # /maps.html?m=battle : the battle sprites
npm run build:site     # builds and copies dist/ into C:\Dev\websites\mysite\play
```

`build:site` empties `mysite/play` and writes `castaways.js` and `castaways.css` (listed with their sizes).
Upload that **play** folder to `/mysite/play` on the server, never this project folder.

The page embeds it with:

```html
<link rel="stylesheet" href="/play/castaways.css">
<div data-nova8></div>
<script type="module" src="/play/castaways.js"></script>
```

`<canvas data-castaways-sprite="tiger">` on the same page is filled with that character's pixel art
(names from `src/art/battlers.js`; comma-separated for several side by side). When Enya uses her
Diamond Flash, the console fires the portfolio's `matrix:burst` event, so the page's code rain flashes too.

### Tests (headless Chrome, `puppeteer-core` with the installed Chrome)

With `npm run dev` running (port 5199: `npx vite --port 5199`) or the site on `php -S localhost:8000`:

```
node tests/play.mjs  [url]                     # title, intro, naming, waking up
node tests/play2.mjs [url] tiger|octo|dragon [red|blue]   # the whole chapter, sped up
node tests/menus.mjs [url]                     # menus, shop, screen colours, each companion's moves
node tests/levels.mjs [url]                    # the thorns, the Whisperwood (a capture, the Veil Gate, FURY),
                                               # the Shroom Groove (the jelly ferry, the boombox, the dance)
node tests/site.mjs  [base]                    # the games page on desktop and phone
node tests/sound.mjs [base]                    # the grove, the companion chooser, hopping, the soundboard
```

Screenshots go to `tests/shots/` (ignored by git).

## Layout

```
src/main.js             mounts every [data-nova8] and draws the cast sprites
src/console/            the NOVA-8: shell.js (DOM, buttons, shells, fitting the screen), console.css, boot.js
src/engine/             pixel.js (sprites, painter, noise), font.js (bitmap font), input.js, audio.js, music.js
src/art/                chars.js (16x16 walking sprites), battlers.js (battle sprites), tiles.js (ground + props)
src/game/               game.js (scenes, loop, saves), world.js, battle.js, story.js, memory.js, scenes.js, maps.js, data.js, ui.js
```

## Author

Made by Ryan Lucas ([rlucas2100](https://github.com/rlucas2100)).
