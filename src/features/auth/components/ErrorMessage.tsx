interface ErrorMessageProps {
    error: string;
  }
  
  export function ErrorMessage({ error }: ErrorMessageProps) {
    return (
      <div>
        <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-3 rounded-md text-center">
            {error}
        </div>
      </div>
    );
  } 