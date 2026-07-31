import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewToken,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onboardingSlides } from '@/data/mock';
import type { OnboardingSlide } from '@/types';
import { useIsDark } from '@/hooks';

const { width } = Dimensions.get('window');

const icons: Record<OnboardingSlide['illustration'], keyof typeof Ionicons.glyphMap> = {
  organize: 'layers-outline',
  focus: 'flash-outline',
  insights: 'stats-chart-outline',
};

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function AuthOnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const isDark = useIsDark();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        setIndex(viewableItems[0].index);
      }
    },
  ).current;

  const handleNext = () => {
    if (index < onboardingSlides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      return;
    }
    onComplete();
  };

  const gradient = isDark
    ? (['#18191A', '#242526', '#18191A'] as const)
    : (['#F0F2F5', '#F0F2F5', '#FFFFFF'] as const);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={[...gradient]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <SafeAreaView className="flex-1" edges={['top', 'left', 'right', 'bottom']}>
        <View className="flex-row items-center justify-between px-6 pt-2">
          <View className="flex-row items-center">
            <View className="mr-2.5 h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <Text className="text-base font-bold text-white">T</Text>
            </View>
            <Text className="text-lg font-bold text-ink dark:text-ink-dark">Taskivo</Text>
          </View>
          <SecondaryButton
            label="Skip"
            fullWidth={false}
            size="sm"
            onPress={onSkip}
            className="border-0 bg-transparent px-2"
          />
        </View>

        <FlatList
          ref={listRef}
          data={onboardingSlides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
          onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const next = Math.round(e.nativeEvent.contentOffset.x / width);
            setIndex(next);
          }}
          renderItem={({ item }) => (
            <Animated.View
              entering={FadeInRight.duration(360)}
              style={{ width }}
              className="px-6 pt-10"
            >
              <View className="mb-10 h-52 items-center justify-center rounded-3xl bg-primary/10 dark:bg-primary/15">
                <View className="h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-elevated">
                  <Ionicons name={icons[item.illustration]} size={40} color="#FFFFFF" />
                </View>
              </View>
              <Text className="mb-3 text-[32px] font-bold leading-10 tracking-tight text-ink dark:text-ink-dark">
                {item.title}
              </Text>
              <Text className="text-[16px] leading-7 text-ink-secondary dark:text-ink-dark-secondary">
                {item.description}
              </Text>
            </Animated.View>
          )}
        />

        <View className="px-6 pb-4">
          <View className="mb-6 flex-row items-center justify-center gap-2">
            {onboardingSlides.map((slide, i) => (
              <View
                key={slide.id}
                className={`h-2 rounded-full ${
                  i === index ? 'w-8 bg-primary' : 'w-2 bg-border dark:bg-border-dark'
                }`}
              />
            ))}
          </View>
          <PrimaryButton
            size="lg"
            label={index === onboardingSlides.length - 1 ? 'Get started' : 'Continue'}
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
