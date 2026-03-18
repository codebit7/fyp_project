/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Mic, 
  RotateCcw, 
  BarChart3, 
  Bookmark, 
  Search, 
  Menu, 
  ChevronLeft, 
  Play, 
  Share2, 
  MoreVertical,
  Plus,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Settings,
  User as UserIcon,
  LogOut,
  HelpCircle,
  RefreshCw,
  Layers,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, Surah, User, Para, Ayah, Page, Hizb } from './types';
import { SURAHS, PARAS, PAGES, HIZBS } from './data';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Header } from './components/Header';
import { NavButton } from './components/NavButton';
import { SidebarItem } from './components/SidebarItem';

const CURRENT_USER: User = {
  name: 'Ahmed Ali',
  level: 'Beginner Student',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
};

const handleShare = async (title: string, text: string) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: window.location.href });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  } else {
    try {
      await navigator.clipboard.writeText(`${title}\n${text}\n${window.location.href}`);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedPara, setSelectedPara] = useState<Para | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedHizb, setSelectedHizb] = useState<Hizb | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<{ ayah: Ayah, surahName?: string, surahId?: number } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchActionContext, setSearchActionContext] = useState<{ type: 'surah' | 'para' | 'ayah', data: any } | null>(null);

  // Navigation Helper
  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  };

  const handleSearchAction = (type: 'surah' | 'para' | 'page' | 'hizb' | 'ayah', data: any) => {
    setSearchActionContext({ type, data });
    setIsSearchModalOpen(true);
  };

  const executeSearchAction = (action: 'memorize' | 'recite') => {
    if (!searchActionContext) return;
    const { type, data } = searchActionContext;

    if (action === 'memorize') {
      if (type === 'surah') {
        setSelectedSurah(data);
        navigate('surah_detail');
      } else if (type === 'para') {
        setSelectedPara(data);
        navigate('para_detail');
      } else if (type === 'page') {
        setSelectedPage(data);
        navigate('page_detail');
      } else if (type === 'hizb') {
        setSelectedHizb(data);
        navigate('hizb_detail');
      } else if (type === 'ayah') {
        // Find surah for this ayah if possible, or just go to recite
        const surah = SURAHS.find(s => s.id === data.surahId);
        if (surah) {
          setSelectedSurah(surah);
          navigate('surah_detail');
        }
      }
    } else {
      // Recite
      if (type === 'ayah') {
        // Set context for recite screen if needed
      }
      navigate('recite');
    }
    setIsSearchModalOpen(false);
    setSearchActionContext(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] text-[#1A3C34] font-sans selection:bg-[#1A3C34]/10">
      <div className="max-w-lg mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Search Action Modal */}
        <AnimatePresence>
          {isSearchModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-xs rounded-[40px] p-8 relative z-10 shadow-2xl"
              >
                <h3 className="text-xl font-bold text-[#1A3C34] mb-2 text-center">Choose Action</h3>
                <p className="text-gray-500 text-sm text-center mb-8">How would you like to continue with this verse?</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => executeSearchAction('memorize')}
                    className="w-full py-4 bg-[#1A3C34] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#2D5A4E] transition-colors"
                  >
                    <BookOpen size={20} /> Memorize
                  </button>
                  <button 
                    onClick={() => executeSearchAction('recite')}
                    className="w-full py-4 bg-[#E8F3F0] text-[#1A3C34] rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#D1E0DB] transition-colors"
                  >
                    <Mic size={20} /> Recite
                  </button>
                  <button 
                    onClick={() => setIsSearchModalOpen(false)}
                    className="w-full py-3 text-gray-400 font-bold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 left-0 bottom-0 w-3/4 bg-white z-[70] shadow-2xl flex flex-col"
              >
                <div className="p-8 bg-[#1A3C34] text-white">
                  <div className="flex justify-between items-start mb-6">
                    <img src={CURRENT_USER.avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white/20 object-cover" />
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold">{CURRENT_USER.name}</h3>
                  <p className="text-xs opacity-60 font-medium uppercase tracking-wider">{CURRENT_USER.level}</p>
                </div>

                <div className="flex-1 p-4 space-y-2">
                  <SidebarItem icon={<UserIcon size={20} />} label="My Profile" onClick={() => navigate('profile')} />
                  <SidebarItem icon={<Settings size={20} />} label="Settings" onClick={() => navigate('settings')} />
                  <SidebarItem icon={<Bookmark size={20} />} label="Saved Verses" onClick={() => navigate('bookmarks')} />
                  <SidebarItem icon={<HelpCircle size={20} />} label="Help & Support" onClick={() => navigate('help')} />
                </div>

                <div className="p-4 border-t border-gray-100">
                  <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => navigate('auth')} danger />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentScreen === 'onboarding' && (
            <OnboardingScreen key="onboarding" onStart={() => navigate('auth')} />
          )}
          {currentScreen === 'auth' && (
            <AuthScreen key="auth" onLogin={() => navigate('dashboard')} />
          )}
          {currentScreen === 'dashboard' && (
            <DashboardScreen 
              key="dashboard" 
              navigate={navigate} 
              onMenuClick={() => setIsSidebarOpen(true)} 
              onSearchAction={handleSearchAction}
            />
          )}
          {currentScreen === 'quran_list' && (
            <QuranListScreen 
              key="quran_list" 
              onBack={() => navigate('dashboard')} 
              onSelectSurah={(surah) => {
                setSelectedSurah(surah);
                navigate('surah_detail');
              }} 
              onSelectPara={(para) => {
                setSelectedPara(para);
                navigate('para_detail');
              }}
              onSelectPage={(page) => {
                setSelectedPage(page);
                navigate('page_detail');
              }}
              onSelectHizb={(hizb) => {
                setSelectedHizb(hizb);
                navigate('hizb_detail');
              }}
            />
          )}
          {currentScreen === 'surah_detail' && selectedSurah && (
            <SurahDetailScreen 
              key="surah_detail" 
              surah={selectedSurah} 
              onBack={() => navigate('quran_list')} 
            />
          )}
          {currentScreen === 'para_detail' && selectedPara && (
            <ParaDetailScreen 
              key="para_detail" 
              para={selectedPara} 
              onBack={() => navigate('quran_list')} 
            />
          )}
          {currentScreen === 'page_detail' && selectedPage && (
            <PageDetailScreen 
              key="page_detail" 
              page={selectedPage} 
              onBack={() => navigate('quran_list')} 
            />
          )}
          {currentScreen === 'hizb_detail' && selectedHizb && (
            <HizbDetailScreen 
              key="hizb_detail" 
              hizb={selectedHizb} 
              onBack={() => navigate('quran_list')} 
            />
          )}
          {currentScreen === 'recite' && (
            <ReciteScreen 
              key="recite" 
              onBack={() => navigate('dashboard')} 
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          )}
          {currentScreen === 'track' && (
            <TrackScreen key="track" onBack={() => navigate('dashboard')} />
          )}
          {currentScreen === 'retain' && (
            <RetainScreen key="retain" onBack={() => navigate('dashboard')} navigate={navigate} />
          )}
          {currentScreen === 'retain_test' && (
            <RetainTestScreen key="retain_test" onBack={() => navigate('retain')} onSeeScore={() => navigate('retain_results')} />
          )}
          {currentScreen === 'retain_results' && (
            <RetainResultsScreen key="retain_results" onBack={() => navigate('retain_test')} onSave={() => navigate('retain')} />
          )}
          {currentScreen === 'bookmarks' && (
            <BookmarksScreen key="bookmarks" onBack={() => navigate('dashboard')} />
          )}
          {currentScreen === 'profile' && (
            <ProfileScreen key="profile" onBack={() => navigate('dashboard')} />
          )}
          {currentScreen === 'settings' && (
            <SettingsScreen key="settings" onBack={() => navigate('dashboard')} />
          )}
          {currentScreen === 'help' && (
            <HelpScreen key="help" onBack={() => navigate('dashboard')} />
          )}
        </AnimatePresence>

        {/* Bottom Navigation - Only visible on main screens */}
        {['dashboard', 'quran_list', 'recite', 'track', 'bookmarks', 'retain', 'surah_detail', 'para_detail', 'page_detail', 'hizb_detail', 'retain_test', 'retain_results'].includes(currentScreen) && (
          <div className="bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
            <NavButton active={['quran_list', 'surah_detail', 'para_detail', 'page_detail', 'hizb_detail'].includes(currentScreen)} icon={<BookOpen size={24} />} label="READ" onClick={() => navigate('quran_list')} />
            <NavButton active={currentScreen === 'retain'} icon={<RotateCcw size={24} />} label="RETAIN" onClick={() => navigate('retain')} />
            <NavButton active={currentScreen === 'recite'} icon={<Mic size={24} />} label="RECITE" onClick={() => navigate('recite')} />
            <NavButton active={currentScreen === 'track'} icon={<BarChart3 size={24} />} label="TRACK" onClick={() => navigate('track')} />
            <NavButton active={currentScreen === 'bookmarks'} icon={<Bookmark size={24} />} label="SAVE" onClick={() => navigate('bookmarks')} />
          </div>
        )}
      </div>
    </div>
  );
}

