import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [surahs,       setSurahsState] = useState([]);
  const [surahsLoaded, setSurahsLoaded] = useState(false);
  const [bookmarks,    setBookmarks]    = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  const setSurahData = useCallback((data) => {
    setSurahsState(data);
    setSurahsLoaded(true);
  }, []);

  const addBookmark = useCallback((item) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (b) => b.surahId === item.surahId && b.ayahNumber === item.ayahNumber
      );
      return exists ? prev : [item, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((surahId, ayahNumber) => {
    setBookmarks((prev) =>
      prev.filter((b) => !(b.surahId === surahId && b.ayahNumber === ayahNumber))
    );
  }, []);

  const isBookmarked = useCallback((surahId, ayahNumber) =>
    bookmarks.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber),
  [bookmarks]);

  return (
    <AppContext.Provider value={{
      surahs, surahsLoaded, setSurahData,
      bookmarks, addBookmark, removeBookmark, isBookmarked,
      currentSession, setCurrentSession,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
