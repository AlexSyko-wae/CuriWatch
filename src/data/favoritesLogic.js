const favoriteIds = ['clock', 'stopwatch', 'activity', 'settings', 'calculator', 'timer', 'memory', 'calendar', 'counter', 'breathe', 'tictactoe', 'reaction', 'habits', 'pomodoro', 'simon', 'alarms', 'converter', 'chance', 'profile', 'tasks', 'battery', 'water', 'birthdays', 'curitap', 'higherlower'];
const defaultFavorites = ['clock', 'timer', 'tasks', 'pomodoro'];
function sanitizeFavorites(value) {
  return Array.isArray(value) ? [...new Set(value.filter(id => favoriteIds.includes(id)))].slice(0, 4) : [...defaultFavorites];
}
function toggleFavorite(favorites, id) {
  if (!favoriteIds.includes(id)) return favorites;
  if (favorites.includes(id)) return favorites.filter(value => value !== id);
  return favorites.length < 4 ? [...favorites, id] : favorites;
}
module.exports = { defaultFavorites, sanitizeFavorites, toggleFavorite };
