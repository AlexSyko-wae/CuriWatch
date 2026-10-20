import React, { useEffect, useState } from 'react';
import { AppState, Keyboard, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import * as Battery from 'expo-battery';
import Ionicons from '@expo/vector-icons/Ionicons';
import Pressable from '../components/Feedback';
import Control from '../components/Controls';
import { localDay } from '../data/productivityLogic';
import { adjustWater, daysUntilBirthday, validBirthday } from '../data/dailyLogic';
const center = { flex: 1, alignItems: 'center', justifyContent: 'center' };
function Title({ theme, children }) { return <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '800', marginBottom: 10 }}>{children}</Text>; }
function Step({ title, label, onPress, theme }) { return <Pressable accessibilityRole="button" accessibilityLabel={label || title} onPress={onPress} style={{ backgroundColor: theme.panel, paddingHorizontal: 15, paddingVertical: 7, borderRadius: 12 }}><Text style={{ color: theme.text, fontSize: 18 }}>{title}</Text></Pressable>; }
export function BatteryScreen({ theme }) {
  const [power, setPower] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    async function refresh() {
      if (AppState.currentState !== 'active' || Platform.OS === 'web') { if (active) setLoading(false); return; }
      try { const value = await Battery.getPowerStateAsync(); if (active) setPower(value); }
      catch { if (active) setPower(null); }
      finally { if (active) setLoading(false); }
    }
    refresh();
    const interval = setInterval(refresh, 30000);
    const stateListener = Battery.addBatteryStateListener(refresh);
    const levelListener = Battery.addBatteryLevelListener(refresh);
    const appListener = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    return () => { active = false; clearInterval(interval); stateListener.remove(); levelListener.remove(); appListener.remove(); };
  }, []);
  const valid = power && Number.isFinite(power.batteryLevel) && power.batteryLevel >= 0 && power.batteryLevel <= 1;
  const charging = power?.batteryState === Battery.BatteryState.CHARGING;
  const full = power?.batteryState === Battery.BatteryState.FULL;
  return <View style={center}><Title theme={theme}>BATERÍA DEL TELÉFONO</Title><Ionicons name={charging ? 'battery-charging' : 'battery-half'} size={55} color={theme.accent} />
    <Text style={{ color: theme.text, fontSize: 42, marginVertical: 8 }}>{loading ? '…' : valid ? `${Math.round(power.batteryLevel * 100)}%` : '—'}</Text>
    <Text style={{ color: theme.muted, fontSize: 12 }}>{!valid ? 'Lectura no disponible' : charging ? 'Cargando' : full ? 'Carga completa' : power.batteryState === Battery.BatteryState.UNPLUGGED ? 'Sin cargador' : 'Estado desconocido'}</Text>
    {power?.lowPowerMode && <Text style={{ color: theme.accent, fontSize: 11, marginTop: 8 }}>Ahorro de energía activo</Text>}
  </View>;
}
export function Water({ theme, water, setWater }) {
  const [day, setDay] = useState(localDay);
  useEffect(() => { const interval = setInterval(() => setDay(localDay()), 1000); return () => clearInterval(interval); }, []);
  const count = water.date === day ? water.count : 0;
  return <View style={center}><Title theme={theme}>AGUA DE HOY</Title><Text style={{ color: theme.text, fontSize: 36 }}>{count} / {water.goal}</Text><Text style={{ color: theme.muted, fontSize: 11, marginBottom: 12 }}>vasos registrados</Text>
    <View style={{ flexDirection: 'row', gap: 12 }}><Step title="−" label="Quitar un vaso" onPress={() => setWater(previous => adjustWater(previous, -1))} theme={theme} /><Step title="+" label="Añadir un vaso" onPress={() => setWater(previous => adjustWater(previous, 1))} theme={theme} /></View>
    <Text style={{ color: theme.accent, fontSize: 11, marginVertical: 10 }}>{count >= water.goal ? '¡Meta completada!' : 'Tu meta personal'}</Text>
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Step title="−" label="Reducir meta" theme={theme} onPress={() => setWater(previous => ({ ...previous, goal: Math.max(1, previous.goal - 1) }))} /><Text style={{ color: theme.text, fontSize: 11 }}>Meta {water.goal}</Text><Step title="+" label="Aumentar meta" theme={theme} onPress={() => setWater(previous => ({ ...previous, goal: Math.min(20, previous.goal + 1) }))} /></View>
  </View>;
}
export function Birthdays({ theme, birthdays, setBirthdays }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const interval = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(interval); }, []);
  function save() {
    if (!name.trim() || !/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !validBirthday(Number(day), Number(month))) { setError('Revisa nombre, día y mes'); return; }
    if (birthdays.length >= 5) { setError('Máximo cinco cumpleaños'); return; }
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`, name: name.trim(), day: Number(day), month: Number(month) };
    setBirthdays(previous => previous.length < 5 ? [...previous, entry] : previous); setAdding(false); setName(''); setDay(''); setMonth(''); setError(''); Keyboard.dismiss();
  }
  const field = { color: theme.text, backgroundColor: theme.panel, borderRadius: 10, paddingHorizontal: 10, height: 36, fontSize: 13 };
  return <View style={center}><Title theme={theme}>CUMPLEAÑOS</Title>
    {adding ? <>
      <TextInput accessibilityLabel="Nombre del cumpleaños" value={name} onChangeText={setName} maxLength={24} placeholder="Nombre" placeholderTextColor={theme.muted} style={[field, { width: 180, marginBottom: 8 }]} />
      <View style={{ flexDirection: 'row', gap: 8 }}><TextInput accessibilityLabel="Día" value={day} onChangeText={setDay} maxLength={2} keyboardType="number-pad" placeholder="Día" placeholderTextColor={theme.muted} style={[field, { width: 80 }]} /><TextInput accessibilityLabel="Mes" value={month} onChangeText={setMonth} maxLength={2} keyboardType="number-pad" placeholder="Mes" placeholderTextColor={theme.muted} style={[field, { width: 80 }]} /></View>
      {!!error && <Text style={{ color: '#ffad43', fontSize: 10, marginTop: 8 }}>{error}</Text>}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}><Control title="Guardar" theme={theme} onPress={save} /><Control title="Cancelar" theme={theme} secondary onPress={() => { setAdding(false); setError(''); Keyboard.dismiss(); }} /></View>
    </> : <>
      <ScrollView style={{ width: 190, maxHeight: 140 }} contentContainerStyle={{ gap: 6 }}>
        {!birthdays.length && <Text style={{ color: theme.muted, textAlign: 'center', paddingVertical: 20, fontSize: 12 }}>Agrega una fecha especial</Text>}
        {[...birthdays].sort((a,b) => daysUntilBirthday(a.day,a.month,now) - daysUntilBirthday(b.day,b.month,now)).map(item => {
          const days = daysUntilBirthday(item.day, item.month, now);
          return <View key={item.id} style={{ backgroundColor: theme.panel, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1, padding: 9 }}><Text numberOfLines={1} style={{ color: theme.text, fontSize: 12 }}>{item.name}</Text><Text style={{ color: theme.accent, fontSize: 10, marginTop: 3 }}>{item.day}/{item.month} · {days === 0 ? '¡Hoy!' : `Faltan ${days} días`}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`Eliminar cumpleaños de ${item.name}`} onPress={() => setBirthdays(previous => previous.filter(entry => entry.id !== item.id))} style={{ padding: 12 }}><Text style={{ color: theme.muted }}>×</Text></Pressable></View>;
        })}
      </ScrollView>{birthdays.length < 5 && <View style={{ marginTop: 10 }}><Control title="Agregar" theme={theme} onPress={() => setAdding(true)} /></View>}
    </>}
  </View>;
}
