import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from "next/router";

import { domain } from '@/../env'
import type { SignupListener, LoginUser as LoginListener } from "@/types/user";
import { Checkbox } from '@/components/SomeFunction';
import { ValidateListenerName, ValidatePassword, ValidateEmail } from '@/features/regularExpression/User'
import { NeedBox } from "@/components/box/Box";
import { FormTW, ToClickTW } from "@/styles/tailwiind";


export const SigninForm = () => {

  const defaultValues: LoginListener = {
    Email: "",
    Password: "",
  };
  const { register, handleSubmit, formState: { errors } } = useForm<LoginListener>({ defaultValues, reValidateMode: 'onChange' });
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  const router = useRouter();

  type InputValues = LoginListener
  const onSubmit = async (data: InputValues) => {
    try {
      console.log("data=", data);
      const response = await fetch(`${domain.backendHost}/users/login`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        router.push(`/`)
      } else {
        throw new Error(response.statusText); //catchに飛ぶから呼び出されること無い？
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#FFF6E4] shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-2 tesxt-black">

        <div className="mb-2">
          <div className="flex text-black">
            <label className={`${FormTW.label}`}>
              Email
            </label>
            <NeedBox />
          </div>
          <input className={`${ToClickTW.input}`}
            type="text" placeholder="v-karaoke@vkara.com"
            {...register("Email", ValidateEmail)}
          />
          {errors.Email && errors.Email.message}<br />
        </div>

        <div className="mb-2">
          <div className="flex">
            <label className={`${FormTW.label}`}>
              Password
            </label>
            <NeedBox />
          </div>
          <input className={`${ToClickTW.input}`}
            placeholder="Password" type={isRevealPassword ? 'text' : 'password'}
            {...register("Password", ValidatePassword)}
          />
          {errors.Password && errors.Password.message} <br />
          <Checkbox checked={isRevealPassword}
            onChange={() => setIsRevealPassword((state) => !state)} >
            <span className="text-gray-700">
              パスワード表示⇔非表示
            </span>
          </Checkbox>
        </div>
        <div id="decide" className="flex justify-center my-4 ">
          <button type="submit"
            className={`${ToClickTW.decide} `}
          >
            確定
          </button>
        </div>
      </div>
      <div className="flex mx-atuo ">
        <Link href="/" className={`${ToClickTW.form} flex w-[40%] justify-center mx-auto`}>
          TOPへ戻る
        </Link>
        <Link href="/user/signup" className={`${ToClickTW.form} flex  w-[40%] justify-center mx-auto`}>
          ログインへ
        </Link>
      </div>
    </form>
  )
}



export function SignupForm() {
  const defaultValues: SignupListener = {
    ListenerName: "",
    Email: "",
    Password: "",
  };
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupListener>({ defaultValues, reValidateMode: 'onChange' });
  const [isRevealPassword, setIsRevealPassword] = useState(false);
  type InputValues = SignupListener
  // register：フォームフィールドを登録する関数
  // handleSubmit：フォームの送信を処理する関数
  // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
  const onSubmit = async (data: InputValues) => {
    try {
      console.log("data=", data);
      const response = await fetch(`${domain.backendHost}/users/signup`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        router.push(`/`)
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    };
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#FFF6E4] shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-2">
        <div className="flex">
          <label className={`${FormTW.label}`}>
            Username
          </label>
          <NeedBox />
        </div>
        <input className={`${ToClickTW.input}`}
          id="username" type="text" placeholder="UserName"
          {...register("ListenerName", ValidateListenerName)}
        />
        {errors.ListenerName && errors.ListenerName.message}<br />
      </div>

      <div className="mb-2">
        <div className="flex">
          <label className={`${FormTW.label}`}>
            Email
          </label>
          <NeedBox />
        </div>
        <input className={`${ToClickTW.input}`}
          type="text" placeholder="v-karaoke@vkara.com"
          {...register("Email", ValidateEmail)}
        />
        {errors.Email && errors.Email.message}<br />
      </div>

      <div className="mb-2">
        <div className="flex">
          <label className={`${FormTW.label}`}>
            Password
          </label>
          <NeedBox />
        </div>
        <input className={`${ToClickTW.input}`}
          placeholder="Password" type={isRevealPassword ? 'text' : 'password'}
          {...register("Password", ValidatePassword)}
        />
        {errors.Password && errors.Password.message} <br />
        <Checkbox checked={isRevealPassword}
          onChange={() => setIsRevealPassword((state) => !state)} >
          <span className="text-gray-700">
            パスワード表示⇔非表示
          </span>
        </Checkbox><br />
      </div>

      <div id="decide" className="flex justify-center my-4 ">
        <button type="submit"
          className={`${ToClickTW.decide} `}
        >
          確定
        </button>
      </div>
      <div className="flex mx-atuo ">
        <Link href="/" className={`${ToClickTW.form} flex w-[40%] justify-center mx-auto`}>
          TOPへ戻る
        </Link>
        <Link href="/user/signin" className={`${ToClickTW.form} flex  w-[40%] justify-center mx-auto`}>
          ログインへ
        </Link>
      </div>
    </form>
  );
}


const memo = { //ファイルのtopレベルに置いておくとESLintの自動整形が機能しなくなる
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
}