# ALB → Caddy 本番切替 runbook（#372）

ALB を廃止し、EC2 上の Caddy で TLS を終端する。証明書は Cloudflare Origin Certificate を使い、Cloudflare の SSL モードは Full(strict) にする。作業はすべて手動で行う。値はプレースホルダで書く（`<EIP>` など。実際の値はコミットしない）。

## 前提条件

- [ ] **#398（DB 再設計）の本番リリースが完了していること**。この PR は `ec2-docker-compose.yml` を変更するため、デプロイ時に api と app の `latest` が pull される。データ移行の前に新しい api が本番に出るのを防ぐため
- [ ] 本番デプロイ（`.github/workflows/deploy.yml`）が成功する状態に戻っていること
- [ ] EC2 の SG（`v-kara-ec2-instance`）の 80/8080 が **ALB SG からのみ** 許可されていること（0.0.0.0/0 になっていないこと）。移行期間中は api の 8080 がホストに公開されたままになるため
- [ ] EC2 のディスクに、デプロイ前の時点で **300MB 以上** の空きがあること（`df -h /`）。ルートボリュームは 8GB で、余裕が少ない。Caddy のイメージ（alpine、約 50MB）の pull と証明書の配置に必要。足りないとデプロイが失敗する
- [ ] AWS CLI は `--profile vkara` で実行する
- [ ] 作業中は RDS / DB の変更を行わない（DB 移行とは直列で行う）

確認コマンド（読み取りのみ）:

```bash
aws ec2 describe-security-groups --profile vkara \
  --filters Name=group-name,Values=v-kara-ec2-instance \
  --query 'SecurityGroups[0].IpPermissions[].{port:FromPort,cidr:IpRanges[].CidrIp,sg:UserIdGroupPairs[].GroupId}'
```

## 手順

### 1. Origin Certificate を発行し、S3 に置く

1. Cloudflare ダッシュボード → `v-karaoke.com` → SSL/TLS → Origin Server → Create Certificate
   - 鍵の種類: RSA（2048）
   - ホスト名: `v-karaoke.com`, `*.v-karaoke.com`
   - 有効期限: 15年
2. 証明書を `origin.pem`、秘密鍵を `origin.key` として**一時ディレクトリ**に保存する（リポジトリ内には置かない）
3. API env バケットにアップロードし、ローカルのファイルを削除する

```bash
aws s3 cp origin.pem s3://<API_ENV_BUCKET>/caddy/origin.pem --profile vkara
aws s3 cp origin.key s3://<API_ENV_BUCKET>/caddy/origin.key --profile vkara
rm origin.pem origin.key
```

### 2. Terraform を apply する（IAM 許可、EIP）

```bash
cd infra/terraform
terraform plan   # 差分が aws_iam_policy.policy_get_s3 の変更と aws_eip.app の追加だけであることを確認する
terraform apply
terraform output ec2_public_ip   # = <EIP>
```

- EIP を関連付けると、EC2 のパブリック IP が変わる。DNS は ALB を向いており、デプロイは SSM 経由なので、サービスへの影響は無い
- SSH を使う場合は、接続先を `<EIP>` に変更する

### 3. PR をマージしてデプロイする

- deploy で Caddyfile と証明書が配置され、`db api app caddy` が再作成される（compose の変更として扱われるため）
- **db コンテナも再作成されるため、数十秒間 API が止まる**（db が healthy になるまで api は起動しない）。アクセスの少ない時間帯に行う
- 証明書の取得に失敗した場合、`set -e` によって compose の再作成前に中断する。そのため既存のコンテナはそのまま動き続ける
- この時点では DNS はまだ ALB を向いている。経路は次のとおりで、サイトは止まらない
  - ALB :443 → EC2:80（Caddy の `:80` ブロック）→ app
  - ALB :443（host が backend）→ EC2:8080 → api

確認（EC2 上で SSM か SSH から実行）:

```bash
df -h /                                     # 空きが残っているか
docker ps --format '{{.Names}}\t{{.Status}}'  # v_kara_db が (healthy)、v-kara-api / v-kara-app / v-kara-caddy が Up
curl -s -o /dev/null -w '%{http_code}\n' -H 'Host: 10.0.0.1' http://localhost/user/signin       # ALB のヘルスチェック相当。200
curl -sk -o /dev/null -w '%{http_code}\n' --resolve v-karaoke.com:443:127.0.0.1 https://v-karaoke.com/user/signin   # 200
curl -sk -o /dev/null -w '%{http_code}\n' --resolve backend.v-karaoke.com:443:127.0.0.1 https://backend.v-karaoke.com/health  # 200
```

AWS コンソールで、ALB の app TG が healthy のままであることも確認する。

### 4. SG に Cloudflare からの 443 を追加する

EC2 の SG は Terraform で `ignore_changes = [ingress]` になっているため、CLI で追加する。

