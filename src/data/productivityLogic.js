function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const habitIds = ['study', 'walk', 'read'];
function toggleHabit(habits, id, day) {
  if (!habitIds.includes(id)) return habits;
  const done = habits.date === day ? habits.done : [];
  return { date: day, done: done.includes(id) ? done.filter(value => value !== id) : [...done, id] };
}
function finishPomodoro(timer, now) {
  if (!timer.running || now < timer.deadline) return timer;
  const phase = timer.phase === 'focus' ? 'break' : 'focus';
  return { ...timer, phase, running: false, deadline: 0, remaining: phase === 'focus' ? timer.focusDuration : timer.breakDuration, completed: timer.completed + (timer.phase === 'focus' ? 1 : 0) };
}
function checkSimon(sequence, index, input) {
  if (index < 0 || index >= sequence.length || sequence[index] !== input) return 'wrong';
  return index === sequence.length - 1 ? 'complete' : 'correct';
}
module.exports = { localDay, habitIds, toggleHabit, finishPomodoro, checkSimon };
