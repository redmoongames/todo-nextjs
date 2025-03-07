import { IoMenuOutline } from 'react-icons/io5';
import { MainMenu } from './MainMenu';

interface MenuContainerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MenuContainer({ isOpen, onToggle }: MenuContainerProps) {
  return (
    <div 
      className={`
        fixed top-0 left-0 h-full w-64 z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-64'}
        shadow-xl
      `}
    >
      <div className="h-16 bg-gray-800 flex justify-end px-4 items-center border-b border-gray-700">
        <button
          onClick={onToggle}
          className={`
            p-2 rounded-lg text-white hover:bg-gray-700 transition-colors
            transform duration-300 ease-in-out
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
        >
          <IoMenuOutline size={24} />
        </button>
      </div>
      
      <MainMenu />
    </div>
  );
} 