import { apiClient } from './client';

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'rent'
  | 'utilities'
  | 'shopping'
  | 'health'
  | 'entertainment'
  | 'education'
  | 'travel'
  | 'work'
  | 'other';

export type ApiExpense = {
  id: string;
  budgetId: string;
  taskId?: string;
  userId?: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  note?: string;
  images?: string[];
  spentAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpenseInput = {
  budgetId?: string;
  taskId?: string | null;
  title: string;
  amount: number;
  currency?: string;
  category?: ExpenseCategory;
  note?: string;
  spentAt?: string;
  images?: string[];
};

export const expensesApi = {
  list: (params?: Record<string, string>) =>
    apiClient.get<ApiExpense[]>('/expenses', { params }),
  summary: (params?: Record<string, string>) =>
    apiClient.get('/expenses/summary', { params }),
  create: (body: ExpenseInput) => apiClient.post<ApiExpense>('/expenses', body),
  update: (id: string, body: Partial<ExpenseInput>) =>
    apiClient.patch<ApiExpense>(`/expenses/${id}`, body),
  remove: (id: string) => apiClient.delete(`/expenses/${id}`),
};
