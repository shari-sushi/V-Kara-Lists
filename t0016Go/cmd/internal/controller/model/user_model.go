package model

import (
	"errors"
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/cmd/internal/controller/crypto"
	"github.com/sharin-sushi/0016go_next_relation/cmd/internal/types"
	"github.com/sharin-sushi/0016go_next_relation/cmd/internal/utility"

	_ "github.com/go-sql-driver/mysql"
)

//
type User types.User

//*types.Userで"invalid receiver type *types.User (type not defined in this package)"
func (u User) LoggedIn() bool {
	// return u.ID != 0 元々これ
	return u.MemberId != ""
}

//*types.Userでもエラー出ない
func Signup(user_id, password string) (*User, error) {
	var user types.User
	// user := types.User だとダメ　gorm公式はこの書き方
	// user := types.User{}最初はこうだった

	fmt.Printf("Sinup関数の受け取った値:user_id=%v, password=%v \n", user_id, password)
	// fmt.Printf("user=%v \n", user)

	// user.MemberId = 2
	// user.Password = "2"
	// fmt.Printf("user=%v, user_id=%s \n", user, user_id)

	utility.Db.Where("user_id = ?", user_id).First(&user.MemberId) //.Firts 1件だけ()内に格納→DBからEnmpty setが返ってきてるはず

	fmt.Printf("userId=%v, password=%v \n", user.MemberId, user.Password) //{0, }期待→ok

	if user.MemberId != "" {
		err := errors.New("登録済みのMemberIdです。")
		fmt.Println(err)
		return nil, err
	}

	fmt.Printf("user=%vです。 \n", user)

	encryptPw, err := crypto.PasswordEncrypt(password)
	if err != nil {
		fmt.Println("パスワード暗号化処理でエラー発生：", err)
		return nil, err
	}
	fmt.Printf("encryptPw=%v \n", encryptPw)

	//user_idINT, _ := strconv.Atoi(user_id)
	user = types.User{MemberId: user_id, Password: encryptPw}
	fmt.Printf("user=%v \n", user)
	utility.Db.Create(&user)
	fmt.Printf("a \n")
	return user, nil
}

func Login(userId, password string) (*types.User, error) {
	user := types.User{}
	utility.Db.Where("user_id = ?", userId).First(&user)
	if user.MemberId == "" {
		err := errors.New("MemberIdが一致するユーザーが存在しません。")
		fmt.Println(err)
		return nil, err
	}

	err := crypto.CompareHashAndPassword(user.Password, password)
	if err != nil {
		fmt.Println("パスワードが一致しませんでした。：", err)
		return nil, err
	}

	return &user, nil
}
