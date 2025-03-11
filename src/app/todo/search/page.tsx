'use client';

import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search functionality
    // For now, let's just show some dummy data
    if (query.trim()) {
      setSearchResults([
        { id: 1, title: 'Complete project documentation', description: 'Write detailed documentation for the new features' },
        { id: 2, title: 'Review pull requests', description: 'Review and merge pending pull requests' },
        // Add more dummy data as needed
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search Tasks</h1>
      
      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <IoSearch 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {searchResults.map((task) => (
          <div
            key={task.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-medium text-lg mb-1">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>
        ))}

        {searchQuery && searchResults.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No tasks found matching your search
          </div>
        )}

        {!searchQuery && (
          <div className="text-center text-gray-500 py-8">
            Start typing to search for tasks
          </div>
        )}
      </div>
    </div>
  );
} 