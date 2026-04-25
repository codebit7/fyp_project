import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCw, ChevronLeft } from 'lucide-react-native';
import Header from '../components/common/Header';
import { COLORS } from '../constants';

function ModeTab({ mode, onChange }) {
  return (
    <View style={s.modeTabs}>
      {['record', 'write'].map(m => (
        <TouchableOpacity key={m} style={[s.modeTab, mode === m && s.modeTabActive]} onPress={() => onChange(m)}>
          <Text style={[s.modeTabTxt, mode === m && s.modeTabTxtActive]}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RetainTestScreen({ navigation }) {
  const [mode,       setMode]       = useState('record');
  const [showStart,  setShowStart]  = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <Header title="Retain Quran: Random Test" onBack={() => navigation.goBack()} showSearch={false} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <ModeTab mode={mode} onChange={setMode} />

        {/* Surah Selector */}
        <View style={s.surahSel}>
          <TouchableOpacity style={s.shuffleBtn}><RefreshCw size={24} color={COLORS.primary} /></TouchableOpacity>
          <View style={s.surahNameRow}>
            <Text style={s.surahAr}>الكهف</Text>
            <ChevronLeft size={20} color={COLORS.gray400} style={{ transform: [{ rotate: '-90deg' }] }} />
          </View>
          <View style={s.verseBadge}><Text style={s.verseBadgeTxt}>Verses 66 – 88</Text></View>
        </View>

        {/* Toggles */}
        <View style={s.toggleRow}>
          <View style={s.toggleItem}>
            <Text style={s.toggleLbl}>Show starting verse</Text>
            <Switch value={showStart} onValueChange={setShowStart} trackColor={{ false: COLORS.gray200, true: COLORS.secondary }} thumbColor={COLORS.white} />
          </View>
          <View style={s.toggleItem}>
            <Text style={s.toggleLbl}>Record</Text>
            <Switch value={isRecording} onValueChange={setIsRecording} trackColor={{ false: COLORS.gray200, true: COLORS.secondary }} thumbColor={COLORS.white} />
          </View>
        </View>

        {/* Verse Display */}
        <View style={s.verseBox}>
          <Text style={s.verseTxt}>
            قَالَ لَهُ مُوسَىٰ هَلْ أَتَّبِعُكَ عَلَىٰ أَن تُعَلِّمَنِ مِمَّا عُلِّمْتَ رُشْدًا (66) قَالَ إِنَّكَ لَن تَسْتَطِيعَ مَعِيَ صَبْرًا (67) وَكَيْفَ تَصْبِرُ عَلَىٰ مَا لَمْ تُحِطْ بِهِ خُبْرًا (68) قَالَ سَتَجِدُنِي إِن شَاءَ اللَّهُ صَابِرًا وَلَا أَعْصِي لَكَ أَمْرًا (69)
          </Text>
        </View>

        <TouchableOpacity style={s.scoreBtn} onPress={() => navigation.navigate('RetainResults')} activeOpacity={0.85}>
          <Text style={s.scoreBtnTxt}>Click to see your score</Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: COLORS.white },
  content:        { padding: 24 },
  modeTabs:       { flexDirection: 'row', backgroundColor: COLORS.gray100, borderRadius: 16, padding: 4, marginBottom: 24 },
  modeTab:        { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center' },
  modeTabActive:  { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  modeTabTxt:     { fontSize: 15, fontWeight: '700', color: COLORS.gray500, textTransform: 'capitalize' },
  modeTabTxtActive:{ color: COLORS.primary },
  surahSel:       { alignItems: 'center', gap: 12, marginBottom: 22 },
  shuffleBtn:     { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center' },
  surahNameRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  surahAr:        { fontSize: 28, color: COLORS.primary },
  verseBadge:     { backgroundColor: COLORS.secondaryUltraLight, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  verseBadgeTxt:  { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  toggleRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  toggleItem:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleLbl:      { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  verseBox:       { backgroundColor: COLORS.gray100, borderRadius: 26, padding: 26, minHeight: 190, marginBottom: 22, justifyContent: 'center' },
  verseTxt:       { fontSize: 18, textAlign: 'right', color: `${COLORS.primary}CC`, lineHeight: 40, writingDirection: 'rtl' },
  scoreBtn:       { backgroundColor: COLORS.secondaryLight, borderRadius: 26, paddingVertical: 15, alignItems: 'center' },
  scoreBtnTxt:    { fontSize: 15, fontWeight: '700', color: COLORS.primary },
});
