/* Battle sprites, drawn from shapes with the painter (then outlined and shaded like hand-made pixel
   art). Companions face right, wild creatures face left. All original designs. */
import { painter } from '../engine/pixel.js';

/* a fat curved stroke: dots of radius r along a quadratic curve */
function stroke(p, x0, y0, cx, cy, x1, y1, r, c, steps = 24) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, d = t * t;
    const rr = typeof r === 'function' ? r(t) : r;
    p.ellipse(a * x0 + b * cx + d * x1, a * y0 + b * cy + d * y1, rr, rr, c);
  }
}

/* ---------- the tiger (NOVA, and the Emerald Tiger under Enya) ---------- */
function tigerShape(p, ox = 0, oy = 0, armour = false) {
  stroke(p, ox + 9, oy + 19, ox + 1, oy + 18, ox + 3, oy + 7, (t) => 1.9 - t * 0.5, 'O');   // tail
  p.ellipse(ox + 15, oy + 20, 9.5, 6.2, 'O');                                               // body
  p.rect(ox + 7, oy + 22, 4, 8, 'O'); p.rect(ox + 12, oy + 23, 3, 7, 'D');                // legs (far ones darker)
  p.rect(ox + 18, oy + 23, 3, 7, 'D'); p.rect(ox + 21, oy + 22, 4, 8, 'O');
  p.ellipse(ox + 24, oy + 12, 7, 6.4, 'O');                                                 // head
  p.poly([[ox + 18, oy + 10], [ox + 19, oy + 3], [ox + 23, oy + 7]], 'O');                  // ears
  p.poly([[ox + 25, oy + 6], [ox + 29, oy + 3], [ox + 29.5, oy + 10]], 'O');
  p.set(ox + 20, oy + 6, 'L'); p.set(ox + 20, oy + 7, 'L'); p.set(ox + 28, oy + 6, 'L'); p.set(ox + 28, oy + 7, 'L');
  p.ellipse(ox + 28, oy + 15, 3.6, 2.8, 'W');                                               // muzzle
  p.poly([[ox + 19, oy + 14], [ox + 23, oy + 18], [ox + 18, oy + 19]], 'W');                // cheek fluff
  p.ellipse(ox + 21, oy + 22, 3.5, 3.5, 'W');                                               // chest
  p.recolour('O', 'W', (x, y) => y >= oy + 25 && x > ox + 10 && x < ox + 20);                // belly
  for (const lx of [7, 21]) p.rect(ox + lx, oy + 28, 4, 2, 'W');                            // paws
  for (const lx of [12, 18]) p.rect(ox + lx, oy + 28, 3, 2, 'L');
  p.shade('O', 'D', 0, 1, 2);
  // stripes
  for (const sx of [10, 13, 16, 19]) { p.line(ox + sx, oy + 14, ox + sx - 1, oy + 18, 'K'); p.set(ox + sx - 1, oy + 19, 'K'); }
  p.line(ox + 24, oy + 6, ox + 24, oy + 8, 'K'); p.line(ox + 22, oy + 7, ox + 22, oy + 9, 'K'); p.line(ox + 26, oy + 7, ox + 26, oy + 9, 'K');
  p.line(ox + 18, oy + 11, ox + 20, oy + 11, 'K'); p.line(ox + 18, oy + 13, ox + 20, oy + 13, 'K');
  for (const t of [[ox + 4, oy + 14], [ox + 3, oy + 11], [ox + 3, oy + 8]]) { p.set(t[0] - 1, t[1], 'K'); p.set(t[0], t[1], 'K'); p.set(t[0] + 1, t[1], 'K'); }
  p.line(ox + 7, oy + 24, ox + 10, oy + 24, 'K'); p.line(ox + 21, oy + 25, ox + 24, oy + 25, 'K');
  // face
  p.rect(ox + 25, oy + 10, 2, 2, 'E'); p.set(ox + 26, oy + 11, 'K'); p.set(ox + 25, oy + 9, 'K'); p.set(ox + 26, oy + 9, 'K');
  p.set(ox + 30, oy + 13, 'N'); p.set(ox + 31, oy + 13, 'N'); p.set(ox + 30, oy + 14, 'N');
  p.set(ox + 29, oy + 17, 'K'); p.set(ox + 30, oy + 16, 'K'); p.set(ox + 28, oy + 16, 'K');
  if (armour) {   // the Emerald Tiger's gold-trimmed armour
    p.recolour('O', 'A', (x, y) => y >= oy + 15 && y <= oy + 18 && x >= ox + 8 && x <= ox + 21);
    p.recolour('D', 'A', (x, y) => y >= oy + 15 && y <= oy + 18 && x >= ox + 8 && x <= ox + 21);
    p.line(ox + 8, oy + 15, ox + 21, oy + 15, 'Y'); p.line(ox + 8, oy + 18, ox + 21, oy + 18, 'Y');
    p.rect(ox + 22, oy + 6, 4, 2, 'Y'); p.set(ox + 23, oy + 5, 'Y'); p.set(ox + 24, oy + 6, 'G');
  }
}
function tiger() {
  const p = painter(32, 32);
  tigerShape(p);
  p.outline('K');
  return p.rows();
}

