function addTask(tasks, text, id) {
  const title = text.trim().slice(0, 50);
  if (!title || tasks.length >= 8 || tasks.some(task => task.id === id)) return tasks;
  return [...tasks, { id, text: title, done: false }];
}
function toggleTask(tasks, id) {
  return tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
}
function clockAngles(date) {
  return { hour: (date.getHours() % 12) * 30 + date.getMinutes() * 0.5, minute: date.getMinutes() * 6 + date.getSeconds() * 0.1, second: date.getSeconds() * 6 };
}
module.exports = { addTask, toggleTask, clockAngles };
