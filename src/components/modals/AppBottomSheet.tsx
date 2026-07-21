import { forwardRef, useMemo, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { useThemeColors } from '@/hooks';

interface AppBottomSheetProps extends Partial<BottomSheetModalProps> {
  title?: string;
  children: ReactNode;
  snapPoints?: (string | number)[];
}

export const AppBottomSheet = forwardRef<BottomSheetModal, AppBottomSheetProps>(
  ({ title, children, snapPoints: customSnapPoints, ...props }, ref) => {
    const colors = useThemeColors();
    const snapPoints = useMemo(() => customSnapPoints ?? ['40%', '70%'], [customSnapPoints]);

    const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
      />
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.surface, borderRadius: 24 }}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
        {...props}
      >
        <BottomSheetView className="px-5 pb-8 pt-2">
          {title ? (
            <Text className="mb-4 text-xl font-bold text-ink dark:text-ink-dark">{title}</Text>
          ) : null}
          <View>{children}</View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

AppBottomSheet.displayName = 'AppBottomSheet';
