interface DividerProps {
  text: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-600/50"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 py-1 bg-gray-800/80 text-gray-500 rounded-full">{text}</span>
      </div>
    </div>
  );
} 