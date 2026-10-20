import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaults, sanitizePreferences } from '../data/preferences';
const key = '@smartwatch-demo/preferences-v1';
export default function usePreferences() {
  const [preferences, setPreferences] = useState(defaults);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const writes = useRef(Promise.resolve());
  const snapshot = useRef(JSON.stringify(defaults));
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key).then(raw => {
      if (active && raw) {
        const loaded = sanitizePreferences(JSON.parse(raw));
        snapshot.current = JSON.stringify(loaded);
        setPreferences(loaded);
      }
    }).catch(() => { if (active) setStorageError(true); }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const serialized = JSON.stringify(preferences);
    if (serialized === snapshot.current) return;
    snapshot.current = serialized;
    // Serialize writes so an older snapshot cannot overwrite a newer record.
    writes.current = writes.current.catch(() => {}).then(() => AsyncStorage.setItem(key, serialized))
      .then(() => setStorageError(false)).catch(() => setStorageError(true));
  }, [preferences, ready]);
  const setField = (field, value) => setPreferences(previous => ({ ...previous, [field]: typeof value === 'function' ? value(previous[field]) : value }));
  return { preferences, setField, ready, storageError };
}
