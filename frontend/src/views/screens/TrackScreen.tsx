import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, Zap, Mic, Share2 } from 'lucide-react';
import { Header } from '../components/common';
import { CURRENT_USER } from '../../constants/appConstants';
import { shareContent } from '../../utils/shareUtils';

interface TrackScreenProps {
  onBack: () => void;
}

const WEEKLY_BARS = [40, 65, 45, 90, 35, 75, 85];

export const TrackScreen: React.FC<TrackScreenProps> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col overflow-y-auto pb-24 bg-[#F8FAFB]"
    >
      <Header
        title="My Progress"
        onBack={onBack}
        rightElement={
          <button
            onClick={() => shareContent('My Progress', 'Check out my progress on True Tilawah!')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Share progress"
          >
            <Share2 size={24} className="text-[#1A3C34]" />
          </button>
        }
      />

      {/* Profile summary */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-black/5 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A3C34]/5 rounded-full -mr-16 -mt-16" />

          <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#1A3C34]/20 rounded-full blur-lg animate-pulse" />
              <img
                src={CURRENT_USER.avatar}
                alt="User"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover relative z-10"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1A3C34]">{CURRENT_USER.name}</h3>
              <span className="px-2 py-0.5 bg-[#E8F3F0] text-[#1A3C34] text-[10px] font-bold rounded-full uppercase tracking-wider">
                {CURRENT_USER.level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <StatPill icon={<Clock size={20} />} value="14h"   label="Time"   color="text-blue-500"   bg="bg-blue-50"   />
            <StatPill icon={<Zap size={20} />}   value="5"     label="Streak" color="text-orange-500" bg="bg-orange-50" />
            <StatPill icon={<BookOpen size={20} />} value="12" label="Surahs" color="text-emerald-500" bg="bg-emerald-50" />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Section title */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A3C34] uppercase tracking-wider">Learning Stats</h3>
        </div>

        {/* Accuracy + weekly target */}
        <div className="grid grid-cols-2 gap-4">
          <AccuracyCard percentage={80} />
          <WeeklyTargetCard daysCompleted={4} daysTotal={5} />
        </div>

        {/* Memorization bar chart */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Memorization Flow</p>
            <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500">Last 7 Days</div>
          </div>
          <div className="flex items-end justify-between h-32 gap-3">
            {WEEKLY_BARS.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-full relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="w-full bg-[#1A3C34] rounded-t-xl group-hover:bg-[#2D5A4E] transition-colors"
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A3C34] text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">
                    {h}%
                  </div>
                </div>
                <span className="text-[8px] font-bold text-gray-400 uppercase">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Focus areas */}
        <div className="space-y-4 pb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Focus Areas</p>
          <FocusAreaCard title="Ghunnah"  level="High"   progress={85} barColor="bg-red-500"    iconColor="text-red-500"    iconBg="bg-red-50"    />
          <FocusAreaCard title="Madd"     level="Medium" progress={60} barColor="bg-orange-500" iconColor="text-orange-500" iconBg="bg-orange-50" />
          <FocusAreaCard title="Qalqalah" level="Low"    progress={30} barColor="bg-yellow-500" iconColor="text-yellow-500" iconBg="bg-yellow-50" />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatPill: React.FC<{ icon: React.ReactNode; value: string; label: string; color: string; bg: string }> = ({
  icon, value, label, color, bg,
}) => (
  <div className="text-center">
    <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mx-auto mb-2`}>
      {icon}
    </div>
    <p className="text-xl font-bold text-[#1A3C34]">{value}</p>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
  </div>
);

const AccuracyCard: React.FC<{ percentage: number }> = ({ percentage }) => {
  const dashOffset = 251.2 * (1 - percentage / 100);
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Accuracy</p>
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#F3F4F6" strokeWidth="8" />
          <circle cx="48" cy="48" r="40" fill="none" stroke="#1A3C34" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={dashOffset} strokeLinecap="round" />
        </svg>
        <span className="absolute text-xl font-bold text-[#1A3C34]">{percentage}%</span>
      </div>
    </div>
  );
};

const WeeklyTargetCard: React.FC<{ daysCompleted: number; daysTotal: number }> = ({
  daysCompleted, daysTotal,
}) => {
  const percentage = Math.round((daysCompleted / daysTotal) * 100);
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Target</p>
        <h4 className="text-lg font-bold text-[#1A3C34]">{daysCompleted} / {daysTotal} Days</h4>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-gray-400">
          <span>PROGRESS</span><span>{percentage}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-[#1A3C34]" />
        </div>
      </div>
    </div>
  );
};

const FocusAreaCard: React.FC<{
  title: string; level: string; progress: number;
  barColor: string; iconColor: string; iconBg: string;
}> = ({ title, level, progress, barColor, iconColor, iconBg }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
        <Mic size={24} className={iconColor} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#1A3C34]">{title}</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priority: {level}</p>
      </div>
    </div>
    <div className="w-24">
      <div className="flex justify-between text-[8px] font-bold text-gray-400 mb-1">
        <span>STRENGTH</span><span>{progress}%</span>
      </div>
      <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  </div>
);
