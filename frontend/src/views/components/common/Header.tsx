import React from 'react';
import { ChevronLeft, Search, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onMenuClick?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  onMenuClick,
  showSearch = true,
  onSearchClick,
  rightElement,
}) => {
  return (
    <div className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
      {/* Left: back or menu */}
      <div className="flex items-center gap-4">
        {onBack ? (
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-[#1A3C34]" />
          </button>
        )}
        <h1 className="text-xl font-bold text-[#1A3C34]">{title}</h1>
      </div>

      {/* Right: search + optional extra element */}
      <div className="flex items-center gap-2">
        {showSearch && (
          <button
            onClick={onSearchClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search size={24} className="text-[#1A3C34]" />
          </button>
        )}
        {rightElement}
      </div>
    </div>
  );
};
