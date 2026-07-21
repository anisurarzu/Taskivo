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
        'h-11 flex-row items-center rounded-lg border border-border bg-card px-3 dark:border-border-dark dark:bg-card-dark',
        containerClassName,
      )}
    >
      <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
      <TextInput
        placeholder="Search tasks..."
        placeholderTextColor={colors.textMuted}
        className={cn('ml-2 flex-1 text-sm text-ink dark:text-ink-dark', className)}
        returnKeyType="search"
        {...props}
      />
    </View>
  );
}
