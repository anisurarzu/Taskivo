import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { colors } from '@/theme/colors';
import { useHaptics } from '@/hooks';
import { cn } from '@/utils/cn';
import { useTasksQuery, getActiveTasks } from '@/features/tasks';
import { FOCUS_PRESETS_MINUTES } from '../types';
import {
  formatFocusDuration,
  getFocusSecondsThisWeek,
} from '../utils/selectors';
import {
  useCreateFocusSessionMutation,
  useFocusSessionsQuery,
} from '../hooks/useFocusQueries';
import { useFocusUiStore } from '../store/focus-ui-store';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 220;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FocusScreen() {
  const { success, medium } = useHaptics();
  const durationMinutes = useFocusUiStore((s) => s.durationMinutes);
  const linkedTask = useFocusUiStore((s) => s.linkedTask);
  const setDurationMinutes = useFocusUiStore((s) => s.setDurationMinutes);
  const setLinkedTask = useFocusUiStore((s) => s.setLinkedTask);
  const hydrate = useFocusUiStore((s) => s.hydrate);

  const totalSeconds = durationMinutes * 60;
  const [seconds, setSeconds] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const startedAtRef = useRef<string | null>(null);
  const progress = useSharedValue(0);

  const { data: tasks = [] } = useTasksQuery();
  const { data: sessions = [] } = useFocusSessionsQuery();
  const createSession = useCreateFocusSessionMutation();
  const activeTasks = getActiveTasks(tasks).slice(0, 12);
  const weekFocus = getFocusSecondsThisWeek(sessions);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (running) return;
    setSeconds(totalSeconds);
  }, [totalSeconds, running]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    progress.value = withTiming(1 - seconds / totalSeconds, { duration: 350 });
  }, [seconds, totalSeconds, progress]);

  useEffect(() => {
    if (seconds !== 0 || !startedAtRef.current) return;
    setRunning(false);
    const startedAt = startedAtRef.current;
    startedAtRef.current = null;
    success();
    void createSession.mutateAsync({
      taskId: linkedTask?.id,
      taskTitle: linkedTask?.title,
      durationSeconds: totalSeconds,
      completedSeconds: totalSeconds,
      startedAt,
      status: 'completed',
    });
  }, [seconds, linkedTask, totalSeconds, createSession, success]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  const onStartPause = () => {
    medium();
    if (!running) {
      if (!startedAtRef.current) {
        startedAtRef.current = new Date().toISOString();
      }
      setRunning(true);
      return;
    }
    setRunning(false);
  };

  const onReset = async () => {
    medium();
    const startedAt = startedAtRef.current;
    const completedSeconds = totalSeconds - seconds;
    setRunning(false);
    setSeconds(totalSeconds);
    startedAtRef.current = null;

    if (startedAt && completedSeconds >= 30) {
      await createSession.mutateAsync({
        taskId: linkedTask?.id,
        taskTitle: linkedTask?.title,
        durationSeconds: totalSeconds,
        completedSeconds,
        startedAt,
        status: 'cancelled',
      });
    }
  };

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(400)} className="items-center pt-2">
        <Text className="mb-1 self-start text-3xl font-bold text-ink dark:text-ink-dark">
          Focus
        </Text>
        <Text className="mb-4 self-start text-base text-ink-secondary dark:text-ink-dark-secondary">
          Deep work · {durationMinutes} min · {formatFocusDuration(weekFocus)} this week
        </Text>

        <View className="mb-5 w-full flex-row flex-wrap gap-2">
          {FOCUS_PRESETS_MINUTES.map((preset) => {
            const active = preset === durationMinutes;
            return (
              <Pressable
                key={preset}
                disabled={running}
                onPress={() => setDurationMinutes(preset)}
                className={cn(
                  'rounded-full px-3 py-1.5',
                  active ? 'bg-primary' : 'bg-surface-elevated dark:bg-surface-elevated-dark',
                  running && 'opacity-50',
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold',
                    active ? 'text-white' : 'text-ink dark:text-ink-dark',
                  )}
                >
                  {preset}m
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mb-8 items-center justify-center">
          <Svg width={SIZE} height={SIZE}>
            <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke="#E5E7EB"
                strokeWidth={STROKE}
                fill="none"
              />
              <AnimatedCircle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={colors.primary}
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                animatedProps={animatedProps}
              />
            </G>
          </Svg>
          <View className="absolute items-center">
            <Text className="text-5xl font-bold text-ink dark:text-ink-dark">
              {mins}:{secs}
            </Text>
            <Text className="mt-1 text-sm text-ink-secondary dark:text-ink-dark-secondary">
              {running ? 'In session' : seconds === 0 ? 'Done' : 'Ready'}
            </Text>
          </View>
        </View>

        <View className="mb-6 w-full gap-3">
          <PrimaryButton
            label={running ? 'Pause' : seconds === 0 ? 'Start again' : 'Start focus'}
            onPress={() => {
              if (seconds === 0) {
                setSeconds(totalSeconds);
              }
              onStartPause();
            }}
            loading={createSession.isPending}
          />
          <SecondaryButton label="Reset" onPress={() => void onReset()} />
        </View>

        <Card className="mb-4 w-full">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-ink dark:text-ink-dark">
              Linked task
            </Text>
            <Pressable onPress={() => setPickerOpen(true)} disabled={running}>
              <Text className="text-xs font-semibold text-primary">
                {linkedTask ? 'Change' : 'Choose'}
              </Text>
            </Pressable>
          </View>
          <Text className="text-sm leading-6 text-ink-secondary dark:text-ink-dark-secondary">
            {linkedTask?.title ?? 'No task linked — optional focus target.'}
          </Text>
          {linkedTask ? (
            <Pressable
              className="mt-3 self-start"
              disabled={running}
              onPress={() => setLinkedTask(null)}
            >
              <Text className="text-xs font-semibold text-danger">Clear</Text>
            </Pressable>
          ) : null}
        </Card>

        <Card className="w-full" padded={false}>
          <View className="border-b border-border px-4 py-3 dark:border-border-dark">
            <Text className="text-sm font-semibold text-ink dark:text-ink-dark">
              Recent sessions
            </Text>
          </View>
          {sessions.length === 0 ? (
            <View className="px-4 py-4">
              <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
                Complete a focus block to see history here.
              </Text>
            </View>
          ) : (
            sessions.slice(0, 5).map((session, index, arr) => (
              <View
                key={session.id}
                className={`px-4 py-3 ${
                  index < arr.length - 1 ? 'border-b border-border dark:border-border-dark' : ''
                }`}
              >
                <Text className="text-sm font-medium text-ink dark:text-ink-dark">
                  {session.taskTitle ?? 'Open focus'}
                </Text>
                <Text className="mt-0.5 text-xs text-ink-secondary dark:text-ink-dark-secondary">
                  {formatFocusDuration(session.completedSeconds)} · {session.status}
                </Text>
              </View>
            ))
          )}
        </Card>
      </Animated.View>

      <Modal visible={pickerOpen} animationType="slide" transparent onRequestClose={() => setPickerOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setPickerOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="max-h-[70%] rounded-t-3xl bg-surface px-4 pb-8 pt-4 dark:bg-surface-dark"
          >
            <Text className="mb-3 text-lg font-bold text-ink dark:text-ink-dark">
              Choose a task
            </Text>
            <ScrollView>
              {activeTasks.length === 0 ? (
                <Text className="py-4 text-sm text-ink-secondary dark:text-ink-dark-secondary">
                  No active tasks to link.
                </Text>
              ) : (
                activeTasks.map((task) => (
                  <Pressable
                    key={task.id}
                    className="border-b border-border py-3.5 dark:border-border-dark"
                    onPress={() => {
                      setLinkedTask({ id: task.id, title: task.title });
                      setPickerOpen(false);
                    }}
                  >
                    <Text className="text-base font-medium text-ink dark:text-ink-dark">
                      {task.title}
                    </Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
