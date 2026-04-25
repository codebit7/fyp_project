import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, RefreshControl,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { Clock, Zap, BookOpen, Mic, Share2 } from 'lucide-react-native';
import Header from '../components/common/Header';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';
import { shareContent, getShadow } from '../utils/helpers';
import { COLORS } from '../constants';

function StatPill({ icon, value, label, bg }) {
  return (
    <View style={s.statPill}>
      <View style={[s.statIcon, { backgroundColor: bg }]}>{icon}</View>
      <Text style={s.statVal}>{value}</Text>
      <Text style={s.statLbl}>{label}</Text>
    </View>
  );
}

function AccuracyRing({ pct = 0 }) {
  const r = 40; const circ = 2 * Math.PI * r;
  return (
    <View style={s.ringWrap}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r={r} fill="none" stroke={COLORS.gray100} strokeWidth={10} />
        <Circle cx="50" cy="50" r={r} fill="none" stroke={COLORS.primary} strokeWidth={10}
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" transform="rotate(-90 50 50)" />
      </Svg>
      <View style={s.ringCenter}><Text style={s.ringVal}>{Math.round(pct)}%</Text></View>
    </View>
  );
}

function Bar({ value, index }) {
  const h = useSharedValue(0);
  useEffect(() => { h.value = withTiming(Math.max(4, value), { duration: 600 + index * 80 }); }, []);
  const barStyle = useAnimatedStyle(() => ({ height: `${h.value}%` }));
  return (
    <View style={s.barWrap}>
      <View style={s.barTrack}>
        <Animated.View style={[s.barFill, barStyle]} />
      </View>
      <Text style={s.barLbl}>D{index + 1}</Text>
    </View>
  );
}

function FocusCard({ title, level, prog, barColor }) {
  const w = useSharedValue(0);
  useEffect(() => { w.value = withSpring(prog, { damping: 14 }); }, []);
  const fillStyle = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={[s.focusCard, getShadow(1)]}>
      <View style={s.focusLeft}>
        <View style={s.focusIcon}><Mic size={22} color="#4D6BFE" /></View>
        <View>
          <Text style={s.focusTitle}>{title}</Text>
          <Text style={s.focusMeta}>Priority: {level}</Text>
        </View>
      </View>
      <View style={s.focusRight}>
        <View style={s.focusBarMeta}><Text style={s.focusStrength}>STRENGTH</Text><Text style={s.focusPct}>{prog}%</Text></View>
        <View style={s.focusTrack}><Animated.View style={[s.focusFill, { backgroundColor: barColor }, fillStyle]} /></View>
      </View>
    </View>
  );
}

