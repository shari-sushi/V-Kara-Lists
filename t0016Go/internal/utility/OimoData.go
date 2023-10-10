package utility

import (
	"fmt"
)

// サイト上は何の意味も無いコード
// 開発者のお楽しみ

func Oimo() string {
	name := "妹望おいも"
	birth := "2000:5:30"
	species := "たぬき"
	favariteFoods1 := "いも製品全般、かんころ餅、こんにゃく、しいたけ、イチゴ大福、ピーマン肉詰め"
	favariteFoods2 := "芋羊羹、金の干芋、うどんにちくわ天とイカ天、こしあん、味噌ラーメン、揚げ鶏"
	notLike := "粒あん、山椒、辛いもの、大葉、パクチー、しそ、ナス"
	etc := "たい焼きは頭から、猫のぬいぐるみの抱き枕＝しっぽを掴んでると落ち着く、都会に出ると きらきら時間♪"

	str := fmt.Sprintf("名前:%s\n生年月日:%s\n\n種族:%s\n 好きな食べ物:%v \n %v \n 嫌いな食べ物:%v \n 他:%v \n", name, birth, species, favariteFoods1, favariteFoods2, notLike, etc)
	return str
}
