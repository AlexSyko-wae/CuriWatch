const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function boardResult(board) {
  for (const [a, b, c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return board.every(Boolean) ? 'draw' : null;
}
function computerMove(board, difficulty = 'normal', random = Math.random) {
  if (boardResult(board)) return -1;
  const available = board.map((value, index) => value ? -1 : index).filter(index => index >= 0);
  if (difficulty === 'easy') return available[Math.floor(random() * available.length)];
  if (difficulty === 'hard') {
    function score(position, turn, depth) {
      const result = boardResult(position);
      if (result) return result === 'O' ? 10 - depth : result === 'X' ? depth - 10 : 0;
      const scores = [];
      position.forEach((value, index) => {
        if (value) return;
        const next = [...position]; next[index] = turn;
        scores.push(score(next, turn === 'O' ? 'X' : 'O', depth + 1));
      });
      return turn === 'O' ? Math.max(...scores) : Math.min(...scores);
    }
    let best = -Infinity; let move = available[0];
    for (const index of available) {
      const next = [...board]; next[index] = 'O';
      const value = score(next, 'X', 0);
      if (value > best) { best = value; move = index; }
    }
    return move;
  }
  for (const player of ['O', 'X']) {
    for (let index = 0; index < 9; index++) {
      if (board[index]) continue;
      const trial = [...board]; trial[index] = player;
      if (boardResult(trial) === player) return index;
    }
  }
  return [4,0,2,6,8,1,3,5,7].find(index => !board[index]) ?? -1;
}
function monthCells(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: 42 }, (_, index) => index >= offset && index < offset + days ? index - offset + 1 : null);
}
module.exports = { boardResult, computerMove, monthCells };
