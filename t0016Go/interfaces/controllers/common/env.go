package common

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

var goEnv = os.Getenv("GO_ENV") //ローカルpc上でのみ設定

func returnDetailEnv() string {
	var env string
	isDockerCompose := os.Getenv("IS_DOCKER_COMPOSE") //docckercompos.ymlにのみ記載
	if goEnv == "" && isDockerCompose == "" {
		//クラウド環境
		fmt.Println("クラウド環境で起動")
		env = "on cloud"
		envCheck(goEnv, isDockerCompose)
	} else if goEnv == "" && isDockerCompose == "true" {
		// ローカルのdocker上(compose使用)
		fmt.Println("ローカルのdockerコンテナ内で起動")
		env = "on local with docker-copmpose"
		envCheck(goEnv, isDockerCompose)
	} else if goEnv == "development" && isDockerCompose == "" {
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
	fmt.Printf("GUEST_USER_NAME=%v \n", guest)
}

func ReturnEvnCloudorLocal() string {
	isDockerCompose := os.Getenv("IS_DOCKER_COMPOSE")
	var env string
	if goEnv == "" && isDockerCompose == "" {
		//クラウド環境
		env = "on cloud"
	} else if (goEnv == "" && isDockerCompose == "true") || (goEnv == "development" && isDockerCompose == "") {
		// ローカルのdocker上(compose使用) or  VSCodeで起動
		env = "on local"
	}
	return env
}

func GetGuestListenerId() domain.ListenerId {
	stringGuestId, _ := strconv.Atoi(os.Getenv("GUEST_USER_ID"))
	guestId := domain.ListenerId(stringGuestId)
	fmt.Printf("guestId:%v\n", guestId)
	return guestId
}
