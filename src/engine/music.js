/* The soundtrack: original tunes written for Cosmic Castaways, one token per step
   (an eighth note unless div says otherwise). "-" holds the note before, "." is a rest, "|" is
   only there to show the bars. Shorter tracks loop under longer ones.
   Drums: k kick, s snare, h hat, o open hat, c cymbal, . nothing. */

export const SONGS = {
  /* Title: a hopeful space theme. Am  F  C  G */
  title: {
    bpm: 108,
    tracks: [
      { wave: 'p0.25', vol: 0.17, vib: true, notes:
        'A4 - C5 - E5 - A5 - | G5 - F5 - E5 - C5 - | E5 - - - G5 - E5 - | D5 - - - - - . . | ' +
        'A4 - C5 - E5 - A5 - | C6 - B5 - A5 - F5 - | G5 - E5 - C5 - E5 - | D5 - B4 - E5 - - - ' },
      { wave: 'p0.125', vol: 0.06, notes:
        'A4 E5 C5 E5 A4 E5 C5 E5 | F4 C5 A4 C5 F4 C5 A4 C5 | E4 G4 C5 G4 E4 G4 C5 G4 | D4 G4 B4 G4 D4 G4 B4 G4 | ' +
        'A4 E5 C5 E5 A4 E5 C5 E5 | F4 C5 A4 C5 F4 C5 A4 C5 | E4 G4 C5 G4 E4 G4 C5 G4 | D4 G4 B4 G4 E4 G#4 B4 G#4 ' },
      { wave: 'triangle', vol: 0.3, notes:
        'A2 - - - A3 - - - | F2 - - - F3 - - - | C3 - - - C3 - - - | G2 - - - G3 - - - | ' +
        'A2 - - - A3 - - - | F2 - - - F3 - - - | C3 - - - C3 - - - | G2 - - - E2 - - - ' },
      { drums: 'k...s...k.k.s...', vol: 0.22 },
    ],
  },

  /* Bloomhaven, the garden city: easy and bright. C  Am  F  G */
  town: {
    bpm: 94,
    tracks: [
      { wave: 'p0.125', vol: 0.15, vib: true, notes:
        'E5 - G5 - C6 - B5 A5 | G5 - E5 - - - C5 D5 | E5 - F5 - A5 - G5 F5 | E5 - D5 - - - - - | ' +
        'E5 - G5 - C6 - D6 E6 | D6 - C6 - A5 - - - | A5 G5 F5 E5 D5 - F5 - | E5 - D5 - C5 - - - ' },
      { wave: 'p0.25', vol: 0.05, notes:
        '. G4 . G4 . G4 . G4 | . E4 . E4 . E4 . E4 | . A4 . A4 . A4 . A4 | . B4 . B4 . B4 . B4 ' },
      { wave: 'triangle', vol: 0.28, notes:
        'C3 - G3 - E3 - G3 - | A2 - E3 - C3 - E3 - | F2 - C3 - A2 - C3 - | G2 - D3 - B2 - D3 - ' },
      { drums: 'k.h.s.h.k.hhs.h.', vol: 0.12 },
    ],
  },

  /* The Crimson Wilds: an adventure. Dm  C  Bb  C ... */
  wilds: {
    bpm: 126,
    tracks: [
      { wave: 'p0.25', vol: 0.15, vib: true, notes:
        'D5 - - A4 D5 - E5 F5 | E5 - - C5 E5 - F5 G5 | F5 - E5 - D5 - C5 - | E5 - - - G4 - C5 - | ' +
        'D5 - - A4 D5 - E5 F5 | G5 - - E5 G5 - A5 Bb5 | A5 - G5 - F5 - E5 - | E5 - - - C#5 - - - | ' +
        'F5 - - - D5 - F5 - | G5 - - - E5 - G5 - | A5 - - - F5 - A5 - | E5 - - - C#5 - A4 - | ' +
        'F5 - D5 - Bb4 - D5 - | E5 - C5 - G4 - C5 - | D5 - F5 - A5 - D6 - | C#6 - - - A5 - - - ' },
      { wave: 'p0.125', vol: 0.05, notes:
        'F4 A4 D5 A4 F4 A4 D5 A4 | E4 G4 C5 G4 E4 G4 C5 G4 | D4 F4 Bb4 F4 D4 F4 Bb4 F4 | E4 G4 C5 G4 E4 G4 C5 G4 | ' +
        'F4 A4 D5 A4 F4 A4 D5 A4 | E4 G4 C5 G4 E4 G4 C5 G4 | D4 F4 Bb4 F4 D4 F4 Bb4 F4 | E4 A4 C#5 A4 E4 A4 C#5 A4 | ' +
        'D4 F4 Bb4 F4 D4 F4 Bb4 F4 | E4 G4 C5 G4 E4 G4 C5 G4 | F4 A4 D5 A4 F4 A4 D5 A4 | E4 A4 C#5 A4 E4 A4 C#5 A4 | ' +
        'D4 F4 Bb4 F4 D4 F4 Bb4 F4 | E4 G4 C5 G4 E4 G4 C5 G4 | F4 A4 D5 A4 F4 A4 D5 A4 | E4 A4 C#5 A4 E4 A4 C#5 A4 ' },
      { wave: 'triangle', vol: 0.3, notes:
        'D2 - D3 - D2 - D3 D2 | C2 - C3 - C2 - C3 C2 | Bb1 - Bb2 - Bb1 - Bb2 Bb1 | C2 - C3 - C2 - C3 C2 | ' +
        'D2 - D3 - D2 - D3 D2 | C2 - C3 - C2 - C3 C2 | Bb1 - Bb2 - Bb1 - Bb2 Bb1 | A1 - A2 - A1 - A2 A1 | ' +
        'Bb1 - Bb2 - Bb1 - Bb2 Bb1 | C2 - C3 - C2 - C3 C2 | D2 - D3 - D2 - D3 D2 | A1 - A2 - A1 - A2 A1 | ' +
        'Bb1 - Bb2 - Bb1 - Bb2 Bb1 | C2 - C3 - C2 - C3 C2 | D2 - D3 - D2 - D3 D2 | A1 - A2 - A1 - A2 A1 ' },
      { drums: 'k.h.s.hkk.h.s.h.', vol: 0.16 },
    ],
  },

  /* Wild battle: fast and driving. Em  C  D  B */
  battle: {
    bpm: 150,
    tracks: [
      { wave: 'p0.25', vol: 0.15, notes:
        'E5 - B4 - E5 F#5 G5 - | E5 - C5 - E5 F#5 G5 A5 | F#5 - D5 - F#5 G5 A5 - | B5 - A5 G5 F#5 - D#5 - | ' +
        'E5 - G5 - B5 - A5 G5 | E5 - - - C5 D5 E5 - | D5 - F#5 - A5 - G5 F#5 | B4 - - - D#5 - F#5 - ' },
      { wave: 'p0.125', vol: 0.05, notes:
        'E4 G4 B4 G4 E4 G4 B4 G4 | E4 G4 C5 G4 E4 G4 C5 G4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4 | D#4 F#4 B4 F#4 D#4 F#4 B4 F#4 ' },
      { wave: 'triangle', vol: 0.32, notes:
        'E2 E3 E2 E3 E2 E3 E2 E3 | C2 C3 C2 C3 C2 C3 C2 C3 | D2 D3 D2 D3 D2 D3 D2 D3 | B1 B2 B1 B2 B1 B2 B1 B2 ' },
      { drums: 'k.hsk.hsk.hskkhs', vol: 0.18 },
    ],
  },

  /* Boss: Rustclaw. Cm  Ab  Bb  G */
  boss: {
    bpm: 138,
    tracks: [
      { wave: 'p0.5', vol: 0.12, notes:
        'C5 - Eb5 - G5 - - C6 | Bb5 - Ab5 - G5 - Eb5 - | F5 - D5 - Bb4 - D5 F5 | G5 - - - B4 - D5 - | ' +
        'C6 - B5 - C6 - G5 - | Ab5 - G5 - F5 - Eb5 - | D5 - F5 - Bb5 - Ab5 - | G5 - F5 - D5 - B4 - ' },
      { wave: 'p0.125', vol: 0.06, notes:
        'C4 Eb4 G4 C5 G4 Eb4 C4 Eb4 | Ab3 C4 Eb4 Ab4 Eb4 C4 Ab3 C4 | Bb3 D4 F4 Bb4 F4 D4 Bb3 D4 | G3 B3 D4 G4 D4 B3 G3 B3 ' },
      { wave: 'triangle', vol: 0.34, notes:
        'C2 C2 C3 C2 C2 C2 Eb2 G2 | Ab1 Ab1 Ab2 Ab1 Ab1 Ab1 C2 Eb2 | Bb1 Bb1 Bb2 Bb1 Bb1 Bb1 D2 F2 | G1 G1 G2 G1 G1 G1 B1 D2 ' },
      { drums: 'k.skk.s.k.skkss.', vol: 0.2 },
    ],
  },

  /* Enya's theme: a quick jig (6/8), for the girl from Tipperary. D */
  enya: {
    bpm: 112, div: 3,
    tracks: [
      { wave: 'p0.25', vol: 0.15, notes:
        'D5 E5 F#5 A5 - F#5 | G5 - E5 F#5 - D5 | E5 F#5 E5 D5 B4 A4 | D5 - - D5 - - | ' +
        'A5 B5 A5 F#5 - D5 | G5 - B5 A5 - F#5 | E5 F#5 G5 F#5 E5 D5 | D5 - - - - - ' },
      { wave: 'p0.125', vol: 0.05, notes: 'F#4 A4 D5 A4 F#4 A4 | G4 B4 D5 B4 G4 B4 | E4 G4 B4 A4 C#5 A4 | F#4 A4 D5 A4 F#4 A4 ' },
      { wave: 'triangle', vol: 0.28, notes: 'D3 - - A2 - - | G2 - - D3 - - | A2 - - E3 - - | D3 - - A2 - - ' },
      { drums: 'k..s..k.ks..', vol: 0.15 },
    ],
  },

  /* The crash: slow and uneasy. */
  intro: {
    bpm: 76,
    tracks: [
      { wave: 'p0.5', vol: 0.09, vib: true, notes: 'E5 - - - - - - - | D5 - - - C5 - - - | B4 - - - - - - - | C5 - - - - - B4 - ' },
      { wave: 'p0.125', vol: 0.05, notes: 'A4 C5 E5 C5 A4 C5 E5 C5 | F4 A4 C5 A4 F4 A4 C5 A4 | G4 B4 D5 B4 G4 B4 D5 B4 | E4 G#4 B4 G#4 E4 G#4 B4 G#4 ' },
      { wave: 'triangle', vol: 0.3, notes: 'A2 - - - - - - - | F2 - - - - - - - | G2 - - - - - - - | E2 - - - - - - - ' },
    ],
  },

  /* A short win jingle, then back to the area's tune */
  victory: {
    bpm: 150, loop: false,
    tracks: [
      { wave: 'p0.25', vol: 0.18, notes: 'G4 C5 E5 G5 - - E5 G5 | C6 - - - - - . . ' },
      { wave: 'p0.125', vol: 0.08, notes: 'E4 G4 C5 E5 - - C5 E5 | G5 - - - - - . . ' },
      { wave: 'triangle', vol: 0.3, notes: 'C3 - - - G2 - - - | C3 - - - - - . . ' },
    ],
  },

  /* Chapter complete */
  chapter: {
    bpm: 100,
    tracks: [
      { wave: 'p0.25', vol: 0.16, vib: true, notes:
        'C5 - E5 - G5 - C6 - | B5 - G5 - E5 - G5 - | A5 - F5 - C5 - F5 - | G5 - - - - - . . | ' +
        'C5 - E5 - G5 - C6 - | D6 - B5 - G5 - B5 - | C6 - A5 - F5 - G5 - | C6 - - - - - . . ' },
      { wave: 'p0.125', vol: 0.06, notes: 'E4 G4 C5 G4 E4 G4 C5 G4 | D4 G4 B4 G4 D4 G4 B4 G4 | C4 F4 A4 F4 C4 F4 A4 F4 | D4 G4 B4 G4 D4 G4 B4 G4 ' },
      { wave: 'triangle', vol: 0.3, notes: 'C3 - - - G2 - - - | G2 - - - D3 - - - | F2 - - - C3 - - - | G2 - - - G2 - - - ' },
      { drums: 'k...s...k.k.s..h', vol: 0.15 },
    ],
  },

  /* Bloomhaven, second tune: the evening shuffle. F  Dm  Bb  C */
  town2: {
    bpm: 98,
    tracks: [
      { wave: 'p0.25', vol: 0.14, vib: true, notes:
        'A5 - C6 - A5 G5 F5 - | D5 - F5 - A5 - - - | Bb5 - A5 - G5 - F5 D5 | E5 - - - C5 - - - | ' +
        'A5 - C6 - D6 C6 A5 - | F5 - A5 - D6 - - - | D6 C6 Bb5 A5 G5 - E5 - | F5 - - - - - . . ' },
      { wave: 'p0.125', vol: 0.05, notes: 'F4 A4 C5 A4 F4 A4 C5 A4 | D4 F4 A4 F4 D4 F4 A4 F4 | Bb3 D4 F4 D4 Bb3 D4 F4 D4 | C4 E4 G4 E4 C4 E4 G4 E4 ' },
      { wave: 'triangle', vol: 0.28, notes: 'F2 - C3 - A2 - C3 - | D2 - A2 - F2 - A2 - | Bb1 - F2 - D2 - F2 - | C2 - G2 - E2 - G2 - ' },
      { drums: 'k..hs.h.k.hhs.h.', vol: 0.11 },
    ],
  },

  /* The Crimson Wilds, second tune: a gallop. Am  F  G  E */
  wilds2: {
    bpm: 132,
    tracks: [
      { wave: 'p0.25', vol: 0.14, vib: true, notes:
        'A4 - E5 - A5 - G5 E5 | F5 - - E5 D5 - C5 - | D5 - G5 - B5 - A5 G5 | G#5 - - - E5 - - - | ' +
        'C6 - B5 - A5 - E5 - | F5 - A5 - C6 - A5 - | B5 - A5 - G5 - D5 - | E5 - G#5 - B5 - E6 - ' },
      { wave: 'p0.125', vol: 0.05, notes: 'A4 C5 E5 C5 A4 C5 E5 C5 | F4 A4 C5 A4 F4 A4 C5 A4 | G4 B4 D5 B4 G4 B4 D5 B4 | E4 G#4 B4 G#4 E4 G#4 B4 G#4 ' },
      { wave: 'triangle', vol: 0.3, notes: 'A2 A2 A3 A2 A2 A2 A3 A2 | F2 F2 F3 F2 F2 F2 F3 F2 | G2 G2 G3 G2 G2 G2 G3 G2 | E2 E2 E3 E2 E2 E2 E3 E2 ' },
      { drums: 'k.hkk.hsk.hkk.hs', vol: 0.15 },
    ],
  },

  /* Riding your companion: bouncy and quick. C  F  G  C */
  ride: {
    bpm: 150,
    tracks: [
      { wave: 'p0.25', vol: 0.14, notes:
        'G5 E5 G5 C6 - B5 A5 G5 | A5 - F5 - C5 D5 E5 F5 | G5 - D5 - B4 C5 D5 E5 | E5 - C5 - G4 - - - | ' +
        'G5 E5 G5 C6 - D6 E6 C6 | A5 - C6 - F6 E6 D6 C6 | B5 - G5 - D6 C6 B5 A5 | C6 - - - G5 - C6 - ' },
      { wave: 'p0.125', vol: 0.05, notes: '. E5 . G5 . E5 . G5 | . F5 . A5 . F5 . A5 | . D5 . G5 . D5 . G5 | . E5 . G5 . E5 . G5 ' },
      { wave: 'triangle', vol: 0.3, notes: 'C3 . G2 . C3 . G2 . | F2 . C3 . F2 . C3 . | G2 . D3 . G2 . D3 . | C3 . G2 . C3 . E3 . ' },
      { drums: 'k.hsk.hsk.osk.hs', vol: 0.16 },
    ],
  },

  /* A second battle tune. Gm  Eb  F  D */
  battle2: {
    bpm: 156,
    tracks: [
      { wave: 'p0.25', vol: 0.15, notes:
        'G5 - D5 - G5 A5 Bb5 - | G5 - Eb5 - G5 A5 Bb5 C6 | A5 - F5 - A5 Bb5 C6 - | D6 - C6 Bb5 A5 - F#5 - | ' +
        'Bb5 - A5 G5 D5 - G5 - | Eb6 - D6 C6 Bb5 - G5 - | F5 - A5 - C6 - A5 F5 | D5 - F#5 - A5 - D6 - ' },
      { wave: 'p0.125', vol: 0.05, notes: 'G4 Bb4 D5 Bb4 G4 Bb4 D5 Bb4 | Eb4 G4 Bb4 G4 Eb4 G4 Bb4 G4 | F4 A4 C5 A4 F4 A4 C5 A4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4 ' },
      { wave: 'triangle', vol: 0.32, notes: 'G1 G2 G1 G2 G1 G2 G1 G2 | Eb2 Eb3 Eb2 Eb3 Eb2 Eb3 Eb2 Eb3 | F2 F3 F2 F3 F2 F3 F2 F3 | D2 D3 D2 D3 D2 D3 D2 D3 ' },
      { drums: 'k.skk.sok.skkkss', vol: 0.18 },
    ],
  },

  /* Getting close to Rustclaw's nest: a heartbeat */
  nest: {
    bpm: 92,
    tracks: [
      { wave: 'p0.5', vol: 0.09, vib: true, notes: 'E5 - - - F5 - - - | E5 - - - D#5 - - - | E5 - G5 - F#5 - D#5 - | E5 - - - - - . . ' },
      { wave: 'p0.125', vol: 0.045, notes: 'B3 C4 B3 C4 B3 C4 B3 C4 | B3 C4 B3 C4 A3 B3 A3 B3 | G3 B3 E4 B3 F#3 A3 D#4 A3 | B3 C4 B3 C4 B3 C4 B3 C4 ' },
      { wave: 'triangle', vol: 0.32, notes: 'E2 - E2 - E2 - F2 - | E2 - E2 - E2 - D#2 - | E2 - E2 - B1 - B1 - | E2 - E2 - E2 - F2 - ' },
      { drums: 'k..k....k..k..s.', vol: 0.2 },
    ],
  },

  /* Choosing your companion: a little sparkle tune. D  G  Em  A */
  select: {
    bpm: 104,
    tracks: [
      { wave: 'p0.125', vol: 0.15, vib: true, notes:
        'F#5 - A5 - D6 - A5 - | B5 - G5 - D5 - G5 - | E5 - G5 - B5 - G5 - | C#6 - - - A5 - - - | ' +
        'D6 - C#6 - B5 - A5 - | G5 - B5 - D6 - B5 - | A5 - E5 - C#5 - E5 - | D5 - - - - - . . ' },
      { wave: 'p0.25', vol: 0.04, notes: 'D6 A5 F#5 A5 D6 A5 F#5 A5 | D6 B5 G5 B5 D6 B5 G5 B5 | E6 B5 G5 B5 E6 B5 G5 B5 | E6 C#6 A5 C#6 E6 C#6 A5 C#6 ' },
      { wave: 'triangle', vol: 0.26, notes: 'D3 - - - A2 - - - | G2 - - - D3 - - - | E2 - - - B2 - - - | A2 - - - E3 - - - ' },
      { drums: 'k.......s.......', vol: 0.08 },
    ],
  },

  /* The Whisperwood: mysterious, with tom-tom drums. Am  G  F  E */
  jungle: {
    bpm: 100,
    tracks: [
      { wave: 'p0.125', vol: 0.14, vib: true, notes:
        'A4 - C5 - D5 - E5 - | G5 - E5 - D5 - C5 D5 | E5 - - - A4 - - - | . . C5 D5 E5 - G5 - | ' +
        'A5 - G5 - E5 - D5 - | C5 - D5 - E5 - G5 - | A5 - - - G5 E5 D5 C5 | D5 - - - - - . . ' },
      { wave: 'p0.25', vol: 0.04, notes: 'A3 E4 A4 E4 C4 E4 A4 E4 | G3 D4 G4 D4 B3 D4 G4 D4 | F3 C4 F4 C4 A3 C4 F4 C4 | E3 B3 E4 B3 G#3 B3 E4 B3 ' },
      { wave: 'triangle', vol: 0.3, notes: 'A2 - . A2 . . A2 . | G2 - . G2 . . G2 . | F2 - . F2 . . F2 . | E2 - . E2 . . E2 B1 ' },
      { drums: 'k..k..s.k.k.s..h', vol: 0.15 },
    ],
  },

  /* The Whisperwood, second tune: following the stream. Dm  C  F  A ... */
  jungle2: {
    bpm: 108,
    tracks: [
      { wave: 'p0.25', vol: 0.13, vib: true, notes:
        'D5 - F5 - A5 - G5 F5 | E5 - C5 - D5 - - - | F5 - A5 - C6 - A5 G5 | A5 - - - - - . . | ' +
        'Bb5 - A5 - G5 - F5 - | G5 - F5 - E5 - C5 - | D5 - E5 - F5 - E5 C5 | D5 - - - - - . . ' },
      { wave: 'p0.125', vol: 0.045, notes:
        'D4 A4 D5 A4 D4 A4 D5 A4 | C4 G4 C5 G4 C4 G4 C5 G4 | F4 C5 F5 C5 F4 C5 F5 C5 | A3 E4 A4 E4 A3 E4 A4 E4 | ' +
        'Bb3 F4 Bb4 F4 Bb3 F4 Bb4 F4 | C4 G4 C5 G4 C4 G4 C5 G4 | D4 A4 D5 A4 D4 A4 D5 A4 | D4 A4 D5 A4 D4 A4 D5 A4 ' },
      { wave: 'triangle', vol: 0.3, notes:
        'D2 - D3 - D2 - D3 - | C2 - C3 - C2 - C3 - | F2 - F3 - F2 - F3 - | A1 - A2 - A1 - A2 - | ' +
        'Bb1 - Bb2 - Bb1 - Bb2 - | C2 - C3 - C2 - C3 - | D2 - D3 - D2 - D3 - | D2 - D3 - D2 - A1 - ' },
      { drums: 'k.h.s.hkk.h.s.hh', vol: 0.13 },
    ],
  },

  /* The Jelly Jam: a funk jam in sixteenths. The bass guitar (a plucked pulse over the triangle)
     bops along under offbeat chord stabs. Em7  Em7  A7  B7 */
  groove: {
    bpm: 104, div: 4,
    tracks: [
      { wave: 'p0.25', vol: 0.13, vib: true, notes:
        '. . E5 . G5 . E5 . D5 . B4 . . . . . | . . E5 . G5 . A5 . B5 . A5 . G5 . E5 . | ' +
        '. . C#5 . E5 . C#5 . B4 . A4 . . . . . | D#5 - - . F#5 - - . A5 - - . B5 - - - | ' +
        'E6 - . . D6 . B5 . . . A5 . B5 - . . | G5 . A5 . B5 - . . D6 . B5 . A5 . G5 . | ' +
        'A5 - . . C#6 - . . E6 . C#6 . A5 - . . | B5 . A5 . F#5 . D#5 . B4 - - - . . . . ' },
      { wave: 'p0.125', vol: 0.05, sus: 0.3, notes:
        '. . B4 . . . G4 . . . B4 . . . D5 . | . . B4 . . . G4 . . . B4 . . . D5 . | ' +
        '. . C#5 . . . A4 . . . C#5 . . . E5 . | . . D#5 . . . B4 . . . D#5 . . . F#5 . ' },
      { wave: 'triangle', vol: 0.34, notes:
        'E2 . E3 . . . E2 . . E2 G2 . A2 . B2 . | E2 . E3 . . . E2 . D3 . B2 . G2 . A2 . | ' +
        'A1 . A2 . . . A1 . . A1 C#2 . E2 . G2 . | B1 . B2 . . . B1 . D#2 . F#2 . A2 . B2 . ' },
      { wave: 'p0.25', vol: 0.07, oct: 1, sus: 0.22, gate: 0.7, notes:
        'E2 . E3 . . . E2 . . E2 G2 . A2 . B2 . | E2 . E3 . . . E2 . D3 . B2 . G2 . A2 . | ' +
        'A1 . A2 . . . A1 . . A1 C#2 . E2 . G2 . | B1 . B2 . . . B1 . D#2 . F#2 . A2 . B2 . ' },
      { drums: 'k.hhs.hkk.hhs.oh | k.hhs.hkk.hhs.oh | k.hhs.hkk.hhs.oh | k.hhs.hkk.ssk.sc', vol: 0.2 },
    ],
  },

  /* The Jelly Jam, second tune: the jellies' jam, with a slap-bass breakdown. Em  Bm  C  B */
  groove2: {
    bpm: 104, div: 4,
    tracks: [
      { wave: 'p0.25', vol: 0.13, vib: true, notes:
        'B5 - . . . . G5 . E5 - . . . . . . | F#5 - . . D5 . . . B4 . D5 . F#5 - . . | ' +
        'G5 - . . E5 . . . C5 . E5 . G5 . C6 . | B5 - - - A5 . . . F#5 . . . D#5 . . . ' },
      { wave: 'p0.125', vol: 0.05, sus: 0.3, notes:
        '. . G4 . . . B4 . . . G4 . . . B4 . | . . F#4 . . . D5 . . . B4 . . . F#4 . | ' +
        '. . G4 . . . C5 . . . E5 . . . C5 . | . . D#5 . . . F#5 . . . B4 . . . D#5 . ' },
      { wave: 'triangle', vol: 0.34, notes:
        'E2 E3 . E2 . E3 E2 . G2 . G3 . A2 . A3 . | B2 . B1 . D3 . B2 . A2 . G2 . E2 . D2 . | ' +
        'C2 C3 . C2 . C3 C2 . D2 . D3 . E2 . E3 . | B1 . . B2 . . B1 . D#2 . F#2 . B2 . D#3 . ' },
      { wave: 'p0.25', vol: 0.075, oct: 1, sus: 0.2, gate: 0.6, notes:
        'E2 E3 . E2 . E3 E2 . G2 . G3 . A2 . A3 . | B2 . B1 . D3 . B2 . A2 . G2 . E2 . D2 . | ' +
        'C2 C3 . C2 . C3 C2 . D2 . D3 . E2 . E3 . | B1 . . B2 . . B1 . D#2 . F#2 . B2 . D#3 . ' },
      { drums: 'k.h.s.hkk.h.skoh | k.h.s.hkk.h.skoh | k.h.s.hkk.h.skoh | k.h.s.hkk.ssk.sc', vol: 0.2 },
    ],
  },

  /* Beyond the veil: visions of the other side. Fmaj7  Dm7  Bbmaj7  Cmaj7 */
  vision: {
    bpm: 66,
    tracks: [
      { wave: 'p0.125', vol: 0.12, vib: true, notes: 'C6 - - - B5 - G5 - | A5 - - - - - E5 - | F5 - G5 - A5 - C6 - | B5 - - - - - . . ' },
      { wave: 'p0.5', vol: 0.035, notes: 'F4 A4 C5 E5 F4 A4 C5 E5 | D4 F4 A4 C5 D4 F4 A4 C5 | Bb3 D4 F4 A4 Bb3 D4 F4 A4 | C4 E4 G4 B4 C4 E4 G4 B4 ' },
      { wave: 'triangle', vol: 0.26, notes: 'F2 - - - - - - - | D2 - - - - - - - | Bb1 - - - - - - - | C2 - - - - - - - ' },
    ],
  },

  /* Ghouls from beyond the veil: eerie and driving. C#m  A  F#m  G#(b5) */
  ghoul: {
    bpm: 132,
    tracks: [
      { wave: 'p0.5', vol: 0.11, notes: 'C#5 - D5 - C#5 - G#4 - | A4 - G#4 - F#4 - E4 - | C#5 - E5 - G#5 - A5 - | G#5 - - - D5 - - - ' },
      { wave: 'p0.125', vol: 0.05, notes: 'C#4 G#4 C#5 G#4 C#4 G#4 C#5 G#4 | A3 E4 A4 E4 A3 E4 A4 E4 | F#3 C#4 F#4 C#4 F#3 C#4 F#4 C#4 | G#3 D4 G#4 D4 G#3 D4 G#4 D4 ' },
      { wave: 'triangle', vol: 0.32, notes: 'C#2 C#2 C#3 C#2 C#2 C#2 D2 C#2 | A1 A1 A2 A1 A1 A1 B1 A1 | F#1 F#1 F#2 F#1 F#1 F#1 G#1 F#1 | G#1 G#1 G#2 G#1 D2 D2 D3 D2 ' },
      { drums: 'k.sk.ksk.sk.kss.', vol: 0.19 },
    ],
  },

  /* ===== Chapter 2 ===== */

  /* The Venom Mire: a slow swamp shuffle, the bass squelching along. Em blues */
  mire: {
    bpm: 80,
    tracks: [
      { wave: 'p0.25', vol: 0.13, vib: true, notes:
        'E4 - G4 - A4 Bb4 A4 G4 | E4 - - - D4 - E4 - | G4 - A4 - B4 - D5 B4 | A4 - G4 - E4 - - - | ' +
        'B4 - - D5 E5 - D5 B4 | A4 - G4 A4 Bb4 - A4 - | G4 - E4 - D4 - G4 - | E4 - - - - - . . ' },
      { wave: 'p0.125', vol: 0.045, notes: '. . E6 . . . B5 . | . . . G5 . . . . | . . D6 . . B5 . . | . . . . E6 . . . ' },
      { wave: 'triangle', vol: 0.32, notes:
        'E2 - E2 G2 A2 - Bb2 B2 | E2 - E2 G2 A2 - G2 E2 | A2 - A2 C3 D3 - C3 A2 | E2 - E2 G2 B2 - A2 G2 | ' +
        'B1 - B1 D2 E2 - D2 B1 | A1 - A1 C2 E2 - D2 C2 | G1 - G1 B1 D2 - B1 G1 | E2 - B1 - E2 - - - ' },
      { drums: 'k..hs..hk.k.s..h', vol: 0.13 },
    ],
  },

  /* The Jade Lagoon: calm, clear water and a palace of jade. D major pentatonic */
  lagoon: {
    bpm: 92,
    tracks: [
      { wave: 'p0.125', vol: 0.14, vib: true, notes:
        'A5 - B5 - D6 - B5 A5 | F#5 - - - E5 - D5 - | E5 - F#5 - A5 - F#5 E5 | D5 - - - - - . . | ' +
        'B5 - A5 - F#5 - A5 B5 | D6 - - - B5 - A5 - | F#5 - E5 - D5 - E5 F#5 | D5 - - - - - . . ' },
      { wave: 'p0.25', vol: 0.045, notes: 'D5 F#5 A5 F#5 D5 F#5 A5 F#5 | B4 D5 F#5 D5 B4 D5 F#5 D5 | G4 B4 D5 B4 G4 B4 D5 B4 | A4 C#5 E5 C#5 A4 C#5 E5 C#5 ' },
      { wave: 'triangle', vol: 0.28, notes: 'D3 - A2 - D3 - A2 - | B2 - F#2 - B2 - F#2 - | G2 - D3 - G2 - D3 - | A2 - E3 - A2 - E3 - ' },
      { drums: 'k...h...s...h.h.', vol: 0.1 },
    ],
  },

  /* The Dragon Kings: a mighty battle. E minor pentatonic, with a crash of cymbals */
  dragon: {
    bpm: 146,
    tracks: [
      { wave: 'p0.25', vol: 0.15, notes:
        'E5 - G5 A5 B5 - A5 G5 | E5 - - D5 E5 - G5 - | A5 - B5 D6 E6 - D6 B5 | A5 - G5 - E5 - D5 - | ' +
        'E5 G5 A5 - B5 - D6 - | E6 - D6 B5 A5 - G5 - | A5 - G5 E5 D5 - E5 - | E5 - - - B4 - D5 - ' },
      { wave: 'p0.125', vol: 0.05, notes: 'E4 B4 E5 B4 E4 B4 E5 B4 | C4 G4 C5 G4 C4 G4 C5 G4 | D4 A4 D5 A4 D4 A4 D5 A4 | B3 F#4 B4 F#4 B3 F#4 B4 F#4 ' },
      { wave: 'triangle', vol: 0.34, notes: 'E2 E2 E3 E2 E2 E2 G2 A2 | C2 C2 C3 C2 C2 C2 D2 E2 | D2 D2 D3 D2 D2 D2 E2 F#2 | B1 B1 B2 B1 D2 D2 D3 D2 ' },
      { drums: 'c.skk.s.k.skkss. | k.skk.s.k.skkss. | c.skk.s.k.skkss. | k.skk.s.k.sksscs', vol: 0.19 },
    ],
  },

  /* The Withered Deep: grey and silent. A few lonely notes, and a slow heartbeat. Am */
  deep: {
    bpm: 66,
    tracks: [
      { wave: 'p0.5', vol: 0.085, vib: true, notes: 'A4 - - - - - C5 - | B4 - - - F4 - - - | A4 - - - E5 - D5 - | C5 - - - B4 - - - ' },
      { wave: 'p0.125', vol: 0.035, notes: 'A3 E4 A4 E4 A3 E4 A4 E4 | F3 C4 F4 C4 F3 C4 F4 C4 | D3 A3 D4 A3 D3 A3 D4 A3 | E3 B3 E4 B3 G#3 B3 E4 B3 ' },
      { wave: 'triangle', vol: 0.26, notes: 'A2 - - - - - - - | F2 - - - - - - - | D2 - - - - - - - | E2 - - - - - - - ' },
      { drums: 'k..k............', vol: 0.14 },
    ],
  },

  /* CODY's theme: a cheeky little swing, for a wise old cat who knows it. F */
  cody: {
    bpm: 132, div: 3,
    tracks: [
      { wave: 'p0.25', vol: 0.15, notes:
        'F5 - A5 C6 - A5 | Bb5 - G5 E5 - C5 | F5 - A5 C6 - D6 | C6 - - - - - | ' +
        'A5 - C6 Bb5 - G5 | A5 - F5 G5 - E5 | F5 - D5 C5 - A4 | C5 - - F5 - - ' },
      { wave: 'p0.125', vol: 0.05, notes: '. A4 C5 . A4 C5 | . Bb4 D5 . Bb4 D5 | . A4 C5 . A4 C5 | . G4 Bb4 . G4 Bb4 ' },
      { wave: 'triangle', vol: 0.3, notes: 'F2 - - A2 - - | Bb2 - - C3 - - | F2 - - A2 - - | C3 - - E2 - - | D2 - - F2 - - | G2 - - Bb2 - - | C3 - - C2 - - | F2 - - C3 - - ' },
      { drums: 'k..h.sk.hh.s', vol: 0.13 },
    ],
  },

  /* A dream on the COMET: her tune, played like a music box. G  Em  C  D */
  dream: {
    bpm: 84,
    tracks: [
      { wave: 'p0.125', vol: 0.14, vib: true, notes:
        'B5 - D6 E6 D6 - B5 A5 | G5 - A5 B5 D6 - - - | E6 - D6 B5 A5 - G5 A5 | B5 - - - - - . . | ' +
        'C6 - B5 A5 G5 - E5 G5 | A5 - G5 E5 D5 - - - | E5 - G5 A5 B5 - D6 B5 | G5 - - - - - . . ' },
      { wave: 'p0.25', vol: 0.04, notes: 'G4 B4 D5 B4 G4 B4 D5 B4 | E4 G4 B4 G4 E4 G4 B4 G4 | C4 E4 G4 E4 C4 E4 G4 E4 | D4 F#4 A4 F#4 D4 F#4 A4 F#4 ' },
      { wave: 'triangle', vol: 0.26, notes: 'G2 - - - D3 - - - | E2 - - - B2 - - - | C3 - - - G2 - - - | D3 - - - A2 - - - ' },
    ],
  },

  /* Mossa's shop */
  shop: {
    bpm: 112,
    tracks: [
      { wave: 'p0.25', vol: 0.14, notes: 'D5 - F5 - Bb5 - A5 G5 | F5 - D5 - - - C5 - | Eb5 - G5 - C6 - Bb5 A5 | G5 - - - F5 - - - ' },
      { wave: 'p0.125', vol: 0.05, notes: '. D5 . F5 . D5 . F5 | . D5 . F5 . D5 . F5 | . Eb5 . G5 . Eb5 . G5 | . C5 . F5 . C5 . F5 ' },
      { wave: 'triangle', vol: 0.28, notes: 'Bb2 - F2 - Bb2 - F2 - | Bb2 - F2 - Bb2 - F2 - | Eb2 - Bb2 - Eb2 - Bb2 - | F2 - C3 - F2 - C3 - ' },
      { drums: 'k.h.s.hkk.h.s.h.', vol: 0.12 },
    ],
  },
};

