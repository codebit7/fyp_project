import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User as UserIcon, Settings, Bookmark, HelpCircle, LogOut } from 'lucide-react';
import { SidebarItem } from '../common/SidebarItem';
import { Screen } from '../../../models/types';
import { CURRENT_USER } from '../../../constants/appConstants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const handleNav = (screen: Screen) => {
    onNavigate(screen);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-3/4 bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 bg-[#1A3C34] text-white">
              <div className="flex justify-between items-start mb-6">
                <img
                  src={CURRENT_USER.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-white/20 object-cover"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <h3 className="text-xl font-bold">{CURRENT_USER.name}</h3>
              <p className="text-xs opacity-60 font-medium uppercase tracking-wider">
                {CURRENT_USER.level}
              </p>
            </div>

            {/* Nav items */}
            <div className="flex-1 p-4 space-y-2">
              <SidebarItem icon={<UserIcon size={20} />}  label="My Profile"    onClick={() => handleNav('profile')}   />
              <SidebarItem icon={<Settings size={20} />}  label="Settings"      onClick={() => handleNav('settings')}  />
              <SidebarItem icon={<Bookmark size={20} />}  label="Saved Verses"  onClick={() => handleNav('bookmarks')} />
              <SidebarItem icon={<HelpCircle size={20} />} label="Help & Support" onClick={() => handleNav('help')}    />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
              <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => handleNav('auth')} danger />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
