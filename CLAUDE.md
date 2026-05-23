# Sweet Mate — Claude 作業ルール

Expo SDK 54 + TypeScript の恋愛AIコンサルタントアプリ。アプリの概要は [README.md](./README.md) 参照。

## 作業ディレクトリ

**必ずプロジェクトルート (`/Users/keita/Developments/sweet-mate/`) 配下のファイルを編集すること。**

- `.claude/worktrees/` 配下のワークツリーは **編集対象に含めない**(ローカル一時ファイル、`.gitignore` 済み)
- Devcontainer 内では `/workspaces/sweet-mate/` がルートに対応する
- 同名ファイルがワークツリーとルートに両方ある場合、ルート側のみを編集する

## 依存パッケージ

- 新規追加・バージョン更新は **`npx expo install <package>`** を優先(SDK 互換版に整合するため)
- `package.json` を直接書き換えるより CLI を通す
- ピア依存衝突が出たら、まず関連パッケージ(`@react-navigation/*` など)のバージョンを揃えてから `--legacy-peer-deps` を検討
- TypeScript / `@types/react` は **`devDependencies`** に置く(`npx expo install` はそのまま `dependencies` に入れがちなので注意)

## Devcontainer

- `.devcontainer/Dockerfile` は Node 20 (Bookworm) + watchman ベース
- `node_modules` は bind マウントで運用(名前付きボリュームは権限問題のため使わない)
- 実機テスト: `npx expo start --tunnel` → iPhone Expo Go(SDK 54)で QR スキャン
- Web プレビュー: ポート 19006 が自動で開く

## コミット

- `.claude/settings.json` (チーム共有許可コマンド) と `.claude/settings.local.json` (個人設定) は **コミット対象**
- `.claude/worktrees/` は `.gitignore` 済み
- 機能単位で論理的に分割してコミット
