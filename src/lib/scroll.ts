/**
 * Shared, mutable scroll state. Written by <ScrollTracker/> (DOM) and read
 * every frame by the three.js scene, so it lives outside React state.
 *
 * `target` is the "scene time": section index + progress through that section
 * (0 = hero, 1 = pour, 2 = reveal, 3 = story, 4 = menu, 5 = visit).
 * `s` is the damped version the scene actually animates with.
 */
export const scroll = {
  target: 0,
  s: 0,
  gx: 0,
  pointer: { x: 0, y: 0 },
};

/** Scene-time windows for the pour choreography. */
export const POUR = {
  tiltIn: [0.7, 0.92],
  head: [0.9, 0.95],
  fill: [0.93, 1.72],
  tail: [1.7, 1.76],
  tiltOut: [1.74, 1.92],
  exit: [1.8, 2.15],
} as const;
