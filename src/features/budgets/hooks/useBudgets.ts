import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  budgetsApi,
  expensesApi,
  getApiErrorMessage,
  type ApiBudget,
  type BudgetInput,
  type ApiExpense,
  type ExpenseInput,
} from '@/services/api';

export const budgetKeys = {
  all: ['budgets'] as const,
  list: () => [...budgetKeys.all, 'list'] as const,
  detail: (id: string) => [...budgetKeys.all, 'detail', id] as const,
  org: (orgId: string, teamId?: string) =>
    [...budgetKeys.all, 'org', orgId, teamId ?? 'all'] as const,
  expenses: (budgetId?: string) => [...budgetKeys.all, 'expenses', budgetId ?? 'all'] as const,
};

export function useBudgetsQuery() {
  return useQuery({
    queryKey: budgetKeys.list(),
    queryFn: async () => {
      try {
        const { data } = await budgetsApi.list();
        return data as ApiBudget[];
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load budgets'));
      }
    },
  });
}

export function useOrgBudgetsQuery(orgId: string | undefined, teamId?: string) {
  return useQuery({
    queryKey: budgetKeys.org(orgId ?? '', teamId),
    enabled: Boolean(orgId),
    queryFn: async () => {
      try {
        const { data } = await budgetsApi.listForOrg(
          orgId!,
          teamId ? { teamId } : undefined,
        );
        return data as ApiBudget[];
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to load org budgets'));
      }
    },
  });
}

export function useBudgetQuery(id: string | undefined) {
  return useQuery({
    queryKey: budgetKeys.detail(id ?? ''),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await budgetsApi.get(id!);
      return data as ApiBudget;
    },
  });
}

export function useExpensesQuery(budgetId?: string) {
  return useQuery({
    queryKey: budgetKeys.expenses(budgetId),
    queryFn: async () => {
      const { data } = await expensesApi.list(budgetId ? { budgetId } : undefined);
      return data as ApiExpense[];
    },
  });
}

export function useCreateBudgetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BudgetInput) => {
      try {
        const { data } = await budgetsApi.create(body);
        return data as ApiBudget;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to create budget'));
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useCreateOrgBudgetMutation(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BudgetInput) => {
      try {
        const { data } = await budgetsApi.createForOrg(orgId, body);
        return data as ApiBudget;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to create org budget'));
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });
}

export function useCreateExpenseMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ExpenseInput) => {
      try {
        const { data } = await expensesApi.create(body);
        return data as ApiExpense;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, 'Unable to add expense'));
      }
    },
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: budgetKeys.all });
      if (vars.budgetId) {
        await qc.invalidateQueries({ queryKey: budgetKeys.expenses(vars.budgetId) });
      }
    },
  });
}
