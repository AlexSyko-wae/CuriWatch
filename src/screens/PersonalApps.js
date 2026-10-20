import React, { useState } from 'react';
import { Keyboard, ScrollView, Text, TextInput, View } from 'react-native';
import Pressable from '../components/Feedback';
import Control from '../components/Controls';
import { addTask, toggleTask } from '../data/personalLogic';

const center = { flex: 1, alignItems: 'center', justifyContent: 'center' };
function Field({ label, value, onChangeText, maxLength, theme }) {
  return <View style={{ width: 180, marginBottom: 9 }}><Text style={{ color: theme.muted, fontSize: 11, marginBottom: 4 }}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} maxLength={maxLength} placeholder={label} placeholderTextColor={theme.muted} style={{ color: theme.text, backgroundColor: theme.panel, fontSize: 13, borderRadius: 10, paddingHorizontal: 10, height: 38 }} /></View>;
}
export function Profile({ theme, profile, setProfile }) {
  return <View style={center}><Text style={{ color: theme.accent, fontWeight: '800', fontSize: 11, marginBottom: 12 }}>MI PERFIL</Text>
    <Field label="Tu nombre" value={profile.name} onChangeText={name => setProfile(previous => ({ ...previous, name }))} maxLength={24} theme={theme} />
    <Field label="Mi meta personal" value={profile.goal} onChangeText={goal => setProfile(previous => ({ ...previous, goal }))} maxLength={60} theme={theme} />
    <Text style={{ color: theme.muted, fontSize: 10, marginBottom: 9 }}>Guardado local automático</Text><Control title="Listo" theme={theme} onPress={() => Keyboard.dismiss()} />
  </View>;
}
export function Tasks({ theme, tasks, setTasks }) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  function add() {
    if (!draft.trim()) { setError('Escribe un pendiente'); return; }
    if (tasks.length >= 8) { setError('Máximo 8 pendientes'); return; }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    setTasks(previous => addTask(previous, draft, id)); setDraft(''); setError(''); Keyboard.dismiss();
  }
  return <View style={center}><Text style={{ color: theme.accent, fontWeight: '800', fontSize: 11, marginBottom: 8 }}>PENDIENTES · {tasks.filter(task => task.done).length}/{tasks.length}</Text>
    <View style={{ flexDirection: 'row', gap: 5, marginBottom: 8 }}><TextInput accessibilityLabel="Nuevo pendiente" value={draft} onChangeText={setDraft} maxLength={50} placeholder="Nuevo pendiente" placeholderTextColor={theme.muted} returnKeyType="done" onSubmitEditing={add} style={{ width: 137, height: 36, backgroundColor: theme.panel, color: theme.text, borderRadius: 10, paddingHorizontal: 9, fontSize: 12 }} /><Pressable accessibilityRole="button" accessibilityLabel="Agregar pendiente" onPress={add} style={{ backgroundColor: theme.accent, paddingHorizontal: 11, borderRadius: 10, justifyContent: 'center' }}><Text style={{ color: '#10200a', fontSize: 19 }}>+</Text></Pressable></View>
    <ScrollView style={{ width: 190, maxHeight: 128 }} contentContainerStyle={{ gap: 5 }} keyboardShouldPersistTaps="handled">
      {!tasks.length && <Text style={{ color: theme.muted, textAlign: 'center', paddingVertical: 20, fontSize: 12 }}>Tu lista está vacía</Text>}
      {tasks.map(task => <View key={task.id} style={{ flexDirection: 'row', backgroundColor: theme.panel, borderRadius: 9, alignItems: 'center' }}>
        <Pressable accessibilityRole="checkbox" accessibilityLabel={task.text} accessibilityState={{ checked: task.done }} onPress={() => setTasks(previous => toggleTask(previous, task.id))} style={{ flex: 1, padding: 8 }}><Text style={{ color: task.done ? theme.accent : theme.text, fontSize: 12, textDecorationLine: task.done ? 'line-through' : 'none' }}>{task.done ? '✓' : '○'} {task.text}</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Eliminar ${task.text}`} onPress={() => { setTasks(previous => previous.filter(item => item.id !== task.id)); setError(''); }} style={{ padding: 10 }}><Text style={{ color: theme.muted, fontSize: 16 }}>×</Text></Pressable>
      </View>)}
    </ScrollView>{!!error && <Text accessibilityLiveRegion="polite" style={{ color: '#ffad43', fontSize: 10, marginTop: 5 }}>{error}</Text>}
  </View>;
}
