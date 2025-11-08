'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface LaunchTask {
  id: string;
  checklist_id: string;
  task_name: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  task_order: number;
}

export interface LaunchChecklist {
  id: string;
  book_id: string;
  launch_date: string;
  template_id?: string;
  status: string;
  created_at: string;
  tasks: LaunchTask[];
  book?: {
    id: string;
    title: string;
  };
}

export interface CreateLaunchInput {
  bookId: string;
  launchDate: string;
  templateId: string;
}

export interface CreateTaskInput {
  taskName: string;
  description?: string;
  dueDate?: string;
}

export function useCreateLaunch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLaunchInput) => {
      const response = await fetch('/api/launches/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create launch');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['launches'] });
    },
  });
}

export function useLaunch(launchId: string) {
  return useQuery<LaunchChecklist>({
    queryKey: ['launches', launchId],
    queryFn: async () => {
      const response = await fetch(`/api/launches/${launchId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch launch');
      }

      return response.json();
    },
    enabled: !!launchId,
  });
}

export function useUpdateTask(launchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      completed,
    }: {
      taskId: string;
      completed: boolean;
    }) => {
      const response = await fetch(`/api/launches/${launchId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['launches', launchId] });
    },
  });
}

export function useCreateTask(launchId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      const response = await fetch(`/api/launches/${launchId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['launches', launchId] });
    },
  });
}