/* ---------- the baby dragon (EMBER red, AZURE blue) ---------- */
function dragon() {
  const p = painter(32, 32);
  p.poly([[12, 15], [3, 5], [1, 16], [6, 15], [3, 21], [11, 20]], 'w');                     // wing behind
  p.line(4, 7, 9, 17, 'v'); p.line(2, 15, 9, 18, 'v');
  stroke(p, 10, 25, 3, 29, 2, 22, (t) => 2.2 - t * 1.4, 'R');                                 // tail curling up
  p.poly([[1, 22], [0, 19], [3, 20]], 'Y');                                                   // tail tip
  p.ellipse(15, 21, 7, 7.5, 'R');                                                             // body
  p.ellipse(17, 22, 4, 5.5, 'C');                                                             // belly
  p.rect(11, 26, 4, 4, 'R'); p.rect(17, 26, 4, 4, 'R');                                       // legs
  p.rect(11, 29, 4, 1, 'Y'); p.rect(17, 29, 4, 1, 'Y');
  p.ellipse(19, 10, 6.5, 6, 'R');                                                             // head
  p.ellipse(25, 12, 4.4, 3.2, 'R');                                                           // snout
  p.poly([[14, 6], [9, 1], [15, 3]], 'Y'); p.poly([[17, 4], [16, -1], [20, 4]], 'Y');           // horns
  p.ellipse(22, 17, 2, 1.5, 'R'); p.set(24, 17, 'Y');                                          // little arm
  for (const [sx, sy] of [[12, 8], [11, 12], [9, 16]]) p.poly([[sx, sy], [sx - 3, sy + 1], [sx, sy + 2]], 'Y');   // spines
  p.shade('R', 'r', 0, 1, 2);
  for (const by of [19, 22, 25]) p.line(14, by, 20, by, 'c');                                 // belly plates
  p.rect(20, 8, 3, 3, 'W'); p.set(22, 9, 'E'); p.set(22, 10, 'E'); p.set(21, 8, 'K'); p.set(22, 8, 'K');   // eye
  p.set(28, 11, 'K');                                                                          // nostril
  p.line(25, 14, 28, 14, 'K');                                                                 // mouth
  p.line(28, 12, 31, 15, 'Y'); p.set(31, 16, 'Y'); p.set(30, 17, 'Y');                         // whisker
  p.outline('K');
  return p.rows();
}

/* ---------- LUMI, the clever glowing octopus (with her reading glasses) ---------- */
function octo() {
  const p = painter(32, 32);
  const tents = [[9, 21, 4, 30, 1, 25], [12, 22, 9, 31, 6, 30], [16, 23, 15, 31, 13, 31], [19, 23, 21, 31, 23, 30], [22, 22, 27, 30, 29, 26], [24, 20, 30, 24, 31, 20]];
  for (const [x0, y0, cx, cy, x1, y1] of tents) stroke(p, x0, y0, cx, cy, x1, y1, (t) => 2.2 - t * 1.5, 'L');
  p.ellipse(16, 12, 10.5, 10, 'L');                                                            // mantle
  p.ellipse(16, 19, 9, 4, 'L');
  p.shade('L', 'D', 0, 1, 2);
  p.ellipse(13, 6, 3, 2, 'l'); p.set(11, 9, 'l'); p.set(20, 5, 'l');
  for (const [sx, sy] of [[8, 9], [23, 8], [19, 4], [24, 13], [7, 14]]) p.set(sx, sy, 'M');
  for (const [x0, y0, cx, cy, x1, y1] of tents) { const t = 0.7; const a = (1 - t) ** 2, b = 2 * (1 - t) * t, d = t * t; p.set(Math.round(a * x0 + b * cx + d * x1), Math.round(a * y0 + b * cy + d * y1), 'M'); }
  // eyes, looking right, behind round gold glasses
  p.ellipse(13, 13, 2.8, 3.2, 'W'); p.ellipse(20, 13, 2.8, 3.2, 'W');
  p.rect(14, 13, 1, 2, 'E'); p.rect(21, 13, 1, 2, 'E'); p.set(13, 12, 'W');
  for (const ex of [13, 20]) for (let a = 0; a < 24; a++) { const t = (a / 24) * Math.PI * 2; p.set(Math.round(ex + Math.cos(t) * 3.6 - 0.5), Math.round(13 + Math.sin(t) * 4 - 0.5), 'Y'); }
  p.set(16, 12, 'Y'); p.set(17, 12, 'Y');
  p.line(15, 18, 18, 18, 'K'); p.set(14, 17, 'K'); p.set(19, 17, 'K');                         // smile
  p.outline('K');
  return p.rows();
}

