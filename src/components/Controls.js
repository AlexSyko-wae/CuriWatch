import Pressable from './Feedback';
import React from 'react';
import { Text } from 'react-native';
export default function Control({ title, onPress, theme, secondary = false }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ paddingVertical: 9, paddingHorizontal: 16, borderRadius: 24, backgroundColor: secondary ? theme.panel : theme.accent, opacity: pressed ? 0.6 : 1 })}>
    <Text style={{ color: secondary ? theme.text : '#10200a', fontWeight: '700', fontSize: 12 }}>{title}</Text>
  </Pressable>;
}
