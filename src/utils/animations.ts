import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  ZoomIn,
} from 'react-native-reanimated';

export const FadeInView = Animated.createAnimatedComponent(Animated.View);

export const enterFade = FadeIn.duration(400);
export const enterFadeUp = FadeInUp.duration(450).springify().damping(18);
export const enterFadeDown = FadeInDown.duration(450).springify().damping(18);
export const enterSlideRight = SlideInRight.duration(400);
export const enterZoom = ZoomIn.duration(350).springify();
export const exitFade = FadeOut.duration(200);

export { FadeIn, FadeInDown, FadeInUp, FadeOut, SlideInRight, ZoomIn };
