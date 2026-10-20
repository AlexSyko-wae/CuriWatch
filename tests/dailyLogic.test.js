const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validBirthday, daysUntilBirthday, adjustWater, homeDestination } = require('../src/data/dailyLogic');
const { sanitizePreferences } = require('../src/data/preferences');
test('birthday countdown handles today, next year and February 29', () => {
  assert.equal(validBirthday(31,4), false); assert.equal(validBirthday(29,2), true);
  assert.equal(daysUntilBirthday(19,10,new Date(2026,9,19,23,0)),0);
  assert.equal(daysUntilBirthday(1,1,new Date(2026,11,31)),1);
  assert.equal(daysUntilBirthday(29,2,new Date(2025,1,27)),1);
  assert.equal(daysUntilBirthday(29,2,new Date(2024,1,28)),1);
  assert.equal(daysUntilBirthday(31,4),null);
});
test('water count resets each day and remains within bounds', () => {
  const water = { date:'2026-10-18',count:10,goal:8 };
  assert.equal(adjustWater(water,1,'2026-10-19').count,1);
  assert.equal(adjustWater(water,-1,'2026-10-19').count,0);
  assert.equal(adjustWater({ ...water,count:30 },1,water.date).count,30);
});
test('clock mode toggles crown destinations and saves daily preferences', () => {
  assert.equal(homeDestination('clock',true),null);
  assert.equal(homeDestination(null,true),'clock');
  assert.equal(homeDestination('settings',true),'clock');
  assert.equal(homeDestination('settings',false),null);
  const saved = { startWithClock:true,water:{date:'2026-10-19',count:3,goal:6},birthdays:[{id:'a',name:'Ana',day:29,month:2}] };
  const restored = sanitizePreferences(JSON.parse(JSON.stringify(saved)));
  for (const key of Object.keys(saved)) assert.deepEqual(restored[key],saved[key]);
  assert.deepEqual(sanitizePreferences({birthdays:[{id:'bad',name:'X',day:31,month:4}]}).birthdays,[]);
});
