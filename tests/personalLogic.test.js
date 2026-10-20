const { test } = require('node:test');
const assert = require('node:assert/strict');
const { addTask, toggleTask, clockAngles } = require('../src/data/personalLogic');
const { sanitizePreferences } = require('../src/data/preferences');
test('personal tasks reject blank input and duplicates, enforce limit and toggle completion', () => {
  let tasks = addTask([], '  Comprar pan  ', '1');
  assert.equal(tasks[0].text, 'Comprar pan');
  assert.equal(addTask(tasks, ' ', '2'), tasks);
  assert.equal(addTask(tasks, 'Otra', '1'), tasks);
  tasks = toggleTask(tasks, '1'); assert.equal(tasks[0].done, true);
  for (let index = 2; index <= 8; index++) tasks = addTask(tasks, 'Tarea', String(index));
  assert.equal(addTask(tasks, 'Extra', '9'), tasks);
});
test('clock hands account for hours, minutes and seconds', () => {
  assert.deepEqual(clockAngles(new Date(2026,9,19,3,30,15)), { hour: 105, minute: 181.5, second: 90 });
  assert.deepEqual(clockAngles(new Date(2026,9,19,12,0,0)), { hour: 0, minute: 0, second: 0 });
});
test('watch faces, profile and tasks survive serialization and malformed data is sanitized', () => {
  const saved = { clockStyle: 'analog', hour12: true, profile: { name: 'Ana', goal: 'Leer' }, tasks: [{ id: 'a', text: 'Comprar', done: true }] };
  const loaded = sanitizePreferences(JSON.parse(JSON.stringify(saved)));
  for (const key of Object.keys(saved)) assert.deepEqual(loaded[key], saved[key]);
  const invalid = sanitizePreferences({ clockStyle: 'broken', profile: { name: 'a'.repeat(40) }, tasks: [null, { id: 'a', text: 'Primera' }, { id: 'a', text: 'Duplicada' }, { id: 'b', text: ' ' }] });
  assert.equal(invalid.clockStyle, 'digital'); assert.equal(invalid.profile.name.length, 24); assert.equal(invalid.tasks.length, 1);
});
