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
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { Screen } from '@/components/common';
import { onboardingSlides } from '@/data/mock';
import type { OnboardingSlide } from '@/types';
import { colors } from '@/theme/colors';

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

  return (
    <Screen padded={false} className="bg-background dark:bg-background-dark">
      <View className="flex-row items-center justify-between px-5 pt-2">
        <Text className="text-lg font-bold text-primary">Taskivo</Text>
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
            entering={FadeInRight.duration(400)}
            style={{ width }}
            className="px-8 pt-10"
          >
            <View className="mb-10 h-56 items-center justify-center rounded-3xl bg-primary/10 dark:bg-primary/20">
              <View className="h-28 w-28 items-center justify-center rounded-[32px] bg-primary">
                <Ionicons name={icons[item.illustration]} size={48} color="#FFFFFF" />
              </View>
            </View>
            <Text className="mb-3 text-3xl font-bold text-ink dark:text-ink-dark">
              {item.title}
            </Text>
            <Text className="text-base leading-7 text-ink-secondary dark:text-ink-dark-secondary">
              {item.description}
            </Text>
          </Animated.View>
        )}
      />

      <View className="px-5 pb-4">
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
          label={index === onboardingSlides.length - 1 ? 'Get started' : 'Continue'}
          onPress={handleNext}
        />
      </View>
    </Screen>
  );
}
