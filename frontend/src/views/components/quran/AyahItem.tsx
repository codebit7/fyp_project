import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Play, Bookmark } from 'lucide-react';
import { Ayah } from '../../../models/types';
import { shareContent } from '../../../utils/shareUtils';

interface AyahItemProps {
  ayah: Ayah;
}

export const AyahItem: React.FC<AyahItemProps> = ({ ayah }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = () => {
    shareContent(
      `Ayah ${ayah.number}`,
      `"${ayah.text}"\n\nTranslation: ${ayah.translation}\n\nShared from True Tilawah App`
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="space-y-4 bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Action bar */}
      <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-[#1A3C34] text-white flex items-center justify-center text-xs font-bold shadow-sm">
          {ayah.number}
        </div>

        <div className="flex items-center gap-4 text-[#1A3C34]">
          <motion.button
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 hover:bg-white rounded-full transition-all shadow-sm"
            aria-label="Share this ayah"
          >
            <Share2 size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`p-2 hover:bg-white rounded-full transition-all shadow-sm ${isPlaying ? 'text-green-600' : ''}`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <Play size={20} fill={isPlaying ? 'currentColor' : 'none'} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSaved((prev) => !prev)}
            className={`p-2 hover:bg-white rounded-full transition-all shadow-sm ${isSaved ? 'text-orange-500' : ''}`}
            aria-label={isSaved ? 'Remove bookmark' : 'Bookmark'}
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>

      {/* Arabic text */}
      <div className="text-right">
        <p className="text-3xl font-arabic leading-[2.5] text-[#1A3C34] drop-shadow-sm">
          {ayah.text}
        </p>
      </div>

      {/* Translation */}
      <p className="text-sm text-gray-600 leading-relaxed font-medium">
        {ayah.translation}
      </p>
    </motion.div>
  );
};
