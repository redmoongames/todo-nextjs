interface PageBackgroundProps {
  children: React.ReactNode;
  style?: 'glass' | 'gradient' | 'pattern';
}

export function PageBackground({ children, style = 'glass' }: PageBackgroundProps) {
  const backgroundStyles = {
    glass: "bg-gradient-to-br from-gray-900 to-gray-800",
    gradient: "bg-gradient-to-br from-indigo-900 to-purple-800",
    pattern: "bg-gray-900 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:20px_20px]"
  };

  const containerStyles = {
    glass: "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50",
    gradient: "bg-white/5 border border-white/10",
    pattern: "bg-gray-800/90 border border-gray-700"
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${backgroundStyles[style]} px-4`}>
      <div className={`max-w-md w-full p-10 ${containerStyles[style]} rounded-2xl shadow-2xl`}>
        {children}
      </div>
    </div>
  );
} 