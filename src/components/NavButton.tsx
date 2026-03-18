import React from 'react';
import { motion } from 'motion/react';

interface NavButtonProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const NavButton: React.FC<NavButtonProps> = ({ active, icon, label, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all relative ${active ? 'text-[#1A3C34]' : 'text-gray-400'}`}
    >
      {icon}
      <span className="text-[10px] font-bold tracking-wider">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="absolute -top-1 w-1 h-1 bg-[#1A3C34] rounded-full"
        />
      )}
    </button>
  );
};
