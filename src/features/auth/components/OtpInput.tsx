import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: boolean;
}

export function OtpInput({ value, onChange, length = 6, error }: OtpInputProps) {
  const colors = useThemeColors();
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const updateAt = (index: number, char: string) => {
    const next = value.split('');
    next[index] = char;
    const joined = next.join('').replace(/\s/g, '').slice(0, length);
    onChange(joined);
    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between gap-2.5">
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          value={digit.trim()}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          onChangeText={(text) => updateAt(index, text.replace(/\D/g, '').slice(-1))}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !digit.trim() && index > 0) {
              inputs.current[index - 1]?.focus();
            }
          }}
          placeholderTextColor={colors.textMuted}
          className={cn(
            'h-14 min-w-0 flex-1 rounded-2xl border bg-card text-center text-xl font-bold text-ink dark:bg-card-dark dark:text-ink-dark',
            error ? 'border-danger' : 'border-border dark:border-border-dark',
          )}
        />
      ))}
    </View>
  );
}
