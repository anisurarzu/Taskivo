import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime } from '@/utils/format';
import { useThemeColors } from '@/hooks';
import { cn } from '@/utils/cn';

interface DueDateFieldProps {
  value?: string | null;
  onChange: (value: string | null) => void;
}

function atHour(base: Date, hour: number) {
  const d = new Date(base);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function addDays(days: number, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return atHour(d, hour);
}

export function DueDateField({ value, onChange }: DueDateFieldProps) {
  const colors = useThemeColors();
  const [showPicker, setShowPicker] = useState(false);
  const selected = value ? new Date(value) : null;

  const presets = [
    { label: 'Today', date: atHour(new Date(), 18) },
    { label: 'Tomorrow', date: addDays(1) },
    { label: 'In 2 days', date: addDays(2) },
    { label: 'Next week', date: addDays(7) },
  ];

  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed') return;
    if (date) {
      onChange(date.toISOString());
    }
  };

  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
        Due date
      </Text>

      <View className="mb-2 flex-row flex-wrap gap-2">
        {presets.map((preset) => {
          const active =
            selected != null &&
            selected.toDateString() === preset.date.toDateString();
          return (
            <Pressable
              key={preset.label}
              onPress={() => onChange(preset.date.toISOString())}
              className={cn(
                'rounded-full px-3 py-1.5',
                active ? 'bg-primary' : 'bg-surface-elevated dark:bg-surface-elevated-dark',
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold',
                  active ? 'text-white' : 'text-ink dark:text-ink-dark',
                )}
              >
                {preset.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={() => setShowPicker(true)}
          className="h-11 min-w-0 flex-1 flex-row items-center rounded-lg border border-border bg-card px-3 dark:border-border-dark dark:bg-card-dark"
        >
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text className="ml-2 flex-1 text-sm text-ink dark:text-ink-dark">
            {selected
              ? `${formatDate(selected, { weekday: 'short', month: 'short', day: 'numeric' })} · ${formatTime(selected)}`
              : 'Pick date & time'}
          </Text>
        </Pressable>
        {value ? (
          <Pressable
            onPress={() => onChange(null)}
            className="h-11 items-center justify-center rounded-lg border border-border px-3 dark:border-border-dark"
          >
            <Ionicons name="close" size={16} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {showPicker ? (
        <DateTimePicker
          value={selected ?? new Date()}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPickerChange}
        />
      ) : null}

      {Platform.OS === 'ios' && showPicker ? (
        <Pressable onPress={() => setShowPicker(false)} className="mt-2 self-end">
          <Text className="text-xs font-semibold text-primary">Done</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
