interface DividerProps {
  text: string;
}

export function Divider({ text }: DividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-800"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 py-1 bg-black text-gray-400 rounded-md">{text}</span>
      </div>
    </div>
  );
} 