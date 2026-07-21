import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
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

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 220;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FocusScreen() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const total = 25 * 60;
    progress.value = withTiming(1 - seconds / total, { duration: 400 });
  }, [seconds, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="items-center pt-2">
        <Text className="mb-1 self-start text-3xl font-bold text-ink dark:text-ink-dark">
          Focus
        </Text>
        <Text className="mb-8 self-start text-base text-ink-secondary dark:text-ink-dark-secondary">
          Deep work session · 25 minutes
        </Text>

        <View className="mb-8 items-center justify-center">
          <Svg width={SIZE} height={SIZE}>
            <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke="#E2E8F0"
                strokeWidth={STROKE}
                fill="none"
              />
              <AnimatedCircle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke="#4F46E5"
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
              {running ? 'In session' : 'Ready'}
            </Text>
          </View>
        </View>

        <View className="mb-6 w-full gap-3">
          <PrimaryButton
            label={running ? 'Pause' : 'Start focus'}
            onPress={() => setRunning((v) => !v)}
          />
          <SecondaryButton
            label="Reset"
            onPress={() => {
              setRunning(false);
              setSeconds(25 * 60);
            }}
          />
        </View>

        <Card className="w-full">
          <Text className="mb-2 text-base font-semibold text-ink dark:text-ink-dark">
            Current focus
          </Text>
          <Text className="text-sm text-ink-secondary dark:text-ink-dark-secondary">
            Finalize product roadmap — clear distractions and ship one meaningful block of work.
          </Text>
        </Card>
      </Animated.View>
    </Screen>
  );
}
