import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Mic, RotateCcw, BarChart3, ArrowRight, Play, Share2 } from 'lucide-react';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { SearchBar } from '../components/dashboard/SearchBar';
import { Screen, SearchResult } from '../../models/types';
import { CURRENT_USER } from '../../constants/appConstants';
import { useSearch } from '../../controllers/useSearch';
import { useDailyAyah } from '../../controllers/useDailyAyah';
import { getGreeting, shareContent } from '../../utils/shareUtils';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  onMenuClick: () => void;
  onSearchResultSelect: (result: SearchResult) => void;
}

const DASHBOARD_CARDS = [
  { title: 'Memorize', subtitle: 'Learn Quran',  icon: <BookOpen size={40} />, color: 'bg-[#E8F3F0]', textColor: 'text-[#1A3C34]',    screen: 'quran_list' as Screen },
  { title: 'Recite',   subtitle: 'Voice Check',  icon: <Mic size={40} />,      color: 'bg-[#FFF5F0]', textColor: 'text-[#FF7A3D]',    screen: 'recite'     as Screen },
  { title: 'Retain',   subtitle: 'Memory Test',  icon: <RotateCcw size={40} />,color: 'bg-[#FFFBE8]', textColor: 'text-[#E6B014]',    screen: 'retain'     as Screen },
  { title: 'Track',    subtitle: 'Insights',     icon: <BarChart3 size={40} />, color: 'bg-[#F0F3FF]', textColor: 'text-[#4D6BFE]',   screen: 'track'      as Screen },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onMenuClick,
  onSearchResultSelect,
}) => {
  const { searchQuery, setSearchQuery, searchResults, isSearchVisible, toggleSearch } = useSearch();
  const { dailyAyah, refreshDailyAyah } = useDailyAyah();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col pb-24"
    >
      <Header
        title="True Tilawah"
        onMenuClick={onMenuClick}
        onSearchClick={toggleSearch}
      />

      {/* Search bar with results dropdown */}
      <SearchBar
        isVisible={isSearchVisible}
        searchQuery={searchQuery}
        searchResults={searchResults}
        onQueryChange={setSearchQuery}
        onResultClick={onSearchResultSelect}
      />

      {/* Greeting card */}
      <div className="px-6 py-4">
        <Card
          variant="gradient"
          className="flex items-center justify-between relative overflow-hidden group shadow-xl shadow-[#1A3C34]/10"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-16 -mb-16 blur-2xl" />

          <div className="relative z-10">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">
              {getGreeting()}
            </p>
            <h2 className="text-2xl font-bold mb-4">{CURRENT_USER.name}</h2>
            <button
              onClick={() => onNavigate('track')}
              className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-white/30 transition-all active:scale-95 border border-white/20"
            >
              Track Your Progress <ArrowRight size={14} />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse" />
            <img
              src={CURRENT_USER.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white/30 object-cover relative z-10 shadow-lg"
            />
          </div>
        </Card>
      </div>

      {/* Last read */}
      <div className="px-6 py-2">
        <div className="bg-white rounded-[32px] p-5 flex items-center justify-between border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F3F0] text-[#1A3C34] flex items-center justify-center shadow-inner">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Read</p>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <p className="text-[10px] font-bold text-[#1A3C34]">80% Complete</p>
              </div>
              <h4 className="text-sm font-bold text-[#1A3C34]">Al-Fatihah: 1</h4>
              <div className="mt-2 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-[#1A3C34]" />
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('recite')}
            className="w-10 h-10 rounded-full bg-[#1A3C34] text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-md"
          >
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* Feature grid */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4">
        <AnimatePresence>
          {DASHBOARD_CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <DashboardCard
                title={card.title}
                subtitle={card.subtitle}
                icon={card.icon}
                color={card.color}
                textColor={card.textColor}
                onClick={() => onNavigate(card.screen)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Daily inspiration */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1A3C34] uppercase tracking-wider">Daily Inspiration</h3>
          <button
            onClick={refreshDailyAyah}
            className="text-[10px] font-bold text-gray-400 uppercase hover:text-[#1A3C34] transition-colors"
          >
            Shuffle
          </button>
        </div>

        {dailyAyah && (
          <motion.div
            key={dailyAyah.ayah.number}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#1A3C34] to-[#2D5A4E] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BookOpen size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {dailyAyah.surahName} : {dailyAyah.ayah.number}
                </div>
              </div>
              <p className="text-2xl font-arabic leading-loose mb-6 text-right">{dailyAyah.ayah.text}</p>
              <p className="text-sm italic opacity-80 leading-relaxed">"{dailyAyah.ayah.translation}"</p>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => onSearchResultSelect({ type: 'ayah', data: dailyAyah.ayah as any, label: '', sub: '' })}
                  className="flex-1 py-3 bg-white text-[#1A3C34] rounded-2xl text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Learn This Verse
                </button>
                <button
                  onClick={() => shareContent('Daily Inspiration', `"${dailyAyah.ayah.text}"\n\n${dailyAyah.ayah.translation}\n\n- ${dailyAyah.surahName}:${dailyAyah.ayah.number}`)}
                  className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
