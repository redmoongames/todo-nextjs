interface StickyNoteProps {
  login: string;
  password: string;
}

export function StickyNote({ login, password }: StickyNoteProps) {
  return (
    <div className="max-w-md mx-auto relative">
      <div className="absolute -right-4 md:right-4 top-4 w-48 p-4 bg-yellow-100 rotate-6 rounded-sm"
           style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 23px, #9ca3af 24px)" }}>
        {/* Tape on top */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-gray-200/70 rounded-sm rotate-3"></div>
        
        {/* Content */}
        <div className="space-y-4 text-gray-800" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
          <div>
            <p className="font-bold underline decoration-2">LOGIN:</p>
            <p className="ml-4 text-lg">{login}</p>
          </div>
          <div>
            <p className="font-bold underline decoration-2">PASSWORD:</p>
            <p className="ml-4 text-lg">{password}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 