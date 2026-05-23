import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius, shadow, typography } from '../../constants/theme';
import { DatePlanInput, DatePlanStackParamList } from '../../types';
import { generateDatePlan } from '../../services/claudeApi';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';

type NavProp = StackNavigationProp<DatePlanStackParamList, 'DatePlanForm'>;

const DATE_NUMBERS = ['初めて', '2回目', '3回目', '4〜5回目', '6回以上'];
const BUDGETS = ['〜3,000円', '〜5,000円', '〜8,000円', '〜12,000円', '12,000円以上'];

export default function DatePlanFormScreen() {
  const navigation = useNavigation<NavProp>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<DatePlanInput>({
    area: '',
    budget: '〜5,000円',
    preferences: '',
    dateNumber: '初めて',
    startTime: '13:00',
    endTime: '20:00',
    additionalNotes: '',
  });

  const update = (key: keyof DatePlanInput, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!form.area.trim()) {
      Alert.alert('入力が必要です', 'デートのエリアを入力してください');
      return;
    }
    setLoading(true);
    try {
      const plan = await generateDatePlan(form);
      navigation.navigate('DatePlanResult', { plan, input: form });
    } catch (e: any) {
      Alert.alert('エラー', e.message || 'デートプランの生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LoadingOverlay visible={loading} message="デートプランを作成中..." />

      <LinearGradient
        colors={[colors.secondary, '#FFB347']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerEmoji}>📅</Text>
        <View>
          <Text style={styles.headerTitle}>デートプラン作成</Text>
          <Text style={styles.headerSub}>情報を入力して完璧なデートを計画しよう</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* エリア */}
        <View style={styles.section}>
          <Text style={styles.label}>📍 デートエリア <Text style={styles.required}>*必須</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="例：渋谷、横浜みなとみらい、新宿"
            placeholderTextColor={colors.textLight}
            value={form.area}
            onChangeText={v => update('area', v)}
          />
        </View>

        {/* 何回目のデート */}
        <View style={styles.section}>
          <Text style={styles.label}>💕 何回目のデート？</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {DATE_NUMBERS.map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.chip, form.dateNumber === n && styles.chipSelected]}
                onPress={() => update('dateNumber', n)}
              >
                <Text style={[styles.chipText, form.dateNumber === n && styles.chipTextSelected]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 予算 */}
        <View style={styles.section}>
          <Text style={styles.label}>💰 1人あたりの予算</Text>
          <View style={styles.chipWrap}>
            {BUDGETS.map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.chip, form.budget === b && styles.chipSelected]}
                onPress={() => update('budget', b)}
              >
                <Text style={[styles.chipText, form.budget === b && styles.chipTextSelected]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 時間帯 */}
        <View style={styles.section}>
          <Text style={styles.label}>🕐 デートの時間帯</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>開始</Text>
              <TextInput
                style={styles.timeField}
                placeholder="13:00"
                placeholderTextColor={colors.textLight}
                value={form.startTime}
                onChangeText={v => update('startTime', v)}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <Text style={styles.timeSeparator}>〜</Text>
            <View style={styles.timeInput}>
              <Text style={styles.timeLabel}>終了</Text>
              <TextInput
                style={styles.timeField}
                placeholder="20:00"
                placeholderTextColor={colors.textLight}
                value={form.endTime}
                onChangeText={v => update('endTime', v)}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
        </View>

        {/* 相手の好み */}
        <View style={styles.section}>
          <Text style={styles.label}>🎨 相手の好み・特徴</Text>
          <TextInput
            style={styles.textarea}
            placeholder="例：猫が好き、アート系、カフェ好き、スポーツが得意、静かな場所が好き..."
            placeholderTextColor={colors.textLight}
            value={form.preferences}
            onChangeText={v => update('preferences', v)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* その他 */}
        <View style={styles.section}>
          <Text style={styles.label}>📝 その他の希望（任意）</Text>
          <TextInput
            style={styles.textarea}
            placeholder="例：電車移動希望、屋内中心、夕食もいれたい..."
            placeholderTextColor={colors.textLight}
            value={form.additionalNotes}
            onChangeText={v => update('additionalNotes', v)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* 生成ボタン */}
        <TouchableOpacity style={styles.genBtn} onPress={handleGenerate} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.secondary, '#FFB347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.genGradient}
          >
            <Ionicons name="sparkles" size={20} color="#fff" />
            <Text style={styles.genText}>デートプランを生成する</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.notice}>※ AIがエリアの最新スポット情報と会話ネタも含めたプランを作成します</Text>
      </ScrollView>
    </SafeAreaView>
  );
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
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  label: { ...typography.h4, marginBottom: spacing.sm },
  required: { fontSize: 11, color: colors.error, fontWeight: '400' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
    minHeight: 70,
  },
  chipScroll: { marginHorizontal: -4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    margin: 2,
  },
  chipSelected: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextSelected: { color: '#fff' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  timeInput: { flex: 1 },
  timeLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  timeField: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
    textAlign: 'center',
  },
  timeSeparator: { fontSize: 20, color: colors.textSecondary, marginTop: 16 },
  genBtn: { borderRadius: borderRadius.round, overflow: 'hidden', marginVertical: spacing.sm },
  genGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  genText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  notice: { fontSize: 11, color: colors.textLight, textAlign: 'center', lineHeight: 18 },
});
