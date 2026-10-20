function nextNumber(current, random = Math.random) {
  const value = Math.floor(random() * 8) + 1;
  return value >= current ? value + 1 : value;
}
function guessRound(game, choice, next) {
  if (game.lives <= 0 || !['higher','lower'].includes(choice) || !Number.isInteger(next) || next < 1 || next > 9 || next === game.current) return game;
  const correct = choice === 'higher' ? next > game.current : next < game.current;
  const streak = correct ? game.streak + 1 : 0;
  return { ...game, previous: game.current, current: next, correct, lives: game.lives - (correct ? 0 : 1), score: game.score + (correct ? 1 : 0), streak, bestStreak: Math.max(game.bestStreak, streak) };
}
module.exports = { nextNumber, guessRound };
