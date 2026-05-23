import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Clipboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, spacing, borderRadius, shadow, typography } from '../../constants/theme';
import {
  ReplyTone,
  RelationshipGoal,
  ReplyOption,
  REPLY_TONES,
  RELATIONSHIP_GOALS,
  DMStackParamList,
} from '../../types';
import { generateDMReplies } from '../../services/claudeApi';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';

type RouteT = RouteProp<DMStackParamList, 'DMReply'>;

export default function DMReplyScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const { conversationName } = route.params || {};

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [manualText, setManualText] = useState('');
  const [selectedTone, setSelectedTone] = useState<ReplyTone>('friendly');
  const [selectedGoal, setSelectedGoal] = useState<RelationshipGoal>('none');
  const [userInstruction, setUserInstruction] = useState('');
  const [replies, setReplies] = useState<ReplyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAdvice, setExpandedAdvice] = useState<number | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!imageUri && !manualText.trim()) {
      Alert.alert('入力が必要です', 'スクリーンショットをアップロードするか、会話内容を入力してください');
      return;
    }

    setLoading(true);
    try {
      const description = imageUri
        ? `（スクリーンショット画像がアップロードされています）\n追加メモ: ${manualText}`
        : manualText;

      const result = await generateDMReplies(description, selectedTone, selectedGoal, userInstruction);
      setReplies(result);
    } catch (e: any) {
      Alert.alert('エラー', e.message || '返信の生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const copyReply = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('コピーしました！', 'クリップボードにコピーしました 📋');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LoadingOverlay visible={loading} message="返信案を生成中..." />

      {/* ヘッダー */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>💬 {conversationName || 'DM返信提案'}</Text>
          <Text style={styles.headerSub}>AIが最適な返信を提案します</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* STEP 1: スクリーンショット */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>STEP 1</Text>
          <Text style={styles.sectionTitle}>📱 会話内容を入力</Text>

          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} resizeMode="cover" />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="image-outline" size={32} color={colors.primary} />
                <Text style={styles.uploadText}>スクリーンショットをアップロード</Text>
                <Text style={styles.uploadSub}>LINE / Instagram / マッチングアプリ</Text>
              </View>
            )}
          </TouchableOpacity>

          {imageUri && (
            <TouchableOpacity style={styles.removeImage} onPress={() => setImageUri(null)}>
              <Ionicons name="close-circle" size={16} color={colors.error} />
              <Text style={styles.removeImageText}>画像を削除</Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.textarea}
            placeholder="または会話内容をテキストで入力&#10;（例：彼女から「最近どう？」と来ました）"
            placeholderTextColor={colors.textLight}
            value={manualText}
            onChangeText={setManualText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* STEP 2: トーン選択 */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>STEP 2</Text>
          <Text style={styles.sectionTitle}>🎭 返信のトーンを選択</Text>
          <View style={styles.toneGrid}>
            {REPLY_TONES.map(tone => (
              <TouchableOpacity
                key={tone.key}
                style={[styles.toneChip, selectedTone === tone.key && styles.toneChipSelected]}
                onPress={() => setSelectedTone(tone.key)}
              >
                <Text style={styles.toneEmoji}>{tone.emoji}</Text>
                <Text style={[styles.toneLabel, selectedTone === tone.key && styles.toneLabelSelected]}>
                  {tone.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* STEP 3: 目標選択 */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>STEP 3</Text>
          <Text style={styles.sectionTitle}>🎯 関係の進め方</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalScroll}>
            {RELATIONSHIP_GOALS.map(goal => (
              <TouchableOpacity
                key={goal.key}
                style={[styles.goalChip, selectedGoal === goal.key && styles.goalChipSelected]}
                onPress={() => setSelectedGoal(goal.key)}
              >
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                <Text style={[styles.goalLabel, selectedGoal === goal.key && styles.goalLabelSelected]}>
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* STEP 4: 追加指示（任意） */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>STEP 4（任意）</Text>
          <Text style={styles.sectionTitle}>✏️ AIへの追加指示</Text>
          <TextInput
            style={styles.instructionInput}
            placeholder="例：相手は猫好きです、絵文字は少なめに、など"
            placeholderTextColor={colors.textLight}
            value={userInstruction}
            onChangeText={setUserInstruction}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* 生成ボタン */}
        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} activeOpacity={0.85}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.generateGradient}
          >
            <Ionicons name="sparkles" size={20} color="#fff" />
            <Text style={styles.generateText}>返信案を生成する</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* 返信案 */}
        {replies.length > 0 && (
          <View style={styles.repliesSection}>
            <Text style={styles.repliesTitle}>✨ 返信案</Text>
            {replies.map((reply, i) => (
              <View key={i} style={styles.replyCard}>
                <View style={styles.replyHeader}>
                  <View style={styles.replyBadge}>
                    <Text style={styles.replyBadgeText}>案 {i + 1}</Text>
                  </View>
                  <TouchableOpacity onPress={() => copyReply(reply.text)} style={styles.copyBtn}>
                    <Ionicons name="copy-outline" size={16} color={colors.primary} />
                    <Text style={styles.copyBtnText}>コピー</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.replyText}>{reply.text}</Text>

                {/* アドバイス */}
                <TouchableOpacity
                  style={styles.adviceToggle}
                  onPress={() => setExpandedAdvice(expandedAdvice === i ? null : i)}
                >
                  <Ionicons name="bulb-outline" size={14} color={colors.secondary} />
                  <Text style={styles.adviceToggleText}>恋愛セオリーのアドバイス</Text>
                  <Ionicons
                    name={expandedAdvice === i ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={colors.secondary}
                  />
                </TouchableOpacity>
                {expandedAdvice === i && (
                  <View style={styles.adviceBox}>
                    <Text style={styles.adviceText}>💡 {reply.advice}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
  stepLabel: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 1, marginBottom: 4 },
  sectionTitle: { ...typography.h4, marginBottom: spacing.sm },
  imageUpload: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    minHeight: 120,
  },
  uploadPlaceholder: { alignItems: 'center', justifyContent: 'center', padding: spacing.lg, minHeight: 120 },
  uploadText: { fontSize: 14, fontWeight: '600', color: colors.primary, marginTop: spacing.sm },
  uploadSub: { fontSize: 12, color: colors.textLight, marginTop: 4 },
  uploadedImage: { width: '100%', height: 200 },
  removeImage: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.sm },
  removeImageText: { fontSize: 12, color: colors.error },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
    minHeight: 80,
  },
  toneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  toneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  toneChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  toneEmoji: { fontSize: 16 },
  toneLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  toneLabelSelected: { color: '#fff' },
  goalScroll: { marginHorizontal: -4 },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  goalChipSelected: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  goalEmoji: { fontSize: 16 },
  goalLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  goalLabelSelected: { color: '#fff' },
  instructionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.background,
    minHeight: 60,
  },
  generateBtn: { borderRadius: borderRadius.round, overflow: 'hidden', marginVertical: spacing.sm },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  generateText: { fontSize: 17, fontWeight: '700', color: '#fff' },
  repliesSection: { marginTop: spacing.sm },
  repliesTitle: { ...typography.h3, marginBottom: spacing.sm },
  replyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadow.sm,
  },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  replyBadge: { backgroundColor: colors.accent, paddingHorizontal: 10, paddingVertical: 3, borderRadius: borderRadius.round },
  replyBadgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  copyBtnText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  replyText: { fontSize: 15, color: colors.text, lineHeight: 24, marginBottom: spacing.sm },
  adviceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  adviceToggleText: { flex: 1, fontSize: 12, color: colors.secondary, fontWeight: '600' },
  adviceBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  adviceText: { fontSize: 13, color: '#856404', lineHeight: 20 },
});
