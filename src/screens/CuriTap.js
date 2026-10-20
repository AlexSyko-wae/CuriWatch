import React, { useEffect, useRef, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Pressable, { useFeedback } from '../components/Feedback';
import Control from '../components/Controls';
import GameIntro from '../components/GameIntro';
import { nextTarget, ROUND_MS, timeLeft } from '../data/curiTapLogic';

export default function CuriTap({ theme, best, setBest }) {
  const [phase, setPhase] = useState('intro');
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(20);
  const [target, setTarget] = useState(null);
  const running = useRef(false);
  const deadline = useRef(0);
  const points = useRef(0);
  const current = useRef(null);
  const generation = useRef(0);
  const feedback = useFeedback();

  function finish() {
    if (!running.current) return;
    running.current = false; setSeconds(0); setPhase('result');
    setBest(previous => Math.max(previous, points.current)); feedback(true);
  }
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      const now = performance.now();
      setSeconds(timeLeft(deadline.current, now));
      if (now >= deadline.current) finish();
    }, 50);
    return () => clearInterval(interval);
  }, [phase, setBest, feedback]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active' && running.current) { running.current = false; setPhase('cancelled'); }
    });
    return () => { running.current = false; subscription.remove(); };
  }, []);
  function start() {
    generation.current++;
    const first = { ...nextTarget(0), version: generation.current };
    current.current = first; setTarget(first); points.current = 0;
    setScore(0); setSeconds(20); deadline.current = performance.now() + ROUND_MS;
    running.current = true; setPhase('playing');
  }
  function hit(version) {
    if (!running.current || version !== generation.current) return;
    if (performance.now() >= deadline.current) { finish(); return; }
    points.current++; generation.current++;
    const next = { ...nextTarget(points.current, current.current), version: generation.current };
    current.current = next; setTarget(next); setScore(points.current);
  }
  if (phase === 'intro') return <GameIntro title="CURITAP" theme={theme} instructions="Toca el objetivo tantas veces como puedas en 20 segundos. Cada cinco aciertos se hace más pequeño." detail={`Récord: ${best} puntos`} onStart={start} />;
  if (phase === 'result' || phase === 'cancelled') return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: theme.accent, fontWeight: '800', fontSize: 13, marginBottom: 12 }}>CURITAP</Text>
    <Text style={{ color: theme.text, fontSize: 12 }}>{phase === 'cancelled' ? 'Partida cancelada' : '¡Tiempo terminado!'}</Text>
    <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 48, marginVertical: 10 }}>{score}</Text>
    <Text style={{ color: theme.muted, fontSize: 11, marginBottom: 15 }}>{phase === 'cancelled' ? 'Saliste de la app · No cuenta' : `Récord: ${best} puntos`}</Text>
    <Control title="Otra partida" theme={theme} onPress={start} />
  </View>;
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '800', marginBottom: 5 }}>CURITAP</Text>
    <Text style={{ color: theme.text, fontSize: 13, marginBottom: 6, fontVariant: ['tabular-nums'] }}>{seconds} s · {score} puntos</Text>
    <View style={{ width: 188, height: 188, borderRadius: 94, backgroundColor: theme.panel, overflow: 'hidden' }}>
      <Pressable key={target.version} accessibilityRole="button" accessibilityLabel="Tocar objetivo" onPress={() => hit(target.version)} style={({ pressed }) => ({ position: 'absolute', left: target.x - target.size / 2, top: target.y - target.size / 2, width: target.size, height: target.size, borderRadius: target.size / 2, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}><Ionicons name="locate" size={Math.round(target.size * 0.55)} color="#10200a" /></Pressable>
    </View><Text style={{ color: theme.muted, fontSize: 10, marginTop: 6 }}>Récord: {best}</Text>
  </View>;
}
