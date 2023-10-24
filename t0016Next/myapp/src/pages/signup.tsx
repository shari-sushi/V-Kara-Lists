// const Signin: WithGetAccessControl<VFC> = (props) => {
//     return
//   }
//   Signin.getAccessControl = () => {
//     return isLoggedIn() ? { type: 'replace', destination: '/mypage' } : null
//   }

import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import type { SignupListener } from "../types/usertype";
import Link from 'next/link';
import {Checkbox} from '../components/SomeFunction';

const Signup = () => {
  const defaultValues: SignupListener = {
    ListenerName: "",
    Email: "",
    Password: "",
  };
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupListener>({defaultValues});
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  type InputValues = SignupListener
  // register：フォームフィールドを登録する関数
  // handleSubmit：フォームの送信を処理する関数
  // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
  const onSubmit = async (data:InputValues) => {
    try {
      console.log("data=", data);
      const response = await fetch(`https://localhost:8080/signup`, { 
          method: 'POST',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if (response.ok) {
        router.push(`/`)
      }else{
          throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    };}

  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            会員登録してください<br />
          name: <input {...register("ListenerName", { required: true,
            pattern: {
              value: /[a-z\d\-]{3,255}/i,
              message: "nameは3文字以上必要です。大文字、小文字、数字、-+を使えます。" 
            } 
            })} 
            placeholder="Listener Name"
            />
            {errors.ListenerName && errors.ListenerName.message }<br />
          Email:
            <input {...register("Email", { required: true,
              pattern: {
              value: /[\w+\-]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]*/i,
              message: "emailの形式で入力してください。" 
              }
            })}
            placeholder="Email"
            />
            {errors.Email && errors.Email.message}<br />
          Password:
            <input {...register("Password", { required: true,
              pattern: {
                value: /[a-z\d\-]{4,255}/i,
                message: "Passwordは4文字以上必要です" 
            }
            })} />
              {errors.Password && errors.Password.message} <br />
            <Checkbox checked={isRevealPassword }
              onChange={() => setIsRevealPassword((state) => !state)} >パスワード表示⇔非表示</Checkbox><br />
            <button type="submit" style={{ background: '' }} >会員情報確定</button>
        </form>
        <br />
        <div>
            <button style={{ background: '' }}><Link href={`/`}>会員登録せずに閲覧する</Link></button><br />
            <button style={{ background: '' }}><Link href={`/signin`}>ログインフォームへ</Link></button><br />
            <button style={{ background: '' }}><Link href={`/mypage`}>mypageへ</Link></button>
                </div>
        </div>
  
  );
}

export default Signup;



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