// --- Utilities ---

// --- Screens ---

function OnboardingScreen({ onStart }: { onStart: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white"
    >
      <h1 className="text-4xl font-bold text-[#1A3C34] mb-2">True Tilawah</h1>
      <p className="text-gray-500 mb-12">Memorize and recite<br />Quran easily</p>
      
      <div className="relative w-full aspect-[4/5] bg-[#1A3C34] rounded-[40px] overflow-hidden mb-12 flex flex-col items-center justify-center p-8 shadow-2xl">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <BookOpen size={120} className="text-[#86B6A7]" />
        </motion.div>
        <div className="mt-8 text-center text-white">
          <p className="text-2xl font-arabic leading-loose">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p>
        </div>
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-200 rounded-full opacity-50" />
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-30" />
        <div className="absolute bottom-20 left-20 w-16 h-8 bg-white/10 rounded-full blur-xl" />
      </div>

      <Button onClick={onStart} size="lg" variant="secondary">
        Get Started
      </Button>
    </motion.div>
  );
}

function SocialButton({ icon, src }: { icon?: string, src?: string }) {
  return (
    <button className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center font-bold text-xl text-[#1A3C34] hover:bg-gray-50 transition-colors shadow-sm overflow-hidden p-3">
      {src ? (
        <img src={src} alt="Social Icon" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
      ) : (
        icon
      )}
    </button>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void, key?: React.Key }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (isRegister) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onLogin();
    }
  };

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -100, opacity: 0 }}
      className="flex-1 p-8 flex flex-col"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1A3C34] mb-2">True Tilawah</h1>
        <p className="text-gray-500">Log in or register to<br />save your progress</p>
      </div>

      <div className="bg-gray-100 p-1 rounded-2xl flex mb-8">
        <button 
          onClick={() => {
            setIsRegister(false);
            setErrors({});
          }}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isRegister ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}
        >
          Sign in
        </button>
        <button 
          onClick={() => {
            setIsRegister(true);
            setErrors({});
          }}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${isRegister ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}
        >
          Register
        </button>
      </div>

      <div className="space-y-6 flex-1">
        <Input 
          label="Email" 
          placeholder="example@gmail.com" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input 
          label={isRegister ? 'Create a password' : 'Password'} 
          placeholder="must be 8 characters" 
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          rightElement={
            <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />

        {isRegister && (
          <Input 
            label="Confirm password" 
            placeholder="repeat password" 
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            rightElement={
              <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
          />
        )}

        <Button onClick={handleSubmit} size="full" className="mt-4">
          {isRegister ? 'Register' : 'Log in'}
        </Button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-500 font-bold">Or {isRegister ? 'Register' : 'Sign in'} with</span>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <SocialButton src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" />
          <SocialButton src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
          <SocialButton src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" />
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account? <button className="font-bold text-[#1A3C34]">Log in</button>
        </p>
      </div>
    </motion.div>
  );
}

