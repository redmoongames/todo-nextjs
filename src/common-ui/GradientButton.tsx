import React, { ButtonHTMLAttributes } from 'react';

export interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText: string;
  text: string;
  variant?: 'primary' | 'secondary';
}

export function GradientButton({ 
  isLoading, 
  loadingText, 
  text, 
  variant = 'primary',
  disabled,
  type = 'submit',
  ...restProps 
}: GradientButtonProps) {
  const baseClasses = "w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150";
  
  const variantClasses = {
    primary: "bg-white text-black border-gray-100 hover:bg-gray-100 focus:ring-gray-400",
    secondary: "bg-black text-white border-gray-800 hover:bg-gray-900 hover:border-gray-700 focus:ring-gray-500"
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...restProps}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : text}
    </button>
  );
} 