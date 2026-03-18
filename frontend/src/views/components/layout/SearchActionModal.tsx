import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Mic } from 'lucide-react';

interface SearchActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemorize: () => void;
  onRecite: () => void;
}

export const SearchActionModal: React.FC<SearchActionModalProps> = ({
  isOpen,
  onClose,
  onMemorize,
  onRecite,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-xs rounded-[40px] p-8 relative z-10 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-[#1A3C34] mb-2 text-center">Choose Action</h3>
            <p className="text-gray-500 text-sm text-center mb-8">
              How would you like to continue with this verse?
            </p>

            <div className="space-y-3">
              <button
                onClick={onMemorize}
                className="w-full py-4 bg-[#1A3C34] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#2D5A4E] transition-colors"
              >
                <BookOpen size={20} /> Memorize
              </button>

              <button
                onClick={onRecite}
                className="w-full py-4 bg-[#E8F3F0] text-[#1A3C34] rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#D1E0DB] transition-colors"
              >
                <Mic size={20} /> Recite
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-gray-400 font-bold text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
