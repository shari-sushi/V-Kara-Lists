# データベース ルール (MySQL / GORM / AWS RDS)

## 環境

| 環境         | 種別                   | 接続先             |
| ------------ | ---------------------- | ------------------ |
| ローカル開発 | Docker (mysql:8.0.32)  | localhost:3306     |
| 本番 (EC2)   | AWS RDS (MySQL 8.0.32) | RDS エンドポイント |

- 文字コード: utf8mb4（絵文字対応）
- 照合順序: utf8mb4_unicode_ci

## スキーマ管理

スキーマは **GORM のオートマイグレーション** で管理する。

型定義（テーブル定義の正とする）:

- [t0016Go/domain/user.go](t0016Go/domain/user.go)
- [t0016Go/domain/vtuber_content.go](t0016Go/domain/vtuber_content.go)
- [t0016Go/domain/favorite.go](t0016Go/domain/favorite.go)

マイグレーション設定:

- [t0016Go/infra/db.go](t0016Go/infra/db.go)

### AutoMigrate の挙動

- フィールド追加 → カラムが自動追加される
- **カラムの削除・変更は AutoMigrate では行われない** → 手動で `ALTER TABLE` が必要

## カラム変更が必要な場合

本番（RDS）での実行前に必ずバックアップを取ること:

```bash
mysqldump -h <RDSエンドポイント> -u <ユーザー> -p <DB名> > backup_$(date +%Y%m%d).sql
```

```sql
-- カラム削除
ALTER TABLE karaokes DROP COLUMN old_column;

-- カラム名変更
ALTER TABLE karaokes CHANGE old_name new_name VARCHAR(100);

-- カラム型変更
ALTER TABLE karaokes MODIFY COLUMN song_name VARCHAR(200);
```

## インデックス設計

- ユニーク制約は GORM 構造体の `uniqueIndex` タグで管理する
- 複合ユニーク制約は `uniqueIndex:インデックス名` で同名を揃える

## ローカル DB 操作

```bash
# MySQL に接続
make mysql

# テーブル確認
SHOW TABLES;
DESCRIBE karaokes;
```

## DB の初期化

```bash
docker-compose down -v  # ボリュームごと削除
docker-compose up -d db # 再起動（db/initdb.d/create.sql が再実行される）
```
