import { forwardRef, useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
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
  /** sm=44 · md=52 · lg=56 — auth screens use lg */
  size?: 'sm' | 'md' | 'lg';
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

    const heightClass = size === 'sm' ? 'h-11' : size === 'lg' ? 'h-14' : 'h-12';
    const radiusClass = 'rounded-xl';
    const iconSize = size === 'lg' ? 20 : 18;
    const textSize = size === 'lg' ? 'text-[16px]' : 'text-[15px]';

    const resolvedRightIcon =
      secureTextEntry !== undefined
        ? hidden
          ? 'eye-outline'
          : 'eye-off-outline'
        : rightIcon;

    return (
      <View className={cn('w-full', containerClassName)}>
        {label ? (
          <Text className="mb-2 text-[14px] font-semibold text-ink dark:text-ink-dark">
            {label}
          </Text>
        ) : null}
        <View
          className={cn(
            'flex-row items-center border bg-card px-4 dark:bg-card-dark',
            heightClass,
            radiusClass,
            focused
              ? 'border-primary bg-primary/[0.04] dark:bg-primary/10'
              : 'border-border dark:border-border-dark',
            error && 'border-danger bg-danger/[0.04]',
          )}
        >
          {leftIcon ? (
            <Ionicons
              name={leftIcon}
              size={iconSize}
              color={focused ? colors.primary : colors.textMuted}
              style={{ marginRight: 12 }}
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
            className={cn(
              'flex-1 py-0 leading-5 text-ink dark:text-ink-dark',
              textSize,
              className,
            )}
            {...props}
          />
          {resolvedRightIcon ? (
            <Pressable
              hitSlop={10}
              onPress={() => {
                if (secureTextEntry !== undefined) {
                  setHidden((v) => !v);
                }
                onRightIconPress?.();
              }}
              className="ml-1 h-9 w-9 items-center justify-center"
            >
              <Ionicons name={resolvedRightIcon} size={iconSize} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
        {error ? <Text className="mt-1.5 text-[13px] text-danger">{error}</Text> : null}
        {!error && hint ? (
          <Text className="mt-1.5 text-[13px] text-ink-muted">{hint}</Text>
        ) : null}
      </View>
    );
  },
);

AppTextInput.displayName = 'AppTextInput';
