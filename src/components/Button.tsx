import React from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#1A3C34] text-white hover:bg-[#142E28]",
    secondary: "bg-[#D1E0DB] text-[#1A3C34] hover:bg-[#C1D0CB]",
    outline: "border border-gray-200 text-[#1A3C34] hover:bg-gray-50",
    ghost: "text-gray-500 hover:bg-gray-100"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    full: "w-full py-4 text-lg"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
