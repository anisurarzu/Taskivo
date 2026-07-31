import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage, orgsApi } from '@/services/api';
import type { ChatMessage, Organization, OrgMember, Team, TeamMember } from '../types';

export const orgKeys = {
  all: ['orgs'] as const,
  list: () => [...orgKeys.all, 'list'] as const,
  detail: (id: string) => [...orgKeys.all, 'detail', id] as const,
  members: (id: string) => [...orgKeys.all, 'members', id] as const,
  teams: (id: string) => [...orgKeys.all, 'teams', id] as const,
  team: (id: string) => [...orgKeys.all, 'team', id] as const,
  teamMembers: (id: string) => [...orgKeys.all, 'team-members', id] as const,
  messages: (id: string) => [...orgKeys.all, 'messages', id] as const,
  access: () => [...orgKeys.all, 'access'] as const,
};

export function useOrganizationsQuery() {
  return useQuery({
    queryKey: orgKeys.list(),
    queryFn: async () => {
      try {
        const { data } = await orgsApi.list();
        return data as Organization[];
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load organizations'));
      }
    },
  });
}

export function useOrganizationQuery(orgId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.detail(orgId ?? ''),
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data } = await orgsApi.get(orgId!);
      return data as Organization;
    },
  });
}

export function useOrgTeamsQuery(orgId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.teams(orgId ?? ''),
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data } = await orgsApi.teams(orgId!);
      return data as Team[];
    },
  });
}

export function useOrgMembersQuery(orgId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.members(orgId ?? ''),
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data } = await orgsApi.members(orgId!);
      return data as OrgMember[];
    },
  });
}

export function useTeamQuery(teamId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.team(teamId ?? ''),
    enabled: Boolean(teamId),
    queryFn: async () => {
      const { data } = await orgsApi.team(teamId!);
      return data as Team;
    },
  });
}

export function useTeamMembersQuery(teamId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.teamMembers(teamId ?? ''),
    enabled: Boolean(teamId),
    queryFn: async () => {
      const { data } = await orgsApi.teamMembers(teamId!);
      return data as TeamMember[];
    },
  });
}

export function useAllTeamsForChatQuery() {
  const orgsQuery = useOrganizationsQuery();
  return useQuery({
    queryKey: [...orgKeys.all, 'chat-hub'],
    enabled: Boolean(orgsQuery.data?.length),
    queryFn: async () => {
      const orgs = orgsQuery.data ?? [];
      const rows: Array<{ orgId: string; orgName: string; team: Team }> = [];
      for (const org of orgs) {
        const { data } = await orgsApi.teams(org.id);
        const teams = data as Team[];
        for (const team of teams) {
          rows.push({ orgId: org.id, orgName: org.name, team });
        }
      }
      return rows;
    },
  });
}

export function useTeamMessagesQuery(teamId: string | undefined) {
  return useQuery({
    queryKey: orgKeys.messages(teamId ?? ''),
    enabled: Boolean(teamId),
    queryFn: async () => {
      const { data } = await orgsApi.teamMessages(teamId!);
      return data as ChatMessage[];
    },
    refetchInterval: 15_000,
  });
}

export function useCreateOrganizationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description?: string }) => {
      try {
        const { data } = await orgsApi.create(body);
        return data as Organization;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to create organization'));
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: orgKeys.all });
    },
  });
}

export function useCreateTeamMutation(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description?: string }) => {
      try {
        const { data } = await orgsApi.createTeam(orgId, body);
        return data as Team;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to create team'));
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: orgKeys.teams(orgId) });
    },
  });
}

export function useInviteMemberMutation(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { email: string; role?: string }) => {
      try {
        const { data } = await orgsApi.invite(orgId, body);
        return data as OrgMember;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to invite member'));
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: orgKeys.members(orgId) });
    },
  });
}
