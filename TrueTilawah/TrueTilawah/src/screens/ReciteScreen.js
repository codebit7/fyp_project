import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence,
  withTiming, cancelAnimation, Easing,
} from 'react-native-reanimated';
import { BookOpen, Mic } from 'lucide-react-native';
import Header  from '../components/common/Header';
import Button  from '../components/common/Button';
import { audioStreamService } from '../services/audioStreamService';
import { sessionService }     from '../services/sessionService';
import { feedbackService }    from '../services/feedbackService';
import { COLORS } from '../constants';

export default function ReciteScreen({ navigation }) {
  const [isRecording,    setIsRecording]    = useState(false);
  const [isConnected,    setIsConnected]    = useState(false);
  const [mistakes,       setMistakes]       = useState([]);
  const [showVerses,     setShowVerses]     = useState(true);
  const [isSaved,        setIsSaved]        = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [saving,         setSaving]         = useState(false);

  const pulseScale = useSharedValue(1);
  const ring1      = useSharedValue(0.85);
  const ring2      = useSharedValue(0.85);
  const micBg      = useSharedValue(0);  // 0=idle 1=recording

  useEffect(() => {
    audioStreamService.setCallbacks(
      (result) => setMistakes(p => [...p, result.message].slice(-3)),
      (connected) => setIsConnected(connected)
    );
    return () => {
      audioStreamService.stopStreaming();
      audioStreamService.stopDemoMode();
      cancelAnimation(pulseScale);
      cancelAnimation(ring1);
      cancelAnimation(ring2);
    };
  }, []);

  const startAnims = () => {
    pulseScale.value = withRepeat(withSequence(withTiming(1.06, { duration: 900, easing: Easing.inOut(Easing.ease) }), withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })), -1, false);
    ring1.value = withRepeat(withTiming(1.55, { duration: 2000 }), -1, false);
    ring2.value = withRepeat(withSequence(withTiming(0.85, { duration: 0 }), withTiming(1.85, { duration: 2200 })), -1, false);
  };
  const stopAnims  = () => {
    cancelAnimation(pulseScale); cancelAnimation(ring1); cancelAnimation(ring2);
    pulseScale.value = withTiming(1); ring1.value = withTiming(0.85); ring2.value = withTiming(0.85);
  };

  const micCircleStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }], backgroundColor: isRecording ? COLORS.primary : '#F9FAFB' }));
  const ring1Style     = useAnimatedStyle(() => ({ transform: [{ scale: ring1.value }], opacity: isRecording ? Math.max(0, (1.55 - ring1.value) * 0.6) : 0 }));
  const ring2Style     = useAnimatedStyle(() => ({ transform: [{ scale: ring2.value }], opacity: isRecording ? Math.max(0, (1.85 - ring2.value) * 0.35) : 0 }));

  const handleToggle = async () => {
    if (isRecording) {
      await audioStreamService.stopStreaming();
      audioStreamService.stopDemoMode();
      stopAnims();
      setIsRecording(false);
      setIsConnected(false);
    } else {
      setMistakes([]);
      try {
        const session = await sessionService.createSession({ surahId: 1, ayahStart: 1, ayahEnd: 7 });
        setCurrentSession(session);
        try {
          await audioStreamService.startStreaming(session.id);
        } catch {
          audioStreamService.startDemoMode();
        }
        startAnims();
        setIsRecording(true);
      } catch (err) {
        Alert.alert('Error', 'Could not start session: ' + err.message);
      }
    }
  };

  const handleSave = async () => {
    if (!currentSession) { Alert.alert('Info', 'Start recording first'); return; }
    setSaving(true);
    try {
      await audioStreamService.stopStreaming();
      audioStreamService.stopDemoMode();
      stopAnims();
      setIsRecording(false);
      setIsConnected(false);
      if (mistakes.length) {
        const feedbacks = mistakes.map(() => ({ errorType: 'MISPRONUNCIATION', incorrectWord: 'unknown', correctWord: 'unknown' }));
        await feedbackService.logFeedbackBatch(currentSession.id, feedbacks).catch(() => {});
      }
      const score = Math.max(0, 100 - mistakes.length * 12);
      await sessionService.completeSession(currentSession.id, { transcript: '', accuracyScore: score });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      setCurrentSession(null);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally { setSaving(false); }
  };

  const handleReset = async () => {
    await audioStreamService.stopStreaming();
    audioStreamService.stopDemoMode();
    stopAnims();
    setIsRecording(false);
    setIsConnected(false);
    setMistakes([]);
    if (currentSession) {
      await sessionService.abandonSession(currentSession.id).catch(() => {});
      setCurrentSession(null);
    }
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <Header title="Recite Quran" onBack={() => navigation.goBack()} showSearch={false} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Surah Banner */}
        <View style={s.sec}>
          <LinearGradient colors={[COLORS.secondary, COLORS.secondaryMedium]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.banner}>
            <View>
              <View style={s.bannerMeta}><BookOpen size={14} color="rgba(255,255,255,0.9)" /><Text style={s.bannerMetaTxt}>Select Ayah</Text></View>
              <Text style={s.bannerSurah}>Al-Fatihah</Text>
              <Text style={s.bannerAyah}>Ayah No: 1–7</Text>
            </View>
            <BookOpen size={60} color="rgba(255,255,255,0.2)" />
          </LinearGradient>
        </View>

        {/* Toggles */}
        <View style={s.toggleRow}>
          <View style={s.toggleItem}>
            <Text style={s.toggleLbl}>Show verses</Text>
            <Switch value={showVerses} onValueChange={setShowVerses} trackColor={{ false: COLORS.gray200, true: COLORS.primary }} thumbColor={COLORS.white} />
          </View>
          <Text style={s.arabicTitle}>الفاتحة</Text>
          <View style={s.toggleItem}>
            <Text style={s.toggleLbl}>{isConnected ? 'Live' : 'Offline'}</Text>
            <View style={[s.statusDot, { backgroundColor: isConnected ? '#22C55E' : COLORS.gray300 }]} />
          </View>
        </View>

        {/* Arabic Verse */}
        {showVerses && (
          <View style={s.verseSec}>
            <Text style={s.arabicVerse}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (1)</Text>
          </View>
        )}

        {/* Microphone */}
        <View style={s.micWrap}>
          <Animated.View style={[s.ring, ring2Style]} />
          <Animated.View style={[s.ring, ring1Style]} />
          <View style={s.outerCircle}>
            <Animated.View style={[s.micCircle, micCircleStyle]}>
              <TouchableOpacity onPress={handleToggle} style={[s.micBtn, isRecording && s.micBtnActive]} activeOpacity={0.85}>
                <Mic size={40} color={isRecording ? COLORS.primary : COLORS.white} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Status */}
        <View style={s.statusSec}>
          {isRecording
            ? <View style={s.recordingRow}><View style={s.recDot} /><Text style={s.recTxt}>Recording Started...</Text></View>
            : <Text style={s.idleTxt}>Tap the microphone to start reciting</Text>
          }
          {/* Mistake Panel */}
          <View style={s.mistakePanel}>
            <View style={s.mistakeHeader}>
              <View style={s.mistakeDot} />
              <Text style={s.mistakeLbl}>Mistake Detection</Text>
            </View>
            <View style={s.mistakeBox}>
              {mistakes.length
                ? mistakes.slice(-2).map((m, i) => <Text key={i} style={s.mistakeTxt}>{m}</Text>)
                : <Text style={s.listeningTxt}>Listening for recitation errors...</Text>
              }
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={s.btnRow}>
          <Button onPress={handleReset} variant="outline" size="md" style={s.btn}>Reset</Button>
          <Button onPress={handleSave} variant="secondary" size="md" loading={saving} style={s.btn}>
            {isSaved ? '✓ Saved!' : 'Save Session'}
          </Button>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: COLORS.white },
  content:       { paddingBottom: 32 },
  sec:           { paddingHorizontal: 24, marginTop: 14 },
  banner:        { borderRadius: 26, padding: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bannerMeta:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  bannerMetaTxt: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: 1 },
  bannerSurah:   { fontSize: 20, fontWeight: '700', color: COLORS.white },
  bannerAyah:    { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  toggleRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 14 },
  toggleItem:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleLbl:     { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5 },
  statusDot:     { width: 8, height: 8, borderRadius: 4 },
  arabicTitle:   { fontSize: 22, color: COLORS.primary },
  verseSec:      { paddingHorizontal: 32, paddingVertical: 12, alignItems: 'center' },
  arabicVerse:   { fontSize: 24, textAlign: 'center', color: COLORS.primary, lineHeight: 50, writingDirection: 'rtl' },
  micWrap:       { alignItems: 'center', justifyContent: 'center', height: 270, marginVertical: 8 },
  ring:          { position: 'absolute', width: 230, height: 230, borderRadius: 115, borderWidth: 2, borderColor: `${COLORS.primary}28` },
  outerCircle:   { width: 194, height: 194, borderRadius: 97, borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.gray200, alignItems: 'center', justifyContent: 'center' },
  micCircle:     { width: 156, height: 156, borderRadius: 78, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 22, elevation: 10 },
  micBtn:        { width: 86, height: 86, borderRadius: 43, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  micBtnActive:  { backgroundColor: COLORS.white },
  statusSec:     { paddingHorizontal: 24, alignItems: 'center', gap: 14 },
  recordingRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  recDot:        { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.red },
  recTxt:        { fontSize: 12, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1.5 },
  idleTxt:       { fontSize: 14, color: COLORS.gray400, textAlign: 'center' },
  mistakePanel:  { width: '100%', maxWidth: 300 },
  mistakeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  mistakeDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: '#F87171' },
  mistakeLbl:    { fontSize: 10, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 1 },
  mistakeBox:    { backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FEE2E2', borderRadius: 18, padding: 16, minHeight: 76, justifyContent: 'center' },
  mistakeTxt:    { fontSize: 13, color: '#DC2626', textAlign: 'center', fontWeight: '500', marginBottom: 4 },
  listeningTxt:  { fontSize: 10, color: COLORS.gray400, textAlign: 'center', fontStyle: 'italic' },
  btnRow:        { flexDirection: 'row', gap: 14, paddingHorizontal: 24, marginTop: 22 },
  btn:           { flex: 1, borderRadius: 18 },
});
