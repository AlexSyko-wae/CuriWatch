import React, { useEffect, useRef, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import Pressable, { useFeedback } from '../components/Feedback';
import Control from '../components/Controls';
import GameIntro from '../components/GameIntro';
import { localDay, toggleHabit, checkSimon } from '../data/productivityLogic';

const center = { flex: 1, alignItems: 'center', justifyContent: 'center' };
function Title({ theme, children }) {
  return <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 12 }}>{children}</Text>;
}
export function Habits({ theme, habits, setHabits }) {
  const [day, setDay] = useState(localDay);
  useEffect(() => { const interval = setInterval(() => setDay(localDay()), 1000); return () => clearInterval(interval); }, []);
  const done = habits.date === day ? habits.done : [];
  return <View style={center}><Title theme={theme}>HÁBITOS DE HOY</Title>
    <Text style={{ color: theme.muted, fontSize: 11, marginBottom: 10 }}>{done.length} de 3 completados</Text>
    {[['study','Estudiar'],['walk','Caminar'],['read','Leer']].map(([id, label]) => <Pressable key={id} accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked: done.includes(id) }} onPress={() => setHabits(previous => toggleHabit(previous, id, localDay()))} style={{ width: 160, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: theme.panel, marginBottom: 6 }}>
      <Text style={{ color: done.includes(id) ? theme.accent : theme.text, fontSize: 14 }}>{done.includes(id) ? '✓' : '○'}  {label}</Text>
    </Pressable>)}
    <Text style={{ color: theme.muted, fontSize: 10, marginTop: 6 }}>Se renuevan cada día</Text>
  </View>;
}
export function Pomodoro({ theme, timer, setTimer }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const interval = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(interval); }, []);
  const remaining = timer.running ? Math.max(0, timer.deadline - now) : timer.remaining;
  const seconds = Math.ceil(remaining / 1000);
  function toggle() {
    const time = Date.now(); setNow(time);
    setTimer(previous => previous.running ? { ...previous, running: false, remaining: Math.max(0, previous.deadline - time) } : { ...previous, running: true, deadline: time + previous.remaining });
  }
  function reset(quick = timer.focusDuration === 10000) {
    setTimer({ phase: 'focus', remaining: quick ? 10000 : 1500000, focusDuration: quick ? 10000 : 1500000, breakDuration: quick ? 5000 : 300000, running: false, deadline: 0, completed: 0 });
  }
  return <View style={center}><Title theme={theme}>POMODORO</Title>
    <Text style={{ color: theme.accent, fontSize: 13 }}>{timer.phase === 'focus' ? 'Estudio' : 'Descanso'}</Text>
    <Text style={{ color: theme.text, fontSize: 44, fontVariant: ['tabular-nums'], marginVertical: 8 }}>{String(Math.floor(seconds / 60)).padStart(2,'0')}:{String(seconds % 60).padStart(2,'0')}</Text>
    <Text style={{ color: theme.muted, fontSize: 11, marginBottom: 12 }}>Sesiones completadas: {timer.completed}</Text>
    <View style={{ flexDirection: 'row', gap: 6 }}><Control title={timer.running ? 'Pausar' : 'Iniciar'} theme={theme} onPress={toggle} /><Control title="Reiniciar" secondary theme={theme} onPress={() => reset()} /></View>
    <Pressable accessibilityRole="switch" accessibilityLabel="Modo de prueba de diez segundos" accessibilityState={{ checked: timer.focusDuration === 10000 }} onPress={() => reset(timer.focusDuration !== 10000)} style={{ padding: 10 }}><Text style={{ color: theme.muted, fontSize: 10 }}>{timer.focusDuration === 10000 ? 'Prueba: 10 s / 5 s' : '25 min / 5 min · Probar rápido'}</Text></Pressable>
  </View>;
}

const pads = [ { color: '#e95e69', name: 'Rojo' }, { color: '#3ea7ed', name: 'Azul' }, { color: '#e4b544', name: 'Amarillo' }, { color: '#53bd83', name: 'Verde' } ];
export function Simon({ theme, best, setBest }) {
  const [started, setStarted] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [active, setActive] = useState(null);
  const [position, setPosition] = useState(0);
  const inputPosition = useRef(0);
  const locked = useRef(false);
  const feedback = useFeedback();
  useEffect(() => {
    if (phase !== 'show') return;
    let index = 0;
    let handle;
    function show() {
      setActive(sequence[index]);
      handle = setTimeout(() => {
        setActive(null); index++;
        if (index < sequence.length) handle = setTimeout(show, 220);
        else { setPhase('input'); inputPosition.current = 0; locked.current = false; }
      }, 550);
    }
    handle = setTimeout(show, 400);
    return () => clearTimeout(handle);
  }, [phase, sequence]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') { setPhase('idle'); setActive(null); locked.current = true; }
    });
    return () => subscription.remove();
  }, []);
  function next() {
    locked.current = true; inputPosition.current = 0; setPosition(0); setActive(null);
    setSequence(previous => [...(phase === 'won' ? previous : []), Math.floor(Math.random() * 4)]); setPhase('show');
  }
  function tap(index) {
    if (phase !== 'input' || locked.current) return;
    const result = checkSimon(sequence, inputPosition.current, index);
    if (result === 'wrong') { locked.current = true; setPhase('lost'); return; }
    inputPosition.current++; setPosition(inputPosition.current);
    if (result === 'complete') {
      locked.current = true; setPhase('won'); feedback(true); setBest(previous => Math.max(previous, sequence.length));
    }
  }
  if (!started) return <GameIntro theme={theme} title="SIMÓN DICE" instructions="Observa los colores y repite la secuencia. Cada ronda añade un paso." detail={`Récord: ${best} rondas`} onStart={() => { setStarted(true); next(); }} />;
  const message = { idle: 'Intento cancelado', show: 'Observa…', input: `Tu turno · ${position}/${sequence.length}`, won: '¡Ronda completada!', lost: 'Secuencia incorrecta' }[phase];
  return <View style={center}><Title theme={theme}>SIMÓN DICE · {sequence.length}</Title>
    <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 12, marginBottom: 10 }}>{message}</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 132, gap: 8 }}>{pads.map((pad, index) => <Pressable key={pad.name} accessibilityRole="button" accessibilityLabel={`${pad.name}, ${index + 1}`} accessibilityState={{ disabled: phase !== 'input' }} disabled={phase !== 'input'} onPress={() => tap(index)} style={({ pressed }) => ({ width: 62, height: 52, backgroundColor: pad.color, borderRadius: 14, opacity: active === index || pressed ? 1 : 0.55, borderWidth: active === index ? 4 : 1, borderColor: active === index ? '#fff' : '#ffffff30', alignItems: 'center', justifyContent: 'center' })}><Text style={{ color: '#08121a', fontSize: 20, fontWeight: '800' }}>{index + 1}</Text></Pressable>)}</View>
    <Text style={{ color: theme.muted, fontSize: 10, marginTop: 8, marginBottom: 8 }}>Récord: {best} rondas</Text>
    {['won','lost','idle'].includes(phase) && <Control title={phase === 'won' ? 'Siguiente' : 'Otra partida'} theme={theme} onPress={next} />}
  </View>;
}
