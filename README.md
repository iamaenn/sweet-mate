# 💝 Sweet Mate — 恋愛AIコンサルタントアプリ

スマートフォン向けの恋愛AIコンサルタントアプリです。

## 機能

### 1. 💬 DM返信提案
- LINE / Instagram / マッチングアプリのスクリーンショットをアップロード
- トーン別（面白い・誠実・親しみやすい・クール・かわいい）に返信案を3つ提案
- 恋愛セオリーのワンポイントアドバイス付き
- 関係の進め方を指定（デートに誘う、告白など）
- AIへの追加指示欄あり

### 2. 📅 デートプラン作成
- エリア・予算・相手の好み・何回目のデート・時間を入力
- AIがタイムテーブルを自動生成
- 各スポットで使える会話のネタも提案

### 3. 🎤 会話練習
- デート相手のペルソナをカスタム設定（プリセットあり）
- レベル1（1ターン）→ レベル5（3分相当）まで段階的に練習
- 練習後にAIから詳細なフィードバック

## セットアップ

### ① Node.js のインストール（まだの場合）
1. https://nodejs.org/ja/ にアクセス
2. **LTS版**（推奨版）をダウンロード・インストール
3. インストール後、PowerShellを再起動して `node -v` で確認

### ② Expo Go アプリのインストール
- **iPhone**: App Store で「Expo Go」を検索
- **Android**: Google Play で「Expo Go」を検索

### ③ インストール手順
**以下をコピーして、PowerShellに貼り付けること！**

```bash
# 依存パッケージのインストール
# 開発コンテナ起動時にインストールされるため、不要
# npm install

# .envファイルにAPIキーを設定
# EXPO_PUBLIC_ANTHROPIC_API_KEY=あなたのAPIキー

# 開発サーバーを起動
npx expo start --tunnel
```

### APIキーの取得
1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. アカウント作成・ログイン
3. API Keys から新しいキーを作成
4. `.env` ファイルの `EXPO_PUBLIC_ANTHROPIC_API_KEY=` の後に貼り付け

### スマートフォンでの実行
1. スマートフォンに **Expo Go** アプリをインストール
2. `npx expo start --tunnel` を実行するとQRコードが表示される
3. iOSはカメラ、AndroidはExpo GoアプリでQRコードを読み取る

## 技術スタック
- **Framework**: React Native + Expo SDK 51
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **AI**: Anthropic Claude API (claude-sonnet-4-6)
- **Storage**: AsyncStorage
- **UI**: カスタムコンポーネント + expo-linear-gradient

## ファイル構成
```
sweet-mate/
├── App.tsx                    # エントリーポイント
├── .env                       # 環境変数（APIキー）
├── src/
│   ├── constants/theme.ts     # カラー・スタイル定数
│   ├── types/index.ts         # TypeScript型定義
│   ├── services/claudeApi.ts  # Claude API連携
│   ├── navigation/            # ナビゲーション設定
│   ├── components/            # 共通コンポーネント
│   └── screens/               # 各画面
│       ├── HomeScreen.tsx
│       ├── dm/                # DM返信提案
│       ├── dateplan/          # デートプラン
│       └── practice/          # 会話練習
```
