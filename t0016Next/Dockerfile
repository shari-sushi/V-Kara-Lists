# ベースイメージを指定
FROM node:14

# コンテナ内の作業ディレクトリを設定
WORKDIR /app/src

# package.jsonとpackage-lock.jsonをコピー
COPY /myapp/package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# アプリケーションを起動
CMD ["npm", "start"]
# CMD ["npm", "run", "dev-https"]


##################################
# syntax=docker/dockerfile:1    文法の指定。書くなら最初。

# FROM golang:1.16-alpine       ベースイメージの指定 #syntaxの次に書く。必須。

# WORKDIR /t0016Go/cmd          イメージ内にディレクトリの作成


# COPY go.mod ./                Goでプロジェクトをダウンロードして最初に行うこと
# COPY go.sum ./                〃　なお、WORKDIRを基準にした相対パスで書く
# RUN go mod download           〃　ローカルでの実行時と同じように機能する

# COPY *.go ./                  ソースコードをイメージにコピー。
                                # ./の場所から *.go(.goで終わる全ファイル)をコピー

# RUN go build -o /docker-gs-ping   アプリケーションのコンパイル
                                    # /docker-gs-pingという名前でバイナリを配置する。

# EXPOSE 8080                       コンテナが後悔するポート番号をDockerに伝える

# CMD [ "go", "run", "main.go" ]    コンテナ起動時にコンパイルしたファイルを実行する