# Terraform IaC 化（現状の AWS 構成をコードに書き起こす）

## 背景・目的

現在の AWS 構成を Terraform コードとして保存しておく。
将来のさくらのインターネットへの移行時に、インフラ構成の参照・再現に使う。

## 方針

- **`terraform import`** で既存リソースを Terraform 管理下に取り込む
- `terraform plan` で差分ゼロになることを目標とする
- ALB の DNS 名は変わらないため Cloudflare 側の設定変更は不要

## 確定済みのインフラ構成

```txt
[ブラウザ]
    ↓ HTTPS
[Cloudflare] プロキシ済み
    ↓ CNAME
[ALB] <ALB_DNS_NAME>
    ├── v-karaoke.com         → EC2:80  (Next.js)
    └── backend.v-karaoke.com → EC2:8080 (Go API)

[EC2] t3a.micro, AMI: ami-054400ced365b82a0
  └── docker-compose
        ├── app: Next.js  (port 80)
        └── api: Go/Gin   (port 8080)

[RDS] MySQL 8.4.7, db.t3.micro, 暗号化あり

[S3] ***REMOVED*** / ***REMOVED***（env ファイル保管用）
```

## ディレクトリ構成

```txt
infra/
└── terraform/
    ├── main.tf            # provider / backend (S3) 設定
    ├── variables.tf       # 変数定義
    ├── outputs.tf         # ALB DNS 名等
    ├── vpc.tf             # VPC / サブネット / IGW / ルートテーブル / VPCE
    ├── security_group.tf  # ALB / EC2 / RDS のセキュリティグループ
    ├── alb.tf             # ALB / ターゲットグループ / リスナー
    ├── ec2.tf             # EC2 インスタンス / IAM
    ├── rds.tf             # RDS インスタンス / サブネットグループ
    ├── s3.tf              # env 用 S3 バケット
    ├── acm.tf             # ACM 証明書（import のみ）
    └── import.sh          # terraform import コマンド集
```

## 実装ステップ

### Step 1: AWS CLI でリソース ID を収集（完了）

AWS CLI を使い全リソースの ID を自動取得した。

### Step 2: Terraform ファイルを書く（完了）

### Step 3: terraform import を実行する（完了）

```bash
bash infra/terraform/import.sh
```

### Step 4: 差分確認（完了）

```bash
terraform plan  # Plan: 3 to add, 2 to change, 0 to destroy
```

## .gitignore に追加するもの

```gitignore
infra/terraform/.terraform/
infra/terraform/.terraform.lock.hcl
infra/terraform/terraform.tfvars
infra/terraform/*.tfstate
infra/terraform/*.tfstate.backup
```

## 完了条件

- [x] `terraform validate` が通る
- [x] `terraform plan` で差分がゼロ（または意図した差分のみ）
- [x] シークレットが `.tf` に含まれない
- [x] `import.sh` に全リソースの import コマンドが記載されている
- [ ] `.gitignore` が更新されている

## 残存差分（許容済み）

| リソース | 種別 | 理由 |
| --- | --- | --- |
| `aws_lb_listener` x2 | will be updated | `forward` ブロックと `target_group_arn` の二重管理（provider の import 制限）。AWS 上の設定は変わらない |
| `aws_lb_target_group_attachment` x3 | will be created | import 非対応リソース。apply しても既に登録済みなので変化なし |

## 将来のさくら移行への備え

このコードを参照することで以下が再現できる:

- ネットワーク構成（VPC / サブネット / SG）
- サーバースペック（インスタンスタイプ）
- DB 設定（MySQL バージョン / パラメータ）
- ALB のルーティングルール

さくらへの移行は別の計画ファイル（`20260427-2-sakura-migration.md`）で管理する。
