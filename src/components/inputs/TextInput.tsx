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
      ...props
    },
    ref,
  ) => {
    const colors = useThemeColors();
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(secureTextEntry);

    const resolvedRightIcon =
      secureTextEntry !== undefined
        ? hidden
          ? 'eye-outline'
          : 'eye-off-outline'
        : rightIcon;

    return (
      <View className={cn('w-full', containerClassName)}>
        {label ? (
          <Text className="mb-2 text-sm font-medium text-ink dark:text-ink-dark">{label}</Text>
        ) : null}
        <View
          className={cn(
            'h-12 flex-row items-center rounded-xl border bg-surface px-4 dark:bg-surface-dark',
            focused ? 'border-primary' : 'border-border dark:border-border-dark',
            error && 'border-danger',
          )}
        >
          {leftIcon ? (
            <Ionicons
              name={leftIcon}
              size={20}
              color={colors.textSecondary}
              style={{ marginRight: 10 }}
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
            className={cn('flex-1 text-base text-ink dark:text-ink-dark', className)}
            {...props}
          />
          {resolvedRightIcon ? (
            <Ionicons
              name={resolvedRightIcon}
              size={20}
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
        {error ? <Text className="mt-1.5 text-sm text-danger">{error}</Text> : null}
        {!error && hint ? (
          <Text className="mt-1.5 text-sm text-ink-secondary dark:text-ink-dark-secondary">
            {hint}
          </Text>
        ) : null}
      </View>
    );
  },
);

AppTextInput.displayName = 'AppTextInput';
