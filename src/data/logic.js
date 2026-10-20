function formatElapsed(milliseconds) {
  const centiseconds = Math.floor(Math.max(0, milliseconds) / 10);
  const pad = value => String(value).padStart(2, '0');
  return `${pad(Math.floor(centiseconds / 6000))}:${pad(Math.floor(centiseconds / 100) % 60)}.${pad(centiseconds % 100)}`;
}
function demoActivity(tick) {
  return { steps: 3240 + (tick % 100) * 7, heartRate: 70 + (tick % 7) * 2 };
}
module.exports = { formatElapsed, demoActivity };
