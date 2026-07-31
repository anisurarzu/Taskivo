import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { PrimaryButton, IconButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import { EmptyState, ListRowSkeleton } from '@/components/ui';
import { AppModal } from '@/components/modals';
import { colors } from '@/theme/colors';
import { useCreateOrganizationMutation, useOrganizationsQuery } from '../hooks/useOrgs';

interface OrganizationsScreenProps {
  onOrgPress: (orgId: string) => void;
}

export function OrganizationsScreen({ onOrgPress }: OrganizationsScreenProps) {
  const { data: orgs = [], isLoading, isError, refetch } = useOrganizationsQuery();
  const createOrg = useCreateOrganizationMutation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onCreate = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError(null);
    try {
      const org = await createOrg.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setOpen(false);
      setName('');
      setDescription('');
      onOrgPress(org.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create organization');
    }
  };

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(280)} className="pt-1">
        <View className="mb-6 flex-row items-center justify-between">
          <View className="min-w-0 flex-1 pr-3">
            <Text className="text-[28px] font-bold tracking-tight text-ink dark:text-ink-dark">
              Organizations
            </Text>
            <Text className="mt-1.5 text-[16px] text-ink-secondary dark:text-ink-dark-secondary">
              Teams, chat, and shared work
            </Text>
          </View>
          <IconButton name="add" variant="filled" size={22} onPress={() => setOpen(true)} />
        </View>

        {isLoading ? (
          <View>
            <ListRowSkeleton />
            <ListRowSkeleton />
            <ListRowSkeleton />
          </View>
        ) : null}

        {isError ? (
          <EmptyState
            title="Couldn’t load organizations"
            description="Check your connection and try again."
            actionLabel="Retry"
            onAction={() => void refetch()}
            icon="alert-circle-outline"
          />
        ) : null}

        {!isLoading && !isError && orgs.length === 0 ? (
          <EmptyState
            title="No organizations yet"
            description="Create one to collaborate with your team."
            actionLabel="Create organization"
            onAction={() => setOpen(true)}
            icon="people-outline"
          />
        ) : null}

        {!isLoading && !isError ? (
          <View className="gap-3">
            {orgs.map((org) => (
              <Pressable key={org.id} onPress={() => onOrgPress(org.id)}>
                <Card className="p-4">
                  <View className="flex-row items-center">
                    <View className="mr-3.5 h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <Ionicons name="business-outline" size={24} color={colors.primary} />
                    </View>
                    <View className="min-w-0 flex-1">
                      <Text className="text-[17px] font-semibold text-ink dark:text-ink-dark">
                        {org.name}
                      </Text>
                      <Text className="mt-1 text-[14px] text-ink-secondary dark:text-ink-dark-secondary">
                        {org.description?.trim() || org.plan}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        ) : null}
      </Animated.View>

      <AppModal visible={open} onClose={() => setOpen(false)} title="New organization">
        <View className="gap-4">
          <AppTextInput
            size="lg"
            label="Name"
            placeholder="Acme Labs"
            value={name}
            onChangeText={setName}
          />
          <AppTextInput
            size="lg"
            label="Description"
            placeholder="Optional"
            value={description}
            onChangeText={setDescription}
          />
          {error ? <Text className="text-[14px] text-danger">{error}</Text> : null}
          <PrimaryButton
            size="lg"
            label="Create"
            loading={createOrg.isPending}
            onPress={() => void onCreate()}
          />
        </View>
      </AppModal>
    </Screen>
  );
}
