const { test } = require('node:test');
const assert = require('node:assert/strict');
const { defaults, sanitizePreferences } = require('../src/data/preferences');
test('saved preferences round trip and invalid data falls back safely', () => {
  const saved = { themeKey: 'ocean', animations: false, haptics: true, count: 42, difficulty: 'hard', records: { memory: 4, reaction: 220, wins: 3 } };
  assert.deepEqual(sanitizePreferences(JSON.parse(JSON.stringify(saved))), { ...defaults, ...saved });
  assert.deepEqual(sanitizePreferences(null), defaults);
  assert.deepEqual(sanitizePreferences({ themeKey: 'broken', count: -1, records: { memory: '4', reaction: Infinity, wins: -1 } }), defaults);
  assert.equal(sanitizePreferences({ count: 9999999 }).count, 0);
});