export default function TrackScreen({ navigation }) {
  const { user } = useAuth();
  const [progress,   setProgress]   = useState(null);
  const [trend,      setTrend]      = useState([]);
  const [errors,     setErrors]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const bars = trend.length
    ? trend.slice(-7).map(t => t.accuracyScore || 0)
    : [40, 65, 45, 90, 35, 75, 85];

  const load = async () => {
    try {
      const [prog, trendData, errData] = await Promise.all([
        progressService.getProgress(),
        progressService.getAccuracyTrend(7),
        progressService.getErrorSummary(),
      ]);
      setProgress(prog); setTrend(trendData || []); setErrors(errData || []);
    } catch (e) { console.warn('Track:', e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  if (loading) return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <Header title="My Progress" onBack={() => navigation.goBack()} showSearch={false} />
      <View style={s.loader}><ActivityIndicator size="large" color={COLORS.primary} /></View>
    </SafeAreaView>
  );

  const acc    = progress?.averageAccuracy || 0;
  const streak = progress?.dailyStreak     || 0;
  const sessions = progress?.totalSessions || 0;

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <Header title="My Progress" onBack={() => navigation.goBack()} showSearch={false}
        rightElement={
          <TouchableOpacity style={s.shareBtn} onPress={() => shareContent('My Progress', 'Check out my Quran recitation progress!')} hitSlop={8}>
            <Share2 size={24} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={s.scroll} contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <View style={[s.profileCard, getShadow(4)]}>
          <View style={s.profileTop}>
            <View style={s.avatarPlaceholder} />
            <View>
              <Text style={s.profileName}>{user?.fullName || 'User'}</Text>
              <View style={s.levelBadge}><Text style={s.levelText}>Beginner Student</Text></View>
            </View>
          </View>
          <View style={s.statsRow}>
            <StatPill icon={<Clock size={20} color="#3B82F6" />} value={`${Math.round((progress?.totalTimeMin || 0) / 60 * 10) / 10}h`} label="Time" bg="#EFF6FF" />
            <StatPill icon={<Zap   size={20} color="#F97316" />} value={String(streak)}   label="Streak"   bg="#FFF7ED" />
            <StatPill icon={<BookOpen size={20} color="#10B981" />} value={String(sessions)} label="Sessions" bg="#ECFDF5" />
          </View>
        </View>

        <Text style={s.sectionLbl}>Learning Stats</Text>
        <View style={s.statsCards}>
          <View style={[s.statsCard, getShadow(1)]}>
            <Text style={s.statsCardLbl}>Accuracy</Text>
            <AccuracyRing pct={acc} />
          </View>
          <View style={[s.statsCard, getShadow(1)]}>
            <Text style={s.statsCardLbl}>Weekly Target</Text>
            <Text style={s.weeklyDays}>{Math.min(7, sessions)} / 7 Days</Text>
            <View style={s.weeklyTrack}>
              <View style={[s.weeklyFill, { width: `${Math.min(100, (sessions / 7) * 100)}%` }]} />
            </View>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={[s.chartCard, getShadow(1)]}>
          <View style={s.chartHeader}>
            <Text style={s.chartLbl}>Memorization Flow</Text>
            <View style={s.chartBadge}><Text style={s.chartBadgeTxt}>Last 7 Days</Text></View>
          </View>
          <View style={s.chart}>
            {bars.map((h, i) => <Bar key={i} value={h} index={i} />)}
          </View>
        </View>

        <Text style={s.sectionLbl}>Focus Areas</Text>
        <View style={s.focusSection}>
          {errors.length
            ? errors.slice(0, 3).map((e, i) => (
                <FocusCard key={i} title={e.errorType?.replace(/_/g, ' ') || 'Error'}
                  level={['High','Medium','Low'][i]} prog={Math.max(10, 85 - i * 25)}
                  barColor={['#EF4444','#F97316','#EAB308'][i]} />
              ))
            : <>
                <FocusCard title="Ghunnah"  level="High"   prog={85} barColor="#EF4444" />
                <FocusCard title="Madd"     level="Medium" prog={60} barColor="#F97316" />
                <FocusCard title="Qalqalah" level="Low"    prog={30} barColor="#EAB308" />
              </>
          }
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: COLORS.backgroundLight },
  scroll:        { flex: 1 },
  content:       { padding: 24 },
  shareBtn:      { padding: 8, borderRadius: 20 },
  loader:        { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileCard:   { backgroundColor: COLORS.white, borderRadius: 34, padding: 26, marginBottom: 20, borderWidth: 1, borderColor: COLORS.gray100 },
  profileTop:    { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 22 },
  avatarPlaceholder: { width: 68, height: 68, borderRadius: 34, backgroundColor: COLORS.secondaryLight },
  profileName:   { fontSize: 22, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  levelBadge:    { backgroundColor: COLORS.secondaryUltraLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  levelText:     { fontSize: 10, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  statsRow:      { flexDirection: 'row', justifyContent: 'space-between' },
  statPill:      { alignItems: 'center', gap: 5 },
  statIcon:      { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  statVal:       { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  statLbl:       { fontSize: 9, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionLbl:    { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  statsCards:    { flexDirection: 'row', gap: 14, marginBottom: 18 },
  statsCard:     { flex: 1, backgroundColor: COLORS.white, borderRadius: 26, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: COLORS.gray100 },
  statsCardLbl:  { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, alignSelf: 'flex-start' },
  ringWrap:      { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ringCenter:    { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ringVal:       { fontSize: 18, fontWeight: '700', color: COLORS.primary },
  weeklyDays:    { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: 14 },
  weeklyTrack:   { width: '100%', height: 5, backgroundColor: COLORS.gray100, borderRadius: 3, overflow: 'hidden' },
  weeklyFill:    { height: 5, backgroundColor: COLORS.primary, borderRadius: 3 },
  chartCard:     { backgroundColor: COLORS.white, borderRadius: 26, padding: 22, marginBottom: 18, borderWidth: 1, borderColor: COLORS.gray100 },
  chartHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  chartLbl:      { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  chartBadge:    { backgroundColor: COLORS.gray100, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  chartBadgeTxt: { fontSize: 10, fontWeight: '700', color: COLORS.gray500 },
  chart:         { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 96 },
  barWrap:       { flex: 1, alignItems: 'center', gap: 6 },
  barTrack:      { width: '68%', height: 96, backgroundColor: COLORS.gray100, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill:       { width: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  barLbl:        { fontSize: 8, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase' },
  focusSection:  { gap: 10, marginBottom: 18 },
  focusCard:     { backgroundColor: COLORS.white, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS.gray100 },
  focusLeft:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  focusIcon:     { width: 44, height: 44, borderRadius: 13, backgroundColor: '#F0F3FF', alignItems: 'center', justifyContent: 'center' },
  focusTitle:    { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  focusMeta:     { fontSize: 9, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  focusRight:    { width: 96 },
  focusBarMeta:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  focusStrength: { fontSize: 8, fontWeight: '700', color: COLORS.gray400 },
  focusPct:      { fontSize: 8, fontWeight: '700', color: COLORS.gray400 },
  focusTrack:    { height: 4, backgroundColor: COLORS.gray100, borderRadius: 2, overflow: 'hidden' },
  focusFill:     { height: 4, borderRadius: 2 },
});
