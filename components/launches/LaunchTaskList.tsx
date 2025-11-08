'use client';

import { useState } from 'react';
import { useUpdateTask, useCreateTask, LaunchTask } from '@/lib/hooks/useLaunches';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Skeleton } from '@/components/Skeleton';
import { CheckCircle2, Circle, Plus } from 'lucide-react';

interface LaunchTaskListProps {
  launchId: string;
  tasks: LaunchTask[];
  isLoading?: boolean;
}

export function LaunchTaskList({ launchId, tasks, isLoading = false }: LaunchTaskListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const updateTask = useUpdateTask(launchId);
  const createTask = useCreateTask(launchId);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateTask.mutateAsync({
        taskId,
        completed: !completed,
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      return;
    }

    try {
      await createTask.mutateAsync({
        taskName: newTaskName,
        description: newTaskDescription || undefined,
        dueDate: newTaskDueDate || undefined,
      });

      setNewTaskName('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Tasks</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm font-semibold text-primary">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <Input
              label="Task Name"
              placeholder="Enter task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              disabled={createTask.isPending}
            />
            <Input
              label="Description (optional)"
              placeholder="Enter task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              disabled={createTask.isPending}
            />
            <Input
              label="Due Date (optional)"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              disabled={createTask.isPending}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddForm(false)}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTask}
                variant="primary"
                size="sm"
                className="flex-1"
                isLoading={createTask.isPending}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No tasks yet.</p>
          ) : (
            tasks
              .sort((a, b) => a.task_order - b.task_order)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <button
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    disabled={updateTask.isPending}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {task.task_name}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    {task.due_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(task.due_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
