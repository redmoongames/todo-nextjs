import React from 'react';
import { IoAddCircleOutline, IoSearchOutline, IoListOutline, IoBookmarkOutline } from 'react-icons/io5';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface MainMenuProps {
  className?: string;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

export function MainMenu({ className = '' }: MainMenuProps) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    {
      icon: <IoAddCircleOutline size={24} />,
      label: 'Add Task',
      path: '/dashboard/add-task'
    },
    {
      icon: <IoSearchOutline size={24} />,
      label: 'Search',
      path: '/dashboard/search'
    },
    {
      icon: <IoListOutline size={24} />,
      label: 'My Tasks',
      path: '/dashboard'
    },
    {
      icon: <IoBookmarkOutline size={24} />,
      label: 'Priority & Labels',
      path: '/dashboard/labels'
    }
  ];

  return (
    <nav className={`bg-gray-800 h-full ${className}`}>
      <div className="">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center space-x-3 w-full p-3 transition-colors
              ${pathname === item.path 
                ? 'bg-indigo-600 text-white [&>svg]:text-indigo-200' 
                : 'text-white hover:bg-gray-700'}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
} 