/* an area's backing tracks, played in turn (each a couple of times) */
export const PLAYLISTS = {
  'pl:town': ['town', 'town2'],
  'pl:wilds': ['wilds', 'wilds2'],
  'pl:jungle': ['jungle', 'jungle2'],
  'pl:groove': ['groove', 'groove2'],
};

/* short fanfares played over the music */
export const JINGLES = {
  itemget: {
    bpm: 150,
    tracks: [
      { wave: 'p0.25', vol: 0.2, notes: 'C5 E5 G5 C6 - - E6 - | G6 - - - - - . . ' },
      { wave: 'p0.125', vol: 0.09, notes: 'E4 G4 C5 E5 - - G5 - | C6 - - - - - . . ' },
      { wave: 'triangle', vol: 0.3, notes: 'C3 - - - G2 - - - | C3 - - - - - . . ' },
    ],
  },
  joined: {
    bpm: 140,
    tracks: [
      { wave: 'p0.25', vol: 0.2, notes: 'G5 A5 B5 D6 - B5 D6 G6 | - - - - . . . . ' },
      { wave: 'p0.125', vol: 0.08, notes: 'D5 F#5 G5 B5 - G5 B5 D6 | - - - - . . . . ' },
      { wave: 'triangle', vol: 0.3, notes: 'G2 - - - D3 - G2 - | - - - - . . . . ' },
    ],
  },
  levelup: {
    bpm: 180,
    tracks: [
      { wave: 'p0.25', vol: 0.2, notes: 'C5 C5 C5 G5 - E5 G5 C6 - - - - ' },
      { wave: 'p0.125', vol: 0.08, notes: 'E4 E4 E4 C5 - G4 C5 E5 - - - - ' },
      { wave: 'triangle', vol: 0.28, notes: 'C3 - - E3 - G2 - C3 - - - - ' },
    ],
  },
  /* a memory comes back */
  memory: {
    bpm: 132,
    tracks: [
      { wave: 'p0.125', vol: 0.17, notes: 'B4 E5 G#5 B5 E6 - - - | G#6 - - - . . . . ' },
      { wave: 'p0.25', vol: 0.06, notes: 'G#4 B4 E5 G#5 B5 - - - | E6 - - - . . . . ' },
      { wave: 'triangle', vol: 0.24, notes: 'E3 - - - B2 - - - | E3 - - - . . . . ' },
    ],
  },
  /* a creature held in a COSMIC TUBE */
  captured: {
    bpm: 168,
    tracks: [
      { wave: 'p0.25', vol: 0.2, notes: 'C5 E5 G5 C6 E6 G6 - - | C7 - - - . . . . ' },
      { wave: 'p0.125', vol: 0.09, notes: 'G4 C5 E5 G5 C6 E6 - - | G6 - - - . . . . ' },
      { wave: 'triangle', vol: 0.3, notes: 'C3 - - - G2 - - - | C3 - - - . . . . ' },
    ],
  },
  /* her tune, the one she hummed on the walk home: whistled, hummed, and hummed with NOVA (a growly third below) */
  whistle: {
    bpm: 100,
    tracks: [{ wave: 'sine', vol: 0.22, vib: true, notes: 'B5 - D6 E6 D6 - B5 A5 | G5 - A5 B5 D6 - - - | E6 - D6 B5 A5 - G5 A5 | B5 - - - - - . . ' }],
  },
  hum: {
    bpm: 96,
    tracks: [{ wave: 'triangle', vol: 0.3, vib: true, notes: 'B4 - D5 E5 D5 - B4 A4 | G4 - A4 B4 D5 - - - | E5 - D5 B4 A4 - G4 A4 | B4 - - - - - . . ' }],
  },
  humNova: {
    bpm: 96,
    tracks: [
      { wave: 'triangle', vol: 0.26, vib: true, notes: 'B4 - D5 E5 D5 - B4 A4 | G4 - A4 B4 D5 - - - | E5 - D5 B4 A4 - G4 A4 | B4 - - - - - . . ' },
      { wave: 'p0.5', vol: 0.07, vib: true, notes: 'G3 - B3 C4 B3 - G3 F#3 | E3 - F#3 G3 B3 - - - | C4 - B3 G3 F#3 - E3 F#3 | G3 - - - - - . . ' },
    ],
  },
};

