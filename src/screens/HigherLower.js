import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Pressable, { useFeedback } from '../components/Feedback';
import Control from '../components/Controls';
import GameIntro from '../components/GameIntro';
import { nextNumber, guessRound } from '../data/higherLowerLogic';

function freshGame() { return { current: Math.floor(Math.random() * 9) + 1, lives: 3, score: 0, streak: 0, bestStreak: 0 }; }
export default function HigherLower({ theme, best, setBest }) {
  const [phase, setPhase] = useState('intro');
  const [game, setGame] = useState(freshGame);
  const locked = useRef(false);
  const feedback = useFeedback();
  function start() { setGame(freshGame()); locked.current = false; setPhase('play'); }
  function guess(choice) {
    if (phase !== 'play' || locked.current) return;
    locked.current = true;
    const result = guessRound(game, choice, nextNumber(game.current));
    setGame(result);
    if (result.bestStreak > best) setBest(previous => Math.max(previous, result.bestStreak));
    if (result.correct) feedback(true);
    setPhase(result.lives === 0 ? 'over' : 'reveal');
  }
  if (phase === 'intro') return <GameIntro title="MAYOR O MENOR" theme={theme} instructions="Adivina si el próximo número del 1 al 9 será mayor o menor. Tienes tres vidas y nunca se repite el mismo número seguido." detail={`Mejor racha: ${best}`} onStart={start} />;
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: theme.accent, fontWeight: '800', fontSize: 10, marginBottom: 9 }}>MAYOR O MENOR</Text>
    <Text style={{ color: theme.muted, fontSize: 11 }}>Vidas: {game.lives} · Puntos: {game.score}</Text>
    <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 56, marginVertical: 5 }}>{game.current}</Text>
    {phase !== 'play' && <Text style={{ color: game.correct ? theme.accent : '#ffad43', fontSize: 12, marginBottom: 7 }}>{game.previous} → {game.current} · {game.correct ? '¡Acertaste!' : 'Fallaste'}</Text>}
    <Text style={{ color: theme.muted, fontSize: 11, marginBottom: 12 }}>{phase === 'over' ? `Fin · Mejor racha de partida: ${game.bestStreak}` : `Racha: ${game.streak} · Récord: ${best}`}</Text>
    {phase === 'play' ? <View style={{ flexDirection: 'row', gap: 8 }}>{[['lower','↓ Menor'],['higher','↑ Mayor']].map(([choice, title]) => <Pressable key={choice} accessibilityRole="button" accessibilityLabel={choice === 'lower' ? 'El siguiente será menor' : 'El siguiente será mayor'} onPress={() => guess(choice)} style={{ minWidth: 82, paddingVertical: 13, borderRadius: 15, backgroundColor: theme.panel, alignItems: 'center' }}><Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>{title}</Text></Pressable>)}</View> : <Control title={phase === 'over' ? 'Otra partida' : 'Siguiente'} theme={theme} onPress={phase === 'over' ? start : () => { locked.current = false; setPhase('play'); }} />}
  </View>;
}
