import { useRouter } from 'next/router';
import React,{ useState } from "react";
import { useForm } from 'react-hook-form';
import type { LoginUser } from "../types/usertype";
import Link from 'next/link';
import {Checkbox} from '../components/SomeFunction';



// ver1.5でsessoin管理に切り替える
export const GetLogout = () => {
  const router = useRouter();
  const fetchLogout = async () => {
    try {
      const response = await fetch(`https://localhost:8080/logout`, { 
          method: 'GET',
          credentials: "include",
          headers: {
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify(data)    
      });
      console.log("logout response:", response);  
      if (!response.ok) {
          throw new Error(response.statusText);
      }  
    } catch (error) {
      console.error(error);
    }
      router.push(`/`)
  };
  return(
    <button onClick={fetchLogout}>ログアウト</button>
  )
};

