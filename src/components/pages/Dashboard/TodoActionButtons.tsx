import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

interface TodoActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TodoActionButtons({ onEdit, onDelete }: TodoActionButtonsProps) {
  return (
    <div className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
          title="Edit task"
        >
          <IoCreateOutline size={20} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
          title="Delete task"
        >
          <IoTrashOutline size={20} />
        </button>
      )}
    </div>
  );
} 