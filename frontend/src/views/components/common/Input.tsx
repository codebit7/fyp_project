import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftElement,
  rightElement,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-bold text-[#1A3C34]">
          {label}
        </label>
      )}

      <div className="relative">
        {leftElement && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {leftElement}
          </div>
        )}

        <input
          className={`
            w-full py-4 rounded-xl border border-gray-200
            focus:outline-none focus:border-[#1A3C34] transition-colors
            ${leftElement ? 'pl-12' : 'px-4'}
            ${rightElement ? 'pr-12' : 'px-4'}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};
