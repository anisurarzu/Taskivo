import { apiClient } from './client';

export type ApiBudget = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  note?: string;
  month?: string;
  organizationId?: string;
  teamId?: string;
  parentBudgetId?: string;
  parentBudgetName?: string;
  kind?: 'personal' | 'org_fund' | 'team';
  funded: number;
  allocated: number;
  availableToAllocate: number;
  directSpent: number;
  childSpent: number;
  spent: number;
  remaining: number;
  expenseCount: number;
  depositCount: number;
  createdAt: string;
  updatedAt: string;
};

export type BudgetInput = {
  name: string;
  amount: number;
  currency?: string;
  note?: string;
  month?: string;
  teamId?: string | null;
  parentBudgetId?: string | null;
};

export const budgetsApi = {
  list: (params?: Record<string, string>) => apiClient.get<ApiBudget[]>('/budgets', { params }),
  get: (id: string) => apiClient.get<ApiBudget>(`/budgets/${id}`),
  create: (body: BudgetInput) => apiClient.post<ApiBudget>('/budgets', body),
  update: (id: string, body: Partial<BudgetInput>) =>
    apiClient.patch<ApiBudget>(`/budgets/${id}`, body),
  remove: (id: string) => apiClient.delete(`/budgets/${id}`),
  listForOrg: (orgId: string, params?: { teamId?: string }) =>
    apiClient.get<ApiBudget[]>(`/organizations/${orgId}/budgets`, { params }),
  createForOrg: (orgId: string, body: BudgetInput) =>
    apiClient.post<ApiBudget>(`/organizations/${orgId}/budgets`, body),
  deposits: (orgId: string, budgetId: string) =>
    apiClient.get(`/organizations/${orgId}/budgets/${budgetId}/deposits`),
  addDeposit: (
    orgId: string,
    budgetId: string,
    body: { amount: number; note?: string; userId?: string },
  ) => apiClient.post(`/organizations/${orgId}/budgets/${budgetId}/deposits`, body),
};
