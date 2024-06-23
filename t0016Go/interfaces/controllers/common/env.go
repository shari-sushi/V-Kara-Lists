package common

import (
	"fmt"
	"os"
	"strconv"

	"github.com/sharin-sushi/0016go_next_relation/domain"
)

var goEnv = os.Getenv("GO_ENV")                      //ローカルpc上でのみ設定 =development と記載
var isDockerCompose = os.Getenv("IS_DOCKER_COMPOSE") //docckercompos.ymlにのみ =true と記載

var IsOnCloud = (goEnv == "" && isDockerCompose == "")
var IsOnLoclaWithDockerCompose = (goEnv == "" && isDockerCompose == "true")
var IsOnLoclaWithOutDockerCompose = (goEnv == "development" && isDockerCompose == "")
var IsOnLocal = (IsOnLoclaWithDockerCompose || IsOnLoclaWithOutDockerCompose)

func GetEnvHostDomain() string {
	if IsOnCloud {
		return "v-karaoke.com"
	} else if IsOnLocal {
		return "0.0.0.0"
	}

	// 環境変数用意してない人でも動くように(でもゲストIDは環境変数からの取得を必須にしてるという)
	return "0.0.0.0"
}

func GetHostByENV() string {
	var host string
	if IsOnCloud {
		host = ""
	}
	if IsOnLocal {
		host = "localhost"
	}
	return host
}

func GetGuestListenerId() domain.ListenerId {
	stringGuestId, _ := strconv.Atoi(os.Getenv("GUEST_USER_ID"))
	guestId := domain.ListenerId(stringGuestId)
	fmt.Printf("guestId:%v\n", guestId)
	return guestId
}
