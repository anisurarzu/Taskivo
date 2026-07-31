import { Text, View } from 'react-native';
import { APP_NAME, APP_TAGLINE } from '@/constants';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showBrand?: boolean;
}

export function AuthHeader({ title, subtitle, showBrand = true }: AuthHeaderProps) {
  return (
    <View className="mb-6">
      {showBrand ? (
        <View className="mb-6 items-center">
          <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Text className="text-2xl font-bold text-white">T</Text>
          </View>
          <Text className="text-[22px] font-bold tracking-tight text-ink dark:text-ink-dark">
            {APP_NAME}
          </Text>
          <Text className="mt-0.5 text-[13px] font-medium text-ink-muted">{APP_TAGLINE}</Text>
        </View>
      ) : null}

      <Text className="text-center text-[24px] font-bold leading-8 tracking-tight text-ink dark:text-ink-dark">
        {title}
      </Text>
      <Text className="mt-2 text-center text-[15px] leading-5 text-ink-secondary dark:text-ink-dark-secondary">
        {subtitle}
      </Text>
    </View>
  );
}
