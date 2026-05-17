# Terraform 基礎

## Terraform とは

「インフラをコードで管理するツール」。AWS リソース（EC2・RDS など）をマネジメントコンソールで手動作成する代わりに、`.tf` ファイルに書いた設定を `terraform apply` で一括作成・変更・削除できる。

### 基本的な考え方：「あるべき姿」を宣言する

コードで「こういうインフラが欲しい」と書くと、Terraform が現在の AWS の状態と比較して差分を埋めてくれる。

```
.tf ファイル（あるべき姿）
        ↓  terraform plan  → 差分を確認
        ↓  terraform apply → AWS に反映
AWS の実際のリソース
```

### 基本コマンド

```bash
terraform init    # 初期化（プロバイダのダウンロード等）
terraform plan    # 変更内容のプレビュー（実際には何もしない）
terraform apply   # 実際に AWS に反映
```

### state ファイルとは

Terraform は「今どんなリソースを管理しているか」を **state ファイル**（`terraform.tfstate`）に記録する。

```txt
.tf ファイル  ←比較→  state ファイル  ←比較→  実際の AWS
```

state がなければ「どこまで作ったか」がわからないため、チーム開発では S3 などのリモートに保存するのが一般的。

## main.tf

`main.tf` は Terraform 自体の設定を書くエントリポイント的なファイル。主に以下の 3 つのブロックで構成される。

### `terraform {}` ブロック

Terraform 本体とプロバイダのバージョン、state ファイルの保存先を設定する。

```hcl
terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "<state 保存用バケット名>"
    key    = "<バケット内のパス>/terraform.tfstate"
    region = "ap-northeast-1"
  }
}
```

- `required_version` — 使用する Terraform 本体のバージョン制約
- `required_providers` — 使用するプロバイダ（AWS/GCP 等）とそのバージョン
- `backend "s3"` — state ファイルを S3 に保存する設定。ローカル保存だとマシン紛失時にリカバリできないため、チーム開発では S3 保存が推奨される

**注意: バケット自体は事前に手動で作成しておく必要がある。** `backend "s3"` に書いただけでは自動作成されない。バケットが存在しない状態で `terraform init` を実行するとエラーになる。

```txt
# この順番で行う
1. AWS コンソールや CLI でバケットを手動作成
2. main.tf の backend "s3" にそのバケット名を書く
3. terraform init → 以降 apply のたびに自動で state が S3 に保存される
```

これは「state を保存するバケットを作る」操作自体も Terraform で管理したいが、その結果を保存する state がまだ存在しない、という鶏と卵問題があるため。

### `provider "aws" {}` ブロック

操作対象の AWS リージョンを指定する。

```hcl
provider "aws" {
  region = var.aws_region
}
```

- リージョンは変数（`var.aws_region`）で管理するのが一般的
- AWS 認証情報（アクセスキー等）はコードに書かず、`~/.aws/credentials` や環境変数から読み込む

### `provider` と `backend` の違い

|            | 役割                                        |
| ---------- | ------------------------------------------- |
| `provider` | どの AWS（どのリージョン）を操作するか      |
| `backend`  | Terraform の記録（state）をどこに保存するか |

## apply 前に必ず確認すること

**いきなり apply は危険。** Terraform は「あるべき姿」に合わせるため、既存リソースを削除・再作成することがある（RDS が消えるなど）。

### 安全な手順

```bash
terraform init                # エラーなく完了するか確認
terraform plan -out=tfplan    # 差分を必ず読む。-out でファイルに保存
terraform apply tfplan        # 保存した plan だけを適用
```

`-out` を使うと plan と apply の間に `.tf` が変わっても適用内容が変わらないので安全。

### plan の出力で注目する記号

| 記号  | 意味           | 対応           |
| ----- | -------------- | -------------- |
| `+`   | 新規作成       | 基本安全       |
| `~`   | 設定変更       | 内容を確認     |
| `-`   | 削除           | 必ず立ち止まる |
| `-/+` | 削除して再作成 | 必ず立ち止まる |

plan 末尾の `X to destroy` が 1 以上あったら、何が消えるかを確認してから apply する。
