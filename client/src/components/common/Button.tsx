import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  fullWidth?: boolean;
  children: ReactNode;
}

function Button({ variant = 'primary', fullWidth = false, children, className = '', ...props }: ButtonProps) {
  const baseClasses = 'py-2.5 sm:py-2 px-4 rounded-lg font-medium transition focus:outline-none focus:ring-2 text-sm sm:text-base min-h-[44px] sm:min-h-0';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 active:bg-blue-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300 active:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 active:bg-red-800',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-300 active:bg-green-800',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
