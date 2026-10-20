const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculate, createDeck, remainingTime } = require('../src/data/extraLogic');
test('calculator handles operations, decimals and division by zero', () => {
  assert.equal(calculate('0.1', '0.2', '+'), '0.3');
  assert.equal(calculate('3', '5', '−'), '-2');
  assert.equal(calculate('2.5', '4', '×'), '10');
  assert.equal(calculate('9', '2', '÷'), '4.5');
  assert.equal(calculate('1', '0', '÷'), 'Error');
});
test('timer uses deadlines and keeps paused time fixed', () => {
  assert.equal(remainingTime({ running: true, deadline: 5000 }, 2000), 3000);
  assert.equal(remainingTime({ running: true, deadline: 5000 }, 8000), 0);
  assert.equal(remainingTime({ running: false, remaining: 2500 }, 8000), 2500);
});
test('shuffled memory deck always contains exactly three pairs', () => {
  for (const random of [() => 0, () => 0.99, Math.random]) {
    const deck = createDeck(random);
    assert.equal(deck.length, 6);
    for (const symbol of ['sunny', 'heart', 'moon']) assert.equal(deck.filter(card => card === symbol).length, 2);
  }
});
