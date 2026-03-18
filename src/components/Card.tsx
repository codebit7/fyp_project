import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'gradient' | 'outline';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
  const variants = {
    default: "bg-white border border-gray-100 shadow-sm",
    gradient: "bg-gradient-to-br from-[#86B6A7] to-[#5C8E7F] text-white shadow-lg",
    outline: "border border-dashed border-gray-200"
  };

  return (
    <motion.div
      whileHover={onClick ? { y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`rounded-3xl p-6 transition-all ${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
