// ===== DM返信提案 =====
export type ReplyTone = 'funny' | 'sincere' | 'friendly' | 'cool' | 'cute';

export const REPLY_TONES: { key: ReplyTone; label: string; emoji: string }[] = [
  { key: 'funny', label: '面白い', emoji: '😄' },
  { key: 'sincere', label: '誠実', emoji: '🤝' },
  { key: 'friendly', label: '親しみやすい', emoji: '😊' },
  { key: 'cool', label: 'クール', emoji: '😎' },
  { key: 'cute', label: 'かわいい', emoji: '🥰' },
];

export type RelationshipGoal =
  | 'none'
  | 'invite_date'
  | 'deepen_relationship'
  | 'exchange_contact'
  | 'confess';

export const RELATIONSHIP_GOALS: { key: RelationshipGoal; label: string; emoji: string }[] = [
  { key: 'none', label: 'そのまま続ける', emoji: '💬' },
  { key: 'invite_date', label: 'デートに誘う', emoji: '📅' },
  { key: 'deepen_relationship', label: '仲を深める', emoji: '💕' },
  { key: 'exchange_contact', label: '連絡先交換', emoji: '📱' },
  { key: 'confess', label: '告白する', emoji: '💝' },
];

export interface ReplyToneOption {
  key: ReplyTone;
  label: string;
  emoji: string;
}

export interface ReplyOption {
  text: string;
  advice: string;
  tone: ReplyTone;
}

export interface DMConversation {
  id: string;
  name: string;
  platform: 'line' | 'instagram' | 'matching';
  imageUri?: string;
  lastMessage?: string;
  updatedAt: string;
}

// ===== デートプラン =====
export interface DatePlanInput {
  area: string;
  budget: string;
  preferences: string;
  dateNumber: string;
  startTime: string;
  endTime: string;
  additionalNotes: string;
}

export interface DateSpot {
  name: string;
  time: string;
  duration: string;
  description: string;
  talkTopics: string[];
  tips: string;
}

export interface DatePlan {
  title: string;
  spots: DateSpot[];
  totalBudget: string;
  overallAdvice: string;
}

// ===== 会話練習 =====
export interface PersonaConfig {
  name: string;
  age: string;
  personality: string;
  hobbies: string;
  relationshipStage: string;
  additionalInfo: string;
}

export type PracticeLevel = 1 | 2 | 3 | 4 | 5;

export const PRACTICE_LEVELS: { level: PracticeLevel; label: string; description: string; turns: number }[] = [
  { level: 1, label: 'レベル1', description: '1ターン会話', turns: 1 },
  { level: 2, label: 'レベル2', description: '3ターン会話', turns: 3 },
  { level: 3, label: 'レベル3', description: '5ターン会話', turns: 5 },
  { level: 4, label: 'レベル4', description: '10ターン会話', turns: 10 },
  { level: 5, label: 'レベル5', description: '3分間会話', turns: 20 },
];

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface PracticeFeedback {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    comment: string;
  }[];
  improvements: string[];
  goodPoints: string[];
  nextStepAdvice: string;
}

// ===== Navigation =====
export type RootTabParamList = {
  Home: undefined;
  DM: undefined;
  DatePlan: undefined;
  Practice: undefined;
};

export type DMStackParamList = {
  ConversationList: undefined;
  DMReply: { conversationId?: string; conversationName?: string };
};

export type DatePlanStackParamList = {
  DatePlanForm: undefined;
  DatePlanResult: { plan: DatePlan; input: DatePlanInput };
};

export type PracticeStackParamList = {
  PracticeHome: undefined;
  PersonaSetup: undefined;
  PracticeSession: { persona: PersonaConfig; level: PracticeLevel };
  PracticeFeedback: { feedback: PracticeFeedback; persona: PersonaConfig };
};
