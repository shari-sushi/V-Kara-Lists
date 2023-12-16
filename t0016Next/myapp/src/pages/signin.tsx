import React,{ useState } from "react";
import { useForm } from 'react-hook-form';
import { useRouter } from "next/router";
import type { LoginUser as LoginListener } from "../types/usertype";
import Link from 'next/link';
import {Checkbox} from '../components/SomeFunction';
import {domain} from '../../env'



// var1.5~2.0でやりたい
// 送信する前にバリデーションチェック　
// https://yutaro-blog.net/2021/10/22/react-state-tips/

export function SigninPage() {
  const defaultValues: LoginListener = {
    Email: "",
    Password: "",
  };
  const { register, handleSubmit, formState: { errors } } = useForm<LoginListener>({defaultValues});
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const router = useRouter();
 
  type InputValues = LoginListener
  const onSubmit = async (data:InputValues) => {
    try {
      console.log("data=", data);
      const response = await fetch(`${domain.backendHost}/login`, { 
          method: 'PUT',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if (response.ok) {
        router.push(`/`)
      }else{
          throw new Error(response.statusText); //catchに飛ぶから呼び出されること無い？
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        ログイン画面<br />
        Email:
          <input {...register("Email", { required: true,
            pattern: {
              value: /[\w+\-]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]*/i,
              message: "emailの形式で入力してください。" 
            } 
          })}
          placeholder="Email"
          /><br />
          {errors.Email && errors.Email.message} <br />
        Password:
          <input {...register("Password", { required: true,
          //  value:"aa",
           pattern: {
            value: /[a-z\d\-]{4,255}/i,
            message: "パスワードは4文字以上必要です" 
          } 
        })}
            placeholder="Password" type={isRevealPassword ? 'text' : 'password'}
          /><br />
          {errors.Password && errors.Password.message}<br />
        <Checkbox checked={isRevealPassword }
          onChange={() => setIsRevealPassword((state) => !state)} >パスワード表示⇔非表示</Checkbox><br />
        <button type="submit" style={{ background: 'brown' }}>ログイン</button>
      </form>  <br />
      <div>
        <Link href={`/`}><button style={{ background: 'brown' }}>
          ログインせずにTOPへ戻る</button></Link><br />
        <Link href={`/mypage`}><button style={{ background: 'brown' }}>
          mypageへ</button></Link>
        <Link href="/signup"><button style={{ background: 'brown' }}>
          会員登録</button>  
        </Link>
        &nbsp;
      </div>
    </div>
  );
}

export default SigninPage;


// ****memo****
//  <DeleteButton Unique_id ={ Unique_id }/>

// router.push(`/show?Unique_id=${Unique_id}`)

//  条件付きレンダリング…左辺がtrueなら右辺を表示する
// Email: <input {...register("Email", { required: true })} placeholder="Email" /><br />
           
// register：フォームフィールドを登録する関数
// handleSubmit：フォームの送信を処理する関数
// errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
// const router = useRouter();
// const { Unique_id } = router.query;


// フォームの送信が行われたとき(他の処理が終わったとき？)に呼び出される
// const onSubmit = async (data: LoginUser) => {
    // data：送信されたフォームフィールドの値を含むオブジェクト
    // const unique_id = router.query.id;

    // const response = await fetch(`http://localhost:8080/login2`, { 
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data) //dataをJSONに変換
    //     });

//tryブロック　この中でエラー発生したら直後のchatchブロックが実行される
// try {
    // fecthとか
// } chatch{
    // エラー処理とか}
    // 