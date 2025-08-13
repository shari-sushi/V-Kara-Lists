package common

import (
	"fmt"
	"os"
	"strconv"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// TODO: 無駄に複雑になってしまったのでシンプルにする
var goEnv = os.Getenv("GO_ENV")                      // ローカルpc上でのみ設定 =development と記載
var isDockerCompose = os.Getenv("IS_DOCKER_COMPOSE") // docker-compose.ymlにのみ =true と記載
var DEPLOY_ENV = os.Getenv("DEPLOY_ENV")             // EC2用 docker-compose.ymlにのみ =EC2_DOCKER_COMPOSE と記載
var DEPLOY_DB_ENV = os.Getenv("DEPLOY_DB_ENV")       // EC2用 docker-compose.ymlにのみ =RDS と記載

var IsOnCloud = (goEnv == "" && isDockerCompose == "") || (DEPLOY_ENV == "EC2_DOCKER_COMPOSE" && DEPLOY_DB_ENV == "RDS")
var IsOnLocalWithDockerCompose = (goEnv == "" && isDockerCompose == "true")
var IsOnLocalWithOutDockerCompose = (goEnv == "development" && isDockerCompose == "")
var IsOnLocal = (IsOnLocalWithDockerCompose || IsOnLocalWithOutDockerCompose)

func GetEnvHostDomain() string {
	if IsOnCloud {
		return "v-karaoke.com"
	} else if IsOnLocal {
		return "localhost"
	}
	// 環境変数用意してない人でも動くように(でもゲストIDは環境変数からの取得を必須にしてるという)
	return "localhost"
}

func GetGuestListenerID() domain.ListenerId {
	stringGuestID, _ := strconv.Atoi(os.Getenv("GUEST_USER_ID"))
	guestID := domain.ListenerId(stringGuestID)
	fmt.Printf("guestId:%v\n", guestID)
	return guestID
}
