# V-kara開発

はじめまして。

IT業界未経験、プログラミング未経験の状態から独学でwebアプリを作製しました。<br/>
きっかけは趣味で使いたいアプリが無かったことです。<br/>
自分用に開発し始めてすぐにのめり込み仕事にしたいと思うようになり、一般向けに軌道修正してポートフォリオとしました。<br/>

---
※この内容は[Qiitaの記事](https://qiita.com/shari_sushi/items/ed4a06518d29e5c87d77)と同じです。(4/25時点)<br/>
　また、当面はQiitaのみ更新の予定です。
 
---

## 自己紹介

- 30歳男
- バックエンド志望
- 理系私大卒
  - 生物化学系
コロナでお馴染みとなったPCRもやってました
- 職歴
  - 排水処理の薬品・プラントで営業技術6年(mac)
  - めっき薬品の営業技術2年(windows)
  - 個人開発１年(一部在職中)
- 2023年末に退職
- ITの理解度
  - ２年前の自分「javaとjavascriptは全然違うってネットでよく見る」「HTMLって何？」


## ポートフォリオ
### 概要
- サイト: [V-kara](https://v-karaoke.com)
V-karaはVTuberの歌枠の歌情報を登録し、いつでも見返せるwebアプリです。<br/>
歌枠とは配信者がカラオケのように沢山歌う配信のことで、`どの配信の何分何秒に何を歌ったか`の把握が難しいのが唯一の欠点です。<br/>
V-karaはその欠点を補い、歌の検索、視聴、布教までシームレスできます。<br/>
　ただし、コンテンツ情報はユーザーによる入力が必要で、ユーザー同士で作り上げるDBのような立ち位置です。<br/>
※ゲストログイン可能です。
- リポジトリ: [GitHub](https://github.com/shari-sushi/V-Kara-Lists)
- サイトデモ動画: [YouTube](https://youtu.be/HunsO-8Eo7Q)


## webアプリ主要ページ紹介

### 共通仕様
- 曲名をクリック
ページ内の動画が切り替わり、その曲からスタート
- 曲名の右のコピーアイコンクリック
その動画のその曲から再生できるURLをクリップボードに保存
- 表のソート
- ページを開いた際に動画の自動再生

###  TOPページ
<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/23d6f0a7-9e86-cf88-a24d-82ad19a677f6.png" width="400px" />

### 全歌一覧ページ
- ドロップダウンで選択/検索でき、表をfilterする

<image src="https://github.com/shari-sushi/0007test/assets/127638412/d219a34f-e00a-4031-88b7-fb2f6f31005b" width="400px" />

### VTuber個別ページ
- VTuver毎にURLが個別生成される
そのままブクマや布教できる
- ページを開いた際に、このVTuberの登録曲がランダムで選ばれ再生が始まります。

<image src="https://github.com/shari-sushi/0007test/assets/127638412/76243bc6-be19-4054-b7ce-ea91da0692ca" width="400px" />

### データ入力ページ
- ページ中央のラジオボタンで入力するコンテンツを選択
<image src="https://github.com/shari-sushi/0007test/assets/127638412/822e3f3a-d532-4c9f-8806-9bc6a6582462" width="400px" />

### レスポンシブ対応

| 通常画面 | ハンバーガーメニュー |
|:-:|:-:|
|<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/3874fe7c-36c3-5f69-07c1-8c4ecc007245.jpeg" width="250px" />|<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/1036975f-d152-15c0-bc9b-6cc5db332ec9.jpeg" width="250px" />|

### ステルスリリースページ
アクセス方法は秘密です。<br/>
<br/>
※元々使っていたのですが、ステルスリリースという一般的にある手法ということを昨晩知ったので掲載しました。(4/9追記)

<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/9d35bfc6-6ee6-27d8-1957-28a5029881af.png" width="400px" />




## __技術__
### 使用技術
  
| 言語、サービス  | フレームワーク/ライブラリ |
| --- | --- |
| Next.js v13.5.6 | TypeScript v5.1.6 <br> React v18.2.0 <br> react-hook-form v.7.47.0 <br/> react-select 5.7.7 <br> react-table 7.8.0 <Br> react-youtube 10.1.0 <br> |
| Go v1.18  | GORM v1.25.4 <br> GIN v1.9.1 <br> go-sqlmock v1.5.1 <br> godotenv v1.5.1 <br> ozzo-validation v3.6.0 (記載漏れのため追記)|
|MySQL v8.0.32| - |

- その他
  - AWS(Fargate on ECS, ECR, EC2, RDS, ALB, Route53, CloudWatch, VPC, IAM)
  - Docker, GitHub,GitHub Acitons(CI), Postman, Figma(画面遷移図), draw.io(ER図, AWS構成図)
  - Tailwind CSS
      - Gitflow, issue駆動開発、コミットにプレフィックスを付与
 
### 構成図

#### 初期案
| ER図 | 画面遷移図 <br> main, header/footer |
| :---: | :---: |
|[GitHub リンク](https://github.com/shari-sushi/V-Kara-Lists/blob/develop/architecture_figure/primary/ERfigure_VTuber_kraoke_lists.drawio.png) | [GitHub リンク](https://github.com/shari-sushi/V-Kara-Lists/blob/develop/architecture_figure/primary/画面遷移図%20_初期.png)| 
| 縮小画像掲載<br/>予定 | 縮小画像掲載<br/>予定 |


#### 完成物

ER図 <br/>
![ER図.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/c4069111-f2b2-df26-7d95-b50bc64a8af2.png)
 <br>

画面遷移図<br/>
[figma](https://www.figma.com/file/vIIYk3P6AZoyt1C7Rz1PnT/v-kara?type=design&node-id=224%3A2715&mode=design&t=90nX6V56GHSD9Zde-1), [原寸画像](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/5264cf9a-a715-7b71-118e-43d37e231f46.png) <br/>
![v-kara](https://github.com/shari-sushi/V-Kara-Lists/assets/127638412/935dae1d-e564-4b65-a002-f927ec5280e8)<br>


AWS構成図 <br>
<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/db9f86a6-51fa-5bf4-ed01-c3d7a92e08f2.png" width="400px" /><br />

- ※備考※
  - GitHub Actions CIは構築済みです。
  - GitHub Actions CD, apiのprivate subnet化にも取り組んでいます。
  - EC2インタンスは通常時停止です。 

### 技術選定理由

プログラミング、IT業界ともに未経験で着手し独学で作りました。

- Go
  - 比較対象：JAVA、Ruby、Python、PHP
  - コンパイラ言語であり実行速度が高速である
  - 静的型付けであり、コンパイル前にバグを発見しやすい
  - 静的型付けかつ記述自由度が低いことから、以下２点を利点と考えた
    - 開発を中長期まで続けた際にも、加筆・改修しやすい
    - 他人のコードを読んだ際に学びやすい
  - Javaも多少書いてみたが、簡素にかけるGoの方がしっくりきた
  - SHOWROOM、IRIAM、Twitch、AbemaTVといった動画配信サービスにも採用されている
  - 他分野でもメルカリ、Docker、Riot等幅広く使用実績がある
- Gin
  - 比較対象：echo等
  - ~~セキュリティ面が強い~~
   ↑echoと比較して強くはないとご指摘いただきました
  - Goの国内案件数が最多
  - 比較的新規言語かつ現状では後方互換性があり、参考にした記事がバージョン古すぎてだめだった(思い出したので追記)

- Next.js
  - 比較対象：Vue.js, React
  - 広く普及しているReactベースのフレームワークであり、SPAを簡単に実装できる
  - 基本的にTypeScriptと共に採用されるため静的型付け言語であるGoと平衡で学びやすいと考えた
(全くそんなことはなかったです)
  - ページのルーティングが簡単
- MySQL
  - 比較対象：Oracle Database、PostgreSQL
  - 無料かつ、PostgreSQL等と比較し機能が少なく、易しい
- アーキテクチャ
  - バックエンド
     クリーンアーキテクチャ: 拡張やバグ修正しやすさを向上し長期間のサイト運営でも開発コストを抑えられることを期待した
  - フロント
 　アトミックデザインの考え方を適宜取り込みつつ`Reactの流儀`を模倣するに留め、機能ごとにフォルダ分けすることで既存コードを探し出しやすい構成にした。
　ページ構成やCSSも関わってくることから学習初期段階でクリーンアーキテクチャや完璧なアトミックデザイン等を導入しても適切に運用できるとは思えなかった。結果として将来を通して開発コストが増加してしまうものと考えた。

### 機能
- 機能要件
  - 会員機能
    - ログイン（ゲストログイン機能有り、JWT使用）
    - ログアウト
    - 退会
  - コンテンツ*を表やドロップダウンで閲覧
    - *対象データ：VTuber(配信者)、動画(歌枠)、歌(その歌枠の時間指定)
  - コンテンツ*の登録、編集、削除(会員専用)
    - 登録, 編集時はプルダウンを併用し、簡単に入力できるよう(react-select)
    - 削除時は自分で登録したデータを表で一覧表示し、各行に削除ボタンを設置した
    - マイページにて、自分の登録した情報の一覧を確認できる
  - VTuber個別ページ
    - Go, Next.jsともにダイナミックルーティングで自動生成
    - URLにVTuber名のkanaを採用することで若干のSEO対策
  - 表(react-table)
    - ページ内動画再生：曲名クリック (react-youtube)
    - 動画へのリンクをコピー：各曲のコピーアイコンクリック
    - VTubre個別ページ：TOPページにて表のVtuber名クリックでページ遷移
    - ページネーション
    - ソート機能
    - ドロップダウンと連携し、検索や選択でfiltering
    - 直近に登録された50曲の表をtopページに配置(その際、ゲストアカウントの登録データを除外)
  - いいね機能
    - いいねクリックでアイコンの色が変化
    - そのコンテンツに付いた総いいね数を表示
  - バリデーション(react-hook-form、Goでも少し)
    - 会員登録、ログイン時：メアド、パスワード
    - データ登録時：Vtuber名、kana、紹介動画URL、歌枠動画タイトル、歌枠動画URL、曲名
  - レスポンシブ対応(PC推奨)
  - 完全SPA化、apiと通信するページは全てSSR化（Next.js）
  - ブラウザ対応：Chrome, Opera, safari

- 非機能要件
  - N+1問題対策：
    - 正規化して設計
    - 取得時はJoin使用
  - SQLインジェクション対策：ORM導入
  - 不正なログイン対策：CookieにJWT保持
  - DB流出時の被害減少および平文が開発者(私)に見えないように：
    - パスワードをbcryptでソルト付けてhash化
    - メールアドレスをAESで暗号化

  - クリーンアーキテクチャを採用し、拡張と修正しやすさを向上
  - https化
  - コンテナ化で開発環境と本番環境の差を低減(Docker)
  - コンテナを一括管理(Docker Compose)
  - ステルスリリースページ(4/8追記)

## 参考にしたもの
※後日掲載予定

---
## 備考
- 今後の実装検討:issue[#74](https://github.com/shari-sushi/V-Kara-Lists/issues/74)
- 開発画像：isseue[#26](https://github.com/shari-sushi/V-Kara-Lists/issues/26)
- Gitの経験
  - git rebase -i Hard
  - git riset 系[手を動かした履歴](https://github.com/shari-sushi/0015Laboratory/issues/13)
  - git flter-repo、オンライン削除申請
  (古いコミットをpullした際に.gitignoreが書き換わってしまったことで事件が置きました)
  - 他
- SQL(V-karaではMySQLを使用)
  - 平で書いて理解に努めてます
    例) [Xのポスト](https://x.com/shari_susi/status/1756534348403405205?s=20)
  - postgresQL
    就活の選考課題で簡単なcrudとuser認証認可のDB設計およびGORMでの実装をやりました
    (この記事を初公開してから2週間後の話です)
  

## 最後に
非常に長かったと思いますがここまでお読みいただきありがとうございました。

ここからはただのお気持ち表明になります。

このアプリを開発する上で、自分が大事にしたのは目的を見失わないことです。
- 好きなVTuberの歌を簡単に聞けるようにすること
- その歌を「あの人がこんな歌を歌っていたよ」と気軽に他人へ渡せること

そして、全ての機能はこれを達成するための手段でしかありません。
仮に気に入らない状態になっていても、仮にまだ実装したい機能があっても、目的に対して優先度が低ければ後回しにしています。
なので、実務レベルには遠く及ばないでしょうが都合よく言えばMVP開発です。


### 独学の進め方
以下、自己流ですが同じような境遇の人に何か役立てばと思います。

1. 上述のMVP開発の意識は勉強・開発における挫折予防として役立ったと思います。
（初心者なので最初はできないタスクも、後回しにしている間に成長していて後で簡単に実装できたことが多々ありました。）
1. DiscordとGitHubに進捗と備忘録を兼ねてひたすらアウトプット：[専用 issue#74](https://github.com/shari-sushi/V-Kara-Lists/issues/74)
    - 公開できる情報はGitHubの該当のissueへ
    - 公開できない情報が載る可能性があること(AWS周り等)はDiscordのスレッドに
    - 実装したい機能やその良し悪しを思いついたら布団の中からでもやる

| GitHub <br>issue | Discord <br> thread |threadの中身| 初期はDiscordのチャンネルにメモってました<br>管理しにくかったです |
|:-:|:-:|:-:|:-:|
|![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/e0c8cfa5-c172-7321-6eea-c64929f95640.png)|![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/02fe9be8-b17d-4367-8258-686a10d27168.png)|![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/45518696-7adc-7168-46f0-12b577d31dff.png)|![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/ca5bbf1e-8707-7115-e6b4-c34b24e817e6.png)|

3 . 必要と思ったことはやる
　YouTube iflameのバグにぶつかった話です。
　OSS公式ドキュメント通り書いても、期待通り動きませんでした。
　バグの映像[YouTube](https://youtu.be/AWuEQ4UDx84?si=OpQ9ppqINM7rBt8H)

　OSSを類似品に変えてもダメでした。
　サンドボックスので何でも試しました。
　[コード](https://github.com/shari-sushi/0015Laboratory/tree/main/test0015Next/my-app/src/pages/player)

　react-playerサンドボックスの[issue](https://github.com/shari-sushi/0015Laboratory/issues/26)
　↓
　解決しませんでした[YouTube](https://youtu.be/9sJZEIxtcfM?si=fyAei8y2w5gedK19)

　react-youtubeサンドボックスの[issue](https://github.com/shari-sushi/0015Laboratory/issues/26)
　↓
　解決しませんでした[Youtube](https://youtu.be/ucYKlSCN-Cw?si=KQEkjL6YW7-FWAgT)

　自分の問題では無いと確信し、OSS issueへ投稿しました。
　結局、同じ境遇の人から裏技的な回答をもらい、一応解決しました。
　react-player[issue #1725](https://github.com/cookpete/react-player/issues/1725)

　解決実践した自[issue](https://github.com/shari-sushi/V-Kara-Lists/issues/78)

　ただ疑問なのは、こんな大掛かりなバグ、大問題になってもおかしくないです。本当は自分の使い方が間違ってるのかも？

4 . 他人の意見ももらう
　デプロイと同時にまずは知人にフィードバックをもらい、機能追加やバグ修正を行いました。未対応のものもGitHubのissueに記録しています。

5 . Xでとりあえず呟く
　どうしても分からなければXで呟きます。教えてもらえることもありますし、他人に分かるように情報を精査してまとめることで、問題の切り分けが進んだり問題は解決していなくても１ステップ進んだような気持ちになり、ストレスが軽減されていたように思います。結果、ポスト後に自己解決できたりします。

6 . paiza様コーディングテスト
　Bランクに昇格すると紹介できる求人が増えるとのことでポートフォリオ完成前にチャレンジ。
　2問目でなんとかクリア。(目標時間を数分オーバーし減点され昇格ならず。)
　1問目は全く分からず、ご飯中やお風呂中も考えてなんとか正解には辿り着けました。慣れているうちにと、直ぐに2問目に挑戦しました。
　ちなみに、そのエージェント様に再確認したところBランクでも30歳に紹介できるところは無かったと言われ挑戦をやめました。(ポートフォリオ作成に戻りました。)
　ただ、1ヶ月後に別の方に変わってからGoの自社開発企業様を紹介していただけました。
　<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/02c95c62-127a-5b4f-14f7-4a86527b6999.jpeg" width="600px" />
　<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/0cc182dd-073e-432d-5b60-37134848d341.jpeg" width="600px"/>


今後も追加したい機能が山のようにあるので、仮にエンジニアになれなかったとしても開発は続けていきたいと思っています。

ちなみに、一番集中できたときで1日で19時間コーディングしてました。
(31時間くらい起きており、そのうち連続した24時間のなかの19時間)
人生でこんなに集中力が続いたのはじめてで、気がついたらそんなに経っていたという感じで楽しかったです。
逆に、この365日で１時間もやらなかった日はありません。
普段は１人暮らしですが、親の体調不良で看病のために帰省した際は、ゲーミングデスクトップからモニター(2枚)から全て持ち帰って意地でもやりました。

### 〆
30歳を節目に未経験へのハードルがぐっと上がる業界の様ですが、悔いの残らない転職活動になるよう最後まで頑張ります。

もしご質問があればこの記事、[X](https://twitter.com/shari_susi)のポスト、リポジトリの[issue](https://github.com/shari-sushi/V-Kara-Lists/issues)等にご連絡ください。
自分の勉強やV-karaの品質向上につながると思いますのでできる限りお答えします。
