import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface AuthErrorBannerProps {
  message: string;
}

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  return (
    <View className="mb-4 flex-row items-start rounded-2xl border border-danger/25 bg-danger/8 px-4 py-3.5">
      <Ionicons name="alert-circle" size={20} color={colors.danger} style={{ marginTop: 1 }} />
      <Text className="ml-2.5 flex-1 text-[15px] leading-5 text-danger">{message}</Text>
    </View>
  );
}
