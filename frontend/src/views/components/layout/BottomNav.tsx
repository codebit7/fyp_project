import React from 'react';
import { BookOpen, RotateCcw, Mic, BarChart3, Bookmark } from 'lucide-react';
import { NavButton } from '../common/NavButton';
import { Screen } from '../../../models/types';
import { SCREENS_WITH_NAV } from '../../../constants/appConstants';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const READ_SCREENS: Screen[] = ['quran_list', 'surah_detail', 'para_detail', 'page_detail', 'hizb_detail'];

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  if (!SCREENS_WITH_NAV.includes(currentScreen)) return null;

  const isReadActive = READ_SCREENS.includes(currentScreen);

  return (
    <div className="bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
      <NavButton
        active={isReadActive}
        icon={<BookOpen size={24} />}
        label="READ"
        onClick={() => onNavigate('quran_list')}
      />
      <NavButton
        active={currentScreen === 'retain'}
        icon={<RotateCcw size={24} />}
        label="RETAIN"
        onClick={() => onNavigate('retain')}
      />
      <NavButton
        active={currentScreen === 'recite'}
        icon={<Mic size={24} />}
        label="RECITE"
        onClick={() => onNavigate('recite')}
      />
      <NavButton
        active={currentScreen === 'track'}
        icon={<BarChart3 size={24} />}
        label="TRACK"
        onClick={() => onNavigate('track')}
      />
      <NavButton
        active={currentScreen === 'bookmarks'}
        icon={<Bookmark size={24} />}
        label="SAVE"
        onClick={() => onNavigate('bookmarks')}
      />
    </div>
  );
};
