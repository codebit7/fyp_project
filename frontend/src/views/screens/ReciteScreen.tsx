import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Mic } from 'lucide-react';
import { Header, Button } from '../components/common';
import { useRecorder } from '../../controllers/useRecorder';

interface ReciteScreenProps {
  onBack: () => void;
}

export const ReciteScreen: React.FC<ReciteScreenProps> = ({ onBack }) => {
  const { isRecording, isConnected, mistakes, startRecording, stopRecording, resetMistakes } = useRecorder();
  const [showVerses, setShowVerses] = useState(true);
  const [isSaved,    setIsSaved]    = useState(false);

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleReset = () => {
    stopRecording();
    resetMistakes();
  };

  const handleSave = () => {
    stopRecording();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Recite Quran" onBack={onBack} showSearch={false} />

      {/* Selected Surah banner */}
      <div className="px-6 py-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-[#86B6A7] to-[#5C8E7F] rounded-[32px] p-6 text-white flex items-center justify-between shadow-lg cursor-pointer"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold mb-1 opacity-90 uppercase tracking-widest">
              <BookOpen size={14} /> Select Ayah
            </div>
            <h3 className="text-xl font-bold">Al-Fatihah</h3>
            <p className="text-xs opacity-80">Ayah No: 1</p>
          </div>
          <BookOpen size={60} className="opacity-20" />
        </motion.div>
      </div>

      {/* Toggles: show verse / WS status */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Show verses</span>
          <Toggle active={showVerses} onToggle={() => setShowVerses((prev) => !prev)} />
        </div>

        <h2 className="text-2xl font-arabic text-[#1A3C34]">الفاتحة</h2>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {isConnected ? 'Live' : 'Offline'}
          </span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        {/* Arabic verse */}
        <AnimatePresence mode="wait">
          {showVerses && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-12"
            >
              <p className="text-3xl font-arabic leading-loose text-[#1A3C34] drop-shadow-sm">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (1)
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Microphone circle */}
        <MicrophoneCircle isRecording={isRecording} onToggle={handleToggleRecording} />

        {/* Status / feedback */}
        <div className="mt-12 min-h-[100px] flex flex-col items-center w-full">
          <AnimatePresence mode="wait">
            {isRecording ? (
              <RecordingStatus key="recording" mistakes={mistakes} />
            ) : (
              <IdleStatus key="idle" mistakes={mistakes} />
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="mt-auto pt-8 flex gap-4 w-full">
          <Button variant="outline" size="full" onClick={handleReset} className="rounded-2xl">
            Reset
          </Button>
          <Button variant="secondary" size="full" onClick={handleSave} className="rounded-2xl">
            {isSaved ? 'Saved!' : 'Save Session'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Toggle: React.FC<{ active: boolean; onToggle: () => void }> = ({ active, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-[#1A3C34]' : 'bg-gray-200'}`}
    aria-label="Toggle"
  >
    <motion.div
      animate={{ x: active ? 20 : 0 }}
      className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"
    />
  </button>
);

const MicrophoneCircle: React.FC<{ isRecording: boolean; onToggle: () => void }> = ({
  isRecording,
  onToggle,
}) => (
  <div className="relative w-72 h-72 flex items-center justify-center">
    {/* Expanding pulse rings when recording */}
    <AnimatePresence>
      {isRecording && (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 border-2 border-[#1A3C34]/20 rounded-full"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            className="absolute inset-0 border-2 border-[#1A3C34]/10 rounded-full"
          />
        </>
      )}
    </AnimatePresence>

    <div className={`absolute inset-0 border-2 border-dashed border-gray-100 rounded-full ${isRecording ? 'animate-spin-slow' : ''}`} />

    <motion.div
      animate={{
        scale: isRecording ? [1, 1.05, 1] : 1,
        backgroundColor: isRecording ? '#1A3C34' : '#F9FAFB',
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-56 h-56 rounded-full flex items-center justify-center shadow-2xl relative z-10"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${
          isRecording ? 'bg-white text-[#1A3C34]' : 'bg-[#1A3C34] text-white'
        }`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <Mic size={40} />
      </motion.button>
    </motion.div>

    {/* Waveform bars */}
    {Array.from({ length: 32 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 bg-[#1A3C34]/30 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transformOrigin: 'bottom center',
          transform: `rotate(${i * (360 / 32)}deg) translateY(-120px)`,
        }}
        animate={{
          height: isRecording ? [4, Math.random() * 60 + 10, 4] : 4,
          opacity: isRecording ? 1 : 0.2,
        }}
        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.02 }}
      />
    ))}
  </div>
);

const RecordingStatus: React.FC<{ mistakes: string[] }> = ({ mistakes }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex flex-col items-center w-full"
  >
    {/* Recording indicator */}
    <div className="flex items-center gap-2 mb-6">
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
      />
      <span className="text-xs font-bold text-[#1A3C34] uppercase tracking-[0.2em]">
        Recording Started...
      </span>
    </div>

    {/* Mistake feedback panel */}
    <div className="w-full max-w-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mistake Detection</span>
      </div>
      <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-2xl p-4 min-h-[80px] flex flex-col justify-center shadow-inner">
        <AnimatePresence mode="popLayout">
          {mistakes.length > 0 ? (
            <motion.div
              key={mistakes.length}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-1"
            >
              {mistakes.slice(-2).map((mistake, idx) => (
                <p key={idx} className="text-red-600 text-sm text-center leading-relaxed font-medium">
                  {mistake}
                </p>
              ))}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-[10px] text-center italic font-medium"
            >
              Listening for recitation errors...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

const IdleStatus: React.FC<{ mistakes: string[] }> = ({ mistakes }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center"
  >
    <p className="text-gray-400 text-sm font-medium">Tap the microphone to start reciting</p>

    {mistakes.length > 0 && (
      <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">
          Last Session Feedback
        </p>
        {mistakes.map((mistake, idx) => (
          <p key={idx} className="text-xs font-bold text-red-600 mb-1">{mistake}</p>
        ))}
      </div>
    )}
  </motion.div>
);
