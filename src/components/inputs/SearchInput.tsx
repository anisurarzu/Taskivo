import { TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks';

interface SearchInputProps extends TextInputProps {
  containerClassName?: string;
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn(
        'h-12 flex-row items-center rounded-xl border border-border bg-surface px-4 dark:border-border-dark dark:bg-surface-dark',
        containerClassName,
      )}
    >
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
      <TextInput
        placeholder="Search tasks, tags, notes..."
        placeholderTextColor={colors.textMuted}
        className={cn('ml-3 flex-1 text-base text-ink dark:text-ink-dark', className)}
        returnKeyType="search"
        {...props}
      />
    </View>
  );
}
