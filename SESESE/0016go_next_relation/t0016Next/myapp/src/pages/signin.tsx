// const Signin: WithGetAccessControl<VFC> = (props) => {
//     return
//   }
//   Signin.getAccessControl = () => {
//     return isLoggedIn() ? { type: 'replace', destination: '/mypage' } : null
//   }

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import type { LoginUser } from "../types/usertype";
import Link from 'next/link';

const Signin = () => {
  const defaultValues: LoginUser = {
    Email: "",
    Password: "",
    // Email: "exsample@exam.com",
    // Password: "oimomochimochiimomochioimo",
  };

     
  const { register, handleSubmit, formState: { errors } } = useForm<LoginUser>({defaultValues});
  type InputValues = LoginUser
  // register：フォームフィールドを登録する関数
  // handleSubmit：フォームの送信を処理する関数
  // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
  const onSubmit = async (data:InputValues) => {
    try {
      console.log("data=", data);
      const response = await fetch(`https://localhost:8080/login2`, { 
          method: 'POST',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
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
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            ログインしてください<br />
            Email: <input {...register("Email", { required: true })} placeholder="Email" /><br />
            {errors.Email && "Email is required"}
            Password: <input {...register("Password", { required: true })} placeholder="Password" /><br />
            {errors.Password && "Password is required"}<br />
            <button type="submit" style={{ background: 'blue' }}>ログイン</button>
        </form>
        <br />
        <div>
            <button style={{ background: 'blue' }}><Link href={`/`}>ログインせずに閲覧する</Link></button><br />
            <button style={{ background: 'blue' }}><Link href={`/mypage`}>mypageへ</Link></button>
                </div>
        </div>
  
  );
}

export default Signin;



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