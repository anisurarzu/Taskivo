import { useRouter } from 'expo-router';
import { OrganizationsScreen } from '@/features/orgs';

export default function OrganizationsTab() {
  const router = useRouter();
  return (
    <OrganizationsScreen
      onOrgPress={(orgId) => router.push(`/organization/${orgId}`)}
    />
  );
}
