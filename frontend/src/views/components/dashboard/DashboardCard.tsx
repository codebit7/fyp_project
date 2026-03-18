import React from 'react';
import { motion } from 'motion/react';

interface DashboardCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  onClick: () => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  color,
  textColor,
  onClick,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        ${color} p-6 rounded-[32px] flex flex-col items-start text-left w-full
        shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group
      `}
    >
      {/* Faint background icon */}
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>

      {/* Foreground icon badge */}
      <div
        className={`
          w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm
          flex items-center justify-center ${textColor}
          mb-4 shadow-sm group-hover:scale-110 transition-transform
        `}
      >
        {icon}
      </div>

      <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
      <p className={`text-[10px] font-bold ${textColor} opacity-60 uppercase tracking-widest`}>
        {subtitle}
      </p>
    </motion.button>
  );
};
