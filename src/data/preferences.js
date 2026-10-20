const { defaultFavorites, sanitizeFavorites } = require('./favoritesLogic');
const { validBirthday } = require('./dailyLogic');
const defaults = { themeKey: 'midnight', animations: true, haptics: false, count: 0, difficulty: 'normal', records: { memory: null, reaction: null, wins: 0 }, habits: { date: '', done: [] }, simonBest: 0, favorites: defaultFavorites, alarm: { hour: 7, minute: 0, enabled: false, at: 0 }, clockStyle: 'digital', hour12: false, profile: { name: '', goal: '' }, tasks: [], startWithClock: false, water: { date: '', count: 0, goal: 8 }, birthdays: [], curiTapBest: 0, higherLowerBest: 0 };
function sanitizePreferences(value) {
  const source = value && typeof value === 'object' ? value : {};
  const number = (value, fallback, max) => Number.isInteger(value) && value >= 0 && value <= max ? value : fallback;
  return {
    themeKey: source.themeKey === 'ocean' ? 'ocean' : 'midnight',
    animations: typeof source.animations === 'boolean' ? source.animations : true,
    haptics: source.haptics === true,
    clockStyle: ['digital','analog','minimal'].includes(source.clockStyle) ? source.clockStyle : 'digital',
    hour12: source.hour12 === true,
    startWithClock: source.startWithClock === true,
    water: { date: typeof source.water?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(source.water.date) ? source.water.date : '', count: number(source.water?.count, 0, 30), goal: Number.isInteger(source.water?.goal) && source.water.goal >= 1 && source.water.goal <= 20 ? source.water.goal : 8 },
    birthdays: Array.isArray(source.birthdays) ? source.birthdays.filter(item => item && typeof item.id === 'string' && item.id.length <= 80 && typeof item.name === 'string' && item.name.trim() && validBirthday(item.day, item.month)).filter((item, index, items) => items.findIndex(other => other.id === item.id) === index).slice(0, 5).map(item => ({ id: item.id, name: item.name.slice(0, 24), day: item.day, month: item.month })) : [],
    profile: { name: typeof source.profile?.name === 'string' ? source.profile.name.slice(0, 24) : '', goal: typeof source.profile?.goal === 'string' ? source.profile.goal.slice(0, 60) : '' },
    tasks: Array.isArray(source.tasks) ? source.tasks.filter(task => task && typeof task.id === 'string' && task.id.length <= 80 && typeof task.text === 'string' && task.text.trim()).filter((task, index, tasks) => tasks.findIndex(other => other.id === task.id) === index).slice(0, 8).map(task => ({ id: task.id, text: task.text.slice(0, 50), done: task.done === true })) : [],
    count: number(source.count, 0, 9999),
    difficulty: ['easy', 'normal', 'hard'].includes(source.difficulty) ? source.difficulty : 'normal',
    habits: {
      date: typeof source.habits?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(source.habits.date) ? source.habits.date : '',
      done: Array.isArray(source.habits?.done) ? [...new Set(source.habits.done.filter(id => ['study','walk','read'].includes(id)))] : [],
    },
    simonBest: number(source.simonBest, 0, 999999),
    curiTapBest: number(source.curiTapBest, 0, 999999),
    higherLowerBest: number(source.higherLowerBest, 0, 999999),
    favorites: sanitizeFavorites(source.favorites),
    alarm: {
      hour: number(source.alarm?.hour, 7, 23),
      minute: number(source.alarm?.minute, 0, 59),
      enabled: source.alarm?.enabled === true && Number.isSafeInteger(source.alarm?.at) && source.alarm.at > 0 && source.alarm.at <= 8640000000000000,
      at: number(source.alarm?.at, 0, 8640000000000000),
    },
    records: { memory: number(source.records?.memory, null, 999999), reaction: number(source.records?.reaction, null, 999999), wins: number(source.records?.wins, 0, 999999) },
  };
}
module.exports = { defaults, sanitizePreferences };
