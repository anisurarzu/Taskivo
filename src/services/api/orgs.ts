import { apiClient } from './client';

/** Orgs/teams scaffold — mirrors Taskivo-Web/src/services/api/orgs.ts */
export const orgsApi = {
  list: () => apiClient.get('/organizations'),
  create: (body: { name: string; description?: string }) =>
    apiClient.post('/organizations', body),
  get: (orgId: string) => apiClient.get(`/organizations/${orgId}`),
  members: (orgId: string) => apiClient.get(`/organizations/${orgId}/members`),
  invite: (orgId: string, body: { email: string; role?: string; teamId?: string }) =>
    apiClient.post(`/organizations/${orgId}/members`, body),
  joinByToken: (inviteToken: string) =>
    apiClient.post(`/organizations/join/${inviteToken}`),
  checkAccess: () => apiClient.get('/organizations/access'),
  teams: (orgId: string) => apiClient.get(`/organizations/${orgId}/teams`),
  createTeam: (orgId: string, body: { name: string; description?: string }) =>
    apiClient.post(`/organizations/${orgId}/teams`, body),
  team: (teamId: string) => apiClient.get(`/teams/${teamId}`),
  teamMembers: (teamId: string) => apiClient.get(`/teams/${teamId}/members`),
  teamMessages: (teamId: string, params?: { limit?: number; before?: string }) =>
    apiClient.get(`/teams/${teamId}/messages`, { params }),
  teamBudgets: (teamId: string) => apiClient.get(`/teams/${teamId}/budgets`),
};
