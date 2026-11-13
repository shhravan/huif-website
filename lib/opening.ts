/**
 * The Opening script: the whole Gate opening as one table over walk progress p
 * (0: standing back, title in view; 1: through the gate, the story on the page).
 *
 * Every phase lives here, in order, so two phases can't drift apart across files: the title steps aside before
 * the camera turns, the sky softens before the story's words appear, and exactly one header shows throughout.
 * `sceneAt(p)` is the only interface; GateIntro applies it to the page and lib/walk.ts draws the camera from it.
 * tests/opening.test.ts checks the order.
 */

/** [start, end] of each phase, in walk progress */
export const PHASES = {
  /** the title steps aside (fades, drops 40px) */
  title: [0, 0.08],
  /** the shade under the title lifts */
  scrim: [0, 0.18],
  /** the camera turns towards the gate; its slow first steps overlap the title's last, faint ones, so the gate never seems parked without a title */
  turn: [0.06, 0.26],
  /** the walk up to the doorway */
  walk: [0.08, 0.86],
  /** on through it: the pillars slide out past the edges of the screen */
  through: [0.86, 1],
  /** the sky softens into the page */
  paper: [0.6, 0.8],
  /** the story's first words, only once the page colour covers the sky */
  story: [0.8, 0.94],
} as const;

/** walk progress at which the slim bar takes over from the opening's own header (and hands back on the way up) */
export const HEADER_SWITCH = 0.7;

export type Scene = {
  title: { opacity: number; y: number };
  scrim: number;
  paper: number;
  story: { opacity: number; y: number };
  header: "photo" | "bar";
  /** camera, each 0–1: turned towards the gate, walked to the doorway, through it */
  turn: number;
  walk: number;
  through: number;
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const within = (p: number, [a, b]: readonly [number, number]) => clamp((p - a) / (b - a));
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const easeOut = (t: number) => Math.sin((Math.PI / 2) * t);

export function sceneAt(p: number): Scene {
  const title = within(p, PHASES.title);
  const story = easeOut(within(p, PHASES.story));
  return {
    title: { opacity: 1 - title, y: 40 * title },
    scrim: 1 - within(p, PHASES.scrim),
    paper: easeInOut(within(p, PHASES.paper)),
    story: { opacity: story, y: 24 * (1 - story) },
    header: p >= HEADER_SWITCH ? "bar" : "photo",
    turn: easeInOut(within(p, PHASES.turn)),
    walk: easeInOut(within(p, PHASES.walk)),
    through: easeInOut(within(p, PHASES.through)),
  };
}
