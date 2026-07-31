import { useLocalSearchParams, useRouter } from 'expo-router';
import { TeamChatScreen } from '@/features/orgs';

export default function TeamChatRoute() {
  const router = useRouter();
  const { teamId } = useLocalSearchParams<{ teamId: string }>();
  return <TeamChatScreen teamId={String(teamId)} onBack={() => router.back()} />;
}
