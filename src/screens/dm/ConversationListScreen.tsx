import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, shadow, typography } from '../../constants/theme';
import { DMConversation, DMStackParamList, PlatformKey } from '../../types';

type NavProp = StackNavigationProp<DMStackParamList, 'ConversationList'>;

const STORAGE_KEY = '@sweetmate_conversations';

const PLATFORMS: { key: PlatformKey; label: string; color: string; emoji: string }[] = [
  { key: 'line', label: 'LINE', color: '#06C755', emoji: '💬' },
  { key: 'instagram', label: 'Instagram', color: '#E1306C', emoji: '📸' },
  { key: 'matching', label: 'マッチングアプリ', color: '#FF6B8A', emoji: '💕' },
];

export default function ConversationListScreen() {
  const navigation = useNavigation<NavProp>();
  const [conversations, setConversations] = useState<DMConversation[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlatforms, setNewPlatforms] = useState<PlatformKey[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const raw = JSON.parse(data) as any[];
        // 旧データ(platform: string)を新形式(platforms: string[])に移行
        const migrated: DMConversation[] = raw.map(c => ({
          ...c,
          platforms: c.platforms ?? (c.platform ? [c.platform] : ['line']),
        }));
        setConversations(migrated);
      }
    } catch {}
  };

  const saveConversations = async (list: DMConversation[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
  };

  const togglePlatform = (key: PlatformKey) => {
    setNewPlatforms(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const addConversation = () => {
    if (!newName.trim()) {
      Alert.alert('エラー', '相手の名前を入力してください');
      return;
    }
    if (newPlatforms.length === 0) {
      Alert.alert('エラー', 'プラットフォームを1つ以上選んでください');
      return;
    }
    const newConv: DMConversation = {
      id: Date.now().toString(),
      name: newName.trim(),
      platforms: newPlatforms,
      updatedAt: new Date().toISOString(),
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setNewName('');
    setNewPlatforms([]);
    setShowAdd(false);
  };

  const deleteConversation = (id: string) => {
    Alert.alert('削除確認', 'この会話を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => {
          const updated = conversations.filter(c => c.id !== id);
          setConversations(updated);
          saveConversations(updated);
        },
      },
    ]);
  };

  const getPlatformInfo = (key: PlatformKey) =>
    PLATFORMS.find(p => p.key === key) || PLATFORMS[0];

  return (
    <SafeAreaView style={styles.safe}>
      {/* ヘッダー */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>💬 DM返信提案</Text>
        <Text style={styles.headerSub}>やり取りしている相手を選んでください</Text>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 新規追加ボタン */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAdd(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle" size={22} color={colors.primary} />
          <Text style={styles.addButtonText}>新しい相手を追加</Text>
        </TouchableOpacity>

        {/* 新規追加フォーム */}
        {showAdd && (
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>✨ 相手を追加</Text>
            <TextInput
              style={styles.input}
              placeholder="相手の名前・ニックネーム"
              placeholderTextColor={colors.textLight}
              value={newName}
              onChangeText={setNewName}
            />
            <Text style={styles.platformLabel}>プラットフォーム（複数選択可）</Text>
            <View style={styles.platformRow}>
              {PLATFORMS.map(p => {
                const selected = newPlatforms.includes(p.key);
                return (
                  <TouchableOpacity
                    key={p.key}
                    style={[styles.platformChip, selected && { backgroundColor: p.color, borderColor: p.color }]}
                    onPress={() => togglePlatform(p.key)}
                  >
                    <Text style={styles.platformChipEmoji}>{p.emoji}</Text>
                    <Text style={[styles.platformChipText, selected && { color: '#fff' }]}>{p.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.addFormButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowAdd(false); setNewName(''); setNewPlatforms([]); }}>
                <Text style={styles.cancelBtnText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={addConversation}>
                <Text style={styles.confirmBtnText}>追加する</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 会話リスト */}
        {conversations.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💌</Text>
            <Text style={styles.emptyTitle}>まだ相手が登録されていません</Text>
            <Text style={styles.emptyBody}>「新しい相手を追加」からやり取りしている相手を登録しましょう</Text>
          </View>
        ) : (
          conversations.map(conv => {
            const platformInfos = conv.platforms.map(k => getPlatformInfo(k));
            const avatarPlatform = platformInfos[0];
            return (
              <TouchableOpacity
                key={conv.id}
                style={styles.convCard}
                onPress={() => navigation.navigate('DMReply', { conversationId: conv.id, conversationName: conv.name })}
                onLongPress={() => deleteConversation(conv.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.avatar, { backgroundColor: avatarPlatform.color + '20' }]}>
                  <Text style={styles.avatarEmoji}>{avatarPlatform.emoji}</Text>
                </View>
                <View style={styles.convInfo}>
                  <Text style={styles.convName}>{conv.name}</Text>
                  <View style={styles.convMeta}>
                    {platformInfos.map(p => (
                      <View key={p.key} style={[styles.platformBadge, { backgroundColor: p.color + '15' }]}>
                        <Text style={[styles.platformBadgeText, { color: p.color }]}>{p.label}</Text>
                      </View>
                    ))}
                    {conv.lastMessage && (
                      <Text style={styles.lastMessage} numberOfLines={1}>{conv.lastMessage}</Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
              </TouchableOpacity>
            );
          })
        )}

        <Text style={styles.hint}>※ 長押しで削除できます</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  addButtonText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  addForm: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  addFormTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  platformLabel: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs },
  platformRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  platformChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  platformChipEmoji: { fontSize: 14 },
  platformChipText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  addFormButtons: { flexDirection: 'row', gap: spacing.sm },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, color: colors.textSecondary },
  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  confirmBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyEmoji: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  emptyBody: { ...typography.bodySmall, textAlign: 'center', lineHeight: 20 },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  avatarEmoji: { fontSize: 22 },
  convInfo: { flex: 1 },
  convName: { ...typography.h4, marginBottom: 4 },
  convMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  platformBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.round },
  platformBadgeText: { fontSize: 10, fontWeight: '600' },
  lastMessage: { flex: 1, fontSize: 12, color: colors.textSecondary },
  hint: { fontSize: 11, color: colors.textLight, textAlign: 'center', marginTop: spacing.sm },
});
