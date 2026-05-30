import Anthropic from '@anthropic-ai/sdk';
import {
  ReplyTone,
  RelationshipGoal,
  ReplyOption,
  DatePlanInput,
  DatePlan,
  PersonaConfig,
  ChatMessage,
  PracticeFeedback,
} from '../types';

// APIキーは環境変数または設定から取得
// 実際の運用では安全なキー管理を行うこと
const getClient = () => {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '';
  if (!apiKey) {
    throw new Error('Anthropic APIキーが設定されていません。.envファイルにEXPO_PUBLIC_ANTHROPIC_API_KEYを設定してください。');
  }
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
};

// ===== DM返信提案 =====
export async function generateDMReplies(
  screenshotDescription: string,
  tone: ReplyTone,
  goal: RelationshipGoal,
  userInstruction: string
): Promise<ReplyOption[]> {
  const client = getClient();

  const toneMap: Record<ReplyTone, string> = {
    funny: '面白い・ユーモラス',
    sincere: '誠実・真摯',
    friendly: '親しみやすい・フレンドリー',
    cool: 'クール・落ち着いた',
    cute: 'かわいい・甘い',
  };

  const goalMap: Record<RelationshipGoal, string> = {
    none: 'そのままの関係を続ける',
    invite_date: 'デートに誘う',
    deepen_relationship: '仲をもっと深める',
    exchange_contact: '連絡先を交換する',
    confess: '好意を伝える・告白する',
  };

  const prompt = `あなたは恋愛コンサルタントAIです。以下のLINE/Instagram/マッチングアプリのやり取りの内容を見て、返信案を3つ提案してください。

【会話の内容・状況】
${screenshotDescription}

【希望するトーン】
${toneMap[tone]}

【関係の進展目標】
${goalMap[goal]}

${userInstruction ? `【ユーザーからの追加指示】\n${userInstruction}` : ''}

以下のJSON形式で返答してください（必ず有効なJSONのみ返すこと）:
{
  "replies": [
    {
      "text": "返信メッセージ本文",
      "advice": "なぜこの返信が良いのかの恋愛セオリーに関するワンポイントアドバイス（50〜80文字）",
      "tone": "${tone}"
    }
  ]
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('APIレスポンスの解析に失敗しました');

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.replies as ReplyOption[];
}

// ===== デートプラン作成 =====
export async function generateDatePlan(input: DatePlanInput): Promise<DatePlan> {
  const client = getClient();

  const prompt = `あなたは恋愛・デートプランニングの専門家AIです。以下の条件で理想的なデートプランを作成してください。

【エリア】${input.area}
【予算】${input.budget}
【相手の好み・特徴】${input.preferences}
【何回目のデートか】${input.dateNumber}回目
【デート時間】${input.startTime} 〜 ${input.endTime}
${input.additionalNotes ? `【その他希望事項】${input.additionalNotes}` : ''}

以下のJSON形式で返答してください（必ず有効なJSONのみ返すこと）:
{
  "title": "デートプランのタイトル",
  "spots": [
    {
      "name": "スポット名",
      "time": "訪問時刻（例: 13:00）",
      "duration": "滞在時間（例: 1時間30分）",
      "description": "スポットの説明と雰囲気（50〜100文字）",
      "talkTopics": ["会話トピック1", "会話トピック2", "会話トピック3"],
      "tips": "このスポットでのデートのコツやポイント（30〜60文字）"
    }
  ],
  "totalBudget": "予算合計の目安",
  "overallAdvice": "このデートプラン全体のアドバイス（100〜150文字）"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('APIレスポンスの解析に失敗しました');

  return JSON.parse(jsonMatch[0]) as DatePlan;
}

// ===== 会話練習：AIの返答生成 =====
export async function generatePracticeResponse(
  persona: PersonaConfig,
  messages: ChatMessage[],
  isFirstMessage: boolean
): Promise<string> {
  const client = getClient();

  const systemPrompt = `あなたは恋愛会話練習アプリのAIパートナーです。
以下のペルソナとして自然な会話をしてください。

【ペルソナ情報】
名前: ${persona.name}
年齢: ${persona.age}歳
性格: ${persona.personality}
趣味: ${persona.hobbies}
関係性の段階: ${persona.relationshipStage}
${persona.additionalInfo ? `その他: ${persona.additionalInfo}` : ''}

【会話のルール】
- ペルソナのキャラクターに忠実に、リアルな返答をする
- 返答は2〜4文程度の自然な長さにする
- 相手が次に話しやすいような会話の流れを作る
- ${isFirstMessage ? '最初のメッセージなのでフレンドリーに話しかけてください' : '会話の流れを自然に続けてください'}`;

  const anthropicMessages = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// ===== 会話練習：フィードバック生成 =====
export async function generatePracticeFeedback(
  persona: PersonaConfig,
  messages: ChatMessage[]
): Promise<PracticeFeedback> {
  const client = getClient();

  const conversationText = messages
    .map(m => `${m.role === 'user' ? 'あなた' : persona.name}: ${m.content}`)
    .join('\n');

  const prompt = `あなたは恋愛コンサルタントです。以下の会話練習の内容を分析して、詳細なフィードバックを提供してください。

【会話相手のペルソナ】
名前: ${persona.name} (${persona.age}歳)
性格: ${persona.personality}
趣味: ${persona.hobbies}

【会話内容】
${conversationText}

以下のJSON形式で返答してください（必ず有効なJSONのみ返すこと）:
{
  "overallScore": 75,
  "categories": [
    { "name": "会話の自然さ", "score": 80, "comment": "コメント" },
    { "name": "共感・傾聴", "score": 70, "comment": "コメント" },
    { "name": "質問の質", "score": 75, "comment": "コメント" },
    { "name": "ユーモア", "score": 65, "comment": "コメント" },
    { "name": "関係進展", "score": 80, "comment": "コメント" }
  ],
  "goodPoints": ["良かった点1", "良かった点2"],
  "improvements": ["改善点1", "改善点2"],
  "nextStepAdvice": "次の練習に向けたアドバイス（100文字以内）"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('APIレスポンスの解析に失敗しました');

  return JSON.parse(jsonMatch[0]) as PracticeFeedback;
}
