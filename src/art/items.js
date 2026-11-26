/* Things lying on the ground: jewels and ship parts. */
/* jewels (8 px) and ship parts (16 px) lying on the ground */
export const GEM = ['..KKKK..', '.KLWLLK.', 'KLWLLLDK', 'KLLLLLDK', 'KDLLLDDK', '.KDLDDK.', '..KDDK..', '...KK...'];
export const COIN = ['..KKKK..', '.KYYYYK.', 'KYWYYyYK', 'KYWYYyYK', 'KYYYYyYK', 'KYYYyyYK', '.KyyyyK.', '..KKKK..'];
export const COIN_EDGE = ['...KK...', '...KK...', '..KYYK..', '..KYyK..', '..KYyK..', '..KyyK..', '...KK...', '...KK...'];
export const DIAMOND = ['.KKKKKKK.', 'KWLWLWLWK', 'KLLLLLLLK', '.KLLLLLK.', '..KLLLK..', '...KLK...', '....K....', '.........'];
export const GEM_PAL = {
  emerald: { K: '#06301a', L: '#2fe070', W: '#d8ffe8', D: '#13924a' },
  sapphire: { K: '#0a1440', L: '#4f8cff', W: '#e0ecff', D: '#2448c8' },
  ruby: { K: '#3a0612', L: '#ff3a4e', W: '#ffe0e4', D: '#b8122e' },
  diamond: { K: '#1a2a4a', L: '#c8f4ff', W: '#ffffff', D: '#7fc8e8' },
  gold: { K: '#5a3a06', Y: '#ffd23a', W: '#fff6c0', y: '#d8961a' },
};
export const PART_ART = {
  fuelcell: ['....KKKKKKKK....', '...KMMMMMMMMK...', '...KKKKKKKKKK...', '....KGGGGGGK....', '....KGgGGGGK....', '....KGgGGGGK....', '....KGGGGGGK....', '....KGGGGgGK....', '....KGGGGgGK....', '....KGGGGGGK....', '...KKKKKKKKKK...', '...KMMMMMMMMK...', '....KKKKKKKK....'],
  navcore: ['.....KKKKKK.....', '...KKMMMMMMKK...', '..KMMKKKKKKMMK..', '..KMKBBBBBBKMK..', '.KMKBBWBBBBBKMK.', '.KMKBWBBBBBBKMK.', '.KMKBBBBBBbBKMK.', '.KMKBBBBBBbBKMK.', '..KMKBBBBbbKMK..', '..KMMKKKKKKMMK..', '...KKMMMMMMKK...', '.....KKKKKK.....'],
  thruster: ['..KKKKKK........', '.KMMMMMMKK......', 'KMlllllMMMKK....', 'KMMMMMMMMMMMKK..', 'KMmMmMmMmMMMOOK.', 'KMmMmMmMmMMMOoK.', 'KMMMMMMMMMMMOOK.', 'KMlllllMMMKK....', '.KMMMMMMKK......', '..KKKKKK........'],
};
export const PART_PAL = { K: '#1a0f2e', M: '#b8bccc', m: '#7a7e94', l: '#e8ecf8', G: '#3fe08f', g: '#c8ffe0', B: '#4f8cff', b: '#2448c8', W: '#ffffff', O: '#ff8a1e', o: '#fff2a0' };
