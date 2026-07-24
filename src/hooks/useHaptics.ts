import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { usePreferencesStore } from '@/store/preferences-store';

export function useHaptics() {
  const enabled = usePreferencesStore((s) => s.hapticsEnabled);

  const light = useCallback(() => {
    if (!enabled || Platform.OS === 'web') return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [enabled]);

  const medium = useCallback(() => {
    if (!enabled || Platform.OS === 'web') return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [enabled]);

  const success = useCallback(() => {
    if (!enabled || Platform.OS === 'web') return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [enabled]);

  return { light, medium, success };
}
