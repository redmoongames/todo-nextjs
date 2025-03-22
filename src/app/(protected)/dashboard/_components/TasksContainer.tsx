'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoList } from './TodoList';
import { CompletedTasks } from './CompletedTasks';
import { Task, CompletedTask } from '@/features/todo/types';

interface TasksContainerProps {
  tasks: Task[];
  completedTasks: CompletedTask[];
  onTaskComplete: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

export function TasksContainer({
  tasks,
  completedTasks,
  onTaskComplete,
  onTaskDelete,
  onTaskClick
}: TasksContainerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Active Tasks</h2>
        <AnimatePresence mode="popLayout">
          <TodoList
            tasks={tasks}
            onTaskComplete={onTaskComplete}
            onTaskDelete={onTaskDelete}
            onTaskClick={onTaskClick}
          />
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Completed Tasks</h2>
        <AnimatePresence mode="popLayout">
          <CompletedTasks tasks={completedTasks} />
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 