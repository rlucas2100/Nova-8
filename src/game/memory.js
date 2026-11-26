/* The memories that come back to you after the crash. Each one is kept in your QUEST notes; getting one
   back makes the screen flash lilac, plays a little chime and pops up a note. */
import { MEMORIES } from './data.js';
import { sfx } from '../engine/audio.js';

export const hasMemory = (st, id) => !!(st && st.memories && st.memories.includes(id));
export const memoryCount = (st) => (st && st.memories ? st.memories.length : 0);

/* resolves true if it was a new memory */
export async function remember(g, id) {
  const st = g.state, m = MEMORIES.find((q) => q.id === id);
  if (!m || !st) return false;
  if (!st.memories) st.memories = [];
  if (st.memories.includes(id)) return false;
  st.memories.push(id);
  sfx.memory();
  g.flash('#c8a8ff', 16);
  g.toast('♥ MEMORY: ' + m.title, '#ffb0f0');
  await g.wait(36);
  if (st.memories.length === 1) await g.say('A memory came back! Everything you remember is kept on the MEMORIES page of your QUEST notes (START, then QUEST).');
  return true;
}
