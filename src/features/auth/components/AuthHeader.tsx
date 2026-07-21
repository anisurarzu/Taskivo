import { Text, View } from 'react-native';
import { APP_NAME } from '@/constants';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showBrand?: boolean;
}

export function AuthHeader({ title, subtitle, showBrand = true }: AuthHeaderProps) {
  return (
    <View className="mb-8 pt-4">
      {showBrand ? (
        <Text className="mb-3 text-sm font-semibold uppercase tracking-[2px] text-primary">
          {APP_NAME}
        </Text>
      ) : null}
      <Text className="mb-2 text-3xl font-bold leading-9 text-ink dark:text-ink-dark">{title}</Text>
      <Text className="text-base leading-6 text-ink-secondary dark:text-ink-dark-secondary">
        {subtitle}
      </Text>
    </View>
  );
}