/* ---------- Enya on the Emerald Tiger ---------- */
function enya() {
  const p = painter(36, 42);
  tigerShape(p, 3, 10, true);
  // Enya: flowing golden hair, green outfit with gold trim, one fist raised
  p.poly([[11, 6], [6, 12], [5, 20], [9, 17], [8, 23], [13, 17]], 'H');                       // hair streaming back
  p.ellipse(15, 21, 4.5, 4, 'G');                                                              // hips on the saddle
  p.rect(12, 13, 7, 8, 'G');                                                                   // body
  p.line(12, 13, 18, 13, 'Y'); p.line(12, 20, 18, 20, 'Y');
  p.rect(16, 21, 3, 6, 'g'); p.rect(16, 26, 4, 2, 'Y');                                         // leg + boot
  p.ellipse(15, 7, 4.3, 4.6, 'S');                                                             // face
  p.poly([[10, 3], [15, 1], [20, 3], [19, 6], [16, 5], [11, 8]], 'H');                          // fringe
  p.rect(10, 4, 2, 9, 'H');
  p.set(17, 7, 'E'); p.set(16, 9, 'F');                                                         // green eye, shamrock
  p.line(19, 13, 23, 8, 'S'); p.line(19, 14, 23, 9, 'S');                                       // arm up
  p.rect(22, 5, 3, 4, 'G');                                                                    // fist (green glove)
  p.set(15, 12, 'X'); p.set(16, 13, 'X'); p.set(14, 13, 'X');                                   // the diamond necklace
  p.outline('K');
  return p.rows();
}

