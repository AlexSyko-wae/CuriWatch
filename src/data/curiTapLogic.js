const ROUND_MS = 20000;
function targetSize(score) { return Math.max(30, 54 - Math.floor(Math.max(0, score) / 5) * 4); }
function nextTarget(score, previous, random = Math.random) {
  const size = targetSize(score);
  const radius = 94 - size / 2 - 6;
  for (let attempt = 0; attempt < 12; attempt++) {
    const angle = random() * Math.PI * 2;
    const distance = radius * (0.6 + random() * 0.4);
    const point = { x: 94 + Math.cos(angle) * distance, y: 94 + Math.sin(angle) * distance, size };
    if (!previous || Math.hypot(point.x - previous.x, point.y - previous.y) >= size) return point;
  }
  return { x: 94 + (previous.x >= 94 ? -radius : radius), y: 94, size };
}
function timeLeft(deadline, now) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
module.exports = { ROUND_MS, targetSize, nextTarget, timeLeft };