```bash
SG_ID=<EC2_SG_ID>
for cidr in $(curl -s https://www.cloudflare.com/ips-v4); do
  aws ec2 authorize-security-group-ingress --profile vkara --group-id "$SG_ID" \
    --ip-permissions "IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=$cidr,Description=cloudflare}]"
done
for cidr in $(curl -s https://www.cloudflare.com/ips-v6); do
  aws ec2 authorize-security-group-ingress --profile vkara --group-id "$SG_ID" \
    --ip-permissions "IpProtocol=tcp,FromPort=443,ToPort=443,Ipv6Ranges=[{CidrIpv6=$cidr,Description=cloudflare}]"
done
```

- 80 は開けない。HTTP→HTTPS のリダイレクトは Cloudflare のエッジで行う
- IPv6 のルールは、EC2 に IPv6 が無ければ実質的に使われない。ただし Cloudflare のレンジ一覧と揃えておく

### 5. Cloudflare の設定

- SSL/TLS の暗号化モード: **Full (strict)**（すでにそうなっていれば変更しない）
- SSL/TLS → Edge Certificates → **Always Use HTTPS: ON**（現状の `http://v-karaoke.com` の 502 も解消される）

### 6. DNS を切り替える

Cloudflare → DNS で、次の 2 レコードを変更する。

| 名前 | 変更前 | 変更後 |
| --- | --- | --- |
| `v-karaoke.com` | CNAME → ALB の DNS 名（Proxied） | A → `<EIP>`（Proxied） |
| `backend.v-karaoke.com` | CNAME → ALB の DNS 名（Proxied） | A → `<EIP>`（Proxied） |

変更前の CNAME の値は、ロールバック用に控えておく。

### 7. 確認

- [ ] `https://v-karaoke.com/` のトップページが表示される
- [ ] ログインと、ログイン後の操作（Cookie）が動く
- [ ] `https://backend.v-karaoke.com/health` が 200 を返す
- [ ] `http://v-karaoke.com/` が `https://` にリダイレクトされる
- [ ] `docker logs v-kara-caddy` にエラーが無い
- [ ] ALB の CloudWatch メトリクス（RequestCount）が数分でほぼ 0 になる
- [ ] `docker stats --no-stream` でメモリに余裕がある（t3a.micro）

### 8. 後始末（数日様子を見てから、別 PR）

- [ ] Terraform から `aws_lb`、`aws_lb_listener`（http / https）、`aws_lb_listener_rule.backend`、`aws_lb_target_group`（app / api / app_to_http）、attachment、`aws_security_group.alb` を削除して apply する
- [ ] `ec2-docker-compose.yml` から api の `8080:8080` のホスト公開を外す（deploy のヘルスチェックも Caddy 経由のみにする）
- [ ] EC2 の SG から、ALB SG を参照する 80/8080 のルールを削除する（CLI）
- [ ] ACM 証明書（`prevent_destroy`）を残すかどうかを判断する。削除するなら `prevent_destroy` を外してから行う
- [ ] `outputs.tf` の `alb_dns_name` を削除する
- [ ] `t0016Go/cmd/main.go` のコメント（AWS のヘルスチェックについて）を必要に応じて更新する

## ロールバック

| 状況 | 手順 |
| --- | --- |
| 手順 6 の後に不具合が出た | Cloudflare の DNS を、控えておいた ALB の CNAME に戻す（ALB は残してあるので、すぐに戻る） |
| 手順 3 の後に ALB 経由の経路が壊れた | 直前のコミットを revert して develop に push し、再デプロイする。急ぐ場合は EC2 上で `docker-compose -f ec2-docker-compose.yml stop caddy` を実行し、旧 compose（app が `80:80`）で `up -d app` する |
| 証明書の問題（526 エラーなど） | Cloudflare の SSL モードを一時的に Full に下げて原因を調べる。S3 の証明書と鍵を確認し、再取得して `docker restart v-kara-caddy` |

## Cloudflare の IP レンジの更新手順

出典: <https://www.cloudflare.com/ips-v4> と <https://www.cloudflare.com/ips-v6>（API: `https://api.cloudflare.com/client/v4/ips`）

レンジはまれに変わる。半年に一度程度、または Cloudflare からの告知があったときに確認する。

1. 上の URL の一覧と、`infra/caddy/Caddyfile` の `trusted_proxies static` を比較する
2. 差分があれば Caddyfile を更新して PR を出す（`infra/caddy/` の変更は deploy で caddy だけが再作成される）
3. SG についても、手順 4 と同じ方法で不足分を追加し、不要になったレンジを `revoke-security-group-ingress` で削除する

## 外形監視

UptimeRobot（無料枠、5分間隔）に次を登録する。

- `https://v-karaoke.com/user/signin`（HTTP 200）
- `https://backend.v-karaoke.com/health`（HTTP 200）

通知先はメールか Discord の webhook。
