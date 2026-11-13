// The Opening script's order, checked over every step of the walk (npm test).
// Each check is a bug the opening has actually had.
import { test } from "node:test";
import assert from "node:assert/strict";
import { sceneAt, PHASES, HEADER_SWITCH } from "../lib/opening.ts";

const STEPS = 10000;
const every = (check: (p: number) => void) => {
  for (let i = 0; i <= STEPS; i++) check(i / STEPS);
};

test("at rest: the title in full, the gate standing back, the opening's own header", () => {
  const s = sceneAt(0);
  assert.equal(s.title.opacity, 1);
  assert.deepEqual([s.turn, s.walk, s.through], [0, 0, 0]);
  assert.equal(s.header, "photo");
});

test("the title never shows over a moving gate (the title-over-pillar bug)", () => {
  every((p) => {
    const s = sceneAt(p);
    if (s.title.opacity > 0.1) assert.ok(s.turn < 0.02 && s.walk === 0, `p=${p}: title ${s.title.opacity.toFixed(2)} while the camera has turned ${s.turn.toFixed(3)}`);
  });
});

test("the gate is never parked without a title (the empty-frame bug)", () => {
  // once the title has gone, the camera is already on its way
  every((p) => {
    const s = sceneAt(p);
    if (p > 0 && p < PHASES.through[0] && s.title.opacity === 0) assert.ok(s.turn > 0, `p=${p}: no title and the gate at rest`);
  });
});

test("the story's words come only once the page colour covers the sky", () => {
  every((p) => {
    const s = sceneAt(p);
    if (s.story.opacity > 0) assert.ok(s.paper > 0.99, `p=${p}: story ${s.story.opacity.toFixed(2)} over sky (paper ${s.paper.toFixed(2)})`);
  });
});

test("exactly one header, switching once, after the sky has started to soften", () => {
  let switches = 0;
  let last = sceneAt(0).header;
  every((p) => {
    const h = sceneAt(p).header;
    if (h !== last) switches++;
    last = h;
  });
  assert.equal(switches, 1);
  assert.ok(HEADER_SWITCH > PHASES.paper[0] && HEADER_SWITCH < PHASES.story[0]);
});

test("the walk ends through the gate with the story on the page", () => {
  const s = sceneAt(1);
  assert.deepEqual([s.turn, s.walk, s.through, s.paper, s.story.opacity], [1, 1, 1, 1, 1]);
  assert.equal(s.title.opacity, 0);
  assert.equal(s.header, "bar");
});

test("every value moves one way only (scrolling back retraces the same path)", () => {
  let prev = sceneAt(0);
  every((p) => {
    const s = sceneAt(p);
    for (const k of ["turn", "walk", "through", "paper"] as const) assert.ok(s[k] >= prev[k], `${k} goes back at p=${p}`);
    assert.ok(s.title.opacity <= prev.title.opacity && s.story.opacity >= prev.story.opacity);
    prev = s;
  });
});
