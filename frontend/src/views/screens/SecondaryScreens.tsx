import React from 'react';
import { motion } from 'motion/react';
import { Plus, Bookmark, MoreVertical, Settings, Eye, CheckCircle2, Search, ChevronLeft } from 'lucide-react';
import { Header } from '../components/common';
import { CURRENT_USER } from '../../constants/appConstants';

// ─── BookmarksScreen ──────────────────────────────────────────────────────────

interface BookmarksScreenProps {
  onBack: () => void;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Bookmarks" onBack={onBack} showSearch={false} />

      <div className="px-6 py-4 space-y-4">
        {/* Add collection */}
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-dashed border-gray-200">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#1A3C34]">
            <Plus size={24} />
          </div>
          <span className="font-bold text-[#1A3C34]">Add new collection</span>
        </button>

        <BookmarkCollectionItem title="My Favorite" count={8} />
        <BookmarkCollectionItem title="Daily"       count={5} />
      </div>
    </motion.div>
  );
};

const BookmarkCollectionItem: React.FC<{ title: string; count: number }> = ({ title, count }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#1A3C34]">
        <Bookmark size={24} />
      </div>
      <div>
        <h4 className="font-bold text-[#1A3C34]">{title}</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{count} items</p>
      </div>
    </div>
    <MoreVertical size={20} className="text-gray-300" />
  </motion.div>
);

// ─── ProfileScreen ────────────────────────────────────────────────────────────

interface ProfileScreenProps {
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 flex flex-col"
    >
      <Header title="My Profile" onBack={onBack} showSearch={false} />

      <div className="p-8 flex flex-col items-center">
        {/* Avatar with edit button */}
        <div className="relative mb-6">
          <img
            src={CURRENT_USER.avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-[#1A3C34]/10 object-cover"
          />
          <button className="absolute bottom-0 right-0 bg-[#1A3C34] text-white p-2 rounded-full shadow-lg" aria-label="Edit profile">
            <Settings size={16} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-[#1A3C34] mb-1">{CURRENT_USER.name}</h2>
        <p className="text-gray-500 mb-8">{CURRENT_USER.level}</p>

        <div className="w-full space-y-4">
          <ProfileField label="Email"  value="rafiqsaad864@gmail.com" />
          <ProfileField label="Joined" value="March 2024"             />
        </div>
      </div>
    </motion.div>
  );
};

const ProfileField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-sm font-bold text-[#1A3C34]">{value}</span>
  </div>
);

// ─── SettingsScreen ───────────────────────────────────────────────────────────

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Settings" onBack={onBack} showSearch={false} />

      <div className="p-6 space-y-4">
        <SettingRow
          icon={<Eye size={20} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          label="Dark Mode"
          active={false}
        />
        <SettingRow
          icon={<CheckCircle2 size={20} />}
          iconBg="bg-green-50"
          iconColor="text-green-500"
          label="Notifications"
          active={true}
        />
      </div>
    </motion.div>
  );
};

const SettingRow: React.FC<{
  icon: React.ReactNode; iconBg: string; iconColor: string; label: string; active: boolean;
}> = ({ icon, iconBg, iconColor, label, active }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="font-bold text-[#1A3C34]">{label}</span>
    </div>
    <div className={`w-12 h-6 rounded-full relative ${active ? 'bg-[#1A3C34]' : 'bg-gray-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'right-1' : 'left-1'}`} />
    </div>
  </div>
);

// ─── HelpScreen ───────────────────────────────────────────────────────────────

interface HelpScreenProps {
  onBack: () => void;
}

const HELP_ITEMS = ['FAQs', 'Contact Us', 'Privacy Policy', 'Terms of Service'] as const;

export const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Help & Support" onBack={onBack} showSearch={false} />

      <div className="p-6 space-y-4">
        {/* Search help */}
        <div className="bg-[#E8F3F0] p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-[#1A3C34] mb-2">How can we help?</h3>
          <p className="text-sm text-[#1A3C34]/70 mb-4">Search our help center or contact our support team.</p>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none"
              placeholder="Search for help..."
            />
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {HELP_ITEMS.map((item) => (
            <button
              key={item}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
            >
              <span className="font-bold text-[#1A3C34]">{item}</span>
              <ChevronLeft size={20} className="rotate-180 text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
