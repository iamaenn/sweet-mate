import React, { useState } from 'react';
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
import { DatePlanStackParamList, DateSpot } from '../../types';

type RouteT = RouteProp<DatePlanStackParamList, 'DatePlanResult'>;
type NavProp = StackNavigationProp<DatePlanStackParamList, 'DatePlanResult'>;

export default function DatePlanResultScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteT>();
  const { plan, input } = route.params;
  const [expandedSpot, setExpandedSpot] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[colors.secondary, '#FFB347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>📅 デートプラン</Text>
          <Text style={styles.headerSub}>{input.area} / {input.dateNumber} / {input.startTime}〜{input.endTime}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* タイトルカード */}
        <View style={styles.titleCard}>
          <Text style={styles.planTitle}>✨ {plan.title}</Text>
          <View style={styles.budgetRow}>
            <Ionicons name="wallet-outline" size={16} color={colors.secondary} />
            <Text style={styles.budgetText}>予算目安：{plan.totalBudget}</Text>
          </View>
        </View>

        {/* 全体アドバイス */}
        <View style={styles.adviceCard}>
          <Text style={styles.adviceTitle}>💡 プランのポイント</Text>
          <Text style={styles.adviceText}>{plan.overallAdvice}</Text>
        </View>

        {/* タイムライン */}
        <Text style={styles.timelineTitle}>🗺️ タイムライン</Text>
        {plan.spots.map((spot, i) => (
          <View key={i} style={styles.spotWrapper}>
            {/* タイムライン線 */}
            <View style={styles.timeline}>
              <View style={styles.timelineDot} />
              {i < plan.spots.length - 1 && <View style={styles.timelineLine} />}
            </View>

            {/* スポットカード */}
            <TouchableOpacity
              style={styles.spotCard}
              onPress={() => setExpandedSpot(expandedSpot === i ? null : i)}
              activeOpacity={0.85}
            >
              <View style={styles.spotHeader}>
                <View style={styles.spotTimeBox}>
                  <Text style={styles.spotTime}>{spot.time}</Text>
                  <Text style={styles.spotDuration}>{spot.duration}</Text>
                </View>
                <View style={styles.spotInfo}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotDesc} numberOfLines={expandedSpot === i ? undefined : 2}>
                    {spot.description}
                  </Text>
                </View>
                <Ionicons
                  name={expandedSpot === i ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textLight}
                />
              </View>

              {expandedSpot === i && (
                <View style={styles.spotDetail}>
                  {/* 話題 */}
                  <Text style={styles.detailLabel}>💬 話のネタ</Text>
                  {spot.talkTopics.map((topic, j) => (
                    <View key={j} style={styles.topicItem}>
                      <Text style={styles.topicBullet}>●</Text>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}

                  {/* コツ */}
                  <View style={styles.tipBox}>
                    <Ionicons name="heart" size={14} color={colors.primary} />
                    <Text style={styles.tipText}>{spot.tips}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}

        {/* もう一度作成 */}
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh" size={18} color={colors.secondary} />
          <Text style={styles.retryText}>条件を変えて再生成</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { padding: 4, marginRight: spacing.sm },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  titleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  planTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  budgetText: { fontSize: 14, color: colors.secondary, fontWeight: '600' },
  adviceCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  adviceTitle: { fontSize: 14, fontWeight: '700', color: '#856404', marginBottom: spacing.xs },
  adviceText: { fontSize: 13, color: '#856404', lineHeight: 20 },
  timelineTitle: { ...typography.h3, marginBottom: spacing.md },
  spotWrapper: { flexDirection: 'row', marginBottom: spacing.md },
  timeline: { alignItems: 'center', width: 24, marginRight: spacing.sm, paddingTop: 16 },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineLine: { flex: 1, width: 2, backgroundColor: colors.border, marginTop: 4 },
  spotCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  spotHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  spotTimeBox: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    alignItems: 'center',
    minWidth: 52,
  },
  spotTime: { fontSize: 14, fontWeight: '700', color: colors.secondary },
  spotDuration: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  spotInfo: { flex: 1 },
  spotName: { ...typography.h4, marginBottom: 4 },
  spotDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  spotDetail: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  detailLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  topicItem: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  topicBullet: { fontSize: 8, color: colors.primary, marginTop: 5 },
  topicText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  tipText: { flex: 1, fontSize: 13, color: colors.primaryDark, lineHeight: 20 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: borderRadius.round,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  retryText: { fontSize: 15, fontWeight: '600', color: colors.secondary },
});
