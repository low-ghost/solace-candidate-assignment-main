import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={
        'px-4 py-2 rounded-md bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 border border-transparent dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ' +
        className
      }
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
