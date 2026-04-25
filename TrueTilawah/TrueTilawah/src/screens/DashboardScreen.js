import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, RefreshControl,
  Image, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BookOpen, Mic, RotateCcw, BarChart3, ArrowRight, Play, Share2 } from 'lucide-react-native';
import Header              from '../components/common/Header';
import Card                from '../components/common/Card';
import DashboardCard       from '../components/dashboard/DashboardCard';
import SearchBar           from '../components/dashboard/SearchBar';
import SearchActionModal   from '../components/layout/SearchActionModal';
import { useAuth }         from '../context/AuthContext';
import { useApp }          from '../context/AppContext';
import { quranService }    from '../services/quranService';
import { progressService } from '../services/progressService';
import { shareContent, getGreeting, getShadow } from '../utils/helpers';
import { COLORS }          from '../constants';

const CARDS = [
  { title: 'Memorize', subtitle: 'Learn Quran',  icon: BookOpen,  bgColor: '#E8F3F0', textColor: COLORS.primary, tab: 'QuranList' },
  { title: 'Recite',   subtitle: 'Voice Check',  icon: Mic,       bgColor: '#FFF5F0', textColor: '#FF7A3D',      tab: 'Recite' },
  { title: 'Retain',   subtitle: 'Memory Test',  icon: RotateCcw, bgColor: '#FFFBE8', textColor: '#E6B014',      tab: 'Retain' },
  { title: 'Track',    subtitle: 'Insights',     icon: BarChart3,  bgColor: '#F0F3FF', textColor: '#4D6BFE',      tab: 'Track' },
];