/* names for the soundboard and the sound test */
export const TRACKS = [
  ['title', 'Cosmic Castaways'],
  ['intro', 'Meteor storm'],
  ['town', 'Bloomhaven'],
  ['town2', 'Bloomhaven shuffle'],
  ['select', 'Choose your companion'],
  ['shop', "Mossa's shop"],
  ['wilds', 'The Crimson Wilds'],
  ['wilds2', 'Wilds gallop'],
  ['ride', 'Ride on!'],
  ['enya', "Enya's jig"],
  ['nest', 'The scrap nest'],
  ['jungle', 'The Whisperwood'],
  ['jungle2', 'Whisperwood stream'],
  ['groove', 'The Jelly Jam'],
  ['groove2', 'Bass breakdown'],
  ['vision', 'Beyond the veil'],
  ['battle', 'Wild battle'],
  ['battle2', 'Wild battle II'],
  ['ghoul', 'Ghouls!'],
  ['boss', 'Rustclaw'],
  ['victory', 'Victory!'],
  ['chapter', 'Chapter complete'],
  ['cody', "Cody's swing"],
  ['dream', 'A dream on the COMET'],
  ['mire', 'The Venom Mire'],
  ['lagoon', 'The Jade Lagoon'],
  ['dragon', 'The Dragon Kings'],
  ['deep', 'The Withered Deep'],
];
