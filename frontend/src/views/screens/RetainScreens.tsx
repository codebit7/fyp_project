import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Plus, RefreshCw, ChevronLeft, Bookmark, Layers } from 'lucide-react';
import { Header } from '../components/common';
import { Screen } from '../../models/types';

// ─── RetainScreen ─────────────────────────────────────────────────────────────

interface RetainScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

export const RetainScreen: React.FC<RetainScreenProps> = ({ onBack, onNavigate }) => {
  const options = [
    {
      title: 'Random Test',
      icon: '?',
      color: 'bg-blue-50',
      iconColor: 'text-blue-500',
      description: 'Test your memory with random verses',
      onPress: () => onNavigate('retain_test'),
    },
    {
      title: 'Existing Plan',
      icon: <CheckCircle2 size={40} />,
      color: 'bg-green-50',
      iconColor: 'text-green-500',
      description: 'Continue your current memorization plan',
      onPress: () => {},
    },
    {
      title: 'New Plan',
      icon: <Plus size={40} />,
      color: 'bg-orange-50',
      iconColor: 'text-orange-500',
      description: 'Start a fresh memorization journey',
      onPress: () => {},
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Retain Quran" onBack={onBack} showSearch={false} />
      <div className="flex-1 p-6 space-y-6 flex flex-col items-center justify-center">
        {options.map((opt) => (
          <RetainOption key={opt.title} {...opt} />
        ))}
      </div>
    </motion.div>
  );
};

// ─── RetainTestScreen ─────────────────────────────────────────────────────────

interface RetainTestScreenProps {
  onBack: () => void;
  onSeeScore: () => void;
}

export const RetainTestScreen: React.FC<RetainTestScreenProps> = ({ onBack, onSeeScore }) => {
  const [mode,              setMode]              = useState<'record' | 'write'>('record');
  const [showStartingVerse, setShowStartingVerse] = useState(true);
  const [isRecording,       setIsRecording]       = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-white"
    >
      <Header title="Retain Quran: Random Test" onBack={onBack} showSearch={false} />

      <div className="px-6 py-4 overflow-y-auto pb-24">
        {/* Mode tabs */}
        <ModeTab mode={mode} onChange={setMode} />

        {/* Surah selector */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#1A3C34] hover:bg-gray-200 transition-colors">
            <RefreshCw size={24} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-arabic text-[#1A3C34]">الكهف</h2>
            <ChevronLeft size={20} className="-rotate-90 text-gray-400" />
          </div>
          <div className="px-4 py-1.5 bg-[#E8F3F0] rounded-full">
            <span className="text-xs font-bold text-[#1A3C34]">Verses 66 - 88</span>
          </div>
        </div>

        {/* Settings row */}
        <div className="flex items-center justify-between mb-8">
          <ToggleRow label="Show starting verse" active={showStartingVerse} onToggle={() => setShowStartingVerse((p) => !p)} color="bg-[#86B6A7]" />
          <ToggleRow label="Record"               active={isRecording}       onToggle={() => setIsRecording((p) => !p)}       color="bg-[#86B6A7]" />
        </div>

        {/* Verse display */}
        <div className="bg-gray-50 rounded-[32px] p-8 mb-8 min-h-[300px] shadow-inner">
          <p className="text-xl font-arabic leading-[2.5] text-right text-[#1A3C34] opacity-80">
            قَالَ لَهُ مُوسَىٰ هَلْ أَتَّبِعُكَ عَلَىٰ أَن تُعَلِّمَنِ مِمَّا عُلِّمْتَ رُشْدًا (66) قَالَ إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا (67) وَكَيْفَ تَصْبِرُ عَلَىٰ مَا لَمْ تُحِطْ بِهِ خُبْرًا (68) قَالَ سَتَجِدُنِي إِن شَاءَ اللَّهُ صَابِرًا وَلَا أَعْصِي لَكَ أَمْرًا (69)
          </p>
        </div>

        <button
          onClick={onSeeScore}
          className="w-full py-4 bg-[#D1E0DB] text-[#1A3C34] rounded-full font-bold hover:bg-[#C1D0CB] transition-colors shadow-sm"
        >
          Click to see your score
        </button>
      </div>
    </motion.div>
  );
};

// ─── RetainResultsScreen ──────────────────────────────────────────────────────

interface RetainResultsScreenProps {
  onBack: () => void;
  onSave: () => void;
}

export const RetainResultsScreen: React.FC<RetainResultsScreenProps> = ({ onBack, onSave }) => {
  const score = 93;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-white"
    >
      <Header title="Retain Quran: Random Test" onBack={onBack} showSearch={false} />

      <div className="px-6 py-4 overflow-y-auto pb-24">
        <ModeTab mode="record" onChange={() => {}} />

        {/* Surah selector (static display) */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#1A3C34]">
            <RefreshCw size={24} />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-arabic text-[#1A3C34]">الكهف</h2>
            <ChevronLeft size={20} className="-rotate-90 text-gray-400" />
          </div>
          <div className="px-4 py-1.5 bg-[#E8F3F0] rounded-full">
            <span className="text-xs font-bold text-[#1A3C34]">Verses 66 - 88</span>
          </div>
        </div>

        {/* Score gauge */}
        <ScoreGauge score={score} />

        <div className="flex justify-center mb-8">
          <button className="px-8 py-2 bg-[#D1E0DB] text-[#1A3C34] text-xs font-bold rounded-full shadow-sm">
            Short Summary
          </button>
        </div>

        {/* Result items */}
        <div className="space-y-4 mb-12">
          <ResultItem icon="ظ"                 label="Alphabets mistakes"  value="59 / 2303"                       valueColor="text-emerald-500" />
          <ResultItem icon={<Layers size={20} />} label="Words mistakes"   value="10 / 319"                        valueColor="text-emerald-500" />
          <ResultItem icon={<Layers size={20} />} label="Most common error" value='Addition of "waw" before verses' valueColor="text-orange-400" smallValue />
        </div>

        <button
          onClick={onSave}
          className="w-full py-4 bg-[#D1E0DB] text-[#1A3C34] rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#C1D0CB] transition-colors shadow-sm"
        >
          <Bookmark size={20} fill="currentColor" />
          Save your progress
        </button>
      </div>
    </motion.div>
  );
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const RetainOption: React.FC<{
  title: string; icon: React.ReactNode; color: string;
  iconColor: string; description: string; onPress: () => void;
}> = ({ title, icon, color, iconColor, description, onPress }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onPress}
    className={`w-full ${color} rounded-[40px] p-8 flex items-center gap-6 text-left shadow-sm hover:shadow-lg transition-all duration-300`}
  >
    <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold ${iconColor} shadow-md`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-[#1A3C34] mb-1">{title}</h3>
      <p className="text-xs text-gray-500 font-medium">{description}</p>
    </div>
  </motion.button>
);

const ModeTab: React.FC<{ mode: 'record' | 'write'; onChange: (m: 'record' | 'write') => void }> = ({
  mode, onChange,
}) => (
  <div className="bg-gray-100 p-1 rounded-2xl flex mb-6">
    {(['record', 'write'] as const).map((m) => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={`flex-1 py-2.5 rounded-xl font-bold capitalize transition-all ${mode === m ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}
      >
        {m}
      </button>
    ))}
  </div>
);

