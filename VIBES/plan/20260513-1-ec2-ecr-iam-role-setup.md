# EC2 に ECR 読み取り権限を付与した記録

## 背景・目的

IaC 化（ECR へのイメージプッシュ → EC2 でプル）を進めるにあたり、EC2 インスタンスに IAM ロールが付いておらず ECR にアクセスできない状態だった。既存の IAM ロール `role_ec2_get_s3` に ECR 読み取りポリシーを追加して解決した。

---

## 作業ログと各ステップの解説

### Step 1: EC2 に IAM ロールが付いているか確認

```bash
curl -s http://169.254.169.254/latest/meta-data/iam/info
```

**何をしているか:** EC2 インスタンスメタデータサービス（IMDS）に問い合わせて、アタッチされている IAM ロール情報を取得する。 `169.254.169.254` は EC2 内部からのみアクセスできるリンクローカルアドレス。レスポンスが空 → IAM ロールが未設定だと判明した。

---

### Step 2: 新規 IAM ロールを作成しようとした（→結果的に不要だった）

```bash
# 1. IAMロール作成
aws iam create-role \
  --role-name vkara-ec2-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "ec2.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'
```

**何をしているか:** EC2 サービスが「引き受ける（AssumeRole）」ことを許可した IAM ロールを新規作成する。 `Principal: ec2.amazonaws.com` = EC2 インスタンスだけがこのロールを使えるという意味。 `AssumeRole` = ロールの権限を一時的に借りる操作。

```bash
# 2. ECR読み取り権限をアタッチ
aws iam attach-role-policy \
  --role-name vkara-ec2-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
```

**何をしているか:** AWS マネージドポリシー `AmazonEC2ContainerRegistryReadOnly` をロールに付ける。このポリシーで `ecr:GetDownloadUrlForLayer`・`ecr:BatchGetImage`・`ecr:GetAuthorizationToken` 等が許可される（イメージのプルに必要な操作）。

```bash
# 3. インスタンスプロファイル作成・ロールを追加
aws iam create-instance-profile --instance-profile-name vkara-ec2-profile
aws iam add-role-to-instance-profile \
  --instance-profile-name vkara-ec2-profile \
  --role-name vkara-ec2-role
```

**何をしているか:** IAM ロールは直接 EC2 にアタッチできない。 **インスタンスプロファイル**はロールを EC2 にアタッチするためのラッパー（コンテナ）。ロール → プロファイルに追加 → EC2 にアタッチ、という 2 段構えになっている。

---

### Step 3: 既存ロールを確認

```bash
aws ec2 describe-iam-instance-profile-associations \
  --filters "Name=instance-id,Values=<EC2インスタンスID>" \
  --region ap-northeast-1
```

**何をしているか:** EC2 インスタンスにすでにアタッチされている IAM インスタンスプロファイルを確認する。→ `role_ec2_get_s3` というロールがすでにアタッチ済みだと判明。新規ロールを作る必要はなく、既存ロールに権限を追加すれば済む。

---

### Step 4: 既存ロールに ECR 権限を追加（本命の対応）

```bash
aws iam attach-role-policy \
  --role-name role_ec2_get_s3 \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
```

**何をしているか:** すでに EC2 にアタッチ済みの `role_ec2_get_s3` に対して ECR 読み取りポリシーを追加する。EC2 の再起動や再アタッチは不要。ポリシーの変更は数秒〜数分で EC2 側に反映される。

---

### Step 5: EC2 上でロールが認識されているか確認

```bash
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/iam/info
```

**何をしているか:** IMDSv2（Instance Metadata Service v2）を使ってメタデータを取得する。まず PUT リクエストでセッショントークンを取得し（TTL: 21600秒 = 6時間）、そのトークンを使って IAM 情報を取得する。IMDSv2 は IMDSv1（トークンなし）より SSRF 攻撃に強い。→ `role_ec2_get_s3` が `InstanceProfileArn` として表示されていれば OK。

---

### Step 6: ECR 認証トークンが取得できるか確認

```bash
aws ecr get-login-password --region ap-northeast-1 | head -c 20
```

**何をしているか:** ECR に Docker ログインするための一時的な認証トークン（JWT）を取得する。このトークンを `docker login` に渡すことで ECR からイメージをプルできる。 `head -c 20` は確認用に先頭 20 文字だけ表示（トークン全体をログに残さないため）。→ `eyJwYXlsb2FkIjoidkdY...` のような JWT の先頭が表示されれば権限付与成功。

---

## まとめ

| 作業 | 結果 |
| --- | --- |
| EC2 への IAM ロール付与状況を確認 | `role_ec2_get_s3` がすでにアタッチ済みだった |
| 新規ロール作成は不要と判断 | 既存ロールに ECR ポリシーを追加する方針に変更 |
| `AmazonEC2ContainerRegistryReadOnly` を追加 | ECR からのイメージプルが可能になった |
| EC2 上で動作確認 | トークン取得成功 → ECR アクセス OK |

## Terraform への反映

`ec2.tf` の IAM ロール定義に `AmazonEC2ContainerRegistryReadOnly` ポリシーのアタッチを追加する必要がある。現状は手動で付けているため、`terraform plan` を実行すると差分として検出される可能性あり。
