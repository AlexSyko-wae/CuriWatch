const { test } = require('node:test');
const assert = require('node:assert/strict');
const { boardResult, computerMove, monthCells } = require('../src/data/gameLogic');
test('three in a row detects all lines, draws and unfinished boards', () => {
  for (const line of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
    const board = Array(9).fill(null); line.forEach(index => board[index] = 'X');
    assert.equal(boardResult(board), 'X');
  }
  assert.equal(boardResult(['X','O','X','X','O','O','O','X','X']), 'draw');
  assert.equal(boardResult(Array(9).fill(null)), null);
});
test('computer wins before blocking, blocks threats and avoids occupied cells', () => {
  assert.equal(computerMove(['O','O',null,'X','X',null,null,null,null]), 2);
  assert.equal(computerMove(['X','X',null,null,'O',null,null,null,null]), 2);
  assert.equal(computerMove(Array(9).fill(null)), 4);
  assert.equal(computerMove(['X','X','X',null,null,null,null,null,null]), -1);
  const visit = (board, turn) => {
    if (boardResult(board)) return;
    if (turn === 'O') {
      const index = computerMove(board);
      assert.ok(index >= 0 && index < 9); assert.equal(board[index], null);
      const next = [...board]; next[index] = 'O'; visit(next, 'X');
    } else {
      board.forEach((value, index) => { if (!value) { const next = [...board]; next[index] = 'X'; visit(next, 'O'); } });
    }
  };
  visit(Array(9).fill(null), 'X');
});
test('calendar starts on Monday and handles leap years and year boundaries', () => {
  assert.equal(monthCells(2024, 1).filter(Boolean).length, 29);
  assert.equal(monthCells(2025, 1).filter(Boolean).length, 28);
  assert.equal(monthCells(2026, 9)[3], 1);
  assert.deepEqual(monthCells(2026, 12), monthCells(2027, 0));
  assert.equal(monthCells(2026, 10).length, 42);
});
test('easy mode picks an empty cell and hard mode cannot lose to any player sequence', () => {
  assert.equal(computerMove(['X',null,null,null,null,null,null,null,null], 'easy', () => 0), 1);
  function visit(board, turn) {
    const result = boardResult(board);
    assert.notEqual(result, 'X');
    if (result) return;
    if (turn === 'O') {
      const index = computerMove(board, 'hard');
      assert.equal(board[index], null);
      const next = [...board]; next[index] = 'O'; visit(next, 'X');
    } else {
      board.forEach((value, index) => { if (!value) { const next = [...board]; next[index] = 'X'; visit(next, 'O'); } });
    }
  }
  visit(Array(9).fill(null), 'X');
});