const ToggleRow: React.FC<{ label: string; active: boolean; onToggle: () => void; color: string }> = ({
  label, active, onToggle, color,
}) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    <button
      onClick={onToggle}
      className={`w-10 h-5 rounded-full relative transition-colors ${active ? color : 'bg-gray-200'}`}
    >
      <motion.div animate={{ x: active ? 20 : 0 }} className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
    </button>
  </div>
);

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const dashOffset = 125.6 * (1 - score / 100);
  return (
    <div className="text-center mb-8">
      <p className="text-sm font-bold text-[#1A3C34] mb-10">Bingooooo.. You are almost there!</p>
      <div className="relative w-64 h-40 mx-auto">
        <svg viewBox="0 0 100 60" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#EF4444" />
              <stop offset="50%"  stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F3F4F6"          strokeWidth="10" strokeLinecap="round" />
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gaugeGradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset={dashOffset} />
          <motion.line x1="50" y1="50" x2="50" y2="15" stroke="#374151" strokeWidth="3" strokeLinecap="round" initial={{ rotate: -90 }} animate={{ rotate: (score / 100) * 180 - 90 }} style={{ originX: '50px', originY: '50px' }} />
          <circle cx="50" cy="50" r="6" fill="#9CA3AF" />
        </svg>
        <div className="absolute top-1/2 left-full -translate-y-1/2 -ml-8">
          <span className="text-4xl font-bold text-[#1A3C34]">{score}%</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
          <span>POOR</span><span>GOOD</span>
        </div>
      </div>
    </div>
  );
};

const ResultItem: React.FC<{
  icon: React.ReactNode; label: string; value: string;
  valueColor: string; smallValue?: boolean;
}> = ({ icon, label, value, valueColor, smallValue }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl font-arabic text-gray-600 shadow-inner">
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-600">{label}</span>
    </div>
    <span className={`text-xs font-bold ${valueColor} ${smallValue ? 'text-[10px] text-right max-w-[120px] leading-tight' : ''}`}>
      {value}
    </span>
  </motion.div>
);
