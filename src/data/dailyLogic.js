const { localDay } = require('./productivityLogic');
function validBirthday(day, month) {
  return Number.isInteger(day) && Number.isInteger(month) && month >= 1 && month <= 12 && day >= 1 && day <= new Date(2000, month, 0).getDate();
}
function daysUntilBirthday(day, month, now = new Date()) {
  if (!validBirthday(day, month)) return null;
  function dateIn(year) { return new Date(year, month - 1, Math.min(day, new Date(year, month, 0).getDate())); }
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = dateIn(today.getFullYear());
  if (target < today) target = dateIn(today.getFullYear() + 1);
  return Math.round((Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
}
function adjustWater(water, direction, day = localDay()) {
  const count = water.date === day ? water.count : 0;
  return { ...water, date: day, count: Math.max(0, Math.min(30, count + direction)) };
}
function homeDestination(screen, startWithClock) { return screen === 'clock' ? null : startWithClock ? 'clock' : null; }
module.exports = { validBirthday, daysUntilBirthday, adjustWater, homeDestination };
