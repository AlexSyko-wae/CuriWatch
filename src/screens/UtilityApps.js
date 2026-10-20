import React, { useState } from 'react';
import { Keyboard, Switch, Text, TextInput, View } from 'react-native';
import Pressable from '../components/Feedback';
import Control from '../components/Controls';
import { conversions, convertValue, nextAlarm, rollDie, flipCoin } from '../data/utilityLogic';

const center = { flex: 1, alignItems: 'center', justifyContent: 'center' };
function Title({ theme, children }) {
  return <Text style={{ color: theme.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 10 }}>{children}</Text>;
}
function SmallButton({ title, label, onPress, theme, selected }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label || title} accessibilityState={{ selected: !!selected }} onPress={onPress} style={{ paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: selected ? theme.accent : theme.panel }}><Text style={{ color: selected ? '#10200a' : theme.text, fontSize: 12 }}>{title}</Text></Pressable>;
}
export function Alarms({ theme, alarm, setAlarm }) {
  function change(field, direction) {
    setAlarm(previous => ({ ...previous, [field]: (previous[field] + direction + (field === 'hour' ? 24 : 60)) % (field === 'hour' ? 24 : 60), enabled: false, at: 0 }));
  }
  return <View style={center}><Title theme={theme}>ALARMAS</Title>
    <View style={{ flexDirection: 'row', gap: 16 }}>{[['hour', 'Hora'], ['minute', 'Minuto']].map(([field, label]) => <View key={field} style={{ alignItems: 'center', gap: 4 }}>
      <SmallButton title="+" label={`Aumentar ${label}`} onPress={() => change(field, 1)} theme={theme} />
      <Text style={{ color: theme.text, fontSize: 32, fontVariant: ['tabular-nums'] }}>{String(alarm[field]).padStart(2, '0')}</Text>
      <SmallButton title="−" label={`Reducir ${label}`} onPress={() => change(field, -1)} theme={theme} />
    </View>)}</View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 }}><Text style={{ color: theme.text, fontSize: 12 }}>{alarm.enabled ? 'Activada' : 'Desactivada'}</Text><Switch accessibilityLabel="Activar alarma" value={alarm.enabled} onValueChange={enabled => setAlarm(previous => ({ ...previous, enabled, at: enabled ? nextAlarm(previous.hour, previous.minute) : 0 }))} trackColor={{ true: theme.accent }} /></View>
    <Text style={{ color: theme.muted, fontSize: 10, textAlign: 'center', width: 180 }}>{alarm.enabled ? `Aviso: ${new Date(alarm.at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}` : 'Un aviso por activación'}{'\n'}Avisa con la app abierta.{'\n'}No suena con la app cerrada.</Text>
  </View>;
}
export function Converter({ theme }) {
  const [kind, setKind] = useState('temperature');
  const [reverse, setReverse] = useState(false);
  const [input, setInput] = useState('0');
  const [from, to] = reverse ? [...conversions[kind].units].reverse() : conversions[kind].units;
  const result = convertValue(input, kind, reverse);
  return <View style={center}><Title theme={theme}>CONVERSOR</Title>
    <View style={{ flexDirection: 'row', gap: 4 }}>{[['temperature','°C/°F'], ['distance','km/mi'], ['weight','kg/lb']].map(([value, title]) => <SmallButton key={value} title={title} selected={value === kind} theme={theme} onPress={() => { setKind(value); setReverse(false); }} />)}</View>
    <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 10 }}><TextInput accessibilityLabel={`Cantidad en ${from}`} value={input} onChangeText={setInput} maxLength={14} keyboardType="decimal-pad" selectTextOnFocus style={{ width: 112, height: 38, borderRadius: 10, backgroundColor: theme.panel, color: theme.text, paddingHorizontal: 10, fontSize: 18 }} /><Text style={{ color: theme.text }}>{from}</Text><SmallButton title="±" label="Cambiar signo" theme={theme} onPress={() => setInput(previous => previous.startsWith('-') ? previous.slice(1) : `-${previous}`)} /></View>
    <Text numberOfLines={1} adjustsFontSizeToFit accessibilityLiveRegion="polite" style={{ color: theme.accent, fontSize: 23, marginVertical: 12, width: 190, textAlign: 'center' }}>{result === null ? 'Valor inválido' : `${result} ${to}`}</Text>
    <Control title="Invertir unidades" secondary theme={theme} onPress={() => { Keyboard.dismiss(); setReverse(value => !value); }} />
  </View>;
}
export function Chance({ theme }) {
  const [mode, setMode] = useState('die');
  const [value, setValue] = useState(null);
  const [rolls, setRolls] = useState(0);
  function change(next) { setMode(next); setValue(null); setRolls(0); }
  function roll() { setValue(mode === 'die' ? rollDie() : flipCoin()); setRolls(previous => previous + 1); }
  return <View style={center}><Title theme={theme}>DADOS Y MONEDA</Title><View style={{ flexDirection: 'row', gap: 8 }}><SmallButton title="Dado" theme={theme} selected={mode === 'die'} onPress={() => change('die')} /><SmallButton title="Moneda" theme={theme} selected={mode === 'coin'} onPress={() => change('coin')} /></View>
    <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: 40, marginVertical: 14 }}>{value ?? '—'}</Text><Control title="Lanzar" theme={theme} onPress={roll} /><Text style={{ color: theme.muted, fontSize: 10, marginTop: 10 }}>Lanzamientos: {rolls}</Text>
  </View>;
}
