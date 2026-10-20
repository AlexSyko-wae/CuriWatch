const { test } = require('node:test');
const assert = require('node:assert/strict');
const { localDay, toggleHabit, finishPomodoro, checkSimon } = require('../src/data/productivityLogic');
const { sanitizePreferences } = require('../src/data/preferences');
test('habits toggle once, reset on another local day and survive serialization', () => {
  const day = localDay(new Date(2026, 9, 19, 23, 59));
  assert.equal(day, '2026-10-19');
  const first = toggleHabit({ date: '', done: [] }, 'study', day);
  assert.deepEqual(first.done, ['study']);
  assert.deepEqual(toggleHabit(first, 'study', day).done, []);
  assert.deepEqual(toggleHabit(first, 'walk', '2026-10-20').done, ['walk']);
  assert.deepEqual(sanitizePreferences(JSON.parse(JSON.stringify({ habits: first, simonBest: 7 }))).habits, first);
  assert.deepEqual(sanitizePreferences({ habits: { date: day, done: ['study', 'study', 'invalid'] } }).habits.done, ['study']);
  assert.equal(sanitizePreferences({ simonBest: 7 }).simonBest, 7);
});
test('pomodoro finishes each phase once, counts study and waits for user to start next phase', () => {
  const timer = { phase: 'focus', running: true, deadline: 10000, remaining: 10000, focusDuration: 10000, breakDuration: 5000, completed: 0 };
  assert.equal(finishPomodoro(timer, 9999), timer);
  const rest = finishPomodoro(timer, 10000);
  assert.equal(rest.phase, 'break'); assert.equal(rest.running, false); assert.equal(rest.completed, 1); assert.equal(rest.remaining, 5000);
  assert.equal(finishPomodoro(rest, 999999), rest);
  const study = finishPomodoro({ ...rest, running: true, deadline: 15000 }, 15000);
  assert.equal(study.phase, 'focus'); assert.equal(study.completed, 1); assert.equal(study.remaining, 10000);
});
test('Simon distinguishes partial input, completed round and mistakes', () => {
  assert.equal(checkSimon([0,2,1], 0, 0), 'correct');
  assert.equal(checkSimon([0,2,1], 2, 1), 'complete');
  assert.equal(checkSimon([0,2,1], 1, 3), 'wrong');
  assert.equal(checkSimon([], 0, 0), 'wrong');
});
