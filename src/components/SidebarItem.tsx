import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick, danger }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors ${danger ? 'text-red-500 hover:bg-red-50' : 'text-[#1A3C34] hover:bg-gray-50'}`}
    >
      {icon}
      <span className="font-bold">{label}</span>
    </button>
  );
};
