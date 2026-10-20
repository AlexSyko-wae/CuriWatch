const { test } = require('node:test');
const assert = require('node:assert/strict');
const { defaultFavorites, sanitizeFavorites, toggleFavorite } = require('../src/data/favoritesLogic');
const { sanitizePreferences } = require('../src/data/preferences');
test('favorite selection limits entries, rejects unknown destinations and removes duplicates', () => {
  assert.deepEqual(sanitizeFavorites(['clock','clock','notes','favorites','timer','tasks','pomodoro','profile']), defaultFavorites);
  assert.deepEqual(sanitizeFavorites([]), []);
  assert.deepEqual(toggleFavorite(['clock'], 'clock'), []);
  assert.deepEqual(toggleFavorite([], 'tasks'), ['tasks']);
  assert.equal(toggleFavorite(defaultFavorites, 'profile'), defaultFavorites);
});
test('favorite choices persist while older preferences keep their other settings', () => {
  const saved = { favorites: ['profile','habits'], count: 12, themeKey: 'ocean' };
  const restored = sanitizePreferences(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(restored.favorites, saved.favorites); assert.equal(restored.count, 12);
  const legacy = sanitizePreferences({ note: 'Texto antiguo', themeKey: 'ocean', count: 9 });
  assert.deepEqual(legacy.favorites, defaultFavorites); assert.equal(legacy.themeKey, 'ocean'); assert.equal(legacy.count, 9);
  assert.equal('note' in legacy, false);
});
