package utility

import (
	"fmt"
)

//packageはファイル名じゃなくてディレクトリの名前

func Oimo() string {
	name := "妹望おいも"
	old := "21歳と365*2-2日"
	species := "たぬき"
	str := fmt.Sprintf("名前:%s\n年齢:%s\n\n種族:%s\n", name, old, species)
	return str
}

// func Oimo() {
// 	handler(w http.ResponseWriter, r *http.Request)
// }

// func handler(w http.ResponseWriter, r *http.Request) {
// 		fmt.Fprint(w, article.OimoData())
// }

// func OimoData() string {
// 	name := "妹望おいも"
// 	old := "21歳と365*2-2日"
// 	species := "たぬき"
// 	str := fmt.Sprintf("名前:%s\n年齢:%s\n\n種族:%s\n", name, old, species)
// 	return str
// }
