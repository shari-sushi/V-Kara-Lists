package common

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

var goEnv = os.Getenv("GO_ENV")                      //ローカルpc上でのみ設定
var isDockerCompose = os.Getenv("IS_DOCKER_COMPOSE") //docckercompos.ymlにのみ記載

var isOnCloud = (goEnv == "" && isDockerCompose == "")
var isOnLoclaWithDockerCompose = (goEnv == "" && isDockerCompose == "true")
var isOnLoclaWithOutDockerCompose = (goEnv == "development" && isDockerCompose == "")
var isOnLocal = (isOnLoclaWithDockerCompose || isOnLoclaWithOutDockerCompose)

func GetEnvHostDomain() string {
	if isOnCloud {
		return "v-karaoke.com"
	} else if isOnLocal {
		return "localhost"
	}
	return "localhost" // 環境変数用意してない人でも動くように
}

func returnDetailEnv() string {
	var env string
	if isOnCloud {
		//クラウド環境
		fmt.Println("クラウド環境で起動")
		env = "on cloud"
		envCheck(goEnv, isDockerCompose)
	} else if isOnLoclaWithDockerCompose {
		// ローカルのdocker上(compose使用)
		fmt.Println("ローカルのdockerコンテナ内で起動")
		env = "on local with docker-copmpose"
		envCheck(goEnv, isDockerCompose)
	} else if isOnLoclaWithOutDockerCompose {
		//VSCodeで起動
		fmt.Println("VSCodeで起動。godotenv.Load使用")
		err := godotenv.Load("../.env")
		env = "on local with docker-compose"
		if err == nil {
			fmt.Println("got .env file sucussesly. retry os.Getenv")
			goEnv := os.Getenv("GO_ENV")
			envCheck(goEnv, isDockerCompose)
		} else {
			fmt.Println("godotenvで.envファイル取得失敗")
			envCheck(goEnv, isDockerCompose)
		}
	}
	return env
}

func envCheck(goEnv, isDockerCompose string) {
	fmt.Printf("goEnv == %v && isDocker == %v \n", goEnv, isDockerCompose)

	guest := os.Getenv("GUEST_USER_NAME")
	fmt.Printf("環境変数の取得が成功したか：%v\n", guest == "guest")
}

func GetHostByENV() string {
	var host string
	if isOnCloud {
		host = ""
	}
	if isOnLocal {
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
