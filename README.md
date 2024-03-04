# V-kara(VTuber-Karaoke-Lists)

`「推し」の「歌枠」の聴きたい「歌」` </br>
`「把握」、「再生」、「布教」を簡単に`

## __1. 使用感__

### 概要
- サイト: [V-kara](https://v-karaoke.com)<br>
V-karaはVTuber(YouTuberの1種)の歌枠の歌情報を登録し、いつでも見返せるwebアプリです。　<br>
歌枠とは配信者のカラオケ配信のことで、`どの配信の何分何秒に何を歌ったか`の把握が難しいです。<br>
V-karaを使うことで、好きなVTuberが何を歌ったかを検索、視聴、布教までシームレスに実施できます。<br>
ただし、歌情報はユーザーによる入力が必要となり、ユーザー同士で作り上げるDBのような形式になっています。<br>
※ゲストログイン可能です。使用感だけでも試してみてください！<br>
- リポジトリ: [GitHub](https://github.com/sharin-sushi/V-Kara-Lists)<br>
- サイトデモ動画: [YouTube](https://youtu.be/HunsO-8Eo7Q)<br>

### webアプリ主要ページ紹介
- ※VTuber個別はURLが個別生成されるため、そのままブクマや布教できます 

| TOP | 全歌一覧 | VTuber個別 | データ入力 |
|---|---|---|---|
|<image src="https://github.com/sharin-sushi/0007test/assets/127638412/9f8224bc-28d1-4355-92cc-17d90e113192" width="220px"/>|<image src="https://github.com/sharin-sushi/0007test/assets/127638412/d219a34f-e00a-4031-88b7-fb2f6f31005b" width="220px"/><br><br><br>|<image src="https://github.com/sharin-sushi/0007test/assets/127638412/76243bc6-be19-4054-b7ce-ea91da0692ca" width="220px"/><br><br><br>|<image src="https://github.com/sharin-sushi/0007test/assets/127638412/822e3f3a-d532-4c9f-8806-9bc6a6582462" width="220px"/><br><br><br>|

- レスポンシブ対応です。

| 通常画面 | ハンバーガーメニュー |
|:-:|:-:|
|<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/3874fe7c-36c3-5f69-07c1-8c4ecc007245.jpeg" width="220px"/>|<image src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3566489/1036975f-d152-15c0-bc9b-6cc5db332ec9.jpeg" width="220px"/>|

<br>

## __2. 技術__
### 使用技術
  
| 言語、サービス  | フレームワーク/ライブラリ |
| --- | --- |
| Next.js v13.5.6 | TypeScript v5.1.6 <br> React v18.2.0 <br> react-hook-form v.7.47.0 <br/> react-select 5.7.7 <br> react-table 7.8.0 <Br> react-youtube 10.1.0 <br> |
| Go v1.18  | GORM v1.25.4 <br> GIN v1.9.1 <br> go-sqlmock v1.5.1 <br> godotenv v1.5.1|
|MySQL v8.0.32| - |

- その他
  - AWS(Fargate on ECS, ECR, EC2, RDS, ALB, Route53, CloudWatch, VPC)
  - Docker, Github,GitHub Acitons(CI), Postman, Figma(画面遷移図), draw.io(ER図, AWS構成図)
 
### 構成図

ER図 <br>
<image src="https://github.com/sharin-sushi/V-Kara-Lists/blob/develop/architecture_figure/primary/ERfigure_VTuber_kraoke_lists.drawio.png?raw=true" widtch="700px" /><br>

画面遷移図 [figma](https://www.figma.com/file/vIIYk3P6AZoyt1C7Rz1PnT/v-kara?type=design&node-id=224%3A2715&mode=design&t=90nX6V56GHSD9Zde-1), [原寸画像](https://private-user-images.githubusercontent.com/127638412/309806630-a48f8d29-3932-4bb5-83be-c546ae94405c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDk1NjYzMTcsIm5iZiI6MTcwOTU2NjAxNywicGF0aCI6Ii8xMjc2Mzg0MTIvMzA5ODA2NjMwLWE0OGY4ZDI5LTM5MzItNGJiNS04M2JlLWM1NDZhZTk0NDA1Yy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzA0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMwNFQxNTI2NTdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03YTgwNTVjODJkMDkyYjI1ZjIyNmJlNGY3NmU0Yjk5YWZkMjE2NjcxYTMxMjI4MjU4ZWE0MzA3YjZlMzNmMjA1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.2NP2uAfwg-VXFhv7BVRm7wUbutkCqUvNDVW3YeLUy2U)<br> 
![v-kara](https://github.com/sharin-sushi/V-Kara-Lists/assets/127638412/935dae1d-e564-4b65-a002-f927ec5280e8)<br>


AWS構成図 <br />
<image src="https://private-user-images.githubusercontent.com/127638412/309566577-51a5e274-cc19-4ceb-bf45-f8c454251180.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDk1NjMxODcsIm5iZiI6MTcwOTU2Mjg4NywicGF0aCI6Ii8xMjc2Mzg0MTIvMzA5NTY2NTc3LTUxYTVlMjc0LWNjMTktNGNlYi1iZjQ1LWY4YzQ1NDI1MTE4MC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQwMzA0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MDMwNFQxNDM0NDdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02YmE3NGNkZjg0NjA2ZjI1MmU5MzNiMDFiY2JkMzI0N2NkMTJjNTA0NzRjM2JmNjk2MTcyZTJhMDY5NGZmMzMyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.BmPlREKspYmY7xOyd9YsBZhqyH2Lwqf0x5-Rsds4IhY" width="700px" /> <br />
- ※備考※
  - GitHub Actions CIは構築済みです。
  - GitHub Actions CD, apiのprivate subnet化にも取り組んでいます。
  - EC2インタンスは通常時停止です。 

### 技術選定理由

プログラミング、IT業界ともに未経験で着手し独学で作りました。

- Go
  - 比較対象：JAVA、Ruby、Python等
  - コンパイラ言語であり実行速度が高速である
  - 静的型付けであり、コンパイル前にバグを発見しやすい
  - 静的型付けかつ記述自由度が低いことから、以下２点を利点と考えた
    - 開発を中長期まで続けた際にも、加筆・改修しやすい
    - 他人のコードを読んだ際に学びやすい
  - Javaも多少書いてみたが、簡素にかけるGoの方がしっくりきた
  - 比較的後発ながらメルカリ、Docker、twitch、Riot等で使用実績がある
- Gin
  - 比較対象：echo等
  - セキュリティ面が強い
  - Goの国内案件数が最多

- Next.js
  - 比較対象：Vue.js, React
  - 広く普及しているReactベースのフレームワークであり、SPAを簡単に実装できる
  - 基本的にTypeScriptと共に採用されるため静的型付け言語であるGoと平衡で学びやすいと考えた
  - ページのルーティングが簡単

- MySQL
　- 比較対象：Oracle Database、PostgreSQL
　- 無料かつ、PostgreSQL等と比較し機能が少なく、易しい

- アーキテクチャ
  - バックエンド
    クリーンアーキテクチャ: 拡張性やバグ修正をやりやすくし長期間のサイト運営でも開発コストを抑えられることを期待した。
  - フロント
    アトミックデザインの考え方を適宜取り込みつつ`Reactの流儀`を模倣するに留め、機能ごとにフォルダ分けすることで既存コードを探し出しやすい構成にした。
    ページ構成やcssも関わってくることから学習初期段階でクリーンアーキテクチャや完璧なアトミックデザイン等を導入しても適切に運営するのは将来を通して開発コストが増加してしまうものと考えた。

### 機能詳細

- 機能要件
   - 会員機能
    - ログイン（ゲストログイン機能有り、JWT使用）、
    - ログアウト
    - 退会
  - VTubre(配信者)、歌枠(動画)、歌(その動画の何分何秒)といったデータを表やドロップダウンで閲覧
  - コンテンツデータの登録、編集、削除(削除機能会員専用)
    - 対象データ：VTuber、動画、歌の再生開始時間
    - 登録, 編集時はプルダウンを併用し、簡単に入力できるように(react-select)
    - 削除時は表の各今日に削除ボタンを設置
    - マイページにて、自分の登録した情報の一覧を確認できる
  - Vtuber個別ページ
    - Go, Next.jsともにダイナミックルーティングで自動生成
  - 表について(react-table)
    - ページ内動画再生：曲名クリック (react-youtube)
    - 動画へのリンクをコピー：曲毎のコピーアイコンクリック
    - Vtubre個別ページ：Vtuber名クリック
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
  - N+1問題対策：レコードが増えても発行されるSQLが増えないように設計
  - SQLインジェクション対策：ORMを導入
  - 不正なログイン対策：JWTを使用
  - DB流出時の被害減少：
    - パスワードをbcryptで暗号化
    - メールアドレスをAESで暗号化
  - クリーンアーキテクチャを採用し、拡張と修正をしやすく
  - https化

---
## 備考
- 今後の実装検討:issue[#74](https://github.com/sharin-sushi/V-Kara-Lists/issues/74)
- 開発画像：isseue[#26](https://github.com/sharin-sushi/V-Kara-Lists/issues/26)
- 自己紹介等より詳細なことを追記し、Qiitaで[記事]()にしました。