/* ---------- wild creatures of the Crimson Wilds (facing left) ---------- */
function glorp() {
  const p = painter(32, 32);
  p.ellipse(16, 22, 12, 8.5, 'G');
  p.ellipse(16, 16, 8, 6, 'G');
  p.ellipse(7, 29, 3, 1.5, 'G'); p.ellipse(25, 29, 3, 1.5, 'G');                               // drips
  p.shade('G', 'g', 0, 1, 2);
  p.ellipse(12, 15, 3, 2, 'l'); p.set(22, 20, 'l'); p.set(9, 22, 'l');
  stroke(p, 17, 11, 18, 7, 21, 4, 0.6, 'A'); p.ellipse(21.5, 3.5, 2, 2, 'Y'); p.set(21, 3, 'W');  // antenna
  p.ellipse(11, 19, 2.6, 3, 'W'); p.ellipse(18, 19, 2.6, 3, 'W');
  p.rect(10, 19, 1, 2, 'E'); p.rect(17, 19, 1, 2, 'E');
  p.line(12, 25, 16, 25, 'K'); p.set(11, 24, 'K'); p.set(17, 24, 'K');
  p.outline('K');
  return p.rows();
}
function sporelet() {
  const p = painter(32, 32);
  p.ellipse(16, 23, 6.5, 6.5, 'C');                                                            // stalk body
  p.rect(10, 28, 4, 2, 'C'); p.rect(18, 28, 4, 2, 'C');                                        // feet
  p.ellipse(16, 12, 12.5, 8, 'P');                                                             // cap
  p.rect(2, 14, 28, 6, '.'); p.ellipse(16, 14, 12.5, 3, 'P');
  p.shade('P', 'p', 0, 1, 2);
  p.ellipse(16, 16, 9, 1.5, 'u');
  for (const [sx, sy, r] of [[8, 9, 2], [16, 6, 2.4], [23, 10, 1.8], [13, 12, 1.3], [26, 13, 1.2]]) p.ellipse(sx, sy, r, r, 'S');
  p.shade('C', 'c', 1, 1, 1);
  p.rect(12, 21, 2, 3, 'K'); p.rect(17, 21, 2, 3, 'K'); p.set(12, 21, 'W'); p.set(17, 21, 'W');   // eyes
  p.line(14, 26, 16, 25, 'K'); p.line(16, 25, 18, 26, 'K');                                      // frown
  p.outline('K');
  return p.rows();
}
function crystabug() {
  const p = painter(32, 32);
  for (const lx of [10, 15, 20, 25]) { p.line(lx, 24, lx - 2, 29, 'K'); p.line(lx - 2, 29, lx - 3, 29, 'K'); }   // legs
  p.ellipse(18, 21, 11, 6.5, 'B');                                                             // body
  p.ellipse(7, 22, 5, 4.2, 'B');                                                               // head
  p.line(3, 24, 0, 22, 'K'); p.line(4, 25, 1, 27, 'K');                                        // mandibles
  p.shade('B', 'b', 0, 1, 2);
  // crystal shell spikes
  p.poly([[10, 17], [12, 6], [15, 16]], 'C'); p.poly([[14, 16], [18, 3], [21, 16]], 'C'); p.poly([[20, 16], [25, 7], [27, 18]], 'C');
  p.poly([[25, 18], [30, 12], [29, 21]], 'c');
  p.line(18, 5, 18, 14, 'l'); p.line(12, 8, 12.5, 14, 'l'); p.line(25, 9, 24, 15, 'l');
  p.shade('C', 'c', 1, 0, 1);
  p.rect(4, 20, 2, 2, 'Y'); p.set(4, 20, 'W');                                                 // eye
  p.outline('K');
  return p.rows();
}
function flitterfin() {
  const p = painter(32, 32);
  p.poly([[14, 13], [10, 1], [22, 4], [20, 13]], 'w');                                         // top wing-fin
  p.poly([[14, 19], [12, 29], [21, 26], [19, 19]], 'w');                                       // bottom wing-fin
  p.line(15, 12, 13, 4, 'v'); p.line(18, 12, 20, 6, 'v'); p.line(16, 20, 15, 26, 'v');
  p.poly([[26, 16], [31, 9], [30, 16], [31, 23]], 'T');                                        // tail
  p.ellipse(15, 16, 11, 5.5, 'F');                                                             // body
  p.shade('F', 'f', 0, 1, 2);
  p.recolour('F', 'S', (x, y) => y >= 17 && x < 24);
  p.line(9, 14, 22, 14, 'l');
  p.ellipse(8, 15, 2.6, 2.6, 'W'); p.rect(7, 15, 2, 2, 'E'); p.set(7, 14, 'W');                // eye
  p.line(3, 18, 5, 18, 'K');
  p.outline('K');
  return p.rows();
}
function thornback(big = false) {
  const p = painter(32, 32);
  stroke(p, 22, 22, 30, 24, 30, 15, (t) => 2.6 - t * 1.6, 'R');                                 // tail
  p.ellipse(17, 21, 10, 6, 'R');                                                               // body
  p.ellipse(6, 18, 6, 4.6, 'R');                                                               // head
  p.ellipse(2.5, 20, 3, 2.2, 'R');                                                             // snout
  p.rect(9, 24, 4, 6, 'R'); p.rect(20, 24, 4, 6, 'R');
  p.rect(13, 25, 3, 5, 'r'); p.rect(24, 24, 3, 5, 'r');
  for (const [sx, sy, hgt] of [[9, 15, 5], [13, 14, 6], [17, 14, 7], [21, 15, 6], [25, 17, 5], [29, 14, 4]]) p.poly([[sx - 2, sy + 1], [sx, sy - hgt], [sx + 2, sy + 1]], 'S');
  p.poly([[4, 14], [7, 9], [9, 15]], 'S');
  p.shade('R', 'r', 0, 1, 2);
  p.recolour('R', 'C', (x, y) => y >= 24 && x > 8 && x < 26);
  p.rect(5, 16, 2, 2, 'Y'); p.set(5, 16, 'K');                                                 // eye
  p.line(0, 22, 6, 22, 'K'); p.set(2, 23, 'W'); p.set(4, 23, 'W');                              // mouth, teeth
  for (const [cx, cy] of [[9, 29], [20, 29]]) { p.set(cx - 1, cy + 1, 'W'); p.set(cx + 1, cy + 1, 'W'); }
  p.outline('K');
  return p.rows();
}
function rustclaw() {
  const p = painter(48, 40);
  for (const [lx, d] of [[18, -4], [24, -3], [30, 3], [36, 4]]) { p.line(lx, 28, lx + d, 34, 'K'); p.line(lx + d, 34, lx + d, 37, 'K'); p.line(lx + 1, 28, lx + d + 1, 34, 'k'); }
  p.ellipse(27, 26, 15, 8, 'R');                                                               // body
  // your ship's thruster, worn as a shell
  p.rect(18, 9, 18, 13, 'M'); p.ellipse(18, 15.5, 3, 6.5, 'M'); p.ellipse(36, 15.5, 3, 6.5, 'm');
  p.ellipse(39, 15.5, 2.5, 5, 'O'); p.ellipse(39.5, 15.5, 1.3, 3, 'o');
  p.line(20, 12, 34, 12, 'l'); p.rect(24, 9, 2, 13, 'm'); p.rect(30, 9, 2, 13, 'm');
  p.rect(26, 16, 3, 2, 'O');
  // claws (the big one raised)
  p.ellipse(9, 14, 7, 5, 'R'); p.poly([[3, 10], [0, 5], [7, 9]], 'R'); p.poly([[3, 17], [0, 21], [7, 18]], 'R');
  p.line(14, 18, 18, 23, 'R'); p.line(15, 18, 19, 23, 'R'); p.line(14, 19, 18, 24, 'R');
  p.ellipse(12, 30, 5, 3.5, 'R'); p.poly([[8, 28], [5, 26], [9, 30]], 'R');
  p.shade('R', 'r', 0, 1, 2);
  p.shade('M', 'm', 0, 1, 2);
  // eyes on stalks
  p.line(16, 20, 14, 14, 'r'); p.line(19, 20, 18, 13, 'r');
  p.ellipse(14, 12.5, 1.8, 1.8, 'Y'); p.ellipse(18, 11.5, 1.8, 1.8, 'Y'); p.set(13, 12, 'K'); p.set(17, 11, 'K');
  p.line(14, 27, 20, 27, 'K'); p.set(15, 28, 'W'); p.set(18, 28, 'W');
  p.outline('K');
  return p.rows();
}

