import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/common';
import { IconButton, PrimaryButton, SecondaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { useAuthStore } from '@/features/auth';

interface ProfileEditScreenProps {
  onBack: () => void;
}

export function ProfileEditScreen({ onBack }: ProfileEditScreenProps) {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);
  const storeError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(320)} className="pt-2">
        <View className="mb-5 flex-row items-center">
          <IconButton name="chevron-back" onPress={onBack} className="-ml-2" />
          <Text className="ml-1 text-2xl font-bold text-ink dark:text-ink-dark">Edit profile</Text>
        </View>

        <View className="mb-6 gap-3.5">
          <AppTextInput label="Name" value={name} onChangeText={setName} leftIcon="person-outline" />
          <AppTextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="A short intro"
            leftIcon="document-text-outline"
          />
          <PrimaryButton
            label="Save profile"
            loading={isLoading}
            onPress={() => {
              void (async () => {
                clearError();
                setSuccess(null);
                try {
                  await updateProfile({ name: name.trim(), bio: bio.trim() });
                  setSuccess('Profile updated');
                } catch {
                  // store error
                }
              })();
            }}
          />
        </View>

        <Text className="mb-3 text-base font-semibold text-ink dark:text-ink-dark">
          Change password
        </Text>
        <View className="mb-4 gap-3.5">
          <AppTextInput
            label="Current password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            leftIcon="lock-closed-outline"
          />
          <AppTextInput
            label="New password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            leftIcon="lock-closed-outline"
            hint="8+ chars, 1 uppercase, 1 number"
          />
        </View>

        {storeError ? (
          <View className="mb-3 rounded-xl border border-danger/20 bg-danger/5 px-3 py-2.5">
            <Text className="text-sm text-danger">{storeError}</Text>
          </View>
        ) : null}
        {success ? (
          <View className="mb-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
            <Text className="text-sm text-primary">{success}</Text>
          </View>
        ) : null}

        <View className="gap-2.5 pb-4">
          <PrimaryButton
            label="Update password"
            loading={isLoading}
            onPress={() => {
              void (async () => {
                clearError();
                setSuccess(null);
                try {
                  await changePassword({ currentPassword, newPassword });
                  setCurrentPassword('');
                  setNewPassword('');
                  setSuccess('Password changed');
                } catch {
                  // store error
                }
              })();
            }}
          />
          <SecondaryButton label="Done" onPress={onBack} />
        </View>
      </Animated.View>
    </Screen>
  );
}