export default function DashboardScreen({ navigation }) {
  const { user }                                        = useAuth();
  const { surahs, surahsLoaded, setSurahData }          = useApp();
  const [progress,      setProgress]      = useState(null);
  const [dailyAyah,     setDailyAyah]     = useState(null);
  const [refreshing,    setRefreshing]    = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [modalVisible,  setModalVisible]  = useState(false);
  const [pending,       setPending]       = useState(null);

  const progressW = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progressW.value}%` }));

  // Local search across loaded surahs
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return surahs
      .filter(s => s.surahName?.toLowerCase().includes(q) || s.surahNameAr?.includes(searchQuery))
      .slice(0, 8)
      .map(s => ({ type: 'surah', data: s, label: s.surahName, sub: `${s.surahType} • ${s.totalAyahs} verses` }));
  }, [searchQuery, surahs]);

  const load = useCallback(async () => {
    try {
      // Load surahs if not cached
      if (!surahsLoaded) {
        const data = await quranService.getAllSurahs();
        setSurahData(data);
      }
      // Progress stats
      try {
        const prog = await progressService.getProgress();
        setProgress(prog);
        progressW.value = withSpring(prog.averageAccuracy || 0, { damping: 14 });
      } catch {}
      // Daily ayah from Al-Fatihah
      try {
        const data  = await quranService.getAyahsBySurah(1);
        const ayahs = data?.ayahs || [];
        if (ayahs.length) {
          const rand = ayahs[Math.floor(Math.random() * ayahs.length)];
          setDailyAyah({ ayah: rand, surahName: 'Al-Fatihah', surahId: 1 });
        }
      } catch {}
    } catch {}
  }, [surahsLoaded]);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const onSearchResult = (r) => {
    setSearchQuery('');
    setSearchVisible(false);
    setPending(r);
    setModalVisible(true);
  };

  const goTab = (tab) => navigation.navigate('Main', { screen: 'MainTabs', params: { screen: tab } });

  const handleMemorize = () => {
    setModalVisible(false);
    if (pending?.data?.surahNumber) {
      navigation.navigate('Detail', {
        surahNumber: pending.data.surahNumber,
        title:       pending.data.surahName,
        arabicName:  pending.data.surahNameAr,
        meta:        `${pending.data.surahType} • ${pending.data.totalAyahs} VERSES`,
      });
    }
  };

  const handleRecite = () => { setModalVisible(false); goTab('Recite'); };

  const refreshDaily = async () => {
    try {
      const data  = await quranService.getAyahsBySurah(2);
      const ayahs = (data?.ayahs || []).slice(0, 30);
      if (ayahs.length) setDailyAyah({ ayah: ayahs[Math.floor(Math.random() * ayahs.length)], surahName: 'Al-Baqarah', surahId: 2 });
    } catch {}
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <Header title="True Tilawah" onMenuClick={() => navigation.openDrawer()} onSearchClick={() => setSearchVisible(p => !p)} />

      <SearchBar visible={searchVisible} searchQuery={searchQuery} searchResults={searchResults}
        onQueryChange={setSearchQuery} onResultClick={onSearchResult} />
      <SearchActionModal visible={modalVisible} onClose={() => setModalVisible(false)}
        onMemorize={handleMemorize} onRecite={handleRecite} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={s.section}>
          <Card variant="gradient" style={s.greeting}>
            <View style={s.greetLeft}>
              <Text style={s.greetLabel}>{getGreeting()}</Text>
              <Text style={s.greetName}>{user?.fullName || 'User'}</Text>
              <TouchableOpacity style={s.trackBtn} onPress={() => goTab('Track')} activeOpacity={0.8}>
                <Text style={s.trackTxt}>Track Your Progress</Text>
                <ArrowRight size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' }}
              style={s.avatar} />
          </Card>
        </View>

        {/* Last Read */}
        <View style={s.section}>
          <View style={[s.lastRead, getShadow(2)]}>
            <View style={s.lastReadLeft}>
              <View style={s.lastReadIcon}><BookOpen size={24} color={COLORS.primary} /></View>
              <View>
                <View style={s.lastReadMeta}>
                  <Text style={s.lastReadLbl}>Last Read</Text>
                  <View style={s.dot} />
                  <Text style={s.lastReadPct}>{progress ? `${Math.round(progress.averageAccuracy || 0)}% Avg` : '0% Avg'}</Text>
                </View>
                <Text style={s.lastReadSurah}>Al-Fatihah : 1</Text>
                <View style={s.progressTrack}>
                  <Animated.View style={[s.progressFill, progressStyle]} />
                </View>
              </View>
            </View>
            <TouchableOpacity style={s.playBtn} onPress={() => goTab('Recite')}>
              <Play size={18} color={COLORS.white} fill={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feature Grid */}
        <View style={s.section}>
          <View style={s.grid}>
            {CARDS.map((c) => {
              const Ico = c.icon;
              return (
                <View key={c.title} style={s.gridCell}>
                  <DashboardCard title={c.title} subtitle={c.subtitle} icon={<Ico size={40} color={c.textColor} />}
                    bgColor={c.bgColor} textColor={c.textColor} onPress={() => goTab(c.tab)} />
                </View>
              );
            })}
          </View>
        </View>

        {/* Daily Ayah */}
        <View style={s.section}>
          <View style={s.dailyHeader}>
            <Text style={s.dailyTitle}>Daily Inspiration</Text>
            <TouchableOpacity onPress={refreshDaily}><Text style={s.shuffle}>Shuffle</Text></TouchableOpacity>
          </View>
          {dailyAyah ? (
            <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={s.dailyCard}>
              <View style={s.dailyBg}><BookOpen size={120} color={COLORS.white} /></View>
              <View style={s.dailyContent}>
                <View style={s.dailyBadge}><Text style={s.dailyBadgeText}>{dailyAyah.surahName} : {dailyAyah.ayah?.ayahNumber}</Text></View>
                <Text style={s.dailyArabic}>{dailyAyah.ayah?.uthmaniText || ''}</Text>
                <Text style={s.dailyTrans}>"{dailyAyah.ayah?.translationEn || ''}"</Text>
                <View style={s.dailyActions}>
                  <TouchableOpacity style={s.learnBtn} onPress={() => navigation.navigate('Detail', { surahNumber: dailyAyah.surahId })} activeOpacity={0.85}>
                    <Text style={s.learnText}>Learn This Verse</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.shareBtn} onPress={() => shareContent(`${dailyAyah.surahName}`, `${dailyAyah.ayah?.uthmaniText}\n\n${dailyAyah.ayah?.translationEn}`)}>
                    <Share2 size={18} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <View style={s.dailyPlaceholder}><Text style={s.dailyPlaceholderText}>Loading daily verse...</Text></View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:            { flex: 1, backgroundColor: COLORS.background },
  scroll:            { flex: 1 },
  content:           { paddingBottom: 24 },
  section:           { paddingHorizontal: 24, marginTop: 16 },
  greeting:          { overflow: 'hidden' },
  greetLeft:         { flex: 1 },
  greetLabel:        { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  greetName:         { fontSize: 24, fontWeight: '700', color: COLORS.white, marginBottom: 16 },
  trackBtn:          { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  trackTxt:          { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  avatar:            { width: 86, height: 86, borderRadius: 43, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  lastRead:          { backgroundColor: COLORS.white, borderRadius: 28, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.gray100 },
  lastReadLeft:      { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  lastReadIcon:      { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.secondaryUltraLight, alignItems: 'center', justifyContent: 'center' },
  lastReadMeta:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  lastReadLbl:       { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  dot:               { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.gray300 },
  lastReadPct:       { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  lastReadSurah:     { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 8 },
  progressTrack:     { width: 110, height: 4, backgroundColor: COLORS.gray100, borderRadius: 2, overflow: 'hidden' },
  progressFill:      { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  playBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  grid:              { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  gridCell:          { width: '47%' },
  dailyHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  dailyTitle:        { fontSize: 12, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  shuffle:           { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase' },
  dailyCard:         { borderRadius: 28, padding: 26, overflow: 'hidden', position: 'relative' },
  dailyBg:           { position: 'absolute', top: -20, right: -20, opacity: 0.08 },
  dailyContent:      { position: 'relative', zIndex: 1 },
  dailyBadge:        { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', marginBottom: 16 },
  dailyBadgeText:    { fontSize: 10, fontWeight: '700', color: COLORS.white, textTransform: 'uppercase', letterSpacing: 0.5 },
  dailyArabic:       { fontSize: 22, color: COLORS.white, textAlign: 'right', lineHeight: 46, marginBottom: 14, writingDirection: 'rtl' },
  dailyTrans:        { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, fontStyle: 'italic', marginBottom: 22 },
  dailyActions:      { flexDirection: 'row', gap: 12 },
  learnBtn:          { flex: 1, backgroundColor: COLORS.white, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  learnText:         { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  shareBtn:          { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  dailyPlaceholder:  { height: 160, borderRadius: 28, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center' },
  dailyPlaceholderText: { color: COLORS.gray400, fontSize: 14 },
});
