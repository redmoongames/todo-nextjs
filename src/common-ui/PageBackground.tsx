interface PageBackgroundProps {
  children: React.ReactNode;
  style?: 'glass' | 'gradient' | 'pattern';
}

export function PageBackground({ children, style = 'glass' }: PageBackgroundProps) {
  const backgroundStyles = {
    glass: "bg-black",
    gradient: "bg-gradient-to-br from-gray-950 to-black",
    pattern: "bg-black bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:20px_20px]"
  };

  const containerStyles = {
    glass: "bg-black/90 backdrop-blur-sm border border-gray-800",
    gradient: "bg-black border border-gray-800",
    pattern: "bg-black border border-gray-800"
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${backgroundStyles[style]} px-4`}>
      <div className={`max-w-md w-full p-10 ${containerStyles[style]} rounded-md shadow-xl`}>
        {children}
      </div>
    </div>
  );
} 