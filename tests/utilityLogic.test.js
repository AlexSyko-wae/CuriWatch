const { test } = require('node:test');
const assert = require('node:assert/strict');
const { nextAlarm, convertValue, rollDie, flipCoin } = require('../src/data/utilityLogic');
const { sanitizePreferences } = require('../src/data/preferences');
test('alarm schedules later today or tomorrow when that time has passed', () => {
  const now = new Date(2026,9,19,8,30).getTime();
  assert.equal(nextAlarm(9,0,now), new Date(2026,9,19,9,0).getTime());
  assert.equal(nextAlarm(8,30,now), new Date(2026,9,20,8,30).getTime());
  const saved = sanitizePreferences({ alarm: { hour: 9, minute: 0, at: nextAlarm(9,0,now), enabled: true } });
  assert.equal(saved.alarm.enabled, true);
  assert.equal(sanitizePreferences({ alarm: { enabled: true, at: -1 } }).alarm.enabled, false);
});
test('converter handles reverse units, negative temperature, decimals and invalid input', () => {
  assert.equal(convertValue('0', 'temperature'), 32);
  assert.equal(convertValue('212', 'temperature', true), 100);
  assert.equal(convertValue('-40', 'temperature'), -40);
  assert.equal(convertValue('1,609344', 'distance'), 1);
  assert.equal(convertValue('1', 'distance', true), 1.60934);
  assert.equal(convertValue('0.45359237', 'weight'), 1);
  assert.equal(convertValue('1', 'weight', true), 0.45359);
  for (const input of ['', '-', 'hola', '1.2.3']) assert.equal(convertValue(input, 'weight'), null);
});
test('dice and coin stay within intended outcomes', () => {
  assert.equal(rollDie(() => 0), 1); assert.equal(rollDie(() => 0.99999), 6);
  assert.equal(flipCoin(() => 0), 'Cara'); assert.equal(flipCoin(() => 0.99999), 'Cruz');
  for (let index = 0; index < 1000; index++) { const value = rollDie(); assert.ok(Number.isInteger(value) && value >= 1 && value <= 6); }
});
