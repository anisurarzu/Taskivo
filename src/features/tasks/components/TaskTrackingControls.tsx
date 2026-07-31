import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/cards';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { colors } from '@/theme/colors';
import type { Task } from '../types';
import {
  useBreakTrackingMutation,
  useCompleteTrackingMutation,
  useEndTrackingMutation,
  useResumeTrackingMutation,
  useStartTrackingMutation,
} from '../hooks/useTaskQueries';

const BREAK_PRESETS = [5, 10, 15, 30] as const;

function formatMs(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

interface TaskTrackingControlsProps {
  task: Task;
}

export function TaskTrackingControls({ task }: TaskTrackingControlsProps) {
  const start = useStartTrackingMutation();
  const takeBreak = useBreakTrackingMutation();
  const resume = useResumeTrackingMutation();
  const end = useEndTrackingMutation();
  const complete = useCompleteTrackingMutation();
  const [showBreaks, setShowBreaks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = task.trackingStatus ?? task.tracking?.trackingStatus ?? 'not_started';
  const workMs = task.tracking?.workMs ?? task.totalWorkMs ?? 0;
  const breakMs = task.tracking?.breakMs ?? task.totalBreakMs ?? 0;
  const busy =
    start.isPending ||
    takeBreak.isPending ||
    resume.isPending ||
    end.isPending ||
    complete.isPending;

  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tracking action failed');
    }
  };

  const statusLabel =
    status === 'working'
      ? 'Working'
      : status === 'on_break'
        ? 'On break'
        : status === 'ended'
          ? 'Ended'
          : status === 'completed'
            ? 'Completed'
            : 'Not started';

  return (
    <Card className="mb-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-ink dark:text-ink-dark">Time tracking</Text>
        <View className="rounded-full bg-primary/10 px-2.5 py-1">
          <Text className="text-xs font-semibold text-primary">{statusLabel}</Text>
        </View>
      </View>

      <View className="mb-4 flex-row gap-3">
        <View className="flex-1 rounded-xl bg-surface-elevated px-3 py-2.5 dark:bg-surface-elevated-dark">
          <Text className="text-xs text-ink-muted">Work</Text>
          <Text className="mt-0.5 text-sm font-bold text-ink dark:text-ink-dark">
            {formatMs(workMs)}
          </Text>
        </View>
        <View className="flex-1 rounded-xl bg-surface-elevated px-3 py-2.5 dark:bg-surface-elevated-dark">
          <Text className="text-xs text-ink-muted">Break</Text>
          <Text className="mt-0.5 text-sm font-bold text-ink dark:text-ink-dark">
            {formatMs(breakMs)}
          </Text>
        </View>
      </View>

      {error ? <Text className="mb-3 text-sm text-danger">{error}</Text> : null}

      {status === 'not_started' || status === 'ended' ? (
        <PrimaryButton
          label="Start working"
          loading={busy}
          onPress={() => void run(() => start.mutateAsync({ id: task.id }))}
        />
      ) : null}

      {status === 'working' ? (
        <View className="gap-2.5">
          <PrimaryButton
            label="Take a break"
            loading={busy}
            onPress={() => setShowBreaks((v) => !v)}
          />
          {showBreaks ? (
            <View className="flex-row flex-wrap gap-2">
              {BREAK_PRESETS.map((mins) => (
                <Pressable
                  key={mins}
                  disabled={busy}
                  onPress={() =>
                    void run(async () => {
                      await takeBreak.mutateAsync({ id: task.id, minutes: mins });
                      setShowBreaks(false);
                    })
                  }
                  className="rounded-lg border border-border bg-card px-3 py-2 dark:border-border-dark dark:bg-card-dark"
                >
                  <Text className="text-sm font-semibold text-ink dark:text-ink-dark">{mins}m</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <SecondaryButton
            label="End session"
            disabled={busy}
            onPress={() => void run(() => end.mutateAsync({ id: task.id }))}
          />
        </View>
      ) : null}

      {status === 'on_break' ? (
        <View className="gap-2.5">
          <PrimaryButton
            label="Resume work"
            loading={busy}
            onPress={() => void run(() => resume.mutateAsync({ id: task.id }))}
          />
          <SecondaryButton
            label="End session"
            disabled={busy}
            onPress={() => void run(() => end.mutateAsync({ id: task.id }))}
          />
        </View>
      ) : null}

      {(status === 'working' || status === 'on_break' || status === 'ended') ? (
        <Pressable
          disabled={busy}
          onPress={() => void run(() => complete.mutateAsync({ id: task.id }))}
          className="mt-3 flex-row items-center justify-center py-2"
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
          <Text className="ml-1.5 text-sm font-semibold text-primary">Mark tracking complete</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}
