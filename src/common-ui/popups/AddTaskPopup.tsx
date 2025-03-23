'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTodo, PRIORITY_OPTIONS, CreateTodoInput, TaskPriority } from '@/features/todo-planner';
import { Button } from '@/common-ui/Button/Button';
import { Input } from '@/common-ui/Input';
import { TextArea } from '@/common-ui/TextArea';
import { Select } from '@/common-ui/Select';

interface AddTaskPopupProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddTaskPopup({ onClose, onSuccess }: AddTaskPopupProps) {
  const { createTodo } = useTodo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const todoData: CreateTodoInput = {
        title,
        description,
        priority
      };

      const result = await createTodo(todoData);
      
      if (result.success) {
        onSuccess?.();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Add New Task</h2>
      
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
    </motion.div>
  );
} 