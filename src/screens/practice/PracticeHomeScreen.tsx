import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius, shadow, typography } from '../../constants/theme';
import { PracticeStackParamList, PRACTICE_LEVELS } from '../../types';

type NavProp = StackNavigationProp<PracticeStackParamList, 'PracticeHome'>;

export default function PracticeHomeScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#A78BFA', colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerEmoji}>🎤</Text>
        <View>
          <Text style={styles.headerTitle}>会話練習</Text>
          <Text style={styles.headerSub}>AIと本番に近い会話練習をしよう</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 説明カード */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🌟 会話練習の流れ</Text>
          <View style={styles.stepList}>
            {[
              { icon: '👤', text: 'デート相手のペルソナをカスタム設定' },
              { icon: '📈', text: '短い会話から徐々にレベルアップ' },
              { icon: '🤖', text: 'AIがリアルな相手として会話' },
              { icon: '📊', text: '練習後に詳細なフィードバック' },
            ].map((step, i) => (
              <View key={i} style={styles.stepItem}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* レベル説明 */}
        <Text style={styles.sectionTitle}>📊 練習レベル</Text>
        <View style={styles.levelsCard}>
          {PRACTICE_LEVELS.map((level, i) => (
            <View key={level.level} style={[styles.levelRow, i < PRACTICE_LEVELS.length - 1 && styles.levelBorder]}>
              <View style={[styles.levelBadge, { backgroundColor: getLevelColor(level.level) + '20' }]}>
                <Text style={[styles.levelBadgeText, { color: getLevelColor(level.level) }]}>Lv.{level.level}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>{level.label}</Text>
                <Text style={styles.levelDesc}>{level.description}</Text>
              </View>
              {i < 2 && <Ionicons name="lock-closed-outline" size={14} color={colors.textLight} />}
              {i >= 2 && <Ionicons name="checkmark-circle" size={16} color={colors.success} />}
            </View>
          ))}
        </View>

        {/* スタートボタン */}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('PersonaSetup')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#A78BFA', colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startGradient}
          >
            <Ionicons name="play" size={22} color="#fff" />
            <Text style={styles.startText}>練習を始める</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.note}>💡 レベルは最初から選択できます。実力に合わせて挑戦してください！</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function getLevelColor(level: number) {
  const colors_map = ['#4CAF82', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
  return colors_map[level - 1] || '#4CAF82';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerEmoji: { fontSize: 36 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  infoTitle: { ...typography.h4, color: colors.primary, marginBottom: spacing.sm },
  stepList: { gap: spacing.sm },
  stepItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepIcon: { fontSize: 20, width: 28 },
  stepText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  levelsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  levelRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  levelBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.round, minWidth: 50, alignItems: 'center' },
  levelBadgeText: { fontSize: 12, fontWeight: '700' },
  levelInfo: { flex: 1 },
  levelLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  levelDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  startBtn: { borderRadius: borderRadius.round, overflow: 'hidden', marginVertical: spacing.sm },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 18,
  },
  startText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  note: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
