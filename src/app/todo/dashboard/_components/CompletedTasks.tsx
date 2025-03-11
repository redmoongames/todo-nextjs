'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CompletedTask } from '@/todo';
import Image from 'next/image';

interface CompletedTasksProps {
  tasks: CompletedTask[];
}

export function CompletedTasks({ tasks }: CompletedTasksProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            layout
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 hover:border-gray-500/50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-medium text-gray-100 line-through">{task.title}</h3>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                  <Image
                    src={task.completedBy.avatar}
                    alt={task.completedBy.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span>Completed by {task.completedBy.name}</span>
                  <span>•</span>
                  <span>{new Date(task.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 