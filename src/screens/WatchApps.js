import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Control from '../components/Controls';
import { demoActivity, formatElapsed } from '../data/logic';
import Pressable from '../components/Feedback';
import { clockAngles } from '../data/personalLogic';

export function Clock({ theme, clockStyle = 'digital', hour12 = false, profile }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  const time = now.toLocaleTimeString('es-MX', { hour12, hour: '2-digit', minute: '2-digit' });
  const angles = clockAngles(now);
  const date = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
  if (clockStyle === 'analog') return <View style={styles.center}>
    <View accessible accessibilityLabel={`Hora: ${time}`} style={{ width: 144, height: 144, borderRadius: 72, borderWidth: 2, borderColor: theme.panel }}>
      {[12,1,2,3,4,5,6,7,8,9,10,11].map((number, index) => <Text key={number} style={{ position: 'absolute', left: 60 + Math.sin(index * Math.PI / 6) * 57, top: 61 - Math.cos(index * Math.PI / 6) * 57, width: 20, textAlign: 'center', fontSize: 10, color: theme.muted }}>{number}</Text>)}
      {[[angles.hour, 33, 4, theme.text], [angles.minute, 49, 3, theme.text], [angles.second, 53, 1, theme.accent]].map(([angle, length, width, color], index) => <View key={index} style={{ position: 'absolute', width: 140, height: 140, transform: [{ rotate: `${angle}deg` }] }}><View style={{ position: 'absolute', left: 70 - width / 2, top: 70 - length, height: length, width, borderRadius: 3, backgroundColor: color }} /></View>)}
      <View style={{ position: 'absolute', top: 67, left: 67, width: 6, height: 6, borderRadius: 3, backgroundColor: theme.accent }} />
    </View><Text style={[styles.note, { color: theme.muted }]}>{date}</Text>
  </View>;
  if (clockStyle === 'minimal') return <View style={styles.center}>
    <Text style={{ color: theme.accent, fontSize: 12, marginBottom: 14 }} numberOfLines={1}>{profile?.name || 'CuriWatch'}</Text>
    <Text numberOfLines={1} adjustsFontSizeToFit style={{ color: theme.text, fontSize: hour12 ? 36 : 48, fontWeight: '200', fontVariant: ['tabular-nums'], width: 210, textAlign: 'center' }}>{time}</Text>
    <Text style={[styles.note, { color: theme.muted }]}>{date}</Text>
    {!!profile?.goal && <Text numberOfLines={2} style={{ color: theme.accent, fontSize: 11, textAlign: 'center', width: 185, marginTop: 14 }}>{profile.goal}</Text>}
  </View>;
  return <View style={styles.center}><Text style={[styles.eyebrow, { color: theme.accent }]}>HORA LOCAL</Text>
    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.time, { color: theme.text, width: 225, textAlign: 'center' }]}>{time}</Text>
    <Text style={{ color: theme.accent, fontSize: 20 }}>{String(now.getSeconds()).padStart(2, '0')}</Text>
    <Text style={[styles.note, { color: theme.muted }]}>{now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}</Text>
  </View>;
}
export function Stopwatch({ theme, stopwatch, setStopwatch }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { if (!stopwatch.running) return; setNow(Date.now()); const timer = setInterval(() => setNow(Date.now()), 31); return () => clearInterval(timer); }, [stopwatch.running]);
  const elapsed = stopwatch.elapsed + (stopwatch.running ? Math.max(0, now - stopwatch.startedAt) : 0);
  function toggle() { const time = Date.now(); setNow(time); setStopwatch(previous => previous.running ? { elapsed: previous.elapsed + time - previous.startedAt, running: false, startedAt: 0 } : { ...previous, running: true, startedAt: time }); }
  return <View style={styles.center}><Ionicons name="stopwatch-outline" size={25} color="#ffad43" /><Text style={[styles.eyebrow, { color: theme.muted }]}>CRONÓMETRO</Text>
    <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.timer, { color: theme.text }]}>{formatElapsed(elapsed)}</Text>
    <View style={styles.row}><Control title={stopwatch.running ? 'Pausar' : 'Iniciar'} onPress={toggle} theme={theme} /><Control title="Reiniciar" secondary theme={theme} onPress={() => { setNow(Date.now()); setStopwatch({ running: false, elapsed: 0, startedAt: 0 }); }} /></View>
  </View>;
}
export function Activity({ theme }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const timer = setInterval(() => setTick(value => value + 1), 3000); return () => clearInterval(timer); }, []);
  const data = demoActivity(tick);
  return <View style={styles.center}><Text style={[styles.eyebrow, { color: '#fa527e' }]}>ACTIVIDAD SIMULADA</Text><Text style={[styles.time, { color: theme.text }]}>{data.steps.toLocaleString('es-MX')}</Text><Text style={{ color: theme.muted }}>pasos simulados</Text><View style={[styles.row, { marginTop: 14 }]}><Ionicons name="heart" size={20} color="#fa527e" /><Text style={{ color: theme.text, fontWeight: '700' }}>{data.heartRate} lpm</Text></View><Text style={[styles.note, { color: theme.muted }]}>Datos demostrativos.{ '\n' }Sin sensores reales.</Text></View>;
}
export function Settings({ theme, themeKey, setThemeKey, animations, setAnimations, haptics, setHaptics, storageError, clockStyle, setClockStyle, hour12, setHour12, onPreview, startWithClock, setStartWithClock }) {
  const [page, setPage] = useState('faces');
  return <View style={styles.center}>
    <Text style={[styles.eyebrow, { color: theme.accent }]}>CONFIGURACIÓN</Text>
    <View style={{ flexDirection: 'row', gap: 7, marginBottom: 10 }}>{[['faces','Relojes'],['options','Ajustes']].map(([id, label]) => <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: page === id }} onPress={() => setPage(id)} style={{ paddingVertical: 6, paddingHorizontal: 13, borderRadius: 12, backgroundColor: page === id ? theme.accent : theme.panel }}><Text style={{ color: page === id ? '#10200a' : theme.text, fontSize: 12 }}>{label}</Text></Pressable>)}</View>
    {page === 'faces' ? <>
      {[['digital','Digital'],['analog','Analógico'],['minimal','Minimalista']].map(([id, label]) => <Pressable key={id} accessibilityRole="radio" accessibilityState={{ checked: clockStyle === id }} accessibilityLabel={`Reloj ${label}`} onPress={() => setClockStyle(id)} style={{ width: 166, backgroundColor: theme.panel, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12, marginBottom: 5 }}><Text style={{ color: clockStyle === id ? theme.accent : theme.text, fontSize: 12 }}>{clockStyle === id ? '●' : '○'} {label}</Text></Pressable>)}
      <View style={styles.row}><Text style={{ color: theme.text, fontSize: 12 }}>Formato 12 h</Text><Switch accessibilityLabel="Formato de doce horas" value={hour12} onValueChange={setHour12} trackColor={{ true: theme.accent }} /></View>
      <Control title="Ver reloj" theme={theme} onPress={onPreview} />
    </> : <ScrollView style={{ width: 194, maxHeight: 158 }} contentContainerStyle={{ alignItems: 'center' }}>
      <View style={styles.row}><Text style={{ color: theme.text, fontSize: 12 }}>Iniciar con reloj</Text><Switch accessibilityLabel="Iniciar con reloj" value={startWithClock} onValueChange={setStartWithClock} trackColor={{ true: theme.accent }} /></View>
      <View style={styles.row}><Text style={{ color: theme.text }}>Océano</Text><Switch accessibilityLabel="Tema Océano" value={themeKey === 'ocean'} onValueChange={value => setThemeKey(value ? 'ocean' : 'midnight')} trackColor={{ true: theme.accent }} /></View>
      <View style={styles.row}><Text style={{ color: theme.text }}>Animaciones</Text><Switch accessibilityLabel="Animaciones" value={animations} onValueChange={setAnimations} trackColor={{ true: theme.accent }} /></View>
      <View style={styles.row}><Text style={{ color: theme.text }}>Vibración</Text><Switch accessibilityLabel="Vibración" value={haptics} onValueChange={setHaptics} trackColor={{ true: theme.accent }} /></View>
      <Text style={[styles.note, { color: theme.muted }]}>CuriWatch · 1.0</Text>
    </ScrollView>}
    {storageError && <Text style={{ color: '#ffad43', fontSize: 10, textAlign: 'center' }}>Error al guardar o recuperar datos.</Text>}
  </View>;
}
const styles = StyleSheet.create({ center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }, eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2, marginVertical: 10 }, time: { fontSize: 49, fontWeight: '300', fontVariant: ['tabular-nums'] }, timer: { fontSize: 33, fontVariant: ['tabular-nums'], marginVertical: 18 }, note: { fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 12 }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 } });
