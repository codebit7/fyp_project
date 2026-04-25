import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Share2, Play, Bookmark } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { shareContent, getShadow } from '../../utils/helpers';
import { COLORS } from '../../constants';

export default function AyahItem({ ayah, surahId, surahName }) {
  const { isBookmarked, addBookmark, removeBookmark } = useApp();
  const [playing, setPlaying] = useState(false);

  const num    = ayah.ayahNumber ?? ayah.number;
  const text   = ayah.uthmaniText ?? ayah.text ?? '';
  const trans  = ayah.translationEn ?? ayah.translation ?? '';
  const saved  = isBookmarked(surahId, num);

  const toggleBookmark = () => {
    if (saved) removeBookmark(surahId, num);
    else addBookmark({ surahId, surahName, ayahNumber: num, text, translation: trans });
  };

  return (
    <View style={[styles.card, getShadow(2)]}>
      {/* Action bar */}
      <View style={styles.actionBar}>
        <View style={styles.numBadge}><Text style={styles.numText}>{num}</Text></View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => shareContent(`${surahName} : ${num}`, `"${text}"\n\n${trans}`)} style={styles.actionBtn} hitSlop={6}>
            <Share2 size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPlaying(p => !p)} style={styles.actionBtn} hitSlop={6}>
            <Play size={20} color={playing ? '#16A34A' : COLORS.primary} fill={playing ? '#16A34A' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleBookmark} style={styles.actionBtn} hitSlop={6}>
            <Bookmark size={20} color={saved ? '#F97316' : COLORS.primary} fill={saved ? '#F97316' : 'none'} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.arabic}>{text}</Text>
      {trans ? <Text style={styles.translation}>{trans}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card:        { backgroundColor: COLORS.white, borderRadius: 28, padding: 20, borderWidth: 1, borderColor: '#F9FAFB', marginBottom: 16 },
  actionBar:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.gray100, borderRadius: 16, padding: 12, marginBottom: 16 },
  numBadge:    { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  numText:     { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  actions:     { flexDirection: 'row', gap: 14, alignItems: 'center' },
  actionBtn:   { padding: 6, borderRadius: 20 },
  arabic:      { fontSize: 26, textAlign: 'right', color: COLORS.primary, lineHeight: 52, marginBottom: 12, writingDirection: 'rtl' },
  translation: { fontSize: 14, color: COLORS.gray600, lineHeight: 22, fontWeight: '500' },
});
