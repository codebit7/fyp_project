import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, BookOpen, Layers, Mic } from 'lucide-react';
import { Input } from '../common/Input';
import { SearchResult } from '../../../models/types';

interface SearchBarProps {
  isVisible: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  placeholder?: string;
  onQueryChange: (query: string) => void;
  onResultClick: (result: SearchResult) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isVisible,
  searchQuery,
  searchResults,
  placeholder = 'Search Surah, Para, or Ayah...',
  onQueryChange,
  onResultClick,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 pb-4 overflow-hidden"
        >
          <div className="relative">
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              leftElement={<Search size={20} />}
              autoFocus
            />

            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[400px] overflow-y-auto"
              >
                {searchResults.map((result, index) => (
                  <SearchResultRow
                    key={index}
                    result={result}
                    onClick={() => onResultClick(result)}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Sub-component: individual result row ─────────────────────────────────────

interface SearchResultRowProps {
  result: SearchResult;
  onClick: () => void;
}

const RESULT_ICON_STYLES: Record<string, { bg: string; text: string }> = {
  surah: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  para:  { bg: 'bg-blue-50',   text: 'text-blue-600'   },
  page:  { bg: 'bg-orange-50', text: 'text-orange-600' },
  hizb:  { bg: 'bg-purple-50', text: 'text-purple-600' },
  ayah:  { bg: 'bg-orange-50', text: 'text-orange-600' },
};

const ResultIcon: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'surah') return <BookOpen size={20} />;
  if (type === 'para')  return <Layers size={20} />;
  return <Mic size={20} />;
};

const SearchResultRow: React.FC<SearchResultRowProps> = ({ result, onClick }) => {
  const style = RESULT_ICON_STYLES[result.type] ?? RESULT_ICON_STYLES.ayah;

  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-4 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} ${style.text}`}>
          <ResultIcon type={result.type} />
        </div>
        <div>
          <p className="font-bold text-[#1A3C34]">{result.label}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{result.sub}</p>
        </div>
      </div>
      <ArrowRight size={16} className="text-gray-300" />
    </button>
  );
};
