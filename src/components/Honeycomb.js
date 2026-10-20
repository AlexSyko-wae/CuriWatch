import Pressable from './Feedback';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { apps, tiles } from '../data/apps';

const Tile = memo(function Tile({ tile, x, y, size, onOpen, animations }) {
  const positionX = (tile.q + tile.r / 2) * 76;
  const positionY = tile.r * 66;
  const animatedStyle = useAnimatedStyle(() => {
    const dx = positionX + x.value;
    const dy = positionY + y.value;
    const scale = animations ? Math.max(0.36, 1 - Math.pow(Math.sqrt(dx * dx + dy * dy) / (size * 0.68), 2) * 0.7) : 1;
    return { transform: [{ translateX: dx }, { translateY: dy }, { scale }] };
  });
  return <Animated.View style={[styles.tile, { left: size / 2 - 32, top: size / 2 - 32 }, animatedStyle]}>
    <Pressable accessibilityRole="button" accessibilityLabel={tile.title} onPress={() => onOpen(tile.id)} style={({ pressed }) => [styles.button, { backgroundColor: tile.color, opacity: pressed ? 0.65 : 1 }]}>
      <Ionicons name={tile.icon} size={33} color={tile.ink || '#fff'} />
    </Pressable>
  </Animated.View>;
});
export default function Honeycomb({ size, onOpen, animations, resetKey, filter = 'all', onSelect }) {
  const [selectedId, setSelectedId] = React.useState(null);
  React.useEffect(() => { setSelectedId(null); }, [filter, resetKey]);
  function select(id) {
    if (!onSelect || selectedId === id) { onOpen(id); return; }
    setSelectedId(id); onSelect(apps.find(app => app.id === id)?.title || '');
  }
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  React.useEffect(() => { x.value = 0; y.value = 0; }, [resetKey, x, y]);
  const pan = Gesture.Pan().minDistance(8).onStart(() => { originX.value = x.value; originY.value = y.value; }).onUpdate(event => {
    x.value = Math.max(-210, Math.min(210, originX.value + event.translationX));
    y.value = Math.max(-210, Math.min(210, originY.value + event.translationY));
  }).onEnd(() => {
    if (animations) { x.value = withSpring(x.value, { damping: 22 }); y.value = withSpring(y.value, { damping: 22 }); }
  });
  return <GestureDetector gesture={pan}><View style={{ width: size, height: size }} collapsable={false}>
    {tiles.filter(tile => filter === 'all' || (filter === 'games') === ['memory', 'tictactoe', 'reaction', 'simon', 'curitap', 'higherlower'].includes(tile.id)).map(tile => <Tile key={tile.key} tile={tile} x={x} y={y} size={size} onOpen={select} animations={animations} />)}
  </View></GestureDetector>;
}
const styles = StyleSheet.create({ tile: { position: 'absolute', width: 64, height: 64 }, button: { flex: 1, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffffff30' } });