/* ---------- the Whisperwood ---------- */
function lumoth() {   // a moth that glows like a lantern
  const p = painter(32, 32);
  p.poly([[17, 15], [27, 2], [31, 9], [26, 17]], 'v');                                         // far wings
  p.poly([[17, 18], [27, 27], [22, 30], [17, 22]], 'v');
  p.poly([[15, 15], [3, 1], [0, 11], [7, 18]], 'W');                                           // near wings
  p.poly([[15, 18], [4, 25], [9, 30], [16, 22]], 'W');
  p.shade('W', 'w', 1, 1, 1);
  p.ellipse(6, 9, 2.6, 2.6, 'S'); p.ellipse(6, 9, 1.1, 1.1, 'Y');                               // eye spots
  p.ellipse(9, 25, 1.7, 1.7, 'S'); p.ellipse(27, 8, 1.7, 1.7, 'S');
  p.ellipse(16, 20, 3.6, 7, 'F');                                                              // fuzzy body
  p.ellipse(14, 10, 4.2, 3.8, 'F');                                                            // head
  p.shade('F', 'f', 1, 1, 1);
  for (const by of [19, 22, 25]) p.line(14, by, 18, by, 'f');
  p.line(12, 7, 7, 1, 'f'); p.line(15, 7, 17, 1, 'f'); p.set(6, 1, 'Y'); p.set(17, 0, 'Y');   // feathery feelers
  p.rect(10, 9, 2, 2, 'E'); p.set(10, 9, 'Z'); p.rect(14, 9, 2, 2, 'E'); p.set(14, 9, 'Z');      // big eyes
  p.outline('K');
  return p.rows();
}
function jadehop() {   // a frog with a jade crystal back
  const p = painter(32, 32);
  p.ellipse(25, 26, 5.5, 3.6, 'G'); p.rect(23, 28, 8, 2, 'G');                                 // back leg
  p.ellipse(18, 21, 10, 6.5, 'G');                                                             // body
  p.ellipse(10, 17, 7, 5, 'G');                                                                // head
  p.ellipse(7, 11, 3, 3, 'G'); p.ellipse(14, 11, 3, 3, 'G');                                   // eye bumps
  p.rect(9, 24, 3, 5, 'G'); p.rect(7, 28, 6, 2, 'G');                                          // front leg
  p.recolour('G', 'B', (x, y) => y >= 21 && x < 22 && y < 28);                                 // pale belly
  p.shade('G', 'g', 0, 1, 2);
  p.poly([[17, 16], [19, 7], [22, 16]], 'C'); p.poly([[22, 17], [25, 10], [28, 18]], 'C'); p.poly([[13, 14], [15, 9], [17, 14]], 'C');
  p.line(19, 9, 19, 14, 'l'); p.line(25, 12, 25, 16, 'l');
  p.ellipse(7, 11, 2, 2, 'Y'); p.ellipse(14, 11, 2, 2, 'Y'); p.rect(6, 11, 2, 1, 'E'); p.rect(13, 11, 2, 1, 'E');
  p.line(3, 19, 12, 20, 'K');                                                                  // a wide frog smile
  p.outline('K');
  return p.rows();
}
function vinesnap() {   // a snapping plant that walks on its vines
  const p = painter(32, 32);
  stroke(p, 18, 22, 23, 27, 27, 31, 1.4, 'V'); stroke(p, 16, 22, 12, 27, 8, 31, 1.4, 'V'); stroke(p, 17, 22, 18, 27, 17, 31, 1.2, 'V');
  stroke(p, 17, 23, 22, 17, 17, 12, (t) => 2.3 - t * 0.6, 'V');                                // stem
  p.poly([[19, 19], [29, 13], [24, 21]], 'L'); p.poly([[16, 21], [7, 19], [13, 24]], 'L');       // leaves
  p.line(20, 19, 27, 14, 'l'); p.line(15, 21, 9, 20, 'l');
  p.ellipse(12, 8, 9.5, 4.2, 'H');                                                             // upper jaw
  p.ellipse(12, 15, 8.5, 3.6, 'H');                                                            // lower jaw
  p.ellipse(9, 11.5, 6.5, 2.2, 'M');                                                           // the mouth, wide open
  p.shade('H', 'h', 0, 1, 2);
  for (const tx of [4, 7, 10, 13]) { p.set(tx, 10, 'W'); p.set(tx + 1, 13, 'W'); }               // teeth
  for (const sx of [5, 9, 13, 17]) p.set(sx, 3, 'H');                                           // spines on the jaw
  p.ellipse(16, 5, 2, 2, 'Y'); p.set(15, 5, 'E');                                               // eye
  p.outline('K');
  return p.rows();
}
function mosshell() {   // an old turtle with a garden on its back
  const p = painter(32, 32);
  p.rect(9, 24, 4, 5, 'S'); p.rect(21, 24, 4, 5, 'S'); p.rect(14, 25, 3, 4, 's'); p.rect(25, 25, 3, 4, 's');   // legs
  p.ellipse(5, 19, 4.6, 3.6, 'S'); p.rect(7, 19, 5, 4, 'S');                                   // head and neck
  p.ellipse(18, 18, 11, 8, 'C'); p.rect(7, 18, 22, 6, 'C');                                    // shell
  p.rect(6, 23, 24, 2, 'c');
  p.shade('C', 'c', 0, 1, 2);
  p.ellipse(18, 12, 9.5, 3.6, 'M'); p.shade('M', 'm', 0, 1, 1);                                // moss
  p.line(13, 15, 13, 22, 'c'); p.line(23, 15, 23, 22, 'c'); p.line(8, 19, 28, 19, 'c');        // plates
  p.line(19, 9, 19, 5, 'm'); p.ellipse(19, 4, 2.4, 1.9, 'P'); p.set(19, 4, 'Y');                // a glowing flower
  p.set(13, 10, 'P'); p.set(24, 11, 'Y'); p.set(16, 9, 'm'); p.set(22, 9, 'm');
  p.shade('S', 's', 0, 1, 1);
  p.rect(3, 18, 2, 2, 'E'); p.set(3, 18, 'W'); p.line(1, 21, 5, 21, 'K');                       // eye, smile
  p.outline('K');
  return p.rows();
}
function ghoul() {   // a shadow from beyond the veil
  const p = painter(32, 32);
  p.poly([[8, 10], [24, 8], [28, 20], [30, 31], [25, 26], [22, 31], [18, 25], [14, 31], [11, 24], [6, 29], [5, 18]], 'D');
  p.ellipse(15, 11, 8, 7, 'D');                                                                // hood
  p.ellipse(13, 12, 5, 4.4, 'V');                                                              // the dark inside the hood
  p.shade('D', 'd', 0, 1, 2);
  p.line(6, 18, 1, 15, 'D'); p.line(6, 19, 0, 19, 'D'); p.line(6, 20, 2, 23, 'D');               // reaching claws
  for (const [cx, cy] of [[1, 15], [0, 19], [2, 23]]) p.set(cx, cy, 'C');
  p.rect(10, 11, 2, 2, 'Y'); p.rect(15, 11, 2, 2, 'Y'); p.set(10, 11, 'W'); p.set(15, 11, 'W');   // glowing eyes
  for (const [wx, wy] of [[27, 5], [29, 10], [4, 6], [26, 2]]) p.set(wx, wy, 'v');               // wisps
  p.outline('K');
  return p.rows();
}
function grimghoul() {   // a hulking ghoul with long grasping arms
  const p = painter(48, 40);
  p.poly([[14, 12], [34, 10], [40, 24], [45, 39], [37, 34], [33, 39], [28, 33], [23, 39], [19, 33], [14, 38], [12, 26]], 'D');
  p.ellipse(24, 13, 11, 9, 'D');
  p.poly([[16, 7], [11, 0], [19, 5]], 'H'); p.poly([[31, 6], [37, 0], [34, 9]], 'H');          // horns
  p.ellipse(22, 14, 7.5, 5.6, 'V');
  stroke(p, 15, 18, 7, 13, 4, 6, 2, 'D'); stroke(p, 15, 24, 8, 29, 3, 31, 2, 'D');              // arms
  p.shade('D', 'd', 0, 1, 2);
  for (const [cx, cy, dx, dy] of [[4, 6, -3, -3], [4, 6, 0, -5], [4, 6, -4, 1], [3, 31, -3, 2], [3, 31, -3, -1], [3, 31, 0, 4]]) p.line(cx, cy, cx + dx, cy + dy, 'C');
  p.rect(17, 13, 3, 2, 'Y'); p.rect(24, 13, 3, 2, 'Y'); p.set(17, 13, 'W'); p.set(24, 13, 'W');
  for (let i = 0; i < 7; i++) p.set(18 + i, 17 + (i % 2), 'Y');                                  // a jagged grin
  p.line(30, 22, 37, 27, 'v'); p.line(20, 27, 27, 29, 'v'); p.line(33, 15, 38, 18, 'v');
  for (const [wx, wy] of [[42, 6], [45, 12], [8, 38], [40, 2]]) p.set(wx, wy, 'v');
  p.outline('K');
  return p.rows();
}

