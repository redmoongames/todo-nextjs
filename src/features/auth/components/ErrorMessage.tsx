interface ErrorMessageProps {
    error: string;
  }
  
  export function ErrorMessage({ error }: ErrorMessageProps) {
    return (
      <div>
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 text-sm p-3 rounded-lg text-center">
            {error}
        </div>
      </div>
    );
  } 