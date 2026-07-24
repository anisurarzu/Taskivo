import { Pressable, Text, View } from 'react-native';
import { cn } from '@/utils/cn';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface ChipSelectProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  activeClassName?: string;
}

export function ChipSelect<T extends string>({
  label,
  options,
  value,
  onChange,
  activeClassName = 'bg-primary',
}: ChipSelectProps<T>) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className={cn(
                'rounded-full px-3 py-1.5',
                active ? activeClassName : 'bg-surface-elevated dark:bg-surface-elevated-dark',
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold',
                  active ? 'text-white' : 'text-ink dark:text-ink-dark',
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
