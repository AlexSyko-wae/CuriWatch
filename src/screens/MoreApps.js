import Pressable from '../components/Feedback';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';
import Control from '../components/Controls';
import { boardResult, computerMove, monthCells } from '../data/gameLogic';
import GameIntro from '../components/GameIntro';
import { useFeedback } from '../components/Feedback';

function Frame({ title, theme, children }) {
  return <View style={styles.center}><Text style={[styles.title, { color: theme.accent }]}>{title}</Text>{children}</View>;
}
function Button({ title, onPress, theme, disabled, width = 42, height = 36, label }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label || title} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => ({ width, height, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.panel, opacity: pressed || disabled ? 0.65 : 1 })}><Text style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}>{title}</Text></Pressable>;
}
export function Calendar({ theme, size }) {
  const [month, setMonth] = useState(() => { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), 1); });
  const today = new Date();
  const cell = Math.min(25, size * 0.095);
  function change(offset) { setMonth(date => new Date(date.getFullYear(), date.getMonth() + offset, 1)); }
  return <Frame title="CALENDARIO" theme={theme}>
    <View style={styles.row}><Button title="‹" label="Mes anterior" onPress={() => change(-1)} width={30} height={26} theme={theme} /><Text style={{ color: theme.text, fontSize: 11, width: 96, textAlign: 'center' }}>{month.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}</Text><Button title="›" label="Mes siguiente" onPress={() => change(1)} width={30} height={26} theme={theme} /></View>
    <View style={{ width: cell * 7, flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
      {['L','M','X','J','V','S','D'].map((day, index) => <Text key={`day${index}`} style={{ width: cell, textAlign: 'center', color: theme.accent, fontSize: 9 }}>{day}</Text>)}
      {monthCells(month.getFullYear(), month.getMonth()).map((day, index) => {
        const active = day === today.getDate() && month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear();
        return <View key={index} style={{ width: cell, height: cell * 0.75, borderRadius: 8, backgroundColor: active ? theme.accent : 'transparent', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: active ? '#10200a' : theme.text, fontSize: 10 }}>{day || ''}</Text></View>;
      })}
    </View><Pressable accessibilityRole="button" onPress={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))} style={{ padding: 7 }}><Text style={{ color: theme.accent, fontSize: 11 }}>Ir a hoy</Text></Pressable>
  </Frame>;
}
export function Counter({ theme, count, setCount }) {
  return <Frame title="CONTADOR" theme={theme}><Text style={{ color: theme.text, fontSize: 44, marginVertical: 10 }}>{count}</Text><View style={styles.row}><Button title="−" label="Restar uno" theme={theme} onPress={() => setCount(value => Math.max(0, value - 1))} /><Button title="+" label="Sumar uno" theme={theme} onPress={() => setCount(value => Math.min(9999, value + 1))} /></View><View style={{ marginTop: 12 }}><Control title="Reiniciar" theme={theme} secondary onPress={() => setCount(0)} /></View></Frame>;
}
export function Breathe({ theme }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const seconds = Math.min(32, Math.floor((Date.now() - start) / 1000));
      setElapsed(seconds);
      if (seconds === 32) setRunning(false);
    }, 200);
    return () => clearInterval(interval);
  }, [running]);
  const inhale = elapsed % 8 < 4;
  return <Frame title="RESPIRACIÓN" theme={theme}><View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: theme.accent, alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}><Text style={{ color: theme.text, fontSize: 18 }}>{running ? (inhale ? 'Inhala' : 'Exhala') : elapsed === 32 ? 'Listo' : 'Pausa'}</Text><Text style={{ color: theme.accent, fontSize: 14 }}>{running ? 4 - elapsed % 4 : '32 s'}</Text></View><Text style={{ color: theme.muted, fontSize: 11, marginBottom: 12 }}>{running ? `Ciclo ${Math.min(4, Math.floor(elapsed / 8) + 1)} de 4` : 'Sigue un ritmo cómodo'}</Text><Control theme={theme} title={running ? 'Detener' : 'Comenzar'} onPress={() => { setElapsed(0); setRunning(value => !value); }} /></Frame>;
}
export function TicTacToe({ theme, size, records, onRecord, difficulty, setDifficulty }) {
  const [started, setStarted] = useState(false);
  const feedback = useFeedback();
  const recorded = useRef(false);
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const result = boardResult(board);
  useEffect(() => {
    if (result && !recorded.current) {
      recorded.current = true; feedback(true);
      if (result === 'X') onRecord('wins', 1);
    }
  }, [result, feedback, onRecord]);
  useEffect(() => {
    if (turn !== 'O' || result) return;
    const handle = setTimeout(() => {
      setBoard(previous => { const index = computerMove(previous, difficulty); if (index < 0) return previous; const next = [...previous]; next[index] = 'O'; return next; });
      setTurn('X');
    }, 400);
    return () => clearTimeout(handle);
  }, [turn, result, difficulty]);
  const cell = Math.min(40, size * 0.15);
  function play(index) {
    if (turn !== 'X' || result || board[index]) return;
    setBoard(previous => { const next = [...previous]; next[index] = 'X'; return next; }); setTurn('O');
  }
  function restart() { recorded.current = false; setBoard(Array(9).fill(null)); setTurn('X'); setStarted(false); }
  if (!started) return <GameIntro title="TRES EN RAYA" theme={theme} instructions="Eres X. Forma una línea de tres antes que el reloj (O)." detail={`Victorias guardadas: ${records.wins}`} onStart={() => setStarted(true)}>
    <View style={{ gap: 5 }}>{[['easy','Fácil'],['normal','Normal'],['hard','Difícil']].map(([value, label]) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: value === difficulty }} onPress={() => setDifficulty(value)} style={{ paddingVertical: 5, paddingHorizontal: 18, borderRadius: 10, backgroundColor: difficulty === value ? theme.accent : theme.panel }}><Text style={{ color: difficulty === value ? '#10200a' : theme.text, textAlign: 'center' }}>{label}</Text></Pressable>)}</View>
  </GameIntro>;
  return <Frame title="TRES EN RAYA" theme={theme}><Text accessibilityLiveRegion="polite" style={{ color: theme.muted, fontSize: 11, marginBottom: 8 }}>{result === 'X' ? '¡Ganaste!' : result === 'O' ? 'Ganó el reloj' : result === 'draw' ? 'Empate' : turn === 'X' ? 'Tu turno · X' : 'El reloj piensa · O'}</Text><View style={{ width: cell * 3 + 8, flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{board.map((value, index) => <Button key={index} title={value || '·'} label={`Casilla ${index + 1}: ${value || 'vacía'}`} width={cell} height={cell} theme={theme} disabled={!!value || !!result || turn !== 'X'} onPress={() => play(index)} />)}</View><View style={{ marginTop: 8 }}><Control title="Otra partida" secondary theme={theme} onPress={restart} /></View></Frame>;
}
export function Reaction({ theme, records, onRecord }) {
  const [started, setStarted] = useState(false);
  const feedback = useFeedback();
  const [phase, setPhase] = useState('idle');
  const [score, setScore] = useState(null);
  const best = records.reaction;
  const timeout = useRef(null);
  const readyAt = useRef(0);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') { clearTimeout(timeout.current); readyAt.current = 0; setPhase('idle'); }
    });
    return () => { clearTimeout(timeout.current); subscription.remove(); };
  }, []);
  function tap() {
    if (phase === 'waiting') { clearTimeout(timeout.current); setPhase('early'); return; }
    if (phase === 'ready') {
      const elapsed = Math.max(0, performance.now() - readyAt.current);
      const milliseconds = Math.round(elapsed);
      setScore(milliseconds); onRecord('reaction', milliseconds); feedback(true); setPhase('result'); return;
    }
    setPhase('waiting');
    timeout.current = setTimeout(() => { readyAt.current = performance.now(); setPhase('ready'); }, 1500 + Math.random() * 2500);
  }
  const message = { idle: 'Comenzar', waiting: 'Espera…', ready: '¡TOCA YA!', early: 'Muy pronto', result: `${score} ms` }[phase];
  if (!started) return <GameIntro title="REACCIÓN" theme={theme} instructions="Espera la señal y toca lo más rápido posible. Si te adelantas, pierdes el intento." detail={best === null ? 'Todavía no hay récord' : `Mejor marca: ${best} ms`} onStart={() => setStarted(true)} />;
  return <Frame title="REACCIÓN" theme={theme}><Text style={{ color: theme.muted, fontSize: 11, marginBottom: 12 }}>Toca cuando aparezca ¡TOCA YA!</Text><Pressable accessibilityRole="button" accessibilityLabel={message} onPress={tap} style={({ pressed }) => ({ width: 124, height: 88, borderRadius: 22, backgroundColor: phase === 'ready' ? theme.accent : theme.panel, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}><Text accessibilityLiveRegion="polite" style={{ color: phase === 'ready' ? '#10200a' : theme.text, fontWeight: '800', fontSize: 18 }}>{message}</Text></Pressable><Text style={{ color: theme.accent, fontSize: 11, marginTop: 12 }}>{best === null ? 'Sin marca todavía' : `Mejor: ${best} ms`}</Text><Text style={{ color: theme.muted, fontSize: 10, marginTop: 6 }}>{phase === 'result' || phase === 'early' ? 'Toca para repetir' : 'Espera la señal'}</Text></Frame>;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, title: { fontSize: 9, letterSpacing: 1.5, fontWeight: '800', marginBottom: 8 }, row: { flexDirection: 'row', alignItems: 'center', gap: 8 } });
