import { Modal as RNModal, Pressable, Text, View, type ModalProps } from 'react-native';
import { IconButton } from '@/components/buttons';
import { cn } from '@/utils/cn';

interface AppModalProps extends ModalProps {
  title?: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AppModal({
  title,
  visible,
  onClose,
  children,
  className,
  ...props
}: AppModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-5"
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className={cn(
            'w-full max-w-md rounded-2xl bg-surface p-5 dark:bg-surface-dark',
            className,
          )}
        >
          {title ? (
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-ink dark:text-ink-dark">{title}</Text>
              <IconButton name="close" onPress={onClose} />
            </View>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
