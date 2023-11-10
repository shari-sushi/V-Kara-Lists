# syntax=docker/dockerfile:1

FROM golang:1.19

# Set destination for COPY
WORKDIR /api/src

# Download Go modules
COPY go.mod go.sum ./

#GPTより。要ソース検索
# RUN go clean -modcache  

RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
COPY *.go ./

# Build
# RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping 2>&1
# RUN CGO_ENABLED=0 GOOS=linux go build -o ../cmd/main.go 2>&1

# To bind to a TCP port, runtime parameters must be supplied to the docker command.
# But we can (optionally) document in the Dockerfile what ports
# the application is going to listen on by default.
# https://docs.docker.com/engine/reference/builder/#expose
# EXPOSE 80

# Run
# CMD [ "/t0016Go" ]
CMD [ "go","run","cmd\main.go" ]

##################################
# syntax=docker/dockerfile:1    文法の指定。書くなら最初。

# FROM golang:1.16-alpine       ベースイメージの指定 #syntaxの次に書く。必須。

# WORKDIR /t0016Go/cmd          イメージ内にディレクトリの作成


# COPY go.mod ./                Goでプロジェクトをダウンロードして最初に行うこと
    # Dockerイメージをビルドする際に、ホストマシンからコンテナ内にファイルをコピーする

# COPY go.sum ./                〃　なお、WORKDIRを基準にした相対パスで書く
# RUN go mod download           〃　ローカルでの実行時と同じように機能する

# COPY *.go ./                  ソースコードをイメージにコピー。
                                # ./の場所から *.go(.goで終わる全ファイル)をコピー
                                
# RUN go build -o /docker-gs-ping   アプリケーションのコンパイル
                                    # /docker-gs-pingという名前でバイナリを配置する。

# EXPOSE 8080                       コンテナが後悔するポート番号をDockerに伝える

# CMD [ "go", "run", "main.go" ]    コンテナ起動時にコンパイルしたファイルを実行する