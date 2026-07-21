import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { TaskCard, Card } from '@/components/cards';
import { IconButton } from '@/components/buttons';
import { SectionHeader } from '@/components/ui';
import { mockTasks } from '@/data/mock';
import { cn } from '@/utils/cn';
import { colors } from '@/theme/colors';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** Monday-first weekday index (0=Mon … 6=Sun) */
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
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => startOfMonth(today));
  const [selected, setSelected] = useState(today);

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

  const eventDays = useMemo(() => {
    const set = new Set<number>();
    mockTasks.forEach((task) => {
      if (!task.dueAt) return;
      const d = new Date(task.dueAt);
      if (d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear()) {
        set.add(d.getDate());
      }
    });
    return set;
  }, [cursor]);

  const agenda = useMemo(
    () =>
      mockTasks.filter((task) => {
        if (!task.dueAt || task.isCompleted) return false;
        return sameDay(new Date(task.dueAt), selected);
      }),
    [selected],
  );

  const shiftMonth = (delta: number) => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <Text className="mb-1 text-3xl font-bold text-ink dark:text-ink-dark">Calendar</Text>
        <Text className="mb-6 text-base text-ink-secondary dark:text-ink-dark-secondary">
          Plan your month with clarity
        </Text>

        <Card className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <IconButton name="chevron-back" onPress={() => shiftMonth(-1)} variant="soft" />
            <Text className="text-lg font-bold text-ink dark:text-ink-dark">{monthLabel}</Text>
            <IconButton name="chevron-forward" onPress={() => shiftMonth(1)} variant="soft" />
          </View>

          <View className="mb-2 flex-row">
            {WEEKDAYS.map((day) => (
              <View key={day} className="flex-1 items-center py-1">
                <Text className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {cells.map((date, index) => {
              if (!date) {
                return <View key={`empty-${index}`} className="mb-1 aspect-square w-[14.28%]" />;
              }

              const isSelected = sameDay(date, selected);
              const isToday = sameDay(date, today);
              const hasEvent = eventDays.has(date.getDate());

              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => setSelected(date)}
                  className="mb-1 w-[14.28%] items-center justify-center"
                  style={{ aspectRatio: 1 }}
                >
                  <View
                    className={cn(
                      'h-9 w-9 items-center justify-center rounded-full',
                      isSelected && 'bg-primary',
                      !isSelected && isToday && 'bg-primary/10',
                    )}
                  >
                    <Text
                      className={cn(
                        'text-sm font-semibold',
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
                  {hasEvent ? (
                    <View
                      className={cn(
                        'mt-0.5 h-1 w-1 rounded-full',
                        isSelected ? 'bg-white' : 'bg-primary',
                      )}
                    />
                  ) : (
                    <View className="mt-0.5 h-1 w-1" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Card>

        <SectionHeader
          title="Agenda"
          subtitle={selected.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        />

        {agenda.length === 0 ? (
          <Card className="items-center py-8">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Ionicons name="calendar-outline" size={22} color={colors.primary} />
            </View>
            <Text className="text-base font-semibold text-ink dark:text-ink-dark">
              No events today
            </Text>
            <Text className="mt-1 text-center text-sm text-ink-secondary dark:text-ink-dark-secondary">
              Enjoy the open space — or schedule something meaningful.
            </Text>
          </Card>
        ) : (
          agenda.map((task) => (
            <TaskCard key={task.id} task={task} onPress={() => onTaskPress(task.id)} />
          ))
        )}

        <View className="mt-4">
          <SectionHeader title="This month" subtitle="All scheduled tasks" />
          {mockTasks
            .filter((t) => !t.isCompleted)
            .map((task) => (
              <TaskCard key={task.id} task={task} onPress={() => onTaskPress(task.id)} />
            ))}
        </View>
      </Animated.View>
    </Screen>
  );
}
