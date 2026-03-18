import React from 'react';
import { motion } from 'motion/react';
import { Share2 } from 'lucide-react';
import { Header, Card } from '../components/common';
import { AyahItem } from '../components/quran/AyahItem';
import { Ayah } from '../../models/types';
import { shareContent } from '../../utils/shareUtils';

interface DetailScreenProps {
  title: string;
  subtitle: string;
  meta: string;
  arabicName: string;
  ayats?: Ayah[];
  onBack: () => void;
}

/**
 * DetailScreen is a shared layout used by SurahDetail, ParaDetail, PageDetail and HizbDetail.
 * All four screens are structurally identical – only the data differs.
 */
export const DetailScreen: React.FC<DetailScreenProps> = ({
  title,
  subtitle,
  meta,
  arabicName,
  ayats,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header
        title={title}
        onBack={onBack}
        rightElement={
          <button
            onClick={() => shareContent(title, `Read ${title} on True Tilawah`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Share"
          >
            <Share2 size={24} className="text-[#1A3C34]" />
          </button>
        }
      />

      {/* Banner card */}
      <div className="px-6 py-4">
        <Card variant="gradient" className="p-10 text-center relative overflow-hidden rounded-[40px]">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-sm opacity-90 mb-4">{subtitle}</p>
            <div className="w-full h-px bg-white/20 mb-4" />
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">{meta}</p>
            <div className="mt-8">
              <p className="text-3xl font-arabic leading-relaxed">{arabicName}</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </div>

      {/* Ayah list */}
      <motion.div
        className="flex-1 overflow-y-auto px-6 py-4 space-y-8"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {ayats?.length ? (
          ayats.map((ayah) => (
            <motion.div
              key={ayah.number}
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            >
              <AyahItem ayah={ayah} />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 font-medium">Loading ayats...</div>
        )}
      </motion.div>
    </motion.div>
  );
};
