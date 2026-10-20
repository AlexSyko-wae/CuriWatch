import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Pressable from '../components/Feedback';
import Control from '../components/Controls';
import { apps } from '../data/apps';
import { toggleFavorite } from '../data/favoritesLogic';

export default function Favorites({ theme, favorites, setFavorites, onOpen }) {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const available = apps.filter(app => app.id !== 'favorites');
  const selected = favorites.map(id => available.find(app => app.id === id)).filter(Boolean);
  function toggle(id) {
    if (!favorites.includes(id) && favorites.length >= 4) { setMessage('Quita uno para añadir otro'); return; }
    setMessage(''); setFavorites(previous => toggleFavorite(previous, id));
  }
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: theme.accent, fontWeight: '800', letterSpacing: 1, fontSize: 10, marginBottom: 10 }}>FAVORITOS · {selected.length}/4</Text>
    {editing ? <ScrollView style={{ width: 184, maxHeight: 135 }} contentContainerStyle={{ gap: 4 }}>
      {available.map(app => <Pressable key={app.id} accessibilityRole="checkbox" accessibilityLabel={app.title} accessibilityState={{ checked: favorites.includes(app.id) }} onPress={() => toggle(app.id)} style={{ backgroundColor: theme.panel, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <Ionicons name={app.icon} size={16} color={app.ink ? theme.text : app.color} />
        <Text style={{ flex: 1, color: theme.text, fontSize: 12 }}>{app.title}</Text><Text style={{ color: theme.accent }}>{favorites.includes(app.id) ? '✓' : '○'}</Text>
      </Pressable>)}
    </ScrollView> : <View style={{ width: 184, minHeight: 116, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {!selected.length && <Text style={{ color: theme.muted, textAlign: 'center', fontSize: 12 }}>Elige tus apps con Editar</Text>}
      {selected.map(app => <Pressable key={app.id} accessibilityRole="button" accessibilityLabel={`Abrir ${app.title}`} onPress={() => onOpen(app.id)} style={{ width: 88, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: theme.panel, gap: 5 }}><Ionicons name={app.icon} color={app.ink ? theme.text : app.color} size={22} /><Text numberOfLines={1} adjustsFontSizeToFit style={{ color: theme.text, fontSize: 10, width: 80, textAlign: 'center' }}>{app.title}</Text></Pressable>)}
    </View>}
    {!!message && <Text accessibilityLiveRegion="polite" style={{ color: '#ffad43', fontSize: 10, marginTop: 5 }}>{message}</Text>}
    <View style={{ marginTop: 10 }}><Control title={editing ? 'Listo' : 'Editar'} theme={theme} secondary onPress={() => { setEditing(value => !value); setMessage(''); }} /></View>
  </View>;
}
