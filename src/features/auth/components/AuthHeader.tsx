import { Text, View } from 'react-native';
import { APP_NAME, APP_TAGLINE } from '@/constants';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showBrand?: boolean;
}

export function AuthHeader({ title, subtitle, showBrand = true }: AuthHeaderProps) {
  return (
    <View className="mb-7 pt-1">
      {showBrand ? (
        <View className="mb-5 overflow-hidden rounded-card">
          <View className="bg-primary px-5 py-6">
            <Text className="text-3xl font-bold tracking-tight text-white">{APP_NAME}</Text>
            <Text className="mt-1.5 text-sm leading-5 text-white/85">{APP_TAGLINE}</Text>
          </View>
        </View>
      ) : null}
      <Text className="mb-1.5 text-2xl font-bold tracking-tight text-ink dark:text-ink-dark">
        {title}
      </Text>
      <Text className="text-sm leading-6 text-ink-secondary dark:text-ink-dark-secondary">
        {subtitle}
      </Text>
    </View>
  );
}
