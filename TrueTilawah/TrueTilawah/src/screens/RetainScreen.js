import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Plus, RefreshCw } from 'lucide-react-native';
import Header from '../components/common/Header';
import { COLORS } from '../constants';
import { getShadow } from '../utils/helpers';

function OptionCard({ title, iconEl, bgColor, iconColor, description, onPress }) {
  return (
    <TouchableOpacity style={[s.card, { backgroundColor: bgColor }, getShadow(2)]} onPress={onPress} activeOpacity={0.88}>
      <View style={[s.cardIcon, { shadowColor: iconColor }]}>
        {iconEl}
      </View>
      <View style={s.cardInfo}>
        <Text style={s.cardTitle}>{title}</Text>
        <Text style={s.cardDesc}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function RetainScreen({ navigation }) {
  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <Header title="Retain Quran" onBack={() => navigation.goBack()} showSearch={false} />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <OptionCard
          title="Random Test"
          iconEl={<Text style={[s.iconText, { color: '#3B82F6' }]}>?</Text>}
          bgColor="#EFF6FF" iconColor="#3B82F6"
          description="Test your memory with random verses"
          onPress={() => navigation.navigate('RetainTest')}
        />
        <OptionCard
          title="Existing Plan"
          iconEl={<CheckCircle2 size={40} color="#10B981" />}
          bgColor="#ECFDF5" iconColor="#10B981"
          description="Continue your current memorization plan"
          onPress={() => {}}
        />
        <OptionCard
          title="New Plan"
          iconEl={<Plus size={40} color="#F97316" />}
          bgColor="#FFF7ED" iconColor="#F97316"
          description="Start a fresh memorization journey"
          onPress={() => {}}
        />
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: COLORS.white },
  content:   { padding: 24, gap: 18 },
  card:      { borderRadius: 36, padding: 26, flexDirection: 'row', alignItems: 'center', gap: 20 },
  cardIcon:  { width: 74, height: 74, borderRadius: 37, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  iconText:  { fontSize: 30, fontWeight: '700' },
  cardInfo:  { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  cardDesc:  { fontSize: 12, color: COLORS.gray500, fontWeight: '500' },
});
