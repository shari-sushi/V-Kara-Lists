import { User } from '../../types/usertype'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';

export default function EditForm() {
    var defaultValues:User = {
        MemberId    :null , //Goで自動入力　→未実装
        MemberName	:""	, //入力必須
        Email		:""	, //入力必須
        PassWord	:""	, //入力必須
        CreatedAt	:null, //DBで自動入力
    }

    const { register, handleSubmit, formState: { errors } } = useForm<User>({defaultValues});

    type InputValues = User

    // register：フォームフィールドを登録する関数
    // handleSubmit：フォームの送信を処理する関数
    // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
    
  // フォームの送信が行われたとき(他の処理が終わったとき？)に呼び出される
  const onSubmit = async (data:InputValues) => {
    // data：送信されたフォームフィールドの値を受け取るオブジェクト
    
    // data.unique_id = Number(Unique_id)
    
    try {
        console.log("data=", data)
        //tryブロック　この中でエラー発生したら直後のchatchブロックが実行される
        const response = await fetch(`http://localhost:8080/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) //dataをJSONに変換
            });
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        } catch (error) {
        console.error(error);
    }
    console.log(data)
};


return (
    <form onSubmit={handleSubmit(onSubmit)}>
    会員ID: 新規番号が割り振られます <br />
    アカウント名：
    <input {...register("MemberName", { required: true })} placeholder="name" /><br />
    {errors.MemberName && "name is required"}
    {/* 条件付きレンダリング…左辺がtrueなら右辺を表示する */}
    メールアドレス:
    <input {...register("Email", { required: true })} placeholder="***@***.***" /><br />
    {errors.Email && "e-mail is required"}
    パスワード※他で使用しているパスワードは絶対に使用しないでください。：
    <input {...register("PassWord", { required: true })} placeholder="0000でもいいので他で使用していないものにしてね!!" /><br />
    {errors.PassWord && "password is required"}

    <button type="submit" style={{ background: 'skyblue' }}>＜決定＞</button>

    <br />

 &nbsp;  &nbsp;  &nbsp;  &nbsp;
<button style={{ background: 'skyblue' }}><Link href={`/`}>一覧へ</Link></button>

</form>
    // ,<DeleteButton Unique_id ={ Unique_id }/>
);

}