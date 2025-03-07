import { IoMenuOutline } from 'react-icons/io5';

interface MenuToggleButtonProps {
  isMenuOpen: boolean;
  onToggle: () => void;
}

export function MenuToggleButton({ isMenuOpen, onToggle }: MenuToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        fixed top-4 left-4 p-2 rounded-lg text-white hover:bg-gray-800 
        transition-all duration-300 ease-in-out z-50
        ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <IoMenuOutline size={24} />
    </button>
  );
} 