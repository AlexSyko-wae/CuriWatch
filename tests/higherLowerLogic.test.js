const { test } = require('node:test');
const assert = require('node:assert/strict');
const { nextNumber, guessRound } = require('../src/data/higherLowerLogic');
const { sanitizePreferences } = require('../src/data/preferences');
test('next number covers all eight other values and never repeats', () => {
  for (let current = 1; current <= 9; current++) {
    const values = Array.from({length:8}, (_,index) => nextNumber(current, () => index / 8));
    assert.equal(new Set(values).size,8); assert.ok(!values.includes(current));
    assert.ok(values.every(value => value >= 1 && value <= 9));
  }
});
test('correct guesses build streaks, misses cost a life and an ended game rejects input', () => {
  let game = {current:4,lives:3,score:0,streak:0,bestStreak:0};
  game = guessRound(game,'higher',8); game = guessRound(game,'lower',2);
  assert.equal(game.streak,2); assert.equal(game.score,2); assert.equal(game.lives,3);
  game = guessRound(game,'lower',7); assert.equal(game.streak,0); assert.equal(game.bestStreak,2);
  game = guessRound(game,'higher',3); game = guessRound(game,'higher',1);
  assert.equal(game.lives,0); assert.equal(guessRound(game,'higher',9),game);
  assert.equal(sanitizePreferences(JSON.parse(JSON.stringify({higherLowerBest:8}))).higherLowerBest,8);
});
