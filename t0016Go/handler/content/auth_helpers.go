package content

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sharin-sushi/0016go_next_relation/common"
	"github.com/sharin-sushi/0016go_next_relation/domain"
)

// requireListenerId はJWTからlistenerIdを取得する。取得に失敗した場合は400を書き込みfalseを返す。
// 呼び出し側は false の場合、直ちにハンドラをreturnすること。
func requireListenerId(c *gin.Context) (domain.ListenerId, bool) {
	listenerId, err := common.TakeListenerIdFromJWT(c)
	if err != nil {
		log.Println("err:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Error fetching listener info",
		})
		return 0, false
	}
	return listenerId, true
}

// requireAuthorizedInputter はVerifyUserModify*系メソッドの結果を検証する。
// 未認可・検証エラーの場合は400を書き込みfalseを返す。
// 呼び出し側は false の場合、直ちにハンドラをreturnすること。
func requireAuthorizedInputter(c *gin.Context, isAuth bool, err error) bool {
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Auth Check is failed.(we could not Verify)",
		})
		return false
	}
	if !isAuth {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Only The Inputter can modify each data",
		})
		return false
	}
	return true
}
