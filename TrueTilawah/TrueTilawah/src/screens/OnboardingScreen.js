import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withSpring, Easing,
} from 'react-native-reanimated';
import { BookOpen } from 'lucide-react-native';
import { COLORS } from '../constants';

export default function OnboardingScreen({ navigation }) {
  const floatY   = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const cardOp   = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0,   { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ), -1, false
    );
    cardScale.value = withSpring(1,   { damping: 14, stiffness: 120 });
    cardOp.value    = withTiming(1,   { duration: 700 });
  }, []);

  const bookStyle = useAnimatedStyle(() => ({ transform: [{ translateY: floatY.value }] }));
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }], opacity: cardOp.value }));

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <Animated.View style={[styles.inner, cardStyle]}>
        <Text style={styles.title}>True Tilawah</Text>
        <Text style={styles.subtitle}>Memorize and recite{'\n'}Quran easily</Text>

        <LinearGradient colors={[COLORS.primary, '#0F2820']} style={styles.heroCard}>
          <View style={[styles.dot, { top: 40, left: 40 }]} />
          <View style={[styles.dot, { top: 80, right: 80, width: 6, height: 6, opacity: 0.35 }]} />

          <Animated.View style={bookStyle}>
            <BookOpen size={120} color={COLORS.secondary} />
          </Animated.View>

          <Text style={styles.arabicVerse}>وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</Text>
        </LinearGradient>

        <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Auth')} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.white },
  inner:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  title:       { fontSize: 36, fontWeight: '700', color: COLORS.primary, marginBottom: 8, textAlign: 'center' },
  subtitle:    { fontSize: 16, color: COLORS.gray500, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  heroCard:    { width: '100%', aspectRatio: 0.8, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 40, overflow: 'hidden', paddingHorizontal: 32 },
  dot:         { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#FEF08A', opacity: 0.5 },
  arabicVerse: { fontSize: 22, color: COLORS.white, textAlign: 'center', marginTop: 28, lineHeight: 40, writingDirection: 'rtl' },
  cta:         { width: '100%', backgroundColor: COLORS.secondaryLight, paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  ctaText:     { fontSize: 17, fontWeight: '700', color: COLORS.primary },
});
