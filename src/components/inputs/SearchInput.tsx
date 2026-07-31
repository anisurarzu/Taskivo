import { TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks';

interface SearchInputProps extends TextInputProps {
  containerClassName?: string;
}

/** Facebook-style filled search pill */
export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  const colors = useThemeColors();

  return (
    <View
      className={cn(
        'h-10 flex-row items-center rounded-full bg-surface-elevated px-3.5 dark:bg-surface-elevated-dark',
        containerClassName,
      )}
    >
      <Ionicons name="search" size={16} color={colors.textSecondary} />
      <TextInput
        placeholder="Search Taskivo"
        placeholderTextColor={colors.textMuted}
        className={cn('ml-2 flex-1 text-[15px] text-ink dark:text-ink-dark', className)}
        returnKeyType="search"
        {...props}
      />
    </View>
  );
}
