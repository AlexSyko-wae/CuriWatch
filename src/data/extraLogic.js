function calculate(left, right, operation) {
  const a = Number(left);
  const b = Number(right);
  let result;
  if (operation === '+') result = a + b;
  else if (operation === '−') result = a - b;
  else if (operation === '×') result = a * b;
  else if (operation === '÷') result = b === 0 ? NaN : a / b;
  else return right;
  return Number.isFinite(result) ? String(Number(result.toPrecision(10))) : 'Error';
}
function remainingTime(timer, now) {
  return timer.running ? Math.max(0, timer.deadline - now) : timer.remaining;
}
function createDeck(random = Math.random) {
  const cards = ['sunny', 'heart', 'moon', 'sunny', 'heart', 'moon'];
  for (let index = cards.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [cards[index], cards[other]] = [cards[other], cards[index]];
  }
  return cards;
}
module.exports = { calculate, remainingTime, createDeck };