/* ---------- the Jelly Jam ---------- */
function bopjelly() {   // a sky jelly in tiny headphones
  const p = painter(32, 32);
  for (const [x0, cx, x1] of [[9, 6, 8], [13, 15, 12], [18, 16, 20], [22, 25, 24]]) stroke(p, x0, 17, cx, 24, x1, 31, (t) => 1.5 - t * 0.7, 'T');
  p.ellipse(16, 12, 11, 9.5, 'B');
  p.rect(3, 16, 26, 8, '.');                                                                   // flat underside
  for (let x = 6; x <= 26; x += 4) p.ellipse(x, 16, 2, 1.6, 'b');                               // frilly rim
  p.shade('B', 'b', 0, 1, 2);
  p.ellipse(11, 7, 3, 2, 'l'); p.set(20, 6, 'l');
  for (const [sx, sy] of [[22, 10], [8, 12], [17, 5]]) p.set(sx, sy, 'S');
  p.rect(10, 10, 2, 3, 'E'); p.rect(16, 10, 2, 3, 'E'); p.set(10, 10, 'W'); p.set(16, 10, 'W');   // happy face
  p.line(11, 14, 15, 14, 'E'); p.set(10, 13, 'E'); p.set(16, 13, 'E');
  stroke(p, 5, 9, 16, -4, 27, 9, 0.7, 'H'); p.ellipse(5, 10, 2.2, 3, 'H'); p.ellipse(27, 10, 2.2, 3, 'H');   // headphones
  p.outline('K');
  return p.rows();
}
function shroomboom() {   // a mushroom drummer
  const p = painter(32, 32);
  p.ellipse(16, 22, 6.5, 7, 'S'); p.rect(11, 27, 4, 3, 'S'); p.rect(17, 27, 4, 3, 'S');       // stalk body and feet
  p.ellipse(16, 10, 13.5, 7.5, 'C'); p.rect(2, 11, 28, 6, '.');                                // the cap...
  p.rect(3, 10, 26, 4, 'R');                                                                   // ...is a drum
  p.shade('C', 'c', 0, 1, 1);
  for (let x = 5; x <= 26; x += 4) p.line(x, 10, x + 2, 13, 'Y');                               // drum lacing
  for (const [sx, sy, r] of [[9, 6, 1.6], [16, 4, 2], [23, 6, 1.6]]) p.ellipse(sx, sy, r, r, 'D');
  p.line(11, 21, 6, 17, 'S'); p.line(6, 17, 2, 11, 'W'); p.ellipse(2, 10, 1.4, 1.4, 'W');       // arms with drumsticks
  p.line(21, 21, 26, 17, 'S'); p.line(26, 17, 29, 12, 'W'); p.ellipse(29, 11, 1.4, 1.4, 'W');
  p.shade('S', 's', 0, 1, 1);
  p.rect(12, 19, 2, 2, 'E'); p.rect(17, 19, 2, 2, 'E'); p.line(13, 23, 17, 23, 'E'); p.set(12, 22, 'E'); p.set(18, 22, 'E');
  p.outline('K');
  return p.rows();
}

