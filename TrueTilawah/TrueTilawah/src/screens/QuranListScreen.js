import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, RefreshControl,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';
import Header    from '../components/common/Header';
import SearchBar from '../components/dashboard/SearchBar';
import { quranService } from '../services/quranService';
import { useApp }  from '../context/AppContext';
import { COLORS }  from '../constants';

const TABS = ['Surah', 'Para', 'Page', 'Hizb'];

const PARA_NAMES = ['Alif Lam Meem','Sayaqool','Tilkal Rusull','Lan Tanaloo','Wal Mohsanat','La Yuhibbullah','Wa Iza Samiu','Walau Annana','Qalal Malao',"Wa'lamu","Ya'taziroon","Wa Ma Min Da'abbatin","Wa Ma Ubabri'u",'Rubama','Subhanallazi','Qal Alam','Iqtaraba','Qad Aflaha','Wa Qalallazina','Aman Khalaqa','Utlu Ma Oohiya','Wa Manyaqnut','Wa Mali','Faman Azlam','Elahe Yuruddo','Ha Meem','Qala Fama Khatbukum','Qad Sami Allah','Tabarakallazi','Amma'];
const PARAS = PARA_NAMES.map((n, i) => ({ id: i + 1, surahName: n, surahNameAr: `الجزء ${i + 1}`, surahType: 'Para', totalAyahs: 200 + ((i * 7) % 50) }));
const PAGES = Array.from({ length: 604 }, (_, i) => ({ id: i + 1, surahName: `Page ${i + 1}`, surahNameAr: `صفحة ${i + 1}`, surahType: 'Page', totalAyahs: 5 + (i % 15) }));
const HIZBS = Array.from({ length: 60  }, (_, i) => ({ id: i + 1, surahName: `Hizb ${i + 1}`,  surahNameAr: `حزب ${i + 1}`,   surahType: 'Hizb', totalAyahs: 100 + ((i * 3) % 50) }));

function Row({ item, onPress }) {
  const num = item.surahNumber || item.id;
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7}>
      <View style={s.rowLeft}>
        <View style={s.numBox}><Text style={s.numText}>{num}</Text></View>
        <View>
          <Text style={s.rowName}>{item.surahName}</Text>
          <Text style={s.rowMeta}>{item.surahType} • {item.totalAyahs} Ayahs</Text>
        </View>
      </View>
      <Text style={s.rowAr}>{item.surahNameAr}</Text>
    </TouchableOpacity>
  );
}

export default function QuranListScreen({ navigation }) {
  const { surahs, surahsLoaded, setSurahData } = useApp();
  const [tab,           setTab]           = useState('Surah');
  const [searchVisible, setSearchVisible] = useState(false);
  const [query,         setQuery]         = useState('');
  const [loading,       setLoading]       = useState(!surahsLoaded);
  const [refreshing,    setRefreshing]    = useState(false);

  useEffect(() => { if (!surahsLoaded) loadSurahs(); }, []);

  const loadSurahs = async () => {
    try { setLoading(true); const d = await quranService.getAllSurahs(); setSurahData(d); }
    catch (e) { console.warn('QuranList:', e.message); }
    finally { setLoading(false); }
  };

  const onRefresh = async () => { setRefreshing(true); await loadSurahs(); setRefreshing(false); };

  const data = useMemo(() => {
    const q = query.toLowerCase();
    const filterFn = (it) => !q || it.surahName?.toLowerCase().includes(q) || it.surahNameAr?.includes(query);
    switch (tab) {
      case 'Surah': return q ? surahs.filter(filterFn) : surahs;
      case 'Para':  return q ? PARAS.filter(filterFn)  : PARAS;
      case 'Page':  return q ? PAGES.filter(it => it.surahName.toLowerCase().includes(q)) : PAGES;
      case 'Hizb':  return q ? HIZBS.filter(filterFn)  : HIZBS;
      default: return surahs;
    }
  }, [tab, surahs, query]);

  const onPress = useCallback((item) => {
    if (tab === 'Surah') {
      navigation.navigate('Detail', {
        surahNumber: item.surahNumber,
        title:       item.surahName,
        arabicName:  item.surahNameAr,
        meta:        `${item.surahType} • ${item.totalAyahs} VERSES`,
      });
    }
  }, [tab, navigation]);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <Header title="True Tilawah" onBack={() => navigation.navigate('Dashboard')} onSearchClick={() => setSearchVisible(p => !p)} />

      <SearchBar visible={searchVisible} searchQuery={query} searchResults={[]}
        placeholder={`Search ${tab}...`} onQueryChange={setQuery} onResultClick={() => {}} />

      {/* Banner */}
      <View style={s.bannerWrap}>
        <LinearGradient colors={[COLORS.secondary, COLORS.secondaryMedium]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.banner}>
          <View>
            <View style={s.bannerMeta}><BookOpen size={14} color="rgba(255,255,255,0.9)" /><Text style={s.bannerMetaTxt}>Last Read</Text></View>
            <Text style={s.bannerTitle}>Al-Fatihah</Text>
            <Text style={s.bannerSub}>Ayah No: 1</Text>
          </View>
          <BookOpen size={60} color="rgba(255,255,255,0.2)" />
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={s.tabRow}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={s.tabItem} onPress={() => setTab(t)}>
            <Text style={[s.tabTxt, tab === t && s.tabTxtActive]}>{t}</Text>
            {tab === t && <View style={s.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <View style={s.loader}><ActivityIndicator size="large" color={COLORS.primary} /></View>
        : <FlatList
            data={data}
            keyExtractor={it => String(it.surahNumber || it.id)}
            renderItem={({ item }) => <Row item={item} onPress={() => onPress(item)} />}
            contentContainerStyle={s.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
            initialNumToRender={20}
            maxToRenderPerBatch={30}
            windowSize={10}
            showsVerticalScrollIndicator={false}
          />
      }
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.white },
  bannerWrap:   { paddingHorizontal: 24, paddingVertical: 14 },
  banner:       { borderRadius: 26, padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerMeta:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  bannerMetaTxt:{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
  bannerTitle:  { fontSize: 20, fontWeight: '700', color: COLORS.white },
  bannerSub:    { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  tabRow:       { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  tabItem:      { flex: 1, alignItems: 'center', paddingVertical: 15, position: 'relative' },
  tabTxt:       { fontSize: 14, fontWeight: '700', color: COLORS.gray400 },
  tabTxtActive: { color: COLORS.primary },
  tabIndicator: { position: 'absolute', bottom: 0, left: 10, right: 10, height: 3, backgroundColor: COLORS.primary, borderRadius: 2 },
  list:         { paddingHorizontal: 24, paddingTop: 6, paddingBottom: 120 },
  loader:       { flex: 1, alignItems: 'center', justifyContent: 'center' },
  row:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  rowLeft:      { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  numBox:       { width: 38, height: 38, borderRadius: 8, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '45deg' }] },
  numText:      { fontSize: 12, fontWeight: '700', color: COLORS.primary, transform: [{ rotate: '-45deg' }] },
  rowName:      { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  rowMeta:      { fontSize: 10, color: COLORS.gray400, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2 },
  rowAr:        { fontSize: 18, color: COLORS.primary },
});
