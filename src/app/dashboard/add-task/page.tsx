'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TITLE_MAX_LENGTH = 500;
const DESCRIPTION_MAX_LENGTH = 2500;

export default function AddTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= TITLE_MAX_LENGTH) {
      setTitle(newValue);
      adjustTextareaHeight(e.target);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(newValue);
      adjustTextareaHeight(e.target);
    }
  };

  useEffect(() => {
    if (titleRef.current) adjustTextareaHeight(titleRef.current);
    if (descriptionRef.current) adjustTextareaHeight(descriptionRef.current);
  }, [title, description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <span 
              className={`text-sm ${
                title.length > TITLE_MAX_LENGTH * 0.9 
                  ? 'text-red-500' 
                  : 'text-gray-500'
              }`}
            >
              {title.length}/{TITLE_MAX_LENGTH}
            </span>
          </div>
          <textarea
            ref={titleRef}
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden min-h-[42px]"
            placeholder="Enter task title"
            rows={1}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <span 
              className={`text-sm ${
                description.length > DESCRIPTION_MAX_LENGTH * 0.9 
                  ? 'text-red-500' 
                  : 'text-gray-500'
              }`}
            >
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            ref={descriptionRef}
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden min-h-[150px]"
            placeholder="Enter task description"
            rows={6}
            required
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
} 