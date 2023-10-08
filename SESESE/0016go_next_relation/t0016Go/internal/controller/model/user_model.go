package model

import (
	"errors"
	"fmt"

	"github.com/sharin-sushi/0016go_next_relation/internal/controller/crypto"

	"github.com/sharin-sushi/0016go_next_relation/internal/types"

	"github.com/sharin-sushi/0016go_next_relation/internal/utility"

	_ "github.com/go-sql-driver/mysql"
)

//
type AUser struct {
	MemberId   string
	MemberName string
	Email      string
	Password   string
}

//*types.Userで"invalid receiver type *types.Member (type not defined in this package)"
func (u AUser) LoggedIn() bool {
	// return u.ID != 0 元々これ
	return u.MemberId != ""
}

//*types.Userでもエラー出ない
func Signup(user_id, password, accname, mail string) (*AUser, error) {
	var aUser AUser
	// user := types.Member だとダメ　gorm公式はこの書き方なのに
	// user := types.Member{}記事は最初はこうだった

	fmt.Printf("Sinup関数の受け取った値:user_id=%v, password=%v, accname=%v, mail=%v \n", user_id, password, accname, mail)
	// fmt.Printf("user=%v \n", user)

	// user.MemberId = 2
	// user.Password = "2"
	// fmt.Printf("user=%v, user_id=%s \n", user, user_id)

	utility.Db.Where("mail = ?", user_id).First(&aUser.Email) //.Firts 1件だけ()内に格納→DBからEnmpty setが返ってきてるはず
	// .Select("user_id, member_name")

	if aUser.MemberId != "" {
		err := errors.New("登録済みのメールアドレスです。")
		fmt.Println(err)
		return nil, err
	}
	fmt.Printf("userId=%v, name=%v \n", aUser.MemberId, aUser.MemberName) //{0, }期待→ok

	encryptPw, err := crypto.PasswordEncrypt(password)
	if err != nil {
		fmt.Println("パスワード暗号化処理でエラー発生：", err)
		return nil, err
	}
	fmt.Printf("encryptPw=%v \n", encryptPw)

	//user_idINT, _ := strconv.Atoi(user_id)
	aUser = AUser{MemberId: user_id, MemberName: accname, Email: mail, Password: encryptPw}

	fmt.Printf("user=%v \n", aUser)
	utility.Db.Create(&aUser)
	fmt.Printf("a \n")
	return &aUser, err
}

func InquireIntoMember(MemberName, password string) (*types.Member, error) {
	user := types.Member{}
	// fmt.Print("検索したmember名=?\n", MemberName)
	utility.Db.Where("member_name= ?", MemberName).First(&user)
	fmt.Printf("取得したアカウント名=%v \n", user.MemberName)
	if user.MemberName == "" {
		err := errors.New("存在しないアカウント名です。")
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
