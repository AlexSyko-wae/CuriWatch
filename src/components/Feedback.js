import React, { createContext, useContext } from 'react';
import { Pressable as NativePressable, Vibration } from 'react-native';
export const FeedbackContext = createContext(false);
export function useFeedback() {
  const enabled = useContext(FeedbackContext);
  return React.useCallback((success = false) => { if (enabled) Vibration.vibrate(success ? [0, 45, 60, 45] : 12); }, [enabled]);
}
export default function Pressable({ onPress, ...props }) {
  const feedback = useFeedback();
  return <NativePressable {...props} onPress={onPress ? event => { feedback(); onPress(event); } : undefined} />;
}
