import Pressable from '../components/Feedback';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Control from '../components/Controls';
import { calculate, createDeck, remainingTime } from '../data/extraLogic';
import GameIntro from '../components/GameIntro';
import { useFeedback } from '../components/Feedback';

function Key({ label, onPress, theme, selected, width, height = 32, accessibilityLabel, disabled }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel || label} accessibilityState={{ disabled: !!disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => ({ width, height, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? theme.accent : theme.panel, opacity: pressed ? 0.6 : 1 })}>
    <Text style={{ color: selected ? '#10200a' : theme.text, fontSize: 15, fontWeight: '600' }}>{label}</Text>
  </Pressable>;
}

export function Calculator({ theme, size }) {
  const [display, setDisplay] = useState('0');
  const [left, setLeft] = useState(null);
  const [operation, setOperation] = useState(null);
  const [replace, setReplace] = useState(false);
  const keySize = Math.min(38, (size * 0.64 - 12) / 4);
  function press(key) {
    if (key === 'C') { setDisplay('0'); setLeft(null); setOperation(null); setReplace(false); return; }
    if (['+', '−', '×', '÷', '='].includes(key)) {
      const result = operation && !replace ? calculate(left, display, operation) : display;
      setDisplay(result);
      setLeft(key === '=' || result === 'Error' ? null : result);
      setOperation(key === '=' || result === 'Error' ? null : key);
      setReplace(true);
      return;
    }
    const current = replace || display === 'Error' ? '0' : display;
    if (key === '.' && current.includes('.')) return;
    if (current.length >= 10) return;
    setDisplay(key === '.' ? `${current}.` : current === '0' ? key : current + key);
    setReplace(false);
  }
  return <View style={styles.center}>
    <Text style={[styles.title, { color: theme.accent }]}>CALCULADORA</Text>
    <Text numberOfLines={1} adjustsFontSizeToFit accessibilityLiveRegion="polite" style={{ color: theme.text, width: keySize * 4 + 12, textAlign: 'right', fontSize: 25, marginBottom: 6 }}>{display}</Text>
    <View style={[styles.grid, { width: keySize * 4 + 12 }]}>{['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', 'C', '0', '.', '+'].map(key =>
      <Key key={key} label={key} theme={theme} width={keySize} height={Math.min(30, size * 0.105)} selected={key === operation} onPress={() => press(key)} />)}</View>
    <Pressable accessibilityRole="button" accessibilityLabel="Igual" onPress={() => press('=')} style={{ backgroundColor: theme.accent, width: keySize * 3, borderRadius: 12, marginTop: 5, alignItems: 'center', paddingVertical: 3 }}><Text style={{ fontWeight: '800', color: '#10200a' }}>=</Text></Pressable>
  </View>;
}

export function Timer({ theme, timer, setTimer }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const interval = setInterval(() => setNow(Date.now()), 200); return () => clearInterval(interval); }, []);
  const remaining = remainingTime(timer, now);
  const seconds = Math.ceil(remaining / 1000);
  function preset(duration) { setNow(Date.now()); setTimer({ duration, remaining: duration, running: false, deadline: 0 }); }
  function toggle() {
    const time = Date.now();
    setNow(time);
    setTimer(previous => previous.running && remainingTime(previous, time) > 0
      ? { ...previous, remaining: remainingTime(previous, time), running: false }
      : { ...previous, remaining: remainingTime(previous, time) || previous.duration, running: true, deadline: time + (remainingTime(previous, time) || previous.duration) });
  }
  return <View style={styles.center}><Text style={[styles.title, { color: theme.accent }]}>TEMPORIZADOR</Text>
    <View style={styles.row}>{[[10000, '10 s'], [60000, '1 m'], [180000, '3 m']].map(([duration, label]) => <Key key={duration} label={label} width={44} theme={theme} selected={duration === timer.duration} onPress={() => preset(duration)} />)}</View>
    <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 42, fontVariant: ['tabular-nums'], marginVertical: 8 }}>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</Text>
    <Text style={{ color: theme.accent, fontSize: 11, marginBottom: 10 }}>{timer.running && !remaining ? '¡Tiempo terminado!' : 'Cuenta regresiva'}</Text>
    <View style={styles.row}><Key label={timer.running && remaining > 0 ? 'Pausar' : 'Iniciar'} width={70} selected onPress={toggle} theme={theme} /><Key label="Reiniciar" width={76} onPress={() => preset(timer.duration)} theme={theme} /></View>
  </View>;
}

export function Memory({ theme, size, records, onRecord }) {
  const [started, setStarted] = useState(false);
  const feedback = useFeedback();
  const recorded = useRef(false);
  const [deck, setDeck] = useState(createDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const cardSize = Math.min(46, size * 0.19);
  useEffect(() => {
    if (flipped.length !== 2) return;
    const handle = setTimeout(() => {
      if (deck[flipped[0]] === deck[flipped[1]]) { setMatched(previous => [...previous, ...flipped]); feedback(true); }
      setFlipped([]);
    }, 650);
    return () => clearTimeout(handle);
  }, [flipped, deck, feedback]);
  useEffect(() => {
    if (matched.length === 6 && !recorded.current) { recorded.current = true; onRecord('memory', moves); }
  }, [matched.length, moves, onRecord]);
  function flip(index) {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped(previous => [...previous, index]);
    if (flipped.length === 1) setMoves(previous => previous + 1);
  }
  function restart() { recorded.current = false; setDeck(createDeck()); setFlipped([]); setMatched([]); setMoves(0); }
  if (!started) return <GameIntro title="MEMORIA" theme={theme} instructions="Destapa dos cartas y encuentra las tres parejas. Gana con el menor número de intentos." detail={records.memory === null ? 'Todavía no hay récord' : `Récord: ${records.memory} intentos`} onStart={() => setStarted(true)} />;
  return <View style={styles.center}><Text style={[styles.title, { color: theme.accent }]}>MEMORIA</Text>
    <Text accessibilityLiveRegion="polite" style={{ color: theme.muted, fontSize: 11, marginBottom: 9 }}>{matched.length === 6 ? `¡Ganaste en ${moves} intentos!` : `Encuentra 3 parejas · ${moves} intentos`}</Text>
    <View style={[styles.grid, { width: cardSize * 3 + 8 }]}>{deck.map((symbol, index) => {
      const visible = flipped.includes(index) || matched.includes(index);
      return <Pressable key={index} accessibilityRole="button" accessibilityLabel={`Carta ${index + 1}: ${visible ? symbol : 'oculta'}`} accessibilityState={{ disabled: matched.includes(index) || flipped.length === 2 }} disabled={matched.includes(index) || flipped.length === 2} onPress={() => flip(index)} style={({ pressed }) => ({ width: cardSize, height: cardSize, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: visible ? theme.accent : theme.panel, opacity: pressed ? 0.6 : 1 })}>
        <Ionicons name={visible ? symbol : 'help'} size={23} color={visible ? '#10200a' : theme.muted} />
      </Pressable>;
    })}</View><View style={{ marginTop: 10 }}><Control title="Nueva partida" secondary onPress={restart} theme={theme} /></View>
  </View>;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center' }, title: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 }, row: { flexDirection: 'row', gap: 6, alignItems: 'center' } });
