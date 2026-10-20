const { test } = require('node:test');
const assert = require('node:assert/strict');
const { targetSize, nextTarget, timeLeft, ROUND_MS } = require('../src/data/curiTapLogic');
const { sanitizePreferences } = require('../src/data/preferences');
test('CuriTap shrinks every five hits with a minimum target size', () => {
  assert.equal(targetSize(0),54); assert.equal(targetSize(4),54); assert.equal(targetSize(5),50);
  assert.equal(targetSize(1000),30); assert.equal(ROUND_MS,20000);
  assert.equal(timeLeft(20000,19999),1); assert.equal(timeLeft(20000,20000),0); assert.equal(timeLeft(20000,21000),0);
});
test('targets stay wholly inside the circular playfield and move away from the last target', () => {
  for (const random of [Math.random, () => 0, () => 0.99999]) {
    let previous = null;
    for (let score = 0; score < 300; score++) {
      const target = nextTarget(score, previous, random);
      assert.ok(Math.hypot(target.x - 94, target.y - 94) + target.size / 2 <= 94);
      if (previous) assert.ok(Math.hypot(target.x - previous.x, target.y - previous.y) >= target.size);
      previous = target;
    }
  }
});
test('CuriTap record persists and invalid saved scores fall back to zero', () => {
  assert.equal(sanitizePreferences(JSON.parse(JSON.stringify({curiTapBest:42}))).curiTapBest,42);
  assert.equal(sanitizePreferences({curiTapBest:-1}).curiTapBest,0);
});
