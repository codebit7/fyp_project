import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { Header, Card } from '../components/common';
import { SearchBar } from '../components/dashboard/SearchBar';
import { Surah, Para, Page, Hizb, SearchResult } from '../../models/types';
import { SURAHS, PARAS, PAGES, HIZBS } from '../../data/quranData';
import { useSearch } from '../../controllers/useSearch';

interface QuranListScreenProps {
  onBack: () => void;
  onSelectSurah: (surah: Surah) => void;
  onSelectPara: (para: Para) => void;
  onSelectPage: (page: Page) => void;
  onSelectHizb: (hizb: Hizb) => void;
}

type Tab = 'Surah' | 'Para' | 'Page' | 'Hizb';

const TABS: Tab[] = ['Surah', 'Para', 'Page', 'Hizb'];

/** A single list row for any Quran entity */
const QuranListRow: React.FC<{
  id: number;
  name: string;
  arabicName: string;
  meta: string;
  onClick: () => void;
}> = ({ id, name, arabicName, meta, onClick }) => (
  <motion.button
    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
    onClick={onClick}
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.02)' }}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-center justify-between py-4 border-b border-gray-50 group rounded-xl px-2 -mx-2 transition-colors"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#1A3C34] font-bold text-sm border border-gray-100 rotate-45 group-hover:bg-[#1A3C34] group-hover:text-white transition-colors">
        <span className="-rotate-45">{id}</span>
      </div>
      <div className="text-left">
        <h4 className="font-bold text-[#1A3C34]">{name}</h4>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{meta}</p>
      </div>
    </div>
    <span className="text-xl font-arabic text-[#1A3C34]">{arabicName}</span>
  </motion.button>
);

export const QuranListScreen: React.FC<QuranListScreenProps> = ({
  onBack,
  onSelectSurah,
  onSelectPara,
  onSelectPage,
  onSelectHizb,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('Surah');
  const { searchQuery, setSearchQuery, isSearchVisible, toggleSearch } = useSearch();

  const lowerQuery = searchQuery.toLowerCase();

  const filteredSurahs = SURAHS.filter((s) => s.name.toLowerCase().includes(lowerQuery) || s.arabicName.includes(searchQuery));
  const filteredParas  = PARAS.filter((p)  => p.name.toLowerCase().includes(lowerQuery) || p.arabicName.includes(searchQuery));
  const filteredPages  = PAGES.filter((p)  => p.name.toLowerCase().includes(lowerQuery) || p.arabicName.includes(searchQuery));
  const filteredHizbs  = HIZBS.filter((h)  => h.name.toLowerCase().includes(lowerQuery) || h.arabicName.includes(searchQuery));

  // SearchBar expects SearchResult objects – for local filter we pass empty dummy
  const dummyResultClick = (_: SearchResult) => {};

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header title="True Tilawah" onBack={onBack} onSearchClick={toggleSearch} />

      <AnimatePresence>
        {isSearchVisible && (
          <SearchBar
            isVisible={isSearchVisible}
            searchQuery={searchQuery}
            searchResults={[]}           // local filter shown below, not dropdown
            placeholder={`Search ${activeTab}...`}
            onQueryChange={setSearchQuery}
            onResultClick={dummyResultClick}
          />
        )}
      </AnimatePresence>

      {/* Last read banner */}
      <div className="px-6 py-4">
        <Card variant="gradient" className="flex items-center justify-between p-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold mb-1 opacity-90">
              <BookOpen size={14} /> Last Read
            </div>
            <h3 className="text-xl font-bold">Al-Fatihah</h3>
            <p className="text-xs opacity-80">Ayah No: 1</p>
          </div>
          <BookOpen size={60} className="opacity-20" />
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-6 flex border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-bold transition-colors relative ${
              activeTab === tab ? 'text-[#1A3C34]' : 'text-gray-400'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A3C34] rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <motion.div
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {activeTab === 'Surah' && filteredSurahs.map((s) => (
          <QuranListRow key={s.id} id={s.id} name={s.name} arabicName={s.arabicName} meta={`${s.type} • ${s.versesCount} VERSES`} onClick={() => onSelectSurah(s)} />
        ))}
        {activeTab === 'Para' && filteredParas.map((p) => (
          <QuranListRow key={p.id} id={p.id} name={p.name} arabicName={p.arabicName} meta={`${p.surahRange} • ${p.ayatsCount} AYATS`} onClick={() => onSelectPara(p)} />
        ))}
        {activeTab === 'Page' && filteredPages.map((p) => (
          <QuranListRow key={p.id} id={p.id} name={p.name} arabicName={p.arabicName} meta={`${p.surahName} • ${p.ayatsCount} AYATS`} onClick={() => onSelectPage(p)} />
        ))}
        {activeTab === 'Hizb' && filteredHizbs.map((h) => (
          <QuranListRow key={h.id} id={h.id} name={h.name} arabicName={h.arabicName} meta={`${h.surahRange} • ${h.ayatsCount} AYATS`} onClick={() => onSelectHizb(h)} />
        ))}
      </motion.div>
    </motion.div>
  );
};
