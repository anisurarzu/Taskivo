import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { Card } from '@/components/cards';
import { IconButton, PrimaryButton } from '@/components/buttons';
import { AppTextInput } from '@/components/inputs';
import {
  Avatar,
  DetailScreenSkeleton,
  EmptyState,
  ListRowSkeleton,
} from '@/components/ui';
import { AppModal } from '@/components/modals';
import { colors } from '@/theme/colors';
import {
  useCreateTeamMutation,
  useInviteMemberMutation,
  useOrganizationQuery,
  useOrgMembersQuery,
  useOrgTeamsQuery,
} from '../hooks/useOrgs';

interface OrganizationDetailScreenProps {
  orgId: string;
  onBack: () => void;
  onTeamPress: (teamId: string) => void;
  onBudgetsPress: () => void;
  onTeamChatPress?: (teamId: string) => void;
}

export function OrganizationDetailScreen({
  orgId,
  onBack,
  onTeamPress,
  onBudgetsPress,
  onTeamChatPress,
}: OrganizationDetailScreenProps) {
  const orgQuery = useOrganizationQuery(orgId);
  const teamsQuery = useOrgTeamsQuery(orgId);
  const membersQuery = useOrgMembersQuery(orgId);
  const createTeam = useCreateTeamMutation(orgId);
  const invite = useInviteMemberMutation(orgId);

  const [teamOpen, setTeamOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const org = orgQuery.data;
  const teams = teamsQuery.data ?? [];
  const members = membersQuery.data ?? [];

  if (orgQuery.isLoading) {
    return (
      <Screen scroll>
        <DetailScreenSkeleton rows={4} />
      </Screen>
    );
  }

  if (!org) {
    return (
      <Screen>
        <EmptyState
          title="Organization not found"
          actionLabel="Go back"
          onAction={onBack}
          icon="alert-circle-outline"
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(280)} className="pt-1">
        <View className="mb-5 flex-row items-center justify-between">
          <IconButton name="chevron-back" onPress={onBack} size={22} className="-ml-1" />
          <View className="flex-row gap-2">
            <IconButton name="wallet-outline" variant="soft" size={20} onPress={onBudgetsPress} />
            <IconButton
              name="person-add-outline"
              variant="soft"
              size={20}
              onPress={() => setInviteOpen(true)}
            />
            <IconButton name="add" variant="filled" size={22} onPress={() => setTeamOpen(true)} />
          </View>
        </View>

        <Text className="text-[28px] font-bold leading-8 tracking-tight text-ink dark:text-ink-dark">
          {org.name}
        </Text>
        {org.description ? (
          <Text className="mt-2 text-[16px] leading-6 text-ink-secondary dark:text-ink-dark-secondary">
            {org.description}
          </Text>
        ) : (
          <Text className="mt-2 text-[16px] leading-6 text-ink-muted">
            Teams, budgets, and members
          </Text>
        )}

        <Pressable
          onPress={onBudgetsPress}
          className="mt-5 flex-row items-center rounded-xl border border-border bg-card px-4 py-4 dark:border-border-dark dark:bg-card-dark"
        >
          <View className="mr-3.5 h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Ionicons name="wallet-outline" size={22} color={colors.primary} />
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-[17px] font-semibold text-ink dark:text-ink-dark">Budgets</Text>
            <Text className="mt-0.5 text-[14px] text-ink-secondary dark:text-ink-dark-secondary">
              Org funds & team allocations
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <View className="mb-2 mt-8 flex-row items-center justify-between">
          <Text className="text-[19px] font-bold text-ink dark:text-ink-dark">Teams</Text>
          <Text className="text-[15px] font-medium text-ink-muted">{teams.length}</Text>
        </View>
        <Text className="mb-4 text-[15px] leading-5 text-ink-secondary dark:text-ink-dark-secondary">
          Open a team for tasks, progress, and budgets. Chat is separate.
        </Text>

        {teamsQuery.isLoading ? (
          <View>
            <ListRowSkeleton />
            <ListRowSkeleton />
            <ListRowSkeleton />
          </View>
        ) : null}

        {!teamsQuery.isLoading && teams.length === 0 ? (
          <EmptyState
            title="No teams yet"
            description="Create a team to assign tasks and open chat."
            actionLabel="New team"
            onAction={() => setTeamOpen(true)}
            icon="people-outline"
          />
        ) : null}

        {!teamsQuery.isLoading ? (
          <View className="gap-3">
            {teams.map((team) => (
              <Card key={team.id} className="p-4">
                <Pressable onPress={() => onTeamPress(team.id)}>
                  <View className="flex-row items-center">
                    <View className="mr-3.5 h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Ionicons name="briefcase-outline" size={22} color={colors.primary} />
                    </View>
                    <View className="min-w-0 flex-1">
                      <Text className="text-[17px] font-semibold text-ink dark:text-ink-dark">
                        {team.name}
                      </Text>
                      <Text className="mt-1 text-[14px] text-ink-secondary dark:text-ink-dark-secondary">
                        {team.description?.trim() || 'Tasks · budgets · members'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </View>
                </Pressable>
                {onTeamChatPress ? (
                  <Pressable
                    onPress={() => onTeamChatPress(team.id)}
                    className="mt-3.5 flex-row items-center justify-center rounded-xl bg-primary/10 py-3"
                  >
                    <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} />
                    <Text className="ml-2 text-[15px] font-semibold text-primary">Open chat</Text>
                  </Pressable>
                ) : null}
              </Card>
            ))}
          </View>
        ) : null}

        <Text className="mb-3 mt-8 text-[19px] font-bold text-ink dark:text-ink-dark">
          Members
        </Text>

        {membersQuery.isLoading ? (
          <View>
            <ListRowSkeleton />
            <ListRowSkeleton />
          </View>
        ) : (
          <Card padded={false}>
            {members.length === 0 ? (
              <View className="px-4 py-5">
                <Text className="text-[15px] text-ink-secondary dark:text-ink-dark-secondary">
                  Invite teammates to collaborate.
                </Text>
              </View>
            ) : (
              members.map((member, index) => (
                <View
                  key={member.id}
                  className={`flex-row items-center px-4 py-3.5 ${
                    index < members.length - 1
                      ? 'border-b border-border dark:border-border-dark'
                      : ''
                  }`}
                >
                  <Avatar name={member.user.name} uri={member.user.avatarUrl} size="md" />
                  <View className="ml-3.5 min-w-0 flex-1">
                    <Text className="text-[16px] font-semibold text-ink dark:text-ink-dark">
                      {member.user.name}
                    </Text>
                    <Text className="mt-0.5 text-[14px] text-ink-secondary dark:text-ink-dark-secondary">
                      {member.user.email}
                    </Text>
                  </View>
                  <Text className="text-[13px] font-semibold capitalize text-primary">
                    {member.role}
                  </Text>
                </View>
              ))
            )}
          </Card>
        )}
      </Animated.View>

      <AppModal visible={teamOpen} onClose={() => setTeamOpen(false)} title="New team">
        <AppTextInput
          size="lg"
          label="Team name"
          placeholder="Product"
          value={teamName}
          onChangeText={setTeamName}
          containerClassName="mb-4"
        />
        {error ? <Text className="mb-3 text-[14px] text-danger">{error}</Text> : null}
        <PrimaryButton
          size="lg"
          label="Create team"
          loading={createTeam.isPending}
          onPress={() => {
            void (async () => {
              setError(null);
              try {
                const team = await createTeam.mutateAsync({ name: teamName.trim() });
                setTeamOpen(false);
                setTeamName('');
                onTeamPress(team.id);
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Could not create team');
              }
            })();
          }}
        />
      </AppModal>

      <AppModal visible={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite member">
        <AppTextInput
          size="lg"
          label="Email"
          placeholder="teammate@company.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={inviteEmail}
          onChangeText={setInviteEmail}
          containerClassName="mb-4"
        />
        {error ? <Text className="mb-3 text-[14px] text-danger">{error}</Text> : null}
        <PrimaryButton
          size="lg"
          label="Send invite"
          loading={invite.isPending}
          onPress={() => {
            void (async () => {
              setError(null);
              try {
                await invite.mutateAsync({ email: inviteEmail.trim(), role: 'member' });
                setInviteOpen(false);
                setInviteEmail('');
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Could not invite');
              }
            })();
          }}
        />
      </AppModal>
    </Screen>
  );
}
