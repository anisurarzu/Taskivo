import { useRouter } from 'expo-router';
import { ChatHubScreen } from '@/features/orgs';

export default function ChatTab() {
  const router = useRouter();
  return (
    <ChatHubScreen
      onOpenTeamChat={(teamId) => router.push(`/team/${teamId}/chat`)}
      onOpenOrgs={() => router.push('/(tabs)/organizations')}
    />
  );
}
