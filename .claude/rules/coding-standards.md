# コーディング規約

## 共通ルール (Issue #71 準拠)

### コメント

- 関数名・変数名で意図が伝わるようにする（コードを自己文書化）
- 複雑なロジックやコードから読めない意図のみ日本語コメントを付ける
- 実装の詳細はPRの説明に書く
- 不要になったコメントアウトコードは即削除する（稀な例外を除く）

### 命名規則

- 略しすぎる名前は禁止（一時変数を除く）
- 未使用の関数・変数は削除する

---

## TypeScript (フロントエンド)

### 基本方針

- TypeScript のみ使用（`.js` ファイルは作らない）
- `strict: true` を維持する
- `any` 型は使わない。型が不明な場合は `unknown` を使い、型ガードで絞る

### パスエイリアス

- `src/` 配下のモジュールは `@/` エイリアスを使う
- 相対パス (`../`) は使わない

```typescript
// Good
import { Layout } from "@/components/layout/Layout";
import type { ReceivedKaraoke } from "@/types/vtuber_content";

// Bad
import { Layout } from "../../components/layout/Layout";
```

### 命名規則

| 対象                 | 規則                                             | 例                                 |
| -------------------- | ------------------------------------------------ | ---------------------------------- |
| ファイル             | PascalCase (コンポーネント) / camelCase (その他) | `VtuberTable.tsx` / `useVtuber.ts` |
| 型・インターフェース | PascalCase                                       | `ReceivedVtuber`                   |
| 関数・変数           | camelCase                                        | `fetchVtuberList`                  |
| 定数                 | UPPER_SNAKE_CASE                                 | `API_BASE_URL`                     |

### エラーハンドリング

- ユーザーに伝わるエラーメッセージを表示する
- `console.log` はデバッグ用途のみ。本番コードに残さない

---

## Go (バックエンド)

### 基本方針

- Go 1.18 のみ使用 ←update 予定
- `go vet` / `go build` が通ること
- エラーは適切に処理し、握りつぶさない (`_ = err` は禁止)

### 命名規則

| 対象           | 規則                                   | 例                          |
| -------------- | -------------------------------------- | --------------------------- |
| ファイル       | snake_case                             | `vtuber_content.go`         |
| 型・構造体     | PascalCase                             | `VtuberContent`             |
| 関数・メソッド | PascalCase (公開) / camelCase (非公開) | `GetVtubers` / `buildQuery` |
| 変数           | camelCase                              | `vtuberId`                  |
| 定数           | PascalCase or UPPER_SNAKE_CASE         | `MaxRetries`                |

### ~~クリーンアーキテクチャの層を意識する~~ 3層アーキテクチャかつ要所での依存性分離、逆転を意識する

```
domain/       ← エンティティ・インターフェース定義のみ（外部依存なし）
useCase/      ← ビジネスロジック（DBを直接触らない）
interfaces/   ← HTTPハンドラ・DBクエリ実装
infra/        ← DB接続・ルーティング設定
```

- 上位層が下位層に依存しない方向を維持する
- `domain/` に Gin や GORM を import しない

### エラーハンドリング

```go
// Good
result, err := someFunc()
if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
}

// Bad
result, _ := someFunc()
```

---

## 完了基準

実装が完了したと言えるのは以下をすべて満たした場合:

- TypeScript: `npm run build` が型エラーなしで通る
- TypeScript: `npm run lint` が通る
- Go: `go build ./...` が通る
- Go: `go test ./...` が通る（既存テストが壊れていない）