const K = '#1a0f2e';
export const BATTLERS = {
  tiger: { rows: tiger(), pal: { K: '#1d0c05', O: '#ff8a1e', D: '#c9580c', L: '#ffc46e', W: '#fff2da', E: '#7dff2e', N: '#7a2e1c' } },
  dragonRed: { rows: dragon(), pal: { K: '#2a0510', R: '#e8302a', r: '#a3141e', C: '#ffd9a0', c: '#e0a070', Y: '#ffd23a', w: '#ff7a3a', v: '#b8301e', E: K, W: '#ffffff' } },
  dragonBlue: { rows: null, pal: { K: '#06102e', R: '#2f7cf0', r: '#1a48a8', C: '#c8f4ff', c: '#80c0e8', Y: '#e6f0ff', w: '#6fe0ff', v: '#2a6ad0', E: K, W: '#ffffff' } },
  octo: { rows: octo(), pal: { K: '#140a30', L: '#5fc8f8', l: '#e0f4ff', D: '#3a6ad8', W: '#ffffff', E: K, M: '#c08cff', Y: '#ffd23a' } },
  enya: { rows: enya(), pal: { K: '#06240f', O: '#2fb34a', D: '#1b7a33', L: '#a6f27a', W: '#eafff0', E: '#2fd85a', N: '#3a2a10', A: '#145a2a', Y: '#ffcf3a', G: '#1f6b34', g: '#134a22', H: '#f0b440', S: '#f2c08e', F: '#1fae4a', X: '#ffffff' } },
  glorp: { rows: glorp(), pal: { K: '#0a2a10', G: '#7ee04a', g: '#3fa830', l: '#d8ffb0', A: '#3fa830', Y: '#ffe23a', W: '#ffffff', E: K } },
  sporelet: { rows: sporelet(), pal: { K: K, P: '#a050e0', p: '#6a2ab0', u: '#4a1a80', S: '#8ff0ff', C: '#f2e6d8', c: '#c8b4a0', W: '#ffffff' } },
  crystabug: { rows: crystabug(), pal: { K: K, B: '#4a2a7a', b: '#2e1a52', C: '#5ff2ff', c: '#2aa8d8', l: '#e0ffff', Y: '#ffd23a', W: '#ffffff' } },
  flitterfin: { rows: flitterfin(), pal: { K: K, F: '#2fc6b4', f: '#1b8f8c', S: '#ffd9a0', l: '#a8fff0', w: '#ffb43a', v: '#d07a1a', T: '#ff8a3a', W: '#ffffff', E: K } },
  thornback: { rows: thornback(), pal: { K: '#2a0808', R: '#e06030', r: '#a83a20', C: '#ffc890', S: '#ffe27a', Y: '#ffe23a', W: '#ffffff' } },
  thornAlpha: { rows: null, pal: { K: '#14040a', R: '#9a2a4a', r: '#5e1430', C: '#e8a0b0', S: '#c8f0ff', Y: '#ff4a3a', W: '#ffffff' } },
  rustclaw: { rows: rustclaw(), pal: { K: K, k: '#5a2a1a', R: '#c8602a', r: '#8a3a1a', M: '#b8bccc', m: '#7a7e94', l: '#e8ecf8', O: '#ff8a1e', o: '#fff2a0', Y: '#ffe23a', W: '#ffffff' } },
  lumoth: { rows: lumoth(), pal: { K: '#2a1a3a', W: '#f6e8ff', w: '#c8a8f0', v: '#a080d8', S: '#7a3ad8', Y: '#fff2a0', F: '#ffe6a8', f: '#d0a868', E: K, Z: '#ffffff' } },
  jadehop: { rows: jadehop(), pal: { K: '#062a1a', G: '#3fd890', g: '#1f9a60', B: '#c8ffd8', C: '#7dffd0', l: '#e6fff4', Y: '#ffe23a', E: K } },
  vinesnap: { rows: vinesnap(), pal: { K: '#0a2a10', V: '#3a9a40', L: '#5fd860', l: '#a8f0a0', H: '#e8405a', h: '#a82040', M: '#ffb0c0', W: '#ffffff', Y: '#ffe23a', E: K } },
  mosshell: { rows: mosshell(), pal: { K: '#142a14', S: '#a8d070', s: '#6a9a40', C: '#8a6a40', c: '#5a4228', M: '#3fb860', m: '#1f7a38', P: '#ff8ad8', Y: '#ffe23a', E: K, W: '#ffffff' } },
  ghoul: { rows: ghoul(), pal: { K: '#05020a', D: '#2a1640', d: '#160a26', V: '#0a0410', C: '#c8b0ff', Y: '#b06aff', W: '#ffffff', v: '#6a3aa8' } },
  grimghoul: { rows: grimghoul(), pal: { K: '#05020a', D: '#2a1640', d: '#160a26', V: '#0a0410', H: '#4a2a6a', C: '#c8b0ff', Y: '#c86aff', W: '#ffffff', v: '#6a3aa8' } },
  bopjelly: { rows: bopjelly(), pal: { K: '#4a0a48', B: '#ff8ad8', b: '#d050a8', l: '#ffe0f6', T: '#ffb8ea', S: '#ffffff', E: K, W: '#ffffff', H: '#5ff2ff' } },
  shroomboom: { rows: shroomboom(), pal: { K: '#1a0a2e', S: '#f2e6ff', s: '#c0a8e0', C: '#a050e0', c: '#6a2ab0', R: '#ffd23a', Y: '#fff2a0', D: '#5ff2ff', W: '#e8c08a', E: K } },
};
BATTLERS.dragonBlue.rows = BATTLERS.dragonRed.rows;
BATTLERS.thornAlpha.rows = BATTLERS.thornback.rows;
