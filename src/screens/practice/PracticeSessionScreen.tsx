import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius, shadow, typography } from '../../constants/theme';
import {
  ChatMessage,
  PracticeStackParamList,
  PRACTICE_LEVELS,
} from '../../types';
import { generatePracticeResponse, generatePracticeFeedback } from '../../services/claudeApi';

type RouteT = RouteProp<PracticeStackParamList, 'PracticeSession'>;
type NavProp = StackNavigationProp<PracticeStackParamList, 'PracticeSession'>;

export default function PracticeSessionScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteT>();
  const { persona, level } = route.params;

  const levelInfo = PRACTICE_LEVELS.find(l => l.level === level)!;
  const maxTurns = levelInfo.turns;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // セッション開始時にAIから最初のメッセージを送る
  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
    setLoading(true);
    setSessionStarted(true);
    try {
      const firstMsg = await generatePracticeResponse(persona, [], true);
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: firstMsg,
        timestamp: new Date().toISOString(),
      };
      setMessages([aiMessage]);
    } catch (e: any) {
      Alert.alert('エラー', 'セッションの開始に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    // 最大ターン数に達したら終了
    if (newTurn >= maxTurns) {
      // 最後のAI返答を生成してから終了
      try {
        const aiResponse = await generatePracticeResponse(persona, newMessages, false);
        const endMsg: ChatMessage = {
          role: 'assistant',
          content: aiResponse + '\n\n（練習終了です！お疲れさまでした 🎉）',
          timestamp: new Date().toISOString(),
        };
        const finalMessages = [...newMessages, endMsg];
        setMessages(finalMessages);

        // フィードバック生成
        const feedback = await generatePracticeFeedback(persona, finalMessages);
        navigation.navigate('PracticeFeedback', { feedback, persona });
      } catch (e: any) {
        Alert.alert('エラー', e.message || 'フィードバックの生成に失敗しました');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 通常のAI返答
    try {
      const aiResponse = await generatePracticeResponse(persona, newMessages, false);
      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e: any) {
      Alert.alert('エラー', '返答の生成に失敗しました');
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleEndEarly = () => {
    Alert.alert('練習を終了', 'ここで終了してフィードバックを受けますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '終了する',
        onPress: async () => {
          if (messages.length < 2) {
            Alert.alert('もう少し続けてください', '最低1往復の会話が必要です');
            return;
          }
          setLoading(true);
          try {
            const feedback = await generatePracticeFeedback(persona, messages);
            navigation.navigate('PracticeFeedback', { feedback, persona });
          } catch (e: any) {
            Alert.alert('エラー', 'フィードバックの生成に失敗しました');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const progress = Math.min(turnCount / maxTurns, 1);

  return (
    <SafeAreaView style={styles.safe}>
      {/* ヘッダー */}
      <LinearGradient
        colors={['#A78BFA', colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleEndEarly} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            👤 {persona.name}（{persona.age}歳）との練習
          </Text>
          <Text style={styles.headerSub}>{levelInfo.label} — {levelInfo.description}</Text>
        </View>
        <Text style={styles.turnCounter}>{turnCount}/{maxTurns}</Text>
      </LinearGradient>

      {/* 進捗バー */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* メッセージ */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* ペルソナ紹介 */}
          <View style={styles.personaCard}>
            <Text style={styles.personaEmoji}>👤</Text>
            <View style={styles.personaInfo}>
              <Text style={styles.personaName}>{persona.name} / {persona.age}歳</Text>
              <Text style={styles.personaDetail}>{persona.personality}</Text>
              <Text style={styles.personaDetail}>趣味: {persona.hobbies}</Text>
            </View>
          </View>

          {messages.map((msg, i) => (
            <View
              key={i}
              style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              {msg.role === 'assistant' && (
                <View style={styles.aiAvatar}>
                  <Text style={styles.aiAvatarText}>{persona.name[0]}</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubbleBody,
                  msg.role === 'user' ? styles.userBubbleBody : styles.aiBubbleBody,
                ]}
              >
                <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}

          {loading && (
            <View style={[styles.bubble, styles.aiBubble]}>
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>{persona.name[0]}</Text>
              </View>
              <View style={styles.typingBubble}>
                <Text style={styles.typingDots}>●●●</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 入力エリア */}
        <View style={styles.inputArea}>
          <TextInput
            style={styles.textInput}
            placeholder={`${persona.name}さんに返信する...`}
            placeholderTextColor={colors.textLight}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={300}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.sendGradient}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  turnCounter: { fontSize: 13, fontWeight: '700', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.round },
  progressBar: { height: 4, backgroundColor: colors.border },
  progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  messageList: { flex: 1 },
  messageContent: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.lg },
  personaCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceWarm,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    gap: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  personaEmoji: { fontSize: 28 },
  personaInfo: { flex: 1 },
  personaName: { fontSize: 14, fontWeight: '700', color: colors.primary },
  personaDetail: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  bubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  userBubble: { justifyContent: 'flex-end' },
  aiBubble: { justifyContent: 'flex-start' },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: { fontSize: 14, fontWeight: '700', color: colors.primaryDark },
  bubbleBody: {
    maxWidth: '72%',
    borderRadius: 18,
    padding: 12,
  },
  userBubbleBody: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubbleBody: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    ...shadow.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: { fontSize: 15, color: colors.text, lineHeight: 22 },
  userBubbleText: { color: '#fff' },
  typingBubble: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    padding: 12,
    ...shadow.sm,
  },
  typingDots: { fontSize: 10, color: colors.textLight, letterSpacing: 4 },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.background,
    maxHeight: 100,
  },
  sendBtn: { borderRadius: 22, overflow: 'hidden' },
  sendBtnDisabled: { opacity: 0.4 },
  sendGradient: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
