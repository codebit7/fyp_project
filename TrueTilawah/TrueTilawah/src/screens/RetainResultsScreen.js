import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Bookmark, Layers } from 'lucide-react-native';
import Header from '../components/common/Header';
import { COLORS } from '../constants';

function ResultRow({ icon, label, value, valueColor, small }) {
  return (
    <View style={s.resultRow}>
      <View style={s.resultLeft}>
        <View style={s.resultIcon}>
          {typeof icon === 'string'
            ? <Text style={s.resultIconTxt}>{icon}</Text>
            : icon
          }
        </View>
        <Text style={s.resultLabel}>{label}</Text>
      </View>
      <Text style={[s.resultValue, { color: valueColor }, small && s.resultValueSmall]}>{value}</Text>
    </View>
  );
}

export default function RetainResultsScreen({ navigation }) {
  const score    = 93;
  const dashOff  = 125.6 * (1 - score / 100);

  return (
    <SafeAreaView style={s.screen} edges={['top', 'bottom']}>
      <Header title="Retain Quran: Random Test" onBack={() => navigation.goBack()} showSearch={false} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Mode tabs static */}
        <View style={s.modeTabs}>
          <View style={s.modeTabActive}><Text style={s.modeTabTxtActive}>Record</Text></View>
          <View style={s.modeTab}><Text style={s.modeTabTxt}>Write</Text></View>
        </View>

        <Text style={s.congrats}>Bingo! You are almost there!</Text>

        {/* Score Gauge */}
        <View style={s.gaugeWrap}>
          <Svg width={240} height={140} viewBox="0 0 100 60">
            <Path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={COLORS.gray100} strokeWidth={10} strokeLinecap="round" />
            <Path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={COLORS.green} strokeWidth={10} strokeLinecap="round"
              strokeDasharray="125.6" strokeDashoffset={dashOff} />
            <Line x1="50" y1="50" x2="50" y2="15" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="50" cy="50" r="6" fill="#9CA3AF" />
          </Svg>
          <Text style={s.scoreText}>{score}%</Text>
          <View style={s.scaleRow}>
            <Text style={s.scaleTxt}>POOR</Text>
            <Text style={s.scaleTxt}>GOOD</Text>
          </View>
        </View>

        <View style={s.summaryBtn}><Text style={s.summaryTxt}>Short Summary</Text></View>

        {/* Results */}
        <View style={s.results}>
          <ResultRow icon="ظ"  label="Alphabets mistakes"  value="59 / 2303" valueColor={COLORS.green} />
          <ResultRow icon={<Layers size={18} color={COLORS.gray600} />} label="Words mistakes" value="10 / 319" valueColor={COLORS.green} />
          <ResultRow icon={<Layers size={18} color={COLORS.gray600} />} label="Most common error" value='Addition of "waw" before verses' valueColor={COLORS.orange} small />
        </View>

        <TouchableOpacity style={s.saveBtn}
          onPress={() => navigation.navigate('Main', { screen: 'MainTabs', params: { screen: 'Retain' } })}
          activeOpacity={0.85}>
          <Bookmark size={20} color={COLORS.primary} fill={COLORS.primary} />
          <Text style={s.saveTxt}>Save your progress</Text>
        </TouchableOpacity>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:           { flex: 1, backgroundColor: COLORS.white },
  content:          { padding: 24 },
  modeTabs:         { flexDirection: 'row', backgroundColor: COLORS.gray100, borderRadius: 16, padding: 4, marginBottom: 22 },
  modeTab:          { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center' },
  modeTabActive:    { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  modeTabTxt:       { fontSize: 15, fontWeight: '700', color: COLORS.gray500 },
  modeTabTxtActive: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  congrats:         { fontSize: 14, fontWeight: '700', color: COLORS.primary, textAlign: 'center', marginBottom: 18 },
  gaugeWrap:        { alignItems: 'center', marginBottom: 22 },
  scoreText:        { fontSize: 34, fontWeight: '700', color: COLORS.primary, textAlign: 'center', marginTop: -12 },
  scaleRow:         { flexDirection: 'row', justifyContent: 'space-between', width: 240, paddingHorizontal: 8, marginTop: 4 },
  scaleTxt:         { fontSize: 9, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryBtn:       { alignSelf: 'center', backgroundColor: COLORS.secondaryLight, borderRadius: 20, paddingHorizontal: 28, paddingVertical: 10, marginBottom: 24 },
  summaryTxt:       { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  results:          { gap: 14, marginBottom: 28 },
  resultRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.gray100 },
  resultLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultIcon:       { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.gray100, alignItems: 'center', justifyContent: 'center' },
  resultIconTxt:    { fontSize: 16, color: COLORS.gray600 },
  resultLabel:      { fontSize: 12, fontWeight: '700', color: COLORS.gray600 },
  resultValue:      { fontSize: 12, fontWeight: '700' },
  resultValueSmall: { fontSize: 10, maxWidth: 130, textAlign: 'right' },
  saveBtn:          { backgroundColor: COLORS.secondaryLight, borderRadius: 26, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  saveTxt:          { fontSize: 15, fontWeight: '700', color: COLORS.primary },
});
