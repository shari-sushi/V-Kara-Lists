import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import type { SingupUser } from "../types/usertype";
import Link from 'next/link';

const Signin = () => {
  const defaultValues: SingupUser = {
    Email: "",
    Password: "",
    Name: "",
    // Email: "exsample@exam.com",
    // Password: "oimomochimochiimomochioimo",
  };

     
  const { register, handleSubmit, formState: { errors } } = useForm<SingupUser>({defaultValues});
  type InputValues = SingupUser
  // register：フォームフィールドを登録する関数
  // handleSubmit：フォームの送信を処理する関数
  // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
  const onSubmit = async (data:InputValues) => {
    try {
      console.log("data=", data);
      const response = await fetch(`https://localhost:8080/singup2`, { 
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
            会員情報を作成してください<br />
            ユーザー名: <input {...register("Name", { required: true })} placeholder="Name" /><br />
            {errors.Name && "ユーザー名が必要です"}
            Email: <input {...register("Email", { required: true })} placeholder="Email" /><br />
            {errors.Email && "Email is required"}<br />
            Password: <input {...register("Password", { required: true })} placeholder="Password" /><br />
            {errors.Password && "Password is required"}
            {/* Password確認: <input placeholder="Password確認" /><br />
            {errors.Password!==errors.Password2 && "Password が一致していません"}<br /> */}
            <button type="submit" style={{ background: 'blue' }}>決定</button>
        </form>
        <br />
        <div>
            <Link href={`/`}><button style={{ background: 'blue' }}>
              会員登録せずに閲覧する</button></Link><br />
            <Link href={`/mypage`}><button style={{ background: 'blue' }}>
              mypageへ</button></Link>
            <Link href="/signin"><button style={{ background: 'darkblue' }}>
              ログインへ</button>     &nbsp;
            </Link>
           </div>
        </div>
  
  );
}

export default Signin;