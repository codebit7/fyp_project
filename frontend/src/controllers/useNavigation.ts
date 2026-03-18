import { useState } from 'react';
import { Screen } from '../models/types';

interface NavigationState {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

/**
 * useNavigation
 *
 * Centralises all screen-transition logic and sidebar visibility.
 * Navigating always closes the sidebar automatically.
 */
export const useNavigation = (initialScreen: Screen = 'onboarding'): NavigationState => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  };

  return {
    currentScreen,
    navigate,
    isSidebarOpen,
    openSidebar: () => setIsSidebarOpen(true),
    closeSidebar: () => setIsSidebarOpen(false),
  };
};
