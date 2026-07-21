import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { TaskCard, Card } from '@/components/cards';
import { SectionHeader } from '@/components/ui';
import { mockTasks } from '@/data/mock';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarScreenProps {
  onTaskPress: (id: string) => void;
}

export function CalendarScreen({ onTaskPress }: CalendarScreenProps) {
  const today = new Date();
  const [selected, setSelected] = useState(today.getDate());
  const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInView = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(400)} className="pt-2">
        <Text className="mb-1 text-3xl font-bold text-ink dark:text-ink-dark">Calendar</Text>
        <Text className="mb-6 text-base text-ink-secondary dark:text-ink-dark-secondary">
          Plan your week with clarity
        </Text>

        <Card className="mb-6">
          <Text className="mb-4 text-lg font-bold text-ink dark:text-ink-dark">{monthLabel}</Text>
          <View className="mb-2 flex-row justify-between">
            {weekDays.map((day) => (
              <Text
                key={day}
                className="w-10 text-center text-xs font-semibold text-ink-secondary dark:text-ink-dark-secondary"
              >
                {day}
              </Text>
            ))}
          </View>
          <View className="flex-row justify-between">
            {daysInView.map((date) => {
              const day = date.getDate();
              const isSelected = day === selected;
              const isToday = day === today.getDate();
              return (
                <Pressable
                  key={date.toISOString()}
                  onPress={() => setSelected(day)}
                  className={`h-12 w-10 items-center justify-center rounded-xl ${
                    isSelected ? 'bg-primary' : isToday ? 'bg-primary/10' : ''
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected
                        ? 'text-white'
                        : 'text-ink dark:text-ink-dark'
                    }`}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <SectionHeader title="Scheduled" subtitle={`${selected} ${monthLabel.split(' ')[0]}`} />
        {mockTasks
          .filter((t) => !t.isCompleted)
          .map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              onPress={() => onTaskPress(task.id)}
            />
          ))}
      </Animated.View>
    </Screen>
  );
}
