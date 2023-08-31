import { User } from '../../types/usertype'
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';

export default function EditForm() {
    var RegisterWithUser:User = {
        MemberId    :"" , //Goで自動入力　→未実装
        MemberName	:""	, //入力必須
        Email		:""	, //入力必須
        PassWord	:""	, //入力必須
        CreatedAt	:""	, //DBで自動入力
    }}