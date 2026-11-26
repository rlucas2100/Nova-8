/* The NOVA-8 switching on: its logo drops in, chimes and sparkles, then the game's title screen. */
import { W, H } from '../engine/pixel.js';
import { text } from '../engine/font.js';
import { sfx } from '../engine/audio.js';
import { Title } from '../game/scenes.js';

export class Boot {
  constructor(game) { this.game = game; this.t = 0; this.on = false; this.opaque = true; }
  start() { this.on = true; this.t = 0; }
  update(g) {
    if (!this.on) return;
    this.t++;
    if (this.t === 46) sfx.boot();
    if (this.t > 120 || (this.t > 20 && (g.input.pressed.a || g.input.pressed.start))) g.replace(new Title(g));
  }
  draw(ctx) {
    const t = this.t;
    ctx.fillStyle = '#0e0820';
    ctx.fillRect(0, 0, W, H);
    const y = this.on ? Math.min(54, -24 + t * 1.8) : 54;
    const col = this.on && t > 46 && t < 70 && t % 4 < 2 ? '#ffffff' : '#ffd23a';
    text(ctx, 'NOVA-8', W / 2, y, col, { scale: 2, outline: '#1a0f2e', align: 'center' });
    if (!this.on || t > 50) text(ctx, 'pocket adventure system', W / 2, y + 22, '#9a8cc8', { align: 'center' });
    if (this.on && t > 46 && t < 90) {
      const k = (t - 46) * 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(40 + k, y + 2, 1, 1); ctx.fillRect(39 + k, y + 3, 3, 1); ctx.fillRect(40 + k, y + 4, 1, 1);
    }
  }
}
