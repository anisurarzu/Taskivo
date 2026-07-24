import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { SectionHeader, Loading } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatTime } from '@/utils/format';
import { colors } from '@/theme/colors';
import { CATEGORY_LABELS } from '@/constants';
import { useThemeColors } from '@/hooks';
import {
  getEventDaysInMonth,
  getTasksForDate,
  useTasksQuery,
} from '@/features/tasks';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface CalendarScreenProps {
  onTaskPress: (id: string) => void;
}

export function CalendarScreen({ onTaskPress }: CalendarScreenProps) {
  const theme = useThemeColors();
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => startOfMonth(today));
  const [selected, setSelected] = useState(today);
  const { data: tasks = [], isLoading } = useTasksQuery();

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const cells = useMemo(() => {
    const total = daysInMonth(cursor);
    const offset = mondayIndex(startOfMonth(cursor));
    const grid: (Date | null)[] = [];
    for (let i = 0; i < offset; i += 1) grid.push(null);
    for (let day = 1; day <= total; day += 1) {
      grid.push(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    }
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [cursor]);

  const eventDays = useMemo(() => getEventDaysInMonth(tasks, cursor), [tasks, cursor]);

  const agenda = useMemo(
    () => getTasksForDate(tasks, selected).filter((task) => !task.isCompleted),
    [tasks, selected],
  );

  const shiftMonth = (delta: number) => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(350)} className="pt-1">
        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold tracking-tight text-ink dark:text-ink-dark">
              Calendar
            </Text>
            <Text className="mt-0.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
              {today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              setCursor(startOfMonth(today));
              setSelected(today);
            }}
            className="rounded-lg bg-primary/10 px-2.5 py-1.5"
          >
            <Text className="text-xs font-semibold text-primary">Today</Text>
          </Pressable>
        </View>

        <Card className="mb-5">
          <View className="mb-3 flex-row items-center justify-between">
            <Pressable
              onPress={() => shiftMonth(-1)}
              hitSlop={10}
              className="h-8 w-8 items-center justify-center rounded-md bg-surface-elevated dark:bg-surface-elevated-dark"
            >
              <Ionicons name="chevron-back" size={16} color={theme.text} />
            </Pressable>
            <Text className="text-sm font-semibold text-ink dark:text-ink-dark">{monthLabel}</Text>
            <Pressable
              onPress={() => shiftMonth(1)}
              hitSlop={10}
              className="h-8 w-8 items-center justify-center rounded-md bg-surface-elevated dark:bg-surface-elevated-dark"
            >
              <Ionicons name="chevron-forward" size={16} color={theme.text} />
            </Pressable>
          </View>

          <View className="mb-1 flex-row">
            {WEEKDAYS.map((day, i) => (
              <View key={`${day}-${i}`} className="h-7 flex-1 items-center justify-center">
                <Text className="text-[11px] font-medium text-ink-muted">{day}</Text>
              </View>
            ))}
          </View>

          {Array.from({ length: cells.length / 7 }, (_, week) => (
            <View key={`week-${week}`} className="flex-row">
              {cells.slice(week * 7, week * 7 + 7).map((date, index) => {
                const key = date ? date.toISOString() : `e-${week}-${index}`;
                if (!date) {
                  return <View key={key} className="h-10 flex-1" />;
                }

                const isSelected = sameDay(date, selected);
                const isToday = sameDay(date, today);
                const hasEvent = eventDays.has(date.getDate());

                return (
                  <Pressable
                    key={key}
                    onPress={() => setSelected(date)}
                    className="h-10 flex-1 items-center justify-center"
                  >
                    <View
                      className={cn(
                        'h-7 w-7 items-center justify-center rounded-full',
                        isSelected && 'bg-primary',
                        !isSelected && isToday && 'bg-primary/10',
                      )}
                    >
                      <Text
                        className={cn(
                          'text-[13px] font-medium',
                          isSelected
                            ? 'text-white'
                            : isToday
                              ? 'text-primary'
                              : 'text-ink dark:text-ink-dark',
                        )}
                      >
                        {date.getDate()}
                      </Text>
                    </View>
                    <View
                      className={cn(
                        'mt-0.5 h-1 w-1 rounded-full',
                        hasEvent
                          ? isSelected
                            ? 'bg-white'
                            : 'bg-primary'
                          : 'bg-transparent',
                      )}
                    />
                  </Pressable>
                );
              })}
            </View>
          ))}
        </Card>

        <SectionHeader
          title="Agenda"
          subtitle={selected.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        />

        {isLoading ? (
          <Loading label="Loading agenda..." />
        ) : agenda.length === 0 ? (
          <Card className="items-center py-6">
            <Ionicons name="calendar-outline" size={22} color={colors.textMuted} />
            <Text className="mt-2 text-sm font-medium text-ink dark:text-ink-dark">
              Nothing scheduled
            </Text>
            <Text className="mt-0.5 text-xs text-ink-muted">Pick another day or add a task</Text>
          </Card>
        ) : (
          <Card padded={false} className="overflow-hidden">
            {agenda.map((task, index) => (
              <Pressable
                key={task.id}
                onPress={() => onTaskPress(task.id)}
                className={cn(
                  'flex-row items-center px-3.5 py-3',
                  index < agenda.length - 1 && 'border-b border-border dark:border-border-dark',
                )}
              >
                <View className="mr-3 w-12">
                  <Text className="text-xs font-semibold text-primary">
                    {task.dueAt ? formatTime(task.dueAt) : '—'}
                  </Text>
                </View>
                <View className="mr-2 h-8 w-0.5 rounded-full bg-primary" />
                <View className="min-w-0 flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-medium text-ink dark:text-ink-dark"
                  >
                    {task.title}
                  </Text>
                  <Text className="mt-0.5 text-[11px] text-ink-muted">
                    {CATEGORY_LABELS[task.category]}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
              </Pressable>
            ))}
          </Card>
        )}
      </Animated.View>
    </Screen>
  );
}
