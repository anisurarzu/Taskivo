import { forwardRef, useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { useThemeColors } from '@/hooks';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
  size?: 'sm' | 'md';
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerClassName,
      className,
      secureTextEntry,
      size = 'md',
      ...props
    },
    ref,
  ) => {
    const colors = useThemeColors();
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(secureTextEntry);
    const heightClass = size === 'sm' ? 'h-10' : 'h-11';

    const resolvedRightIcon =
      secureTextEntry !== undefined
        ? hidden
          ? 'eye-outline'
          : 'eye-off-outline'
        : rightIcon;

    return (
      <View className={cn('w-full', containerClassName)}>
        {label ? (
          <Text className="mb-1.5 text-xs font-medium text-ink-secondary dark:text-ink-dark-secondary">
            {label}
          </Text>
        ) : null}
        <View
          className={cn(
            'flex-row items-center rounded-lg border bg-card px-3 dark:bg-card-dark',
            heightClass,
            focused ? 'border-primary' : 'border-border dark:border-border-dark',
            error && 'border-danger',
          )}
        >
          {leftIcon ? (
            <Ionicons
              name={leftIcon}
              size={16}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />
          ) : null}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textMuted}
            secureTextEntry={secureTextEntry ? hidden : undefined}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            className={cn('flex-1 text-sm text-ink dark:text-ink-dark', className)}
            {...props}
          />
          {resolvedRightIcon ? (
            <Ionicons
              name={resolvedRightIcon}
              size={16}
              color={colors.textSecondary}
              onPress={() => {
                if (secureTextEntry !== undefined) {
                  setHidden((v) => !v);
                }
                onRightIconPress?.();
              }}
            />
          ) : null}
        </View>
        {error ? <Text className="mt-1 text-xs text-danger">{error}</Text> : null}
        {!error && hint ? (
          <Text className="mt-1 text-xs text-ink-muted">{hint}</Text>
        ) : null}
      </View>
    );
  },
);

AppTextInput.displayName = 'AppTextInput';
