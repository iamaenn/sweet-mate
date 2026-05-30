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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, shadow, typography } from '../../constants/theme';
import { PersonaConfig, PracticeLevel, PRACTICE_LEVELS, PracticeStackParamList, DMConversation, PlatformKey } from '../../types';

const DM_STORAGE_KEY = '@sweetmate_conversations';

const PLATFORM_INFO: Record<PlatformKey, { label: string; color: string; emoji: string }> = {
  line: { label: 'LINE', color: '#06C755', emoji: '💬' },
  instagram: { label: 'Instagram', color: '#E1306C', emoji: '📸' },
  matching: { label: 'マッチングアプリ', color: '#FF6B8A', emoji: '💕' },
};

type NavProp = StackNavigationProp<PracticeStackParamList, 'PersonaSetup'>;

const PRESET_PERSONAS: { label: string; emoji: string; config: PersonaConfig }[] = [
  {
    label: 'カフェ好きな同い年',
    emoji: '☕',
    config: {
      name: '葵',
      age: '22',
      personality: '明るくフレンドリーだが、少し恥ずかしがり屋。好奇心旺盛。',
      hobbies: 'カフェ巡り、読書、映画鑑賞',
      relationshipStage: 'マッチングアプリで知り合って2回メッセージのやり取りをした段階',
      additionalInfo: '猫が好き。週末は友達とカフェに行くことが多い。',
    },
  },
  {
    label: 'スポーツ好きな先輩',
    emoji: '🏃',
    config: {
      name: '玲奈',
      age: '25',
      personality: 'サバサバしているが面倒見がいい。テンション高め。',
      hobbies: 'ランニング、ヨガ、料理',
      relationshipStage: '職場で何度か話したことがある程度',
      additionalInfo: 'アクティブなことが好き。健康志向。',
    },
  },
  {
    label: 'アート系の同期',
    emoji: '🎨',
    config: {
      name: '菜々子',
      age: '23',
      personality: '落ち着いていて感受性豊か。話すのは少し遅め。',
      hobbies: '美術館巡り、写真撮影、映画',
      relationshipStage: '友達の紹介で先日初めて会った',
      additionalInfo: 'インスタが趣味。静かな場所が好き。',
    },
  },
];

const STAGES = [
  'マッチングアプリで知り合ったばかり',
  'LINEを交換したところ',
  '1〜2回会ったことがある',
  '仲良くなってきた段階',
  '付き合いそうな段階',
];

