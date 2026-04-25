import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Share2 } from 'lucide-react-native';
import Header   from '../components/common/Header';
import AyahItem from '../components/quran/AyahItem';
import { quranService } from '../services/quranService';
import { shareContent }  from '../utils/helpers';
import { COLORS } from '../constants';

export default function DetailScreen({ navigation, route }) {
  const { surahNumber, title, arabicName, meta } = route.params || {};
  const [ayahs,   setAyahs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [info,    setInfo]    = useState(null);

  useEffect(() => { if (surahNumber) fetchAyahs(); }, [surahNumber]);

  const fetchAyahs = async () => {
    try {
      setLoading(true);
      const data = await quranService.getAyahsBySurah(surahNumber);
      setInfo(data);
      setAyahs(data?.ayahs || []);
    } catch (e) { console.warn('DetailScreen:', e.message); }
    finally { setLoading(false); }
  };

  const displayTitle  = title      || info?.surahName    || '...';
  const displayAr     = arabicName || info?.surahNameAr  || '';
  const displayMeta   = meta       || (info ? `${info.surahType} • ${info.totalAyahs} VERSES` : '');

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <Header title={displayTitle} onBack={() => navigation.goBack()} showSearch={false}
        rightElement={
          <TouchableOpacity style={s.shareBtn} onPress={() => shareContent(displayTitle, `Read ${displayTitle} on True Tilawah`)} hitSlop={8}>
            <Share2 size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={ayahs}
        keyExtractor={it => String(it.id || it.ayahNumber)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <View style={s.bannerWrap}>
            <LinearGradient colors={[COLORS.secondary, COLORS.secondaryMedium]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.banner}>
              <Text style={s.bannerTitle}>{displayTitle}</Text>
              <View style={s.bannerDiv} />
              <Text style={s.bannerMeta}>{displayMeta}</Text>
              <Text style={s.bannerAr}>{displayAr}</Text>
            </LinearGradient>
          </View>
        }
        ListEmptyComponent={
          <View style={s.center}>
            {loading
              ? <ActivityIndicator size="large" color={COLORS.primary} />
              : <Text style={s.emptyTxt}>No ayahs found</Text>
            }
          </View>
        }
        renderItem={({ item }) => (
          <AyahItem ayah={item} surahId={surahNumber} surahName={displayTitle} />
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.background },
  shareBtn:    { padding: 8, borderRadius: 20 },
  list:        { paddingHorizontal: 24, paddingBottom: 100 },
  bannerWrap:  { marginBottom: 24 },
  banner:      { borderRadius: 30, padding: 32, alignItems: 'center' },
  bannerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.white, marginBottom: 8 },
  bannerDiv:   { width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12 },
  bannerMeta:  { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 },
  bannerAr:    { fontSize: 26, color: COLORS.white, textAlign: 'center', lineHeight: 50 },
  center:      { paddingTop: 60, alignItems: 'center' },
  emptyTxt:    { fontSize: 15, color: COLORS.gray400 },
});
