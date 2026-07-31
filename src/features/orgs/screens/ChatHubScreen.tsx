import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/common';
import { EmptyState, Loading } from '@/components/ui';
import { colors } from '@/theme/colors';
import { useAllTeamsForChatQuery, useOrganizationsQuery } from '../hooks/useOrgs';

interface ChatHubScreenProps {
  onOpenTeamChat: (teamId: string) => void;
  onOpenOrgs: () => void;
}

export function ChatHubScreen({ onOpenTeamChat, onOpenOrgs }: ChatHubScreenProps) {
  const orgsQuery = useOrganizationsQuery();
  const teamsQuery = useAllTeamsForChatQuery();

  const rows = teamsQuery.data ?? [];

  return (
    <Screen scroll tabBar>
      <Animated.View entering={FadeInDown.duration(280)} className="pt-1">
        <Text className="text-[28px] font-bold tracking-tight text-ink dark:text-ink-dark">
          Chat
        </Text>
        <Text className="mt-1 text-[15px] text-ink-secondary dark:text-ink-dark-secondary">
          Team conversations
        </Text>

        {orgsQuery.isLoading || teamsQuery.isLoading ? (
          <View className="mt-8">
            <Loading label="Loading conversations…" />
          </View>
        ) : null}

        {!orgsQuery.isLoading && (orgsQuery.data?.length ?? 0) === 0 ? (
          <View className="mt-6">
            <EmptyState
              title="Join an organization first"
              description="Create or open an org, then chat with your team."
              actionLabel="Go to Orgs"
              onAction={onOpenOrgs}
              icon="people-outline"
            />
          </View>
        ) : null}

        {!teamsQuery.isLoading && (orgsQuery.data?.length ?? 0) > 0 && rows.length === 0 ? (
          <View className="mt-6">
            <EmptyState
              title="No teams yet"
              description="Create a team inside your organization to start chatting."
              actionLabel="Open Orgs"
              onAction={onOpenOrgs}
              icon="chatbubbles-outline"
            />
          </View>
        ) : null}

        <View className="mt-4 overflow-hidden rounded-xl border border-border/80 bg-card dark:border-border-dark dark:bg-card-dark">
          {rows.map(({ orgName, team }, index) => (
            <Pressable
              key={team.id}
              onPress={() => onOpenTeamChat(team.id)}
              className={`flex-row items-center px-3.5 py-3 ${
                index < rows.length - 1 ? 'border-b border-border/70 dark:border-border-dark' : ''
              }`}
            >
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Ionicons name="chatbubbles" size={22} color={colors.primary} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-[15px] font-semibold text-ink dark:text-ink-dark">
                  {team.name}
                </Text>
                <Text className="mt-0.5 text-[13px] text-ink-secondary dark:text-ink-dark-secondary">
                  {orgName}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Screen>
  );
}
