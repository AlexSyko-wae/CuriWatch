function nextAlarm(hour, minute, now = Date.now()) {
  const date = new Date(now);
  date.setHours(hour, minute, 0, 0);
  if (date.getTime() <= now) date.setDate(date.getDate() + 1);
  return date.getTime();
}
const conversions = {
  temperature: { units: ['°C', '°F'], forward: value => value * 9 / 5 + 32, backward: value => (value - 32) * 5 / 9 },
  distance: { units: ['km', 'mi'], forward: value => value / 1.609344, backward: value => value * 1.609344 },
  weight: { units: ['kg', 'lb'], forward: value => value / 0.45359237, backward: value => value * 0.45359237 },
};
function convertValue(input, kind, reverse = false) {
  const text = String(input).trim().replace(',', '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) || !conversions[kind]) return null;
  const value = Number(text);
  const result = conversions[kind][reverse ? 'backward' : 'forward'](value);
  return Number.isFinite(result) ? Number(result.toFixed(5)) : null;
}
function rollDie(random = Math.random) { return Math.floor(random() * 6) + 1; }
function flipCoin(random = Math.random) { return random() < 0.5 ? 'Cara' : 'Cruz'; }
module.exports = { nextAlarm, conversions, convertValue, rollDie, flipCoin };
