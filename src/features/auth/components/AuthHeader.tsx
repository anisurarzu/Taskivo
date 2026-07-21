import { Text, View } from 'react-native';
import { APP_NAME } from '@/constants';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showBrand?: boolean;
}

export function AuthHeader({ title, subtitle, showBrand = true }: AuthHeaderProps) {
  return (
    <View className="mb-6 pt-2">
      {showBrand ? (
        <Text className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-primary">
          {APP_NAME}
        </Text>
      ) : null}
      <Text className="mb-1.5 text-2xl font-bold tracking-tight text-ink dark:text-ink-dark">
        {title}
      </Text>
      <Text className="text-sm leading-5 text-ink-secondary dark:text-ink-dark-secondary">
        {subtitle}
      </Text>
    </View>
  );
}