export default function PersonaSetupScreen() {
  const navigation = useNavigation<NavProp>();
  const [selectedLevel, setSelectedLevel] = useState<PracticeLevel>(1);
  const [persona, setPersona] = useState<PersonaConfig>({
    name: '',
    age: '',
    personality: '',
    hobbies: '',
    relationshipStage: STAGES[0],
    additionalInfo: '',
  });
  const [usePreset, setUsePreset] = useState(false);
  const [useDMPartner, setUseDMPartner] = useState(false);
  const [dmConversations, setDmConversations] = useState<DMConversation[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadDMConversations();
    }, [])
  );

  const loadDMConversations = async () => {
    try {
      const data = await AsyncStorage.getItem(DM_STORAGE_KEY);
      if (data) {
        const raw = JSON.parse(data) as any[];
        const migrated: DMConversation[] = raw.map(c => ({
          ...c,
          platforms: c.platforms ?? (c.platform ? [c.platform] : ['line']),
        }));
        setDmConversations(migrated);
      }
    } catch {}
  };

  const update = (key: keyof PersonaConfig, value: string) => {
    setPersona(prev => ({ ...prev, [key]: value }));
  };

  const applyPreset = (config: PersonaConfig) => {
    setPersona(config);
    setUsePreset(false);
  };

  const applyDMPartner = (conv: DMConversation) => {
    setPersona(prev => ({
      ...prev,
      name: conv.name,
    }));
    setUseDMPartner(false);
  };

  const handleStart = () => {
    if (!persona.name.trim()) {
      Alert.alert('入力が必要です', '相手の名前を入力してください');
      return;
    }
    navigation.navigate('PracticeSession', { persona, level: selectedLevel });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#A78BFA', colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>👤 ペルソナ設定</Text>
          <Text style={styles.headerSub}>練習相手のキャラクターを設定</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* 返信提案の相手から選ぶ */}
        {dmConversations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💌 返信提案の相手から選ぶ</Text>
              <TouchableOpacity onPress={() => setUseDMPartner(!useDMPartner)}>
                <Text style={styles.toggleText}>{useDMPartner ? '閉じる' : '選択する'}</Text>
              </TouchableOpacity>
            </View>
            {useDMPartner && (
              <View style={styles.dmPartnerList}>
                {dmConversations.map(conv => {
                  const primaryPlatform = PLATFORM_INFO[conv.platforms[0]];
                  return (
                    <TouchableOpacity
                      key={conv.id}
                      style={[
                        styles.dmPartnerCard,
                        persona.name === conv.name && styles.dmPartnerCardSelected,
                      ]}
                      onPress={() => applyDMPartner(conv)}
                    >
                      <View style={[styles.dmAvatar, { backgroundColor: primaryPlatform.color + '20' }]}>
                        <Text style={styles.dmAvatarEmoji}>{primaryPlatform.emoji}</Text>
                      </View>
                      <View style={styles.dmPartnerInfo}>
                        <Text style={styles.dmPartnerName}>{conv.name}</Text>
                        <View style={styles.dmBadgeRow}>
                          {conv.platforms.map(key => {
                            const info = PLATFORM_INFO[key];
                            return (
                              <View key={key} style={[styles.dmBadge, { backgroundColor: info.color + '15' }]}>
                                <Text style={[styles.dmBadgeText, { color: info.color }]}>{info.label}</Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                      {persona.name === conv.name && (
                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* プリセット */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎭 プリセットから選ぶ</Text>
            <TouchableOpacity onPress={() => setUsePreset(!usePreset)}>
              <Text style={styles.toggleText}>{usePreset ? '閉じる' : '選択する'}</Text>
            </TouchableOpacity>
          </View>
          {usePreset && (
            <View style={styles.presetGrid}>
              {PRESET_PERSONAS.map((p, i) => (
                <TouchableOpacity key={i} style={styles.presetCard} onPress={() => applyPreset(p.config)}>
                  <Text style={styles.presetEmoji}>{p.emoji}</Text>
                  <Text style={styles.presetLabel}>{p.label}</Text>
                  <Text style={styles.presetName}>{p.config.name}（{p.config.age}歳）</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* カスタム設定 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✏️ カスタム設定</Text>

          <Text style={styles.label}>名前</Text>
          <TextInput style={styles.input} placeholder="例：葵" placeholderTextColor={colors.textLight} value={persona.name} onChangeText={v => update('name', v)} />

          <Text style={styles.label}>年齢</Text>
          <TextInput style={styles.input} placeholder="例：22" placeholderTextColor={colors.textLight} value={persona.age} onChangeText={v => update('age', v)} keyboardType="number-pad" />

          <Text style={styles.label}>性格・特徴</Text>
          <TextInput
            style={styles.textarea}
            placeholder="例：明るくフレンドリー、少し恥ずかしがり屋"
            placeholderTextColor={colors.textLight}
            value={persona.personality}
            onChangeText={v => update('personality', v)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />

          <Text style={styles.label}>趣味・好きなもの</Text>
          <TextInput
            style={styles.textarea}
            placeholder="例：カフェ巡り、読書、映画鑑賞"
            placeholderTextColor={colors.textLight}
            value={persona.hobbies}
            onChangeText={v => update('hobbies', v)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />

          <Text style={styles.label}>関係性の段階</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {STAGES.map(stage => (
              <TouchableOpacity
                key={stage}
                style={[styles.chip, persona.relationshipStage === stage && styles.chipSelected]}
                onPress={() => update('relationshipStage', stage)}
              >
                <Text style={[styles.chipText, persona.relationshipStage === stage && styles.chipTextSelected]}>
                  {stage}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.label, { marginTop: spacing.sm }]}>その他メモ（任意）</Text>
          <TextInput
            style={styles.textarea}
            placeholder="例：猫が好き、週末カフェに行くのが好き"
            placeholderTextColor={colors.textLight}
            value={persona.additionalInfo}
            onChangeText={v => update('additionalInfo', v)}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* レベル選択 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 練習レベルを選択</Text>
          {PRACTICE_LEVELS.map(level => (
            <TouchableOpacity
              key={level.level}
              style={[styles.levelCard, selectedLevel === level.level && styles.levelCardSelected]}
              onPress={() => setSelectedLevel(level.level as PracticeLevel)}
            >
              <View style={[styles.levelDot, selectedLevel === level.level && { backgroundColor: colors.primary }]} />
              <View style={styles.levelText}>
                <Text style={[styles.levelLabel, selectedLevel === level.level && { color: colors.primary }]}>
                  {level.label} — {level.description}
                </Text>
                <Text style={styles.levelTurns}>{level.turns}ターン</Text>
              </View>
              {selectedLevel === level.level && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* スタートボタン */}
        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.85}>
          <LinearGradient
            colors={['#A78BFA', colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startGradient}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.startText}>練習スタート！</Text>
          </LinearGradient>
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { ...typography.h4, marginBottom: spacing.sm },
  toggleText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  dmPartnerList: { gap: spacing.xs },
  dmPartnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  dmPartnerCardSelected: { borderColor: colors.primary, backgroundColor: colors.accent },
  dmAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dmAvatarEmoji: { fontSize: 18 },
  dmPartnerInfo: { flex: 1 },
  dmPartnerName: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  dmBadgeRow: { flexDirection: 'row', gap: 4 },
  dmBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: borderRadius.round },
  dmBadgeText: { fontSize: 10, fontWeight: '600' },
  presetGrid: { flexDirection: 'row', gap: spacing.sm },
  presetCard: {
    flex: 1,
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetEmoji: { fontSize: 24, marginBottom: 4 },
  presetLabel: { fontSize: 11, fontWeight: '600', color: colors.text, textAlign: 'center', marginBottom: 2 },
  presetName: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: spacing.sm },
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
    minHeight: 60,
  },
  chipScroll: { marginHorizontal: -4 },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginHorizontal: 4,
  },
  chipSelected: { backgroundColor: '#A78BFA', borderColor: '#A78BFA' },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  chipTextSelected: { color: '#fff' },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  levelCardSelected: { borderColor: colors.primary, backgroundColor: colors.accent },
  levelDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  levelText: { flex: 1 },
  levelLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  levelTurns: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  startBtn: { borderRadius: borderRadius.round, overflow: 'hidden', marginVertical: spacing.sm },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  startText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
