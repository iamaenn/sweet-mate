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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius, shadow, typography } from '../../constants/theme';
import { PracticeStackParamList } from '../../types';

type RouteT = RouteProp<PracticeStackParamList, 'PracticeFeedback'>;
type NavProp = StackNavigationProp<PracticeStackParamList, 'PracticeFeedback'>;

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? colors.success : score >= 60 ? colors.secondary : colors.error;
  return (
    <View style={fbStyles.scoreBarBg}>
      <View style={[fbStyles.scoreBarFill, { width: `${score}%`, backgroundColor: color }]} />
    </View>
  );
}

export default function PracticeFeedbackScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteT>();
  const { feedback, persona } = route.params;

  const overallColor =
    feedback.overallScore >= 80
      ? colors.success
      : feedback.overallScore >= 60
      ? colors.secondary
      : colors.primary;

  const overallLabel =
    feedback.overallScore >= 85
      ? '素晴らしい！'
      : feedback.overallScore >= 70
      ? 'なかなか良い！'
      : feedback.overallScore >= 55
      ? 'まあまあ'
      : 'もっと頑張れ！';

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#A78BFA', colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>📊 フィードバック</Text>
        <Text style={styles.headerSub}>{persona.name}さんとの会話練習結果</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 総合スコア */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>総合スコア</Text>
          <View style={[styles.scoreBadge, { borderColor: overallColor }]}>
            <Text style={[styles.scoreNumber, { color: overallColor }]}>{feedback.overallScore}</Text>
            <Text style={[styles.scoreMax, { color: overallColor }]}>/100</Text>
          </View>
          <Text style={[styles.scoreComment, { color: overallColor }]}>{overallLabel}</Text>
        </View>

        {/* 項目別評価 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 項目別評価</Text>
          {feedback.categories.map((cat, i) => (
            <View key={i} style={styles.categoryRow}>
              <View style={styles.catHeader}>
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={[styles.catScore, { color: cat.score >= 70 ? colors.success : colors.warning }]}>
                  {cat.score}点
                </Text>
              </View>
              <ScoreBar score={cat.score} />
              <Text style={styles.catComment}>{cat.comment}</Text>
            </View>
          ))}
        </View>

        {/* 良かった点 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ 良かった点</Text>
          {feedback.goodPoints.map((point, i) => (
            <View key={i} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.listText}>{point}</Text>
            </View>
          ))}
        </View>

        {/* 改善点 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 改善点</Text>
          {feedback.improvements.map((imp, i) => (
            <View key={i} style={styles.listItem}>
              <Ionicons name="arrow-up-circle" size={18} color={colors.warning} />
              <Text style={styles.listText}>{imp}</Text>
            </View>
          ))}
        </View>

        {/* 次回アドバイス */}
        <View style={styles.nextCard}>
          <Text style={styles.nextTitle}>🚀 次のステップ</Text>
          <Text style={styles.nextText}>{feedback.nextStepAdvice}</Text>
        </View>

        {/* ボタン */}
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.navigate('PersonaSetup')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#A78BFA', colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.retryGradient}
          >
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.retryText}>もう一度練習する</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('PracticeHome')}
          activeOpacity={0.85}
        >
          <Ionicons name="home-outline" size={18} color={colors.primary} />
          <Text style={styles.homeBtnText}>練習ホームに戻る</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const fbStyles = StyleSheet.create({
  scoreBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 4,
  },
  scoreBarFill: { height: 8, borderRadius: 4 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadow.md,
  },
  scoreLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  scoreBadge: {
    flexDirection: 'row',
    borderWidth: 4,
    borderRadius: 70,
    width: 140,
    height: 140,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  scoreNumber: { fontSize: 52, fontWeight: '800', lineHeight: 60 },
  scoreMax: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  scoreComment: { fontSize: 20, fontWeight: '700' },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  sectionTitle: { ...typography.h4, marginBottom: spacing.md },
  categoryRow: { marginBottom: spacing.md },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catName: { fontSize: 14, fontWeight: '600', color: colors.text },
  catScore: { fontSize: 14, fontWeight: '700' },
  catComment: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm },
  listText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  nextCard: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  nextTitle: { ...typography.h4, color: colors.primary, marginBottom: spacing.sm },
  nextText: { fontSize: 14, color: colors.text, lineHeight: 22 },
  retryBtn: { borderRadius: borderRadius.round, overflow: 'hidden', marginBottom: spacing.sm },
  retryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  retryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.round,
    padding: spacing.md,
  },
  homeBtnText: { fontSize: 15, fontWeight: '600', color: colors.primary },
});
