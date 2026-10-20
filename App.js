import Pressable from './src/components/Feedback';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, AppState, BackHandler, Platform, ScrollView, StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Honeycomb from './src/components/Honeycomb';
import { Clock, Stopwatch, Activity, Settings } from './src/screens/WatchApps';
import { Calculator, Timer, Memory } from './src/screens/ExtraApps';
import { Calendar, Counter, Breathe, TicTacToe, Reaction } from './src/screens/MoreApps';
import { Habits, Pomodoro, Simon } from './src/screens/ProductivityApps';
import { Alarms, Converter, Chance } from './src/screens/UtilityApps';
import Favorites from './src/screens/Favorites';
import { Profile, Tasks } from './src/screens/PersonalApps';
import { BatteryScreen, Water, Birthdays } from './src/screens/DailyApps';
import CuriTap from './src/screens/CuriTap';
import HigherLower from './src/screens/HigherLower';
import { homeDestination } from './src/data/dailyLogic';
import { finishPomodoro } from './src/data/productivityLogic';
import { themes } from './src/theme/themes';
import usePreferences from './src/components/usePreferences';
import { FeedbackContext, useFeedback } from './src/components/Feedback';

export default function App() {
  const storage = usePreferences();
  return <FeedbackContext.Provider value={storage.preferences.haptics}><Watch storage={storage} /></FeedbackContext.Provider>;
}
function Watch({ storage }) {
  const { preferences, setField, ready, storageError } = storage;
  const { themeKey, animations, count, records, difficulty, haptics } = preferences;
  const setThemeKey = value => setField('themeKey', value);
  const setAnimations = value => setField('animations', value);
  const setCount = value => setField('count', value);
  const feedback = useFeedback();
  const { width } = useWindowDimensions();
  const size = Math.max(220, Math.min(width - 64, 340));
  const [screen, setScreen] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const [stopwatch, setStopwatch] = useState({ running: false, elapsed: 0, startedAt: 0 });
  const [timer, setTimer] = useState({ duration: 60000, remaining: 60000, running: false, deadline: 0 });
  const [pomodoro, setPomodoro] = useState({ phase: 'focus', remaining: 1500000, focusDuration: 1500000, breakDuration: 300000, running: false, deadline: 0, completed: 0 });
  const transition = useRef(new Animated.Value(1)).current;
  const theme = themes[themeKey];
  const open = useCallback(id => setScreen(id), []);
  const home = useCallback(() => { setScreen(previous => homeDestination(previous, preferences.startWithClock)); setResetKey(key => key + 1); }, [preferences.startWithClock]);
  const initializedHome = useRef(false);
  useEffect(() => {
    if (ready && !initializedHome.current) { initializedHome.current = true; setScreen(preferences.startWithClock ? 'clock' : null); }
  }, [ready, preferences.startWithClock]);
  const completedDeadline = useRef(0);
  const deliveredAlarm = useRef(0);
  useEffect(() => {
    const alarm = preferences.alarm;
    if (!ready || !alarm.enabled) return;
    function check() {
      if (AppState.currentState !== 'active' || Date.now() < alarm.at || deliveredAlarm.current === alarm.at) return;
      deliveredAlarm.current = alarm.at;
      setField('alarm', previous => ({ ...previous, enabled: false, at: 0 }));
      feedback(true);
      Alert.alert('Alarma', `${String(alarm.hour).padStart(2,'0')}:${String(alarm.minute).padStart(2,'0')} · Hora de tu recordatorio`);
    }
    check(); const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [ready, preferences.alarm, feedback]);
  useEffect(() => {
    if (!pomodoro.running) return;
    function complete() {
      if (Date.now() < pomodoro.deadline) return;
      setPomodoro(previous => finishPomodoro(previous, Date.now()));
      if (AppState.currentState === 'active') feedback(true);
    }
    const interval = setInterval(complete, 300);
    complete(); return () => clearInterval(interval);
  }, [pomodoro.running, pomodoro.deadline, feedback]);
  useEffect(() => {
    if (!timer.running) return;
    const complete = () => {
      if (AppState.currentState === 'active' && Date.now() >= timer.deadline && completedDeadline.current !== timer.deadline) {
        completedDeadline.current = timer.deadline; feedback(true);
      }
    };
    complete(); const interval = setInterval(complete, 300);
    return () => clearInterval(interval);
  }, [timer.running, timer.deadline, feedback]);
  function record(game, value) {
    setField('records', previous => game === 'wins'
      ? { ...previous, wins: Math.min(999999, previous.wins + 1) }
      : { ...previous, [game]: previous[game] === null ? value : Math.min(previous[game], value) });
  }
  useEffect(() => {
    transition.stopAnimation(); transition.setValue(animations ? 0 : 1);
    if (animations) Animated.timing(transition, { toValue: 1, duration: 210, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [screen, animations, transition]);
  useEffect(() => { const subscription = BackHandler.addEventListener('hardwareBackPress', () => { if ((!screen && !preferences.startWithClock) || (screen === 'clock' && preferences.startWithClock)) return false; home(); return true; }); return () => subscription.remove(); }, [screen, home, preferences.startWithClock]);
  const common = { theme, records, onRecord: record, difficulty, setDifficulty: value => setField('difficulty', value) };
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
    <StatusBar barStyle="light-content" backgroundColor={theme.background} />
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <View style={styles.header}><View style={styles.brandMark}><Ionicons name="watch-outline" size={23} color={theme.accent} /></View><Text style={[styles.brand, { color: theme.text }]}>CuriWatch</Text><View style={[styles.live, { backgroundColor: theme.accent }]} /></View>
      <View style={styles.watchArea}><View style={[styles.strap, { backgroundColor: theme.panel }]} /><View style={[styles.case, { width: size + 24, height: size + 24 }]}>
        <View style={[styles.face, { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.watch }]}>
          <Animated.View style={{ flex: 1, opacity: transition, transform: [{ scale: transition.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }}>
            {!ready && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: theme.text }}>Cargando ajustes…</Text></View>}
            {ready && !screen && <Honeycomb size={size} onOpen={open} animations={animations} resetKey={resetKey} />}
            {ready && screen && <View style={{ position: 'absolute', width: 300, height: 300, left: (size - 304) / 2, top: (size - 304) / 2, transform: [{ scale: size / 300 }] }}>
            {screen === 'clock' && <Clock {...common} clockStyle={preferences.clockStyle} hour12={preferences.hour12} profile={preferences.profile} />}
            {screen === 'stopwatch' && <Stopwatch {...common} stopwatch={stopwatch} setStopwatch={setStopwatch} />}
            {screen === 'activity' && <Activity {...common} />}
            {screen === 'calculator' && <Calculator {...common} size={300} />}
            {screen === 'timer' && <Timer {...common} timer={timer} setTimer={setTimer} />}
            {screen === 'memory' && <Memory {...common} size={300} />}
            {screen === 'calendar' && <Calendar {...common} size={300} />}
            {screen === 'counter' && <Counter {...common} count={count} setCount={setCount} />}
            {screen === 'breathe' && <Breathe {...common} />}
            {screen === 'tictactoe' && <TicTacToe {...common} size={300} />}
            {screen === 'reaction' && <Reaction {...common} />}
            {screen === 'habits' && <Habits theme={theme} habits={preferences.habits} setHabits={value => setField('habits', value)} />}
            {screen === 'pomodoro' && <Pomodoro theme={theme} timer={pomodoro} setTimer={setPomodoro} />}
            {screen === 'simon' && <Simon theme={theme} best={preferences.simonBest} setBest={value => setField('simonBest', value)} />}
            {screen === 'alarms' && <Alarms theme={theme} alarm={preferences.alarm} setAlarm={value => setField('alarm', value)} />}
            {screen === 'favorites' && <Favorites theme={theme} favorites={preferences.favorites} setFavorites={value => setField('favorites', value)} onOpen={open} />}
            {screen === 'converter' && <Converter theme={theme} />}
            {screen === 'chance' && <Chance theme={theme} />}
            {screen === 'profile' && <Profile theme={theme} profile={preferences.profile} setProfile={value => setField('profile', value)} />}
            {screen === 'tasks' && <Tasks theme={theme} tasks={preferences.tasks} setTasks={value => setField('tasks', value)} />}
            {screen === 'battery' && <BatteryScreen theme={theme} />}
            {screen === 'water' && <Water theme={theme} water={preferences.water} setWater={value => setField('water', value)} />}
            {screen === 'birthdays' && <Birthdays theme={theme} birthdays={preferences.birthdays} setBirthdays={value => setField('birthdays', value)} />}
            {screen === 'curitap' && <CuriTap theme={theme} best={preferences.curiTapBest} setBest={value => setField('curiTapBest', value)} />}
            {screen === 'higherlower' && <HigherLower theme={theme} best={preferences.higherLowerBest} setBest={value => setField('higherLowerBest', value)} />}
            {screen === 'settings' && <Settings {...common} themeKey={themeKey} setThemeKey={setThemeKey} animations={animations} setAnimations={setAnimations} storageError={storageError} haptics={haptics} setHaptics={value => setField('haptics', value)} clockStyle={preferences.clockStyle} setClockStyle={value => setField('clockStyle', value)} hour12={preferences.hour12} setHour12={value => setField('hour12', value)} onPreview={() => open('clock')} startWithClock={preferences.startWithClock} setStartWithClock={value => setField('startWithClock', value)} />}
            </View>}
          </Animated.View>
        </View><Pressable accessibilityRole="button" accessibilityLabel={screen === 'clock' ? 'Abrir menú de aplicaciones' : preferences.startWithClock ? 'Volver al reloj' : 'Volver al menú y centrar iconos'} onPress={home} style={styles.crown}><View style={styles.crownLine} /></Pressable>
      </View></View>
    </ScrollView>
  </SafeAreaView></SafeAreaProvider></GestureHandlerRootView>;
}
const styles = StyleSheet.create({ page: { alignItems: 'center', flexGrow: 1, paddingHorizontal: 18, paddingTop: 24, paddingBottom: 25 }, header: { flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 540, gap: 8 }, brandMark: { width: 32, height: 32, justifyContent: 'center' }, brand: { fontSize: 11, fontWeight: '800', letterSpacing: 1.3, flex: 1 }, live: { width: 6, height: 6, borderRadius: 3 }, watchArea: { alignItems: 'center', justifyContent: 'center', paddingVertical: 28 }, strap: { position: 'absolute', top: 3, bottom: 3, width: 136, borderRadius: 28, borderWidth: 1, borderColor: '#ffffff0b' }, case: { borderRadius: 200, backgroundColor: '#272e36', borderColor: '#52606c', borderWidth: 2, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 12 }, face: { overflow: 'hidden', borderWidth: 2, borderColor: '#000' }, crown: { position: 'absolute', right: -10, top: '43%', width: 11, height: 35, borderRadius: 4, backgroundColor: '#68737d', alignItems: 'center', justifyContent: 'center' }, crownLine: { width: 3, height: 21, backgroundColor: '#303841', borderRadius: 2 } });
