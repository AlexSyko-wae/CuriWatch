const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formatElapsed, demoActivity } = require('../src/data/logic');
test('centiseconds roll over into seconds and minutes', () => {
  assert.equal(formatElapsed(0), '00:00.00');
  assert.equal(formatElapsed(59999), '00:59.99');
  assert.equal(formatElapsed(60000), '01:00.00');
  assert.equal(formatElapsed(123456), '02:03.45');
});
test('demo data remains in its intended range over a long session', () => {
  for (let tick = 0; tick < 10000; tick++) {
    const data = demoActivity(tick);
    assert.ok(data.steps >= 3240 && data.steps <= 3933);
    assert.ok(data.heartRate >= 70 && data.heartRate <= 82);
  }
});
