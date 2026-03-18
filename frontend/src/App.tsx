/**
 * App.tsx — Root component / View Orchestrator
 *
 * Responsibilities:
 *  - Holds top-level navigation state (via useNavigation controller)
 *  - Manages selected Quran entities (Surah, Para, Page, Hizb)
 *  - Handles search-action flow (select result → choose action modal)
 *  - Renders the correct screen and persistent layout chrome (sidebar, bottom nav)
 */

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';

// Controllers
import { useNavigation } from './controllers/useNavigation';

// Models
import { Surah, Para, Page, Hizb, SearchResult } from './models/types';
import { SURAHS } from './data/quranData';

// Layout components
import { Sidebar }           from './views/components/layout/Sidebar';
import { BottomNav }         from './views/components/layout/BottomNav';
import { SearchActionModal } from './views/components/layout/SearchActionModal';

// Screens
import { OnboardingScreen }   from './views/screens/OnboardingScreen';
import { AuthScreen }         from './views/screens/AuthScreen';
import { DashboardScreen }    from './views/screens/DashboardScreen';
import { QuranListScreen }    from './views/screens/QuranListScreen';
import { DetailScreen }       from './views/screens/DetailScreen';
import { ReciteScreen }       from './views/screens/ReciteScreen';
import { TrackScreen }        from './views/screens/TrackScreen';
import { RetainScreen, RetainTestScreen, RetainResultsScreen } from './views/screens/RetainScreens';
import { BookmarksScreen, ProfileScreen, SettingsScreen, HelpScreen } from './views/screens/SecondaryScreens';

export default function App() {
  // ─── Navigation ─────────────────────────────────────────────────────────────
  const { currentScreen, navigate, isSidebarOpen, openSidebar, closeSidebar } = useNavigation('onboarding');

  // ─── Selected entities ───────────────────────────────────────────────────────
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedPara,  setSelectedPara]  = useState<Para  | null>(null);
  const [selectedPage,  setSelectedPage]  = useState<Page  | null>(null);
  const [selectedHizb,  setSelectedHizb]  = useState<Hizb  | null>(null);

  // ─── Search action modal ─────────────────────────────────────────────────────
  const [pendingSearchResult, setPendingSearchResult] = useState<SearchResult | null>(null);
  const isSearchModalOpen = pendingSearchResult !== null;

  /** Called when user clicks a search result – store it and open the action modal */
  const handleSearchResultSelect = (result: SearchResult) => {
    setPendingSearchResult(result);
  };

  /** User chose "Memorize" from the modal */
  const handleMemorize = () => {
    if (!pendingSearchResult) return;
    const { type, data } = pendingSearchResult;

    if (type === 'surah') {
      setSelectedSurah(data as Surah);
      navigate('surah_detail');
    } else if (type === 'para') {
      setSelectedPara(data as Para);
      navigate('para_detail');
    } else if (type === 'page') {
      setSelectedPage(data as Page);
      navigate('page_detail');
    } else if (type === 'hizb') {
      setSelectedHizb(data as Hizb);
      navigate('hizb_detail');
    } else if (type === 'ayah') {
      // Navigate to the surah that contains this ayah
      const surahId = (data as any).surahId as number;
      const surah = SURAHS.find((s) => s.id === surahId);
      if (surah) {
        setSelectedSurah(surah);
        navigate('surah_detail');
      }
    }

    setPendingSearchResult(null);
  };

  /** User chose "Recite" from the modal */
  const handleRecite = () => {
    navigate('recite');
    setPendingSearchResult(null);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F7F8] text-[#1A3C34] font-sans selection:bg-[#1A3C34]/10">
      <div className="max-w-lg mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col">

        {/* ── Global overlays ── */}
        <SearchActionModal
          isOpen={isSearchModalOpen}
          onClose={() => setPendingSearchResult(null)}
          onMemorize={handleMemorize}
          onRecite={handleRecite}
        />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onNavigate={navigate}
        />

        {/* ── Screen router ── */}
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
              onNavigate={navigate}
              onMenuClick={openSidebar}
              onSearchResultSelect={handleSearchResultSelect}
            />
          )}

          {currentScreen === 'quran_list' && (
            <QuranListScreen
              key="quran_list"
              onBack={() => navigate('dashboard')}
              onSelectSurah={(surah) => { setSelectedSurah(surah); navigate('surah_detail'); }}
              onSelectPara={(para)   => { setSelectedPara(para);   navigate('para_detail');  }}
              onSelectPage={(page)   => { setSelectedPage(page);   navigate('page_detail');  }}
              onSelectHizb={(hizb)   => { setSelectedHizb(hizb);   navigate('hizb_detail');  }}
            />
          )}

          {currentScreen === 'surah_detail' && selectedSurah && (
            <DetailScreen
              key="surah_detail"
              title={selectedSurah.name}
              subtitle="The Opening"
              meta={`${selectedSurah.type} • ${selectedSurah.versesCount} VERSES`}
              arabicName={selectedSurah.arabicName}
              ayats={selectedSurah.ayats}
              onBack={() => navigate('quran_list')}
            />
          )}

          {currentScreen === 'para_detail' && selectedPara && (
            <DetailScreen
              key="para_detail"
              title={selectedPara.name}
              subtitle={selectedPara.surahRange}
              meta={`${selectedPara.ayatsCount} AYATS`}
              arabicName={selectedPara.arabicName}
              ayats={selectedPara.ayats}
              onBack={() => navigate('quran_list')}
            />
          )}

          {currentScreen === 'page_detail' && selectedPage && (
            <DetailScreen
              key="page_detail"
              title={selectedPage.name}
              subtitle={selectedPage.surahName}
              meta={`${selectedPage.ayatsCount} AYATS`}
              arabicName={selectedPage.arabicName}
              ayats={selectedPage.ayats}
              onBack={() => navigate('quran_list')}
            />
          )}

          {currentScreen === 'hizb_detail' && selectedHizb && (
            <DetailScreen
              key="hizb_detail"
              title={selectedHizb.name}
              subtitle={selectedHizb.surahRange}
              meta={`${selectedHizb.ayatsCount} AYATS`}
              arabicName={selectedHizb.arabicName}
              ayats={selectedHizb.ayats}
              onBack={() => navigate('quran_list')}
            />
          )}

          {currentScreen === 'recite' && (
            <ReciteScreen key="recite" onBack={() => navigate('dashboard')} />
          )}

          {currentScreen === 'track' && (
            <TrackScreen key="track" onBack={() => navigate('dashboard')} />
          )}

          {currentScreen === 'retain' && (
            <RetainScreen key="retain" onBack={() => navigate('dashboard')} onNavigate={navigate} />
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

        {/* ── Persistent bottom nav ── */}
        <BottomNav currentScreen={currentScreen} onNavigate={navigate} />

      </div>
    </div>
  );
}
