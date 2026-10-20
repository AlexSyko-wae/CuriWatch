import React from 'react';
import { Text, View } from 'react-native';
import Control from './Controls';
export default function GameIntro({ title, instructions, detail, theme, onStart, children }) {
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 55 }}>
    <Text style={{ color: theme.accent, fontWeight: '800', fontSize: 12, marginBottom: 12 }}>{title}</Text>
    <Text style={{ color: theme.text, fontSize: 13, lineHeight: 19, textAlign: 'center' }}>{instructions}</Text>
    {!!detail && <Text style={{ color: theme.muted, fontSize: 11, marginVertical: 10, textAlign: 'center' }}>{detail}</Text>}
    {children}<View style={{ marginTop: 12 }}><Control title="Jugar" theme={theme} onPress={onStart} /></View>
  </View>;
}
