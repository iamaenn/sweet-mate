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
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, shadow, typography } from '../constants/theme';
import { RootTabParamList } from '../types';

type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const features = [
  {
    tab: 'DM' as keyof RootTabParamList,
    emoji: '💬',
    title: 'DM返信提案',
    description: 'LINEやInstagramのDMに最適な返信をAIが提案。恋愛セオリーのアドバイスつき。',
    gradient: ['#FF6B8A', '#FF9A76'] as [string, string],
    tips: ['トーン別に3案提案', 'ワンポイントアドバイス付き', 'デートへの誘い方も提案'],
  },
  {
    tab: 'DatePlan' as keyof RootTabParamList,
    emoji: '📅',
    title: 'デートプラン作成',
    description: 'エリア・予算・相手の好みを入力するだけで完璧なデートプランを自動生成。',
    gradient: ['#FF9A76', '#FFB347'] as [string, string],
    tips: ['タイムテーブル自動作成', '話題のネタも提案', '相手の好みに合わせたプラン'],
  },
  {
    tab: 'Practice' as keyof RootTabParamList,
    emoji: '🎤',
    title: '会話練習',
    description: '相手のペルソナを設定してAIと会話練習。段階的にスキルアップできる。',
    gradient: ['#A78BFA', '#FF6B8A'] as [string, string],
    tips: ['ペルソナ設定で本番に近い練習', '段階的にレベルアップ', 'AI詳細フィードバック'],
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>💝</Text>
          <Text style={styles.headerTitle}>Sweet Mate</Text>
          <Text style={styles.headerSub}>あなたの恋愛をAIがサポート</Text>
        </LinearGradient>

        {/* お知らせカード */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeEmoji}>✨</Text>
          <View style={styles.noticeText}>
            <Text style={styles.noticeTitle}>今日もステキな出会いを</Text>
            <Text style={styles.noticeBody}>3つの機能で恋愛力をアップしましょう！</Text>
          </View>
        </View>

        {/* 機能カード */}
        <Text style={styles.sectionTitle}>機能一覧</Text>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.tab}
            onPress={() => navigation.navigate(feature.tab)}
            activeOpacity={0.9}
            style={styles.featureCard}
          >
            <LinearGradient
              colors={feature.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featureGradient}
            >
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
            </LinearGradient>
            <View style={styles.featureBody}>
              <Text style={styles.featureDesc}>{feature.description}</Text>
              <View style={styles.tipsList}>
                {feature.tips.map((tip, i) => (
                  <View key={i} style={styles.tipItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>使ってみる</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* フッター */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>💕 Sweet Mate で恋愛力UP！</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginTop: -spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.md,
  },
  noticeEmoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    ...typography.h4,
    color: colors.primary,
  },
  noticeBody: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  featureCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadow.md,
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  featureBody: {
    padding: spacing.md,
  },
  featureDesc: {
    ...typography.body,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  tipsList: {
    marginTop: spacing.sm,
    gap: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipText: {
    fontSize: 13,
    color: colors.text,
  },
  featureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    gap: 2,
  },
  featureAction: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  footerText: {
    fontSize: 13,
    color: colors.textLight,
  },
});
