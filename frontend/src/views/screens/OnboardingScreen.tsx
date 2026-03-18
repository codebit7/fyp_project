import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { Button } from '../components/common';

interface OnboardingScreenProps {
  onStart: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white"
    >
      <h1 className="text-4xl font-bold text-[#1A3C34] mb-2">True Tilawah</h1>
      <p className="text-gray-500 mb-12">
        Memorize and recite
        <br />
        Quran easily
      </p>

      {/* Hero card */}
      <div className="relative w-full aspect-[4/5] bg-[#1A3C34] rounded-[40px] overflow-hidden mb-12 flex flex-col items-center justify-center p-8 shadow-2xl">
        {/* Floating book icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <BookOpen size={120} className="text-[#86B6A7]" />
        </motion.div>

        {/* Arabic verse */}
        <div className="mt-8 text-center text-white">
          <p className="text-2xl font-arabic leading-loose">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-200 rounded-full opacity-50" />
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-30" />
        <div className="absolute bottom-20 left-20 w-16 h-8 bg-white/10 rounded-full blur-xl" />
      </div>

      <Button onClick={onStart} size="lg" variant="secondary">
        Get Started
      </Button>
    </motion.div>
  );
};
