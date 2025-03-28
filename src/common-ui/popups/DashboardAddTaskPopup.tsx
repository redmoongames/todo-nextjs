'use client';

import React, { useState } from 'react';
import { PRIORITY_OPTIONS, CreateTodoInput, TaskPriority } from '@/features/todo-planner';
import { Button } from '@/common-ui/Button/Button';
import { Input } from '@/common-ui/Input';
import { TextArea } from '@/common-ui/TextArea';
import { Select } from '@/common-ui/Select';
import { todoService } from '@/features/todo-planner/services/TodoService';

interface DashboardAddTaskPopupProps {
  dashboardId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DashboardAddTaskPopup({ dashboardId, onClose, onSuccess }: DashboardAddTaskPopupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(3);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const todoData: CreateTodoInput = {
        title,
        description,
        priority
      };

      const result = await todoService.createTodo(dashboardId, todoData);
      
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Failed to create task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-white mb-4">Add New Task</h2>
      
      {error && (
        <div className="bg-red-900/30 text-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          required
          placeholder="Enter task title"
        />

        <TextArea
          id="description"
          label="Description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
        />

        <Select
          id="priority"
          label="Priority"
          value={priority}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(Number(e.target.value) as TaskPriority)}
          options={PRIORITY_OPTIONS}
        />

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
} 