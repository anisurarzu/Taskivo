import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { APP_NAME, APP_TAGLINE } from '@/constants';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const scale = useSharedValue(0.72);
  const opacity = useSharedValue(0);
  const tagOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 500 });
    tagOpacity.value = withDelay(280, withTiming(1, { duration: 500 }));
    const timer = setTimeout(onFinish, 1600);
    return () => clearTimeout(timer);
  }, [onFinish, opacity, scale, tagOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center bg-primary px-8">
      <Animated.View style={logoStyle} className="mb-6 items-center">
        <View className="mb-5 h-24 w-24 items-center justify-center rounded-[28px] bg-white/15">
          <Text className="text-5xl font-bold text-white">T</Text>
        </View>
        <Text className="text-4xl font-bold tracking-tight text-white">{APP_NAME}</Text>
      </Animated.View>
      <Animated.Text style={tagStyle} className="text-center text-base text-white/85">
        {APP_TAGLINE}
      </Animated.Text>
    </View>
  );
}