function DashboardScreen({ navigate, onMenuClick, onSearchAction }: { navigate: (s: Screen) => void, onMenuClick: () => void, onSearchAction: (type: 'surah' | 'para' | 'page' | 'hizb' | 'ayah', data: any) => void, key?: React.Key }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [dailyAyah, setDailyAyah] = useState<{ ayah: Ayah, surahName: string, surahId: number } | null>(null);

  useEffect(() => {
    // Get a random ayah from the first 2 surahs for demo
    const randomSurahIdx = Math.floor(Math.random() * 2);
    const surah = SURAHS[randomSurahIdx];
    if (surah.ayats) {
      const randomAyahIdx = Math.floor(Math.random() * surah.ayats.length);
      setDailyAyah({
        ayah: surah.ayats[randomAyahIdx],
        surahName: surah.name,
        surahId: surah.id
      });
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const dashboardCards = [
    { 
      title: "Memorize", 
      subtitle: "Learn Quran",
      icon: <BookOpen size={40} />, 
      color: "bg-[#E8F3F0]", 
      textColor: "text-[#1A3C34]",
      screen: 'quran_list' as Screen
    },
    { 
      title: "Recite", 
      subtitle: "Voice Check",
      icon: <Mic size={40} />, 
      color: "bg-[#FFF5F0]", 
      textColor: "text-[#FF7A3D]",
      screen: 'recite' as Screen
    },
    { 
      title: "Retain", 
      subtitle: "Memory Test",
      icon: <RotateCcw size={40} />, 
      color: "bg-[#FFFBE8]", 
      textColor: "text-[#E6B014]",
      screen: 'retain' as Screen
    },
    { 
      title: "Track", 
      subtitle: "Insights",
      icon: <BarChart3 size={40} />, 
      color: "bg-[#F0F3FF]", 
      textColor: "text-[#4D6BFE]",
      screen: 'track' as Screen
    }
  ];

  const searchResults = searchQuery.length > 1 ? [
    ...SURAHS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(s => ({ type: 'surah' as const, data: s, label: s.name, sub: 'Surah' })),
    ...PARAS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ type: 'para' as const, data: p, label: p.name, sub: 'Para' })),
    ...PAGES.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => ({ type: 'page' as const, data: p, label: p.name, sub: 'Page' })),
    ...HIZBS.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())).map(h => ({ type: 'hizb' as const, data: h, label: h.name, sub: 'Hizb' })),
    ...SURAHS.flatMap(s => (s.ayats || []).filter(a => a.translation.toLowerCase().includes(searchQuery.toLowerCase()) || a.text.includes(searchQuery)).map(a => ({ type: 'ayah' as const, data: { ...a, surahId: s.id, surahName: s.name }, label: `Ayah ${a.number}`, sub: s.name })))
  ].slice(0, 10) : [];

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
        onSearchClick={() => setIsSearchVisible(!isSearchVisible)}
      />

      <AnimatePresence>
        {isSearchVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-4 overflow-hidden"
          >
            <div className="relative">
              <Input 
                placeholder="Search Surah, Para, or Ayah..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftElement={<Search size={20} />}
                autoFocus
              />
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[400px] overflow-y-auto"
                >
                  {searchResults.map((res, i) => (
                    <button 
                      key={i}
                      onClick={() => onSearchAction(res.type, res.data)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          res.type === 'surah' ? 'bg-emerald-50 text-emerald-600' : 
                          res.type === 'para' ? 'bg-blue-50 text-blue-600' : 
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {res.type === 'surah' ? <BookOpen size={20} /> : 
                           res.type === 'para' ? <Layers size={20} /> : 
                           <Mic size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-[#1A3C34]">{res.label}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{res.sub}</p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-300" />
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 py-4">
        <Card variant="gradient" className="flex items-center justify-between relative overflow-hidden group shadow-xl shadow-[#1A3C34]/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-16 -mb-16 blur-2xl" />
          
          <div className="relative z-10">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">{getGreeting()}</p>
            <h2 className="text-2xl font-bold mb-4">{CURRENT_USER.name}</h2>
            <button 
              onClick={() => navigate('track')}
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
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  className="h-full bg-[#1A3C34]" 
                />
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('recite')}
            className="w-10 h-10 rounded-full bg-[#1A3C34] text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-95 shadow-md"
          >
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </button>
        </div>
      </div>

      <div className="px-6 py-4 grid grid-cols-2 gap-4">
        <AnimatePresence>
          {dashboardCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <DashboardCard 
                title={card.title} 
                subtitle={card.subtitle}
                icon={card.icon} 
                color={card.color} 
                textColor={card.textColor}
                onClick={() => navigate(card.screen)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#1A3C34] uppercase tracking-wider">Daily Inspiration</h3>
          <button 
            onClick={() => {
              const randomSurahIdx = Math.floor(Math.random() * 2);
              const surah = SURAHS[randomSurahIdx];
              if (surah.ayats) {
                const randomAyahIdx = Math.floor(Math.random() * surah.ayats.length);
                setDailyAyah({
                  ayah: surah.ayats[randomAyahIdx],
                  surahName: surah.name,
                  surahId: surah.id
                });
              }
            }}
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
                  onClick={() => onSearchAction('ayah', dailyAyah.ayah)}
                  className="flex-1 py-3 bg-white text-[#1A3C34] rounded-2xl text-xs font-bold hover:bg-gray-100 transition-colors"
                >
                  Learn This Verse
                </button>
                <button 
                  onClick={() => handleShare(`Daily Inspiration`, `"${dailyAyah.ayah.text}"\n\n${dailyAyah.ayah.translation}\n\n- ${dailyAyah.surahName}:${dailyAyah.ayah.number}`)}
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
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[70px] group"
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#1A3C34] shadow-sm group-hover:shadow-xl group-hover:bg-[#1A3C34] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-[#1A3C34] transition-colors">{label}</span>
    </motion.button>
  );
}

function QuranListScreen({ onBack, onSelectSurah, onSelectPara, onSelectPage, onSelectHizb }: { 
  onBack: () => void, 
  onSelectSurah: (s: Surah) => void, 
  onSelectPara: (p: Para) => void,
  onSelectPage: (p: Page) => void,
  onSelectHizb: (h: Hizb) => void,
  key?: React.Key 
}) {
  const [activeTab, setActiveTab] = useState('Surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredSurahs = SURAHS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.arabicName.includes(searchQuery)
  );

  const filteredParas = PARAS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.arabicName.includes(searchQuery)
  );

  const filteredPages = PAGES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.arabicName.includes(searchQuery)
  );

  const filteredHizbs = HIZBS.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.arabicName.includes(searchQuery)
  );

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: -100, opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header 
        title="True Tilawah" 
        onBack={onBack} 
        onSearchClick={() => setIsSearchVisible(!isSearchVisible)}
      />

      <AnimatePresence>
        {isSearchVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-4 overflow-hidden"
          >
            <Input 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftElement={<Search size={20} />}
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className="px-6 flex border-b border-gray-100">
        {['Surah', 'Para', 'Page', 'Hijb'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-bold transition-colors relative ${activeTab === tab ? 'text-[#1A3C34]' : 'text-gray-400'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#1A3C34] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <motion.div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {activeTab === 'Surah' && filteredSurahs.map((surah) => (
          <motion.button 
            key={surah.id} 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            onClick={() => onSelectSurah(surah)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.02)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between py-4 border-b border-gray-50 group rounded-xl px-2 -mx-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#1A3C34] font-bold text-sm border border-gray-100 rotate-45 group-hover:bg-[#1A3C34] group-hover:text-white transition-colors">
                <span className="-rotate-45">{surah.id}</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-[#1A3C34]">{surah.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{surah.type} • {surah.versesCount} VERSES</p>
              </div>
            </div>
            <span className="text-xl font-arabic text-[#1A3C34]">{surah.arabicName}</span>
          </motion.button>
        ))}

        {activeTab === 'Para' && filteredParas.map((para) => (
          <motion.button 
            key={para.id} 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            onClick={() => onSelectPara(para)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.02)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between py-4 border-b border-gray-50 group rounded-xl px-2 -mx-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#1A3C34] font-bold text-sm border border-gray-100 rotate-45 group-hover:bg-[#1A3C34] group-hover:text-white transition-colors">
                <span className="-rotate-45">{para.id}</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-[#1A3C34]">{para.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{para.surahRange} • {para.ayatsCount} AYATS</p>
              </div>
            </div>
            <span className="text-xl font-arabic text-[#1A3C34]">{para.arabicName}</span>
          </motion.button>
        ))}

        {activeTab === 'Page' && filteredPages.map((page) => (
          <motion.button 
            key={page.id} 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            onClick={() => onSelectPage(page)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.02)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between py-4 border-b border-gray-50 group rounded-xl px-2 -mx-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#1A3C34] font-bold text-sm border border-gray-100 rotate-45 group-hover:bg-[#1A3C34] group-hover:text-white transition-colors">
                <span className="-rotate-45">{page.id}</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-[#1A3C34]">{page.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{page.surahName} • {page.ayatsCount} AYATS</p>
              </div>
            </div>
            <span className="text-xl font-arabic text-[#1A3C34]">{page.arabicName}</span>
          </motion.button>
        ))}

        {activeTab === 'Hijb' && filteredHizbs.map((hizb) => (
          <motion.button 
            key={hizb.id} 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            onClick={() => onSelectHizb(hizb)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.02)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-between py-4 border-b border-gray-50 group rounded-xl px-2 -mx-2 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#1A3C34] font-bold text-sm border border-gray-100 rotate-45 group-hover:bg-[#1A3C34] group-hover:text-white transition-colors">
                <span className="-rotate-45">{hizb.id}</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-[#1A3C34]">{hizb.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{hizb.surahRange} • {hizb.ayatsCount} AYATS</p>
              </div>
            </div>
            <span className="text-xl font-arabic text-[#1A3C34]">{hizb.arabicName}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

function SurahDetailScreen({ surah, onBack }: { surah: Surah, onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header 
        title={surah.name} 
        onBack={onBack} 
        rightElement={
          <button 
            onClick={() => handleShare(surah.name, `Read ${surah.name} on True Tilawah`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 size={24} className="text-[#1A3C34]" />
          </button>
        }
      />

      <div className="px-6 py-4">
        <Card variant="gradient" className="p-10 text-center relative overflow-hidden rounded-[40px]">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{surah.name}</h2>
            <p className="text-sm opacity-90 mb-4">The Opening</p>
            <div className="w-full h-px bg-white/20 mb-4" />
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">{surah.type} • {surah.versesCount} VERSES</p>
            <div className="mt-8">
              <p className="text-3xl font-arabic leading-relaxed">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </div>

      <motion.div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {surah.ayats?.map((ayah) => (
          <motion.div
            key={ayah.number}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <AyahItem ayah={ayah} />
          </motion.div>
        )) || (
          <div className="text-center py-12 text-gray-400 font-medium">Loading ayats...</div>
        )}
      </motion.div>
    </motion.div>
  );
}

function ParaDetailScreen({ para, onBack }: { para: Para, onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header 
        title={para.name} 
        onBack={onBack} 
        rightElement={
          <button 
            onClick={() => handleShare(para.name, `Read ${para.name} on True Tilawah`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 size={24} className="text-[#1A3C34]" />
          </button>
        }
      />

      <div className="px-6 py-4">
        <Card variant="gradient" className="p-10 text-center relative overflow-hidden rounded-[40px]">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{para.name}</h2>
            <p className="text-sm opacity-90 mb-4">{para.surahRange}</p>
            <div className="w-full h-px bg-white/20 mb-4" />
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">{para.ayatsCount} AYATS</p>
            <div className="mt-8">
              <p className="text-3xl font-arabic leading-relaxed">{para.arabicName}</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </div>

      <motion.div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {para.ayats?.map((ayah) => (
          <motion.div
            key={ayah.number}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <AyahItem ayah={ayah} />
          </motion.div>
        )) || (
          <div className="text-center py-12 text-gray-400 font-medium">Loading ayats...</div>
        )}
      </motion.div>
    </motion.div>
  );
}

function PageDetailScreen({ page, onBack }: { page: Page, onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header 
        title={page.name} 
        onBack={onBack} 
        rightElement={
          <button 
            onClick={() => handleShare(page.name, `Read ${page.name} on True Tilawah`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 size={24} className="text-[#1A3C34]" />
          </button>
        }
      />

      <div className="px-6 py-4">
        <Card variant="gradient" className="p-10 text-center relative overflow-hidden rounded-[40px]">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{page.name}</h2>
            <p className="text-sm opacity-90 mb-4">{page.surahName}</p>
            <div className="w-full h-px bg-white/20 mb-4" />
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">{page.ayatsCount} AYATS</p>
            <div className="mt-8">
              <p className="text-3xl font-arabic leading-relaxed">{page.arabicName}</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </div>

      <motion.div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {page.ayats?.map((ayah) => (
          <motion.div
            key={ayah.number}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <AyahItem ayah={ayah} />
          </motion.div>
        )) || (
          <div className="text-center py-12 text-gray-400 font-medium">Loading ayats...</div>
        )}
      </motion.div>
    </motion.div>
  );
}

function HizbDetailScreen({ hizb, onBack }: { hizb: Hizb, onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 100, opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header 
        title={hizb.name} 
        onBack={onBack} 
        rightElement={
          <button 
            onClick={() => handleShare(hizb.name, `Read ${hizb.name} on True Tilawah`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 size={24} className="text-[#1A3C34]" />
          </button>
        }
      />

      <div className="px-6 py-4">
        <Card variant="gradient" className="p-10 text-center relative overflow-hidden rounded-[40px]">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">{hizb.name}</h2>
            <p className="text-sm opacity-90 mb-4">{hizb.surahRange}</p>
            <div className="w-full h-px bg-white/20 mb-4" />
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">{hizb.ayatsCount} AYATS</p>
            <div className="mt-8">
              <p className="text-3xl font-arabic leading-relaxed">{hizb.arabicName}</p>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </div>

      <motion.div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {hizb.ayats?.map((ayah) => (
          <motion.div
            key={ayah.number}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <AyahItem ayah={ayah} />
          </motion.div>
        )) || (
          <div className="text-center py-12 text-gray-400 font-medium">Loading ayats...</div>
        )}
      </motion.div>
    </motion.div>
  );
}

function AyahItem({ ayah }: { ayah: Ayah }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const onShare = () => {
    handleShare(
      `Ayah ${ayah.number}`,
      `"${ayah.text}"\n\nTranslation: ${ayah.translation}\n\nShared from True Tilawah App`
    );
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="space-y-4 bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-[#1A3C34] text-white flex items-center justify-center text-xs font-bold shadow-sm">
          {ayah.number}
        </div>
        <div className="flex items-center gap-4 text-[#1A3C34]">
          <motion.button 
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={onShare}
            className="p-2 hover:bg-white rounded-full transition-all shadow-sm"
          >
            <Share2 size={20} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className={`p-2 hover:bg-white rounded-full transition-all shadow-sm ${isPlaying ? 'text-green-600' : ''}`}
          >
            <Play size={20} fill={isPlaying ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSave}
            className={`p-2 hover:bg-white rounded-full transition-all shadow-sm ${isSaved ? 'text-orange-500' : ''}`}
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-arabic leading-[2.5] text-[#1A3C34] drop-shadow-sm">
          {ayah.text}
        </p>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed font-medium">
        {ayah.translation}
      </p>
    </motion.div>
  );
}

function ReciteScreen({ onBack, isRecording, setIsRecording }: { onBack: () => void, isRecording: boolean, setIsRecording: (b: boolean) => void, key?: React.Key }) {
  const [showVerses, setShowVerses] = useState(true);
  const [recordMode, setRecordMode] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      setMistakes([]);
      // Simulate mistake detection
      interval = setInterval(() => {
        const potentialMistakes = [
          "Pronunciation: 'Ra' should be heavier",
          "Tajweed: Missing Ghunnah on 'Noon'",
          "Makhraj: 'Ha' should be from the middle of the throat",
          "Rhythm: Slightly too fast here",
          "Vowel: 'Kasra' was too short"
        ];
        if (Math.random() > 0.7) {
          setMistakes(prev => [...prev, potentialMistakes[Math.floor(Math.random() * potentialMistakes.length)]].slice(-3));
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Recite Quran" onBack={onBack} />

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

      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Show verses</span>
          <button 
            onClick={() => setShowVerses(!showVerses)}
            className={`w-10 h-5 rounded-full relative transition-colors ${showVerses ? 'bg-[#1A3C34]' : 'bg-gray-200'}`}
          >
            <motion.div 
              animate={{ x: showVerses ? 20 : 0 }}
              className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
            />
          </button>
        </div>
        <h2 className="text-2xl font-arabic text-[#1A3C34]">الفاتحة</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Record</span>
          <button 
            onClick={() => setRecordMode(!recordMode)}
            className={`w-10 h-5 rounded-full relative transition-colors ${recordMode ? 'bg-red-500' : 'bg-gray-200'}`}
          >
            <motion.div 
              animate={{ x: recordMode ? 20 : 0 }}
              className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
            />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        <AnimatePresence mode="wait">
          {showVerses && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-12"
            >
              <p className="text-3xl font-arabic leading-loose text-[#1A3C34] drop-shadow-sm">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (1)</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Pulsing rings when recording */}
          <AnimatePresence>
            {isRecording && (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 border-2 border-[#1A3C34]/20 rounded-full"
                />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                  className="absolute inset-0 border-2 border-[#1A3C34]/10 rounded-full"
                />
              </>
            )}
          </AnimatePresence>

          <div className={`absolute inset-0 border-2 border-dashed border-gray-100 rounded-full ${isRecording ? 'animate-spin-slow' : ''}`} />
          
          <motion.div 
            animate={{ 
              scale: isRecording ? [1, 1.05, 1] : 1,
              backgroundColor: isRecording ? '#1A3C34' : '#F9FAFB'
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-56 h-56 rounded-full flex items-center justify-center shadow-2xl relative z-10"
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsRecording(!isRecording)}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl ${isRecording ? 'bg-white text-[#1A3C34]' : 'bg-[#1A3C34] text-white'}`}
            >
              <Mic size={40} />
            </motion.button>
          </motion.div>

          {/* Waveform bars */}
          {[...Array(32)].map((_, i) => (
            <motion.div 
              key={i} 
              className="absolute w-1 bg-[#1A3C34]/30 rounded-full"
              style={{ 
                left: '50%', 
                top: '50%',
                transformOrigin: 'bottom center',
                transform: `rotate(${i * (360/32)}deg) translateY(-120px)`
              }}
              animate={{ 
                height: isRecording ? [4, Math.random() * 60 + 10, 4] : 4,
                opacity: isRecording ? 1 : 0.2
              }}
              transition={{ 
                duration: 0.4, 
                repeat: Infinity, 
                delay: i * 0.02 
              }}
            />
          ))}
        </div>

        <div className="mt-12 min-h-[100px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            {isRecording ? (
              <motion.div
                key="recording-status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center gap-2 mb-6">
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  />
                  <span className="text-xs font-bold text-[#1A3C34] uppercase tracking-[0.2em]">Recording Started...</span>
                </div>
                
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
                            <p key={idx} className="text-red-600 font-arabic text-lg text-center leading-relaxed">
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
            ) : (
              <motion.div
                key="idle-status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-gray-400 text-sm font-medium">Tap the microphone to start reciting</p>
                {mistakes.length > 0 && !isRecording && (
                  <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Last Session Feedback</p>
                    {mistakes.map((mistake, idx) => (
                      <p key={idx} className="text-xs font-bold text-red-600 mb-1">{mistake}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-8 flex gap-4 w-full">
          <Button 
            variant="outline" 
            size="full" 
            onClick={() => {
              setIsRecording(false);
              setMistakes([]);
            }}
            className="rounded-2xl"
          >
            Reset
          </Button>
          <Button 
            variant="secondary" 
            size="full" 
            onClick={() => {
              setIsRecording(false);
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 3000);
            }}
            className="rounded-2xl"
          >
            {isSaved ? 'Saved!' : 'Save Session'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function TrackScreen({ onBack }: { onBack: () => void, key?: React.Key }) {
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
            onClick={() => handleShare('My Progress', 'Check out my progress on True Tilawah!')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 size={24} className="text-[#1A3C34]" />
          </button>
        }
      />

      <div className="px-6 py-6">
        <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-black/5 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A3C34]/5 rounded-full -mr-16 -mt-16" />
          
          <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#1A3C34]/20 rounded-full blur-lg animate-pulse" />
              <img src={CURRENT_USER.avatar} alt="User" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover relative z-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1A3C34]">{CURRENT_USER.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-[#E8F3F0] text-[#1A3C34] text-[10px] font-bold rounded-full uppercase tracking-wider">{CURRENT_USER.level}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                <Clock size={20} />
              </div>
              <p className="text-xl font-bold text-[#1A3C34]">14h</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-2">
                <Zap size={20} />
              </div>
              <p className="text-xl font-bold text-[#1A3C34]">5</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Streak</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                <BookOpen size={20} />
              </div>
              <p className="text-xl font-bold text-[#1A3C34]">12</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Surahs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A3C34] uppercase tracking-wider">Learning Stats</h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1A3C34]" />
            <div className="w-2 h-2 rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Accuracy</p>
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#1A3C34" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" />
              </svg>
              <span className="absolute text-xl font-bold text-[#1A3C34]">80%</span>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weekly Target</p>
              <h4 className="text-lg font-bold text-[#1A3C34]">4 / 5 Days</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>PROGRESS</span>
                <span>80%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  className="h-full bg-[#1A3C34]" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Memorization Flow</p>
            <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500">Last 7 Days</div>
          </div>
          <div className="flex items-end justify-between h-32 gap-3">
            {[40, 65, 45, 90, 35, 75, 85].map((h, i) => (
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

        <div className="space-y-4 pb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Focus Areas</p>
          <div className="grid grid-cols-1 gap-3">
            <FocusAreaCard title="Ghunnah" level="High" progress={85} color="bg-red-500" />
            <FocusAreaCard title="Madd" level="Medium" progress={60} color="bg-orange-500" />
            <FocusAreaCard title="Qalqalah" level="Low" progress={30} color="bg-yellow-500" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FocusAreaCard({ title, level, progress, color }: { title: string, level: string, progress: number, color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl ${color}/10 flex items-center justify-center`}>
          <Mic size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#1A3C34]">{title}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priority: {level}</p>
        </div>
      </div>
      <div className="w-24">
        <div className="flex justify-between text-[8px] font-bold text-gray-400 mb-1">
          <span>STRENGTH</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
          <div className={`h-full ${color}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function RetainScreen({ onBack, navigate }: { onBack: () => void, navigate: (s: Screen) => void, key?: React.Key }) {
  const handleOptionClick = (title: string) => {
    if (title === 'Random Test') {
      navigate('retain_test');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Retain Quran" onBack={onBack} />

      <div className="flex-1 p-6 space-y-6 flex flex-col items-center justify-center">
        <RetainOption 
          title="Random Test" 
          icon="?" 
          color="bg-blue-50" 
          iconColor="text-blue-500"
          description="Test your memory with random verses"
          onClick={() => handleOptionClick('Random Test')}
        />
        <RetainOption 
          title="Existing Plan" 
          icon={<CheckCircle2 size={40} />} 
          color="bg-green-50" 
          iconColor="text-green-500"
          description="Continue your current memorization plan"
          onClick={() => handleOptionClick('Existing Plan')}
        />
        <RetainOption 
          title="New Plan" 
          icon={<Plus size={40} />} 
          color="bg-orange-50" 
          iconColor="text-orange-500"
          description="Start a fresh memorization journey"
          onClick={() => handleOptionClick('New Plan')}
        />
      </div>
    </motion.div>
  );
}

function RetainOption({ title, icon, color, iconColor, description, onClick }: { title: string, icon: any, color: string, iconColor: string, description: string, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
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
}

function BookmarksScreen({ onBack }: { onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Bookmarks" onBack={onBack} />

      <div className="px-6 py-4 space-y-4">
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-dashed border-gray-200">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#1A3C34]">
            <Plus size={24} />
          </div>
          <span className="font-bold text-[#1A3C34]">Add new collection</span>
        </button>

        <BookmarkItem title="My Favorite" count={8} />
        <BookmarkItem title="Daily" count={5} />
      </div>
    </motion.div>
  );
}

function BookmarkItem({ title, count }: { title: string, count: number }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#E8F3F0] flex items-center justify-center text-[#1A3C34]">
          <Bookmark size={24} />
        </div>
        <div>
          <h4 className="font-bold text-[#1A3C34]">{title}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{count} items</p>
        </div>
      </div>
      <MoreVertical size={20} className="text-gray-300" />
    </motion.div>
  );
}

function ProfileScreen({ onBack }: { onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 flex flex-col"
    >
      <Header title="My Profile" onBack={onBack} />
      <div className="p-8 flex flex-col items-center">
        <div className="relative mb-6">
          <img src={CURRENT_USER.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-[#1A3C34]/10 object-cover" />
          <button className="absolute bottom-0 right-0 bg-[#1A3C34] text-white p-2 rounded-full shadow-lg">
            <Settings size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-[#1A3C34] mb-1">{CURRENT_USER.name}</h2>
        <p className="text-gray-500 mb-8">{CURRENT_USER.level}</p>

        <div className="w-full space-y-4">
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Email</span>
            <span className="text-sm font-bold text-[#1A3C34]">rafiqsaad864@gmail.com</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Joined</span>
            <span className="text-sm font-bold text-[#1A3C34]">March 2024</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsScreen({ onBack }: { onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Settings" onBack={onBack} />
      <div className="p-6 space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Eye size={20} />
            </div>
            <span className="font-bold text-[#1A3C34]">Dark Mode</span>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-bold text-[#1A3C34]">Notifications</span>
          </div>
          <div className="w-12 h-6 bg-[#1A3C34] rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HelpScreen({ onBack }: { onBack: () => void, key?: React.Key }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -100 }}
      className="flex-1 flex flex-col"
    >
      <Header title="Help & Support" onBack={onBack} />
      <div className="p-6 space-y-4">
        <div className="bg-[#E8F3F0] p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-[#1A3C34] mb-2">How can we help?</h3>
          <p className="text-sm text-[#1A3C34]/70 mb-4">Search our help center or contact our support team.</p>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full bg-white rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none" placeholder="Search for help..." />
          </div>
        </div>
        <div className="space-y-2">
          {['FAQs', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
            <button key={item} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors">
              <span className="font-bold text-[#1A3C34]">{item}</span>
              <ChevronLeft size={20} className="rotate-180 text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RetainTestScreen({ onBack, onSeeScore }: { onBack: () => void, onSeeScore: () => void, key?: React.Key }) {
  const [mode, setMode] = useState<'record' | 'write'>('record');
  const [showStartingVerse, setShowStartingVerse] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-white"
    >
      <Header title="Retain Quran: Random Test" onBack={onBack} onSearchClick={() => {}} />

      <div className="px-6 py-4 overflow-y-auto pb-24">
        <div className="bg-gray-100 p-1 rounded-2xl flex mb-6">
          <button 
            onClick={() => setMode('record')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${mode === 'record' ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}
          >
            Record
          </button>
          <button 
            onClick={() => setMode('write')}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${mode === 'write' ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}
          >
            Write
          </button>
        </div>

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

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Show starting verse</span>
            <button 
              onClick={() => setShowStartingVerse(!showStartingVerse)}
              className={`w-10 h-5 rounded-full relative transition-colors ${showStartingVerse ? 'bg-[#86B6A7]' : 'bg-gray-200'}`}
            >
              <motion.div 
                animate={{ x: showStartingVerse ? 20 : 0 }}
                className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" 
              />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Record</span>
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`w-10 h-5 rounded-full relative transition-colors ${isRecording ? 'bg-[#86B6A7]' : 'bg-gray-200'}`}
            >
              <motion.div 
                animate={{ x: isRecording ? 20 : 0 }}
                className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" 
              />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-[32px] p-8 mb-8 min-h-[300px] shadow-inner">
          <p className="text-xl font-arabic leading-[2.5] text-right text-[#1A3C34] opacity-80">
            قَالَ لَهُ مُوسَىٰ هَلْ أَتَّبِعُكَ عَلَىٰ أَن تُعَلِّمَنِ مِمَّا عُلِّمْتَ رُشْدًا (66) قَالَ إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا (67) وَكَيْفَ تَصْبِرُ عَلَىٰ مَا لَمْ تُحِطْ بِهِ خُبْرًا (68) قَالَ سَتَجِدُنِي إِن شَاءَ اللَّهُ صَابِرًا وَلَا أَعْصِي لَكَ أَمْرًا (69) قَالَ فَإِنِ اتَّبَعْتَنِي فَلَا تَسْأَلْنِي عَن شَيْءٍ حَتَّىٰ أُحْدِثَ لَكَ مِنْهُ ذِكْرًا (70) فَانطَلَقَا حَتَّىٰ إِذَا رَكِبَا فِي السَّفِينَةِ خَرَقَهَا قَالَ أَخَرَقْتَهَا لِتُغْرِقَ أَهْلَهَا لَقَدْ جِئْتَ شَيْئًا إِمْرًا (71) قَالَ أَلَمْ أَقُلْ إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا (72) قَالَ لَا تُؤَاخِذْنِي بِمَا نَسِيتُ وَلَا تُرْهِقْنِي مِنْ أَمْرِي عُسْرًا (73) فَانطَلَقَا حَتَّىٰ إِذَا لَقِيَا غُلَامًا فَقَتَلَهُ قَالَ أَقَتَلْتَ نَفْسًا زَكِيَّةً بِغَيْرِ نَفْسٍ لَّقَدْ جِئْتَ شَيْئًا نُّكْرًا (74)
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
}

function RetainResultsScreen({ onBack, onSave }: { onBack: () => void, onSave: () => void, key?: React.Key }) {
  const [mode, setMode] = useState<'record' | 'write'>('record');
  const score = 93;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-white"
    >
      <Header title="Retain Quran: Random Test" onBack={onBack} onSearchClick={() => {}} />

      <div className="px-6 py-4 overflow-y-auto pb-24">
        <div className="bg-gray-100 p-1 rounded-2xl flex mb-6">
          <button className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${mode === 'record' ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}>Record</button>
          <button className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${mode === 'write' ? 'bg-white shadow-sm text-[#1A3C34]' : 'text-gray-500'}`}>Write</button>
        </div>

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

        <div className="text-center mb-8">
          <p className="text-sm font-bold text-[#1A3C34] mb-10">Bingooooo.. You are almost there !</p>
          
          <div className="relative w-64 h-40 mx-auto">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F3F4F6" strokeWidth="10" strokeLinecap="round" />
              <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="url(#gaugeGradient)" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeDasharray="125.6" 
                strokeDashoffset={125.6 * (1 - score / 100)} 
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <motion.line 
                x1="50" y1="50" x2="50" y2="15" 
                stroke="#374151" strokeWidth="3" strokeLinecap="round"
                initial={{ rotate: -90 }}
                animate={{ rotate: (score / 100) * 180 - 90 }}
                style={{ originX: '50px', originY: '50px' }}
              />
              <circle cx="50" cy="50" r="6" fill="#9CA3AF" />
            </svg>
            <div className="absolute top-1/2 left-full -translate-y-1/2 -ml-8">
              <span className="text-4xl font-bold text-[#1A3C34]">{score}%</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
              <span>POOR</span>
              <span>GOOD</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button className="px-8 py-2 bg-[#D1E0DB] text-[#1A3C34] text-xs font-bold rounded-full shadow-sm">
            Short Summary
          </button>
        </div>

        <div className="space-y-4 mb-12">
          <ResultItem icon="ظ" label="Alphabets mistakes" value="59 / 2303" color="text-emerald-500" />
          <ResultItem icon={<Award size={20} />} label="Words mistakes" value="10 / 319" color="text-emerald-500" />
          <ResultItem icon={<Layers size={20} />} label="Most common error" value='Addition of "waw" before verses' color="text-orange-400" isTextValue />
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
}

function ResultItem({ icon, label, value, color, isTextValue }: { icon: React.ReactNode, label: string, value: string, color: string, isTextValue?: boolean }) {
  return (
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
      <span className={`text-xs font-bold ${color} ${isTextValue ? 'text-[10px] text-right max-w-[120px] leading-tight' : ''}`}>{value}</span>
    </motion.div>
  );
}

function DashboardCard({ title, subtitle, icon, color, textColor, onClick }: { title: string, subtitle: string, icon: React.ReactNode, color: string, textColor: string, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} p-6 rounded-[32px] flex flex-col items-start text-left w-full shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
    >
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center ${textColor} mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
      <p className={`text-[10px] font-bold ${textColor} opacity-60 uppercase tracking-widest`}>{subtitle}</p>
    </motion.button>
  );
